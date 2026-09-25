/**
 * Frozen shoulder recovery — Google Sheets backend (Apps Script)
 * ============================================================================
 * Receives each monthly assessment from the app and writes it to the
 * spreadsheet in a form a clinician can read at a glance:
 *
 *   "ผลการประเมิน" (Assessments)  one row per assessment, one labelled column
 *                                 per score, grades and stages in words, and
 *                                 the change since the patient's first visit.
 *   "สรุปผู้ป่วย" (Patient summary) one row per patient: first vs latest score,
 *                                 change, number of assessments, and when the
 *                                 next monthly assessment is due (turns red
 *                                 once overdue).
 *
 * Both tabs are created and formatted automatically on the first submission.
 * Any tab the previous script wrote to is left exactly as it is.
 *
 * INSTALL (replaces the script currently deployed — keep the same URL):
 *  1. Open the spreadsheet → Extensions → Apps Script.
 *  2. Select everything in the editor, delete it, paste this whole file, Save.
 *  3. Deploy → Manage deployments → the existing deployment → Edit (pencil)
 *     → Version: "New version" → Deploy.
 *     Do NOT use "New deployment": that creates a different URL and the app
 *     would keep sending to the old one.
 *  4. Check: open the deployment's Web app URL in a browser. It should say
 *     "✓ Working … (readable-sheet v2)". If it says something else, the old
 *     version is still live — repeat step 3.
 *  5. Complete one assessment in the app with a test HN (e.g. TEST-1), check
 *     the two tabs, then delete the test row.
 *
 * Set SHEET_LANG below to 'en' for English headers and labels.
 *
 * Design notes:
 *  - Open to every patient with an HN: any well-formed HN is accepted. There
 *    is no patient list or enrollment code for clinic staff to maintain.
 *    The trade-off: nothing verifies that the person submitting HN "004512"
 *    is that patient. Submissions are write-only, so the exposure is wrong
 *    or junk rows, not a data leak; rate limits cap the volume.
 *  - The UCLA total and grade are recomputed here from the individual
 *    answers rather than trusting the totals the app sends.
 *  - A retried submission (same Record ID) is recognised and not written
 *    twice. Text that could run as a spreadsheet formula is neutralised.
 *  - APP_TOKEN is a coarse abuse deterrent, not a secret: it ships inside
 *    the public app.js.
 */

// ---- Configuration ----------------------------------------------------------

const SHEET_LANG = 'th';                       // 'th' or 'en'
const APP_TOKEN = 'mBXvt5FYGIgaShK6NNu8_dfTAs508xRD';   // same value as in app.js
const ASSESS_INTERVAL_DAYS = 30;               // same cadence as the app
const MAX_REQUESTS_PER_HN_PER_HOUR = 10;
const MAX_REQUESTS_GLOBAL_PER_MINUTE = 60;

const L = {
  th: {
    resultsTab: 'ผลการประเมิน', summaryTab: 'สรุปผู้ป่วย',
    results: ['วันที่ประเมิน', 'HN', 'ระยะของโรค', 'ป่วยมา (เดือน)',
      'UCLA รวม (เต็ม 35)', 'ผล UCLA', 'เปลี่ยนจากครั้งแรก',
      'ปวด (0–10)', 'การใช้งาน (0–10)', 'ยกแขนไปข้างหน้า (°)', 'คะแนนยกแขน (0–5)',
      'กำลังกล้ามเนื้อ (0–5)', 'ความพึงพอใจ', 'กางแขนด้านข้าง (°)',
      'หมุนแขนออก (°)', 'เอื้อมไปด้านหลังถึง', 'วันที่ออกกำลังกายเดือนนี้',
      'ท่าบริหารที่ทำ (ทำ/ทั้งหมด)', 'เริ่มมีอาการ', 'ส่งเมื่อ', 'Record ID'],
    summary: ['HN', 'ประเมินครั้งแรก', 'UCLA ครั้งแรก', 'ประเมินล่าสุด', 'UCLA ล่าสุด',
      'ผลล่าสุด', 'เปลี่ยนแปลง', 'จำนวนครั้ง', 'ระยะล่าสุด', 'ครบกำหนดครั้งถัดไป'],
    grade: { excellent: 'ดีเยี่ยม', good: 'ดี', poor: 'ต้องปรับปรุง' },
    stage: ['ระยะที่ 1 · ก่อนข้อติด', 'ระยะที่ 2 · ระยะเริ่มติด', 'ระยะที่ 3 · ระยะข้อติด', 'ระยะที่ 4 · ระยะคลายตัว'],
    satisfied: 'พอใจ (5)', notSatisfied: 'ไม่พอใจ (0)', first: 'ครั้งแรก',
    months: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    ir: ['ต้นขาด้านนอก', 'สะโพก', 'กระเป๋ากางเกงหลัง', 'กระเบนเหน็บ', 'ขอบเอว',
      'หลังส่วนล่าง', 'กลางหลัง', 'สะบัก', 'ระหว่างสะบัก']
  },
  en: {
    resultsTab: 'Assessments', summaryTab: 'Patient summary',
    results: ['Assessment date', 'HN', 'Stage', 'Months since onset',
      'UCLA total (of 35)', 'UCLA result', 'Change since first',
      'Pain (0–10)', 'Function (0–10)', 'Forward elevation (°)', 'Elevation points (0–5)',
      'Strength (0–5)', 'Satisfaction', 'Abduction (°)',
      'External rotation (°)', 'Reaches behind back to', 'Days exercised this month',
      'Exercises done (done/possible)', 'Symptom onset', 'Submitted', 'Record ID'],
    summary: ['HN', 'First assessment', 'First UCLA', 'Latest assessment', 'Latest UCLA',
      'Latest result', 'Change', 'Assessments', 'Latest stage', 'Next assessment due'],
    grade: { excellent: 'Excellent', good: 'Good', poor: 'Needs work' },
    stage: ['Stage 1 · Pre-freezing', 'Stage 2 · Freezing', 'Stage 3 · Frozen', 'Stage 4 · Thawing'],
    satisfied: 'Satisfied (5)', notSatisfied: 'Not satisfied (0)', first: 'First',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ir: ['Outer thigh', 'Buttock', 'Back pocket', 'Sacrum', 'Waistband',
      'Low back', 'Mid back', 'Shoulder blade', 'Between blades']
  }
}[SHEET_LANG];

// Results-tab column positions (1-based), in the order of L.results.
const COL = { date: 1, hn: 2, total: 5, grade: 6, change: 7, id: 21 };
const RESULT_COLS = 21;
const GRADE_COLORS = { excellent: '#D8F0E3', good: '#FFF1C9', poor: '#FBDAD7' };

// Same bands the app uses to turn forward elevation into UCLA points.
const FLEXION_BANDS = [[150, 5], [120, 4], [90, 3], [45, 2], [30, 1], [0, 0]];
const flexionPoints = deg => FLEXION_BANDS.find(([min]) => deg >= min)[1];
const gradeKey = total => total >= 34 ? 'excellent' : total >= 29 ? 'good' : 'poor';
// "HN-004512", "hn 004512" and "004512" are the same patient.
const bareHN = s => String(s).trim().toUpperCase().replace(/^HN[\s:-]*/, '');

// ---- Entry points -----------------------------------------------------------

const SCRIPT_VERSION = 'readable-sheet v2';

// Opening the script's URL in a browser lands here. Results only ever arrive
// from the app (doPost); this just confirms which version is deployed and
// shows no patient data.
function doGet() {
  return ContentService.createTextOutput(
    '✓ ทำงานปกติ — สคริปต์บันทึกผลฟื้นฟูไหล่ติด (' + SCRIPT_VERSION + ')\n' +
    'ผลการประเมินจะส่งมาจากแอปโดยอัตโนมัติ ไม่ต้องเปิดหน้านี้\n\n' +
    '✓ Working — frozen shoulder results script (' + SCRIPT_VERSION + ')\n' +
    'Results are sent automatically by the app; this page is only a check.');
}

function doPost(e) {
  // One request at a time: the duplicate check and the append must be atomic,
  // and so must the rate-limit counters.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = parseAndValidate(e);
    checkRateLimits(p.hn);
    const result = writeAssessment(p);
    return jsonResponse({ ok: true, deduped: result.deduped });
  } catch (err) {
    // Deliberately generic: don't reveal which check failed. ContentService
    // can't set an HTTP status, so this arrives as a 200; the app treats an
    // explicit ok:false as "not delivered" and retries later.
    console.error(err);
    return jsonResponse({ ok: false, error: 'rejected' });
  } finally {
    lock.releaseLock();
  }
}

// ---- Validation -------------------------------------------------------------

function parseAndValidate(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('no body');
  const b = JSON.parse(e.postData.contents);

  if (b.token !== APP_TOKEN) throw new Error('bad token');
  if (b.recordType !== 'measures') throw new Error('bad recordType');

  const hn = String(b.hn || '');
  // Letters, digits, "-" and "/" (some hospitals print "12345/66"), and it
  // must contain a number — the same shape the app produces.
  if (!/^[A-Za-z0-9\/-]{1,20}$/.test(hn) || !/\d/.test(hn)) throw new Error('bad hn');

  const id = String(b.clientRecordId || '');
  if (!/^[A-Za-z0-9-]{8,80}$/.test(id)) throw new Error('bad clientRecordId');

  const date = String(b.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('bad date');

  const u = b.ucla || {}, r = b.rom || {};
  const num = (v, lo, hi) => typeof v === 'number' && isFinite(v) && v >= lo && v <= hi;
  // Optional extras: an odd value is left blank rather than costing the
  // patient their whole assessment.
  const opt = (v, lo, hi) => num(v, lo, hi) ? v : null;

  if (!num(u.pain, 0, 10) || !num(u.func, 0, 10)) throw new Error('bad pain/function');
  if (!num(u.strength, 0, 5) || !num(u.satisfaction, 0, 5)) throw new Error('bad strength/satisfaction');
  if (!num(r.flexion, 0, 180)) throw new Error('bad flexion');

  const flexPts = flexionPoints(r.flexion);
  const total = u.pain + u.func + flexPts + u.strength + u.satisfaction;

  const onset = /^\d{4}-\d{2}$/.test(String(b.onsetMonthYear || '')) ? b.onsetMonthYear : '';
  const stageNum = Number((String(b.stage || '').match(/Stage\s*([1-4])/) || [])[1]) || null;

  return {
    hn, id, date, onset, stageNum,
    pain: u.pain, func: u.func, strength: u.strength, satisfaction: u.satisfaction,
    flexion: r.flexion, flexPts, total,
    abduction: opt(r.abduction, 0, 180),
    er: opt(r.er, 0, 90),
    ir: opt(r.ir, 0, 8),
    months: opt(b.monthsSinceOnset, 0, 600),
    days: opt(b.daysExercisedThisMonth, 0, 31),
    done: opt(b.exercisesDoneThisMonth, 0, 10000),
    possible: opt(b.exercisesPossibleThisMonth, 0, 10000)
  };
}

// Defuses spreadsheet formula injection: text starting with = + - @ (or a
// tab/CR) gets a leading apostrophe so Sheets shows it as plain text. The
// app already restricts HNs, but this endpoint can be called directly.
function safeString(value, maxLen) {
  let s = String(value == null ? '' : value).slice(0, maxLen);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

// ---- Abuse controls ---------------------------------------------------------

function checkRateLimits(hn) {
  const cache = CacheService.getScriptCache();
  const globalKey = 'rl-global-' + Math.floor(Date.now() / 60000);
  const globalCount = Number(cache.get(globalKey) || 0) + 1;
  cache.put(globalKey, String(globalCount), 90);
  if (globalCount > MAX_REQUESTS_GLOBAL_PER_MINUTE) throw new Error('global rate limit');

  const hnKey = 'rl-hn-' + bareHN(hn) + '-' + Math.floor(Date.now() / 3600000);
  const hnCount = Number(cache.get(hnKey) || 0) + 1;
  cache.put(hnKey, String(hnCount), 3660);
  if (hnCount > MAX_REQUESTS_PER_HN_PER_HOUR) throw new Error('per-hn rate limit');
}

// ---- Writing ----------------------------------------------------------------

function writeAssessment(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureResultsSheet(ss);

  const rows = sheet.getLastRow() - 1;
  if (rows > 0) {
    const ids = sheet.getRange(2, COL.id, rows, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] === p.id) return { deduped: true };
    }
  }

  const [y, m, d] = p.date.split('-').map(Number);
  const blank = v => v === null ? '' : v;
  sheet.appendRow([
    new Date(y, m - 1, d),
    safeString(p.hn, 20),
    p.stageNum ? L.stage[p.stageNum - 1] : '',
    blank(p.months),
    p.total,
    L.grade[gradeKey(p.total)],
    '',                                   // change: filled in below
    p.pain, p.func, p.flexion, p.flexPts, p.strength,
    p.satisfaction >= 5 ? L.satisfied : p.satisfaction === 0 ? L.notSatisfied : p.satisfaction,
    blank(p.abduction),
    blank(p.er),
    p.ir === null ? '' : (L.ir[Math.round(p.ir)] || ''),
    blank(p.days),
    p.possible === null || p.done === null ? ''
      : p.possible ? `${p.done}/${p.possible} (${Math.round(100 * p.done / p.possible)}%)` : `${p.done}/0`,
    p.onset ? L.months[Number(p.onset.slice(5)) - 1] + ' ' + p.onset.slice(0, 4) : '',
    new Date(),
    p.id
  ]);

  refreshChangeColumn(sheet, p.hn);
  rebuildSummary(ss, sheet);
  return { deduped: false };
}

// "Change since first" for every row of this patient, measured from their
// earliest assessment date. Recomputed for all their rows, so it stays right
// even when an older assessment arrives late (e.g. sent after being offline).
function refreshChangeColumn(sheet, hn) {
  const n = sheet.getLastRow() - 1;
  const data = sheet.getRange(2, 1, n, COL.total).getValues();
  const key = bareHN(hn);
  let first = null;                         // earliest date; ties go to the earlier row
  data.forEach((row, i) => {
    if (bareHN(row[COL.hn - 1]) !== key) return;
    const t = new Date(row[COL.date - 1]).getTime();
    if (!first || t < first.t) first = { t, i, total: row[COL.total - 1] };
  });
  data.forEach((row, i) => {
    if (bareHN(row[COL.hn - 1]) !== key) return;
    const diff = row[COL.total - 1] - first.total;
    sheet.getRange(i + 2, COL.change).setValue(
      i === first.i ? L.first : (diff > 0 ? '+' : '') + diff);
  });
}

function rebuildSummary(ss, results) {
  const sheet = ensureSummarySheet(ss);
  const n = results.getLastRow() - 1;
  const data = n > 0 ? results.getRange(2, 1, n, RESULT_COLS).getValues() : [];

  const byPatient = {};
  data.forEach(row => {
    const key = bareHN(row[COL.hn - 1]);
    const r = { date: new Date(row[COL.date - 1]), hn: row[COL.hn - 1], total: row[COL.total - 1],
                grade: row[COL.grade - 1], stage: row[2] };
    const g = byPatient[key] || (byPatient[key] = { first: r, latest: r, count: 0 });
    g.count++;
    if (r.date < g.first.date) g.first = r;
    if (r.date >= g.latest.date) g.latest = r;
  });

  const out = Object.keys(byPatient).map(k => {
    const g = byPatient[k];
    const diff = g.latest.total - g.first.total;
    const due = new Date(g.latest.date.getTime() + ASSESS_INTERVAL_DAYS * 86400000);
    return [g.latest.hn, g.first.date, g.first.total, g.latest.date, g.latest.total,
            g.latest.grade, g.count > 1 ? (diff > 0 ? '+' : '') + diff : L.first,
            g.count, g.latest.stage, due];
  }).sort((a, b) => b[3] - a[3]);           // most recently assessed first

  const old = sheet.getLastRow() - 1;
  if (old > 0) sheet.getRange(2, 1, old, L.summary.length).clearContent();
  if (out.length) sheet.getRange(2, 1, out.length, L.summary.length).setValues(out);
}

// ---- Tab setup (runs once, when a tab doesn't exist yet) ---------------------

function ensureResultsSheet(ss) {
  let sheet = ss.getSheetByName(L.resultsTab);
  if (sheet) return sheet;
  sheet = ss.insertSheet(L.resultsTab);
  styleHeader(sheet, L.results);
  sheet.setFrozenColumns(2);                       // date + HN stay visible
  sheet.getRange('A2:A').setNumberFormat('dd/MM/yyyy');
  sheet.getRange('T2:T').setNumberFormat('dd/MM/yyyy HH:mm');
  sheet.getRange('D2:R').setHorizontalAlignment('center');
  sheet.getRange(1, 1, 1, RESULT_COLS).createFilter();
  sheet.setColumnWidth(1, 105); sheet.setColumnWidth(2, 110); sheet.setColumnWidth(3, 170);
  sheet.hideColumns(COL.id);                       // Record ID: used to skip duplicates only
  addGradeColors(sheet, sheet.getRange('F2:F'));
  return sheet;
}

function ensureSummarySheet(ss) {
  let sheet = ss.getSheetByName(L.summaryTab);
  if (sheet) return sheet;
  sheet = ss.insertSheet(L.summaryTab);
  styleHeader(sheet, L.summary);
  sheet.getRange('B2:B').setNumberFormat('dd/MM/yyyy');
  sheet.getRange('D2:D').setNumberFormat('dd/MM/yyyy');
  sheet.getRange('J2:J').setNumberFormat('dd/MM/yyyy');
  sheet.getRange('B2:J').setHorizontalAlignment('center');
  sheet.setColumnWidth(1, 110); sheet.setColumnWidth(9, 170);
  addGradeColors(sheet, sheet.getRange('F2:F'));
  const overdue = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($J2<>"",$J2<TODAY())')
    .setBackground('#FBDAD7').setFontColor('#9B1C1C')
    .setRanges([sheet.getRange('J2:J')]).build();
  sheet.setConditionalFormatRules(sheet.getConditionalFormatRules().concat([overdue]));
  return sheet;
}

function styleHeader(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF')
    .setWrap(true).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 48);
  for (let c = 4; c <= headers.length; c++) sheet.setColumnWidth(c, 120);
}

function addGradeColors(sheet, range) {
  const rules = Object.keys(GRADE_COLORS).map(k =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(L.grade[k])
      .setBackground(GRADE_COLORS[k]).setRanges([range]).build());
  sheet.setConditionalFormatRules(sheet.getConditionalFormatRules().concat(rules));
}

// ---- Response ---------------------------------------------------------------

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
