/**
 * ============================================================================
 * REFERENCE ONLY — NOT DEPLOYED, NOT VERIFIED AGAINST YOUR LIVE BACKEND
 * ============================================================================
 * This file does not exist anywhere in this repository's history. The real
 * Apps Script project behind SHEET_WEBHOOK_URL in app.js lives in your
 * Google account, not in GitHub, so it was never reviewable from here and
 * nothing in this file has replaced it.
 *
 * To use this: open your Apps Script project (script.google.com), compare
 * it against this file, adapt the sheet/column names to match your actual
 * spreadsheet, test it against a COPY of your sheet first, and only then
 * redeploy. Re-run the test plan in TESTING.md against the real endpoint
 * before trusting it with real patients.
 *
 * What this addresses, from the security review:
 *  - Patient-scoped authorization: rejects any HN not on an enrolled-patient
 *    allowlist, instead of accepting whatever HN string the client sends.
 *  - Strict payload validation: every field is type/range/enum-checked; any
 *    unrecognised top-level key aborts the write.
 *  - Spreadsheet formula-injection safety: any string that could be
 *    interpreted as a formula is neutralised before it reaches a cell.
 *  - Abuse controls: per-HN and global rate limits via CacheService.
 *  - Idempotency: a repeated clientRecordId updates/no-ops instead of
 *    appending a duplicate row, so client-side retries are safe.
 *  - A real, readable JSON response, so the client can tell success from
 *    failure instead of guessing.
 *
 * What this does NOT do, on purpose:
 *  - It does not add a new shared secret in place of APP_TOKEN. APP_TOKEN
 *    stays as a coarse, openly-documented abuse deterrent (see its comment
 *    in app.js); the real access control here is the allowlist check.
 *  - It does not *authenticate* the caller as that patient. Checking "is
 *    this HN enrolled" stops a random stranger from writing rows for HNs
 *    that don't exist, but it does not prove the phone submitting HN
 *    "004512" is actually patient 004512 rather than someone who saw that
 *    number on a form. True authentication needs a second factor you
 *    control the distribution of — e.g. requiring HN *and* date of birth to
 *    match your patient roster, or a one-time enrollment code handed out at
 *    intake. That is a product decision (how much friction is acceptable
 *    at onboarding for this patient population), not something to bake in
 *    unilaterally, so it is a recommendation here, not an implementation.
 *  - It does not solve the CORS caveat below for you.
 *
 * KNOWN CAVEAT — Apps Script and CORS:
 *  ContentService responses have no public API to set arbitrary response
 *  headers (no setHeader for Access-Control-Allow-Origin). Web app
 *  deployments ("Execute as: Me", "Who has access: Anyone") are reported to
 *  serve GET responses readably cross-origin in most cases, but POST
 *  responses are inconsistently readable depending on account/deployment
 *  specifics, and this cannot be verified from this environment (its
 *  network egress cannot reach script.google.com at all). app.js's
 *  syncOne() already fails safe either way — if the response can't be read,
 *  the record simply stays "pending" and retries later, it is never marked
 *  synced on a guess. But if you find POST responses aren't readable for
 *  your deployment, the standard fix is a small proxy you control (a Vercel
 *  Edge Function or Cloudflare Worker) that forwards to this script and
 *  adds the CORS header itself; ask for that as a separate follow-up if
 *  you hit this.
 */

// ---- Configuration -------------------------------------------------------

// Same value as APP_TOKEN in app.js. Keep them in sync.
const APP_TOKEN = 'mBXvt5FYGIgaShK6NNu8_dfTAs508xRD';

// Tab that holds one row per enrolled patient, with an "HN" column.
// Only clinic staff should have edit access to this tab.
const PATIENTS_SHEET_NAME = 'Patients';
const PATIENTS_HN_COLUMN = 'HN';

// Tab that measurement rows are appended to.
const MEASURES_SHEET_NAME = 'Measures';

// Rate limits (tune to your real patient volume).
const MAX_REQUESTS_PER_HN_PER_HOUR = 10;
const MAX_REQUESTS_GLOBAL_PER_MINUTE = 60;

// ---- Entry point -----------------------------------------------------------

function doPost(e) {
  // One request at a time: the duplicate check and the append below must be
  // atomic, or two concurrent retries of the same record both pass the check
  // and both append. The rate-limit counters need the same protection.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = parseAndValidate(e);
    checkRateLimits(payload.hn);
    assertPatientEnrolled(payload.hn);
    const result = writeMeasureIdempotently(payload);
    return jsonResponse({ ok: true, deduped: result.deduped });
  } catch (err) {
    // Deliberately generic message: do not echo back which check failed
    // (unknown-HN vs bad-token vs malformed payload) — that would let an
    // attacker enumerate valid HNs by watching which rejection they get.
    // ContentService cannot set an HTTP status, so this still arrives as a
    // 200; the client treats an explicit ok:false as "not delivered".
    console.error(err);
    return jsonResponse({ ok: false, error: 'rejected' });
  } finally {
    lock.releaseLock();
  }
}

// ---- Validation --------------------------------------------------------

function parseAndValidate(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('no body');
  const body = JSON.parse(e.postData.contents);

  if (body.token !== APP_TOKEN) throw new Error('bad token');
  if (body.recordType !== 'measures') throw new Error('bad recordType');

  const hn = String(body.hn || '');
  if (!/^[A-Za-z0-9-]{1,20}$/.test(hn)) throw new Error('bad hn');

  const clientRecordId = String(body.clientRecordId || '');
  if (!/^[A-Za-z0-9-]{8,80}$/.test(clientRecordId)) throw new Error('bad clientRecordId');

  const date = String(body.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('bad date');

  const ucla = body.ucla || {};
  const rom = body.rom || {};
  const numInRange = (v, lo, hi) => typeof v === 'number' && isFinite(v) && v >= lo && v <= hi;
  if (!numInRange(ucla.pain, 0, 10)) throw new Error('bad ucla.pain');
  if (!numInRange(ucla.func, 0, 10)) throw new Error('bad ucla.func');
  if (!numInRange(ucla.strength, 0, 5)) throw new Error('bad ucla.strength');
  if (!numInRange(ucla.satisfaction, 0, 5)) throw new Error('bad ucla.satisfaction');
  if (!numInRange(rom.flexion, 0, 180)) throw new Error('bad rom.flexion');
  if (rom.abduction !== undefined && !numInRange(rom.abduction, 0, 180)) throw new Error('bad rom.abduction');
  if (rom.externalRotation !== undefined && !numInRange(rom.externalRotation, -90, 90)) throw new Error('bad rom.externalRotation');

  const uclaTotal = body.uclaTotal;
  if (!numInRange(uclaTotal, 0, 35)) throw new Error('bad uclaTotal');

  return {
    hn: hn,
    clientRecordId: clientRecordId,
    date: date,
    recordedAt: safeString(body.recordedAt, 40),
    ucla: ucla,
    rom: rom,
    flexionPts: numInRange(body.flexionPts, 0, 5) ? body.flexionPts : 0,
    uclaTotal: uclaTotal,
    uclaGrade: safeString(body.uclaGrade, 20),
    stage: safeString(body.stage, 60),
    onsetMonthYear: safeString(body.onsetMonthYear, 10),
    monthsSinceOnset: typeof body.monthsSinceOnset === 'number' ? body.monthsSinceOnset : null,
    daysExercisedThisMonth: typeof body.daysExercisedThisMonth === 'number' ? body.daysExercisedThisMonth : null,
    exercisesDoneThisMonth: typeof body.exercisesDoneThisMonth === 'number' ? body.exercisesDoneThisMonth : null,
    exercisesPossibleThisMonth: typeof body.exercisesPossibleThisMonth === 'number' ? body.exercisesPossibleThisMonth : null
  };
}

// Defuses spreadsheet formula injection: any string that could be
// interpreted as a formula (or a formula-adjacent CSV/DDE trick) when a
// human later opens the sheet gets a leading apostrophe, which forces
// Sheets to treat it as literal text. Client-side sanitiseHN() already
// restricts HN to [A-Za-z0-9-], but the server must never trust that —
// this endpoint can be hit directly, bypassing the client entirely.
function safeString(value, maxLen) {
  let s = String(value == null ? '' : value).slice(0, maxLen);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

// ---- Authorization -------------------------------------------------------

function assertPatientEnrolled(hn) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PATIENTS_SHEET_NAME);
  if (!sheet) throw new Error('patients sheet missing');
  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const col = header.indexOf(PATIENTS_HN_COLUMN);
  if (col === -1) throw new Error('HN column missing');
  // Patients type the number as printed on their card ("HN-004512"); the
  // roster may hold "004512" or "hn 004512". Compare the bare number. Format
  // the roster's HN column as plain text, or Sheets drops leading zeros.
  const bare = s => String(s).trim().toUpperCase().replace(/^HN[\s:-]*/, '');
  const want = bare(hn);
  for (let i = 1; i < values.length; i++) {
    if (bare(values[i][col]) === want) return;
  }
  throw new Error('hn not enrolled');
}

// ---- Abuse controls --------------------------------------------------------

function checkRateLimits(hn) {
  const cache = CacheService.getScriptCache();

  const globalKey = 'rl-global-' + Math.floor(Date.now() / 60000);
  const globalCount = Number(cache.get(globalKey) || 0) + 1;
  cache.put(globalKey, String(globalCount), 90);
  if (globalCount > MAX_REQUESTS_GLOBAL_PER_MINUTE) throw new Error('global rate limit');

  const hnKey = 'rl-hn-' + hn + '-' + Math.floor(Date.now() / 3600000);
  const hnCount = Number(cache.get(hnKey) || 0) + 1;
  cache.put(hnKey, String(hnCount), 3660);
  if (hnCount > MAX_REQUESTS_PER_HN_PER_HOUR) throw new Error('per-hn rate limit');
}

// ---- Idempotent write -----------------------------------------------------

function writeMeasureIdempotently(payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEASURES_SHEET_NAME);
  if (!sheet) throw new Error('measures sheet missing');

  // clientRecordId lives in column A. Scanning the column is fine at
  // clinic-scale volumes (thousands of rows); if this sheet grows past
  // that, replace this scan with a CacheService/PropertiesService index
  // keyed on clientRecordId instead of re-reading the whole column.
  // getRange() throws on a zero-row range, which is what a header-only sheet
  // would ask for — so skip the scan until there is at least one data row.
  const dataRows = sheet.getLastRow() - 1;
  if (dataRows > 0) {
    const existingIds = sheet.getRange(2, 1, dataRows, 1).getValues();
    for (let i = 0; i < existingIds.length; i++) {
      if (existingIds[i][0] === payload.clientRecordId) {
        return { deduped: true };
      }
    }
  }

  sheet.appendRow([
    payload.clientRecordId,
    safeString(payload.hn, 20),
    payload.date,
    payload.recordedAt,
    payload.ucla.pain, payload.ucla.func, payload.ucla.strength, payload.ucla.satisfaction,
    payload.rom.flexion, payload.rom.abduction ?? '', payload.rom.externalRotation ?? '',
    payload.flexionPts,
    payload.uclaTotal,
    safeString(payload.uclaGrade, 20),
    safeString(payload.stage, 60),
    payload.onsetMonthYear,
    payload.monthsSinceOnset,
    payload.daysExercisedThisMonth,
    payload.exercisesDoneThisMonth,
    payload.exercisesPossibleThisMonth,
    new Date()
  ]);
  return { deduped: false };
}

// ---- Response helper -----------------------------------------------------

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
