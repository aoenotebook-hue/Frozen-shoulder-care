# Sync/security test results

All tests use synthetic data only (fake HNs such as `HN-TEST01`). Nothing was
sent to the real Apps Script endpoint: this environment cannot reach
`script.google.com`, and the client tests intercept every request to it.

## How the client decides a record is delivered (`syncOne` in `app.js`)

- **Delivered** = a readable 2xx reply that is not an Apps Script HTML error
  page and not an explicit `{"ok":false}`. Any reply format the currently
  deployed backend might use (`OK`, `{"status":"success"}`, `{"ok":true}`)
  counts, so the record is sent once.
- **Not delivered** (record stays pending): network error, non-2xx, HTML
  error page, or `{"ok":false}`.
- **Retries** wait 1 min after a failure, doubling up to once a day. They are
  never sent twice at once. Nothing is attempted (or counted) while the
  device reports offline; reconnecting retries immediately.

## Client (browser, mocked backend) — 15/15 passed

| Scenario | Result |
|---|---|
| Backend replies `OK` / `{"status":"success"}` / `{"ok":true}`, then 5 app re-focuses | 1 POST each, marked synced |
| Backend replies `{"ok":false}` (e.g. unenrolled HN), then 5 re-focuses | Stays pending, still only 1 POST |
| Same, after the backoff window passes | Retries once |
| Apps Script HTML error page (200) | Stays pending |
| HTTP 500 | Stays pending |
| Network error, then 5 re-focuses | Stays pending, 1 attempt |
| Offline, then 3 re-focuses | No request, no attempt counted |
| Back online | Retried immediately, acknowledged |
| 3 sync triggers overlapping | 1 POST |
| Payload | Has `clientRecordId`, `hn`, `token`, `recordType`; omits local-only `syncAttempts` / `lastSyncAttemptAt` / `syncedAt` |
| `data-action` not on the allowlist (injected markup) | Ignored |

Before this fix the client required exactly `{"ok":true}`, so against any
other reply it re-sent the same record on every app focus (6 POSTs for one
record in 5 re-focuses), and 3 overlapping triggers sent 3 POSTs.

## HN entry (both languages) — 16/16 passed

| Scenario | Result |
|---|---|
| Blank HN, or `HN` with no number | Blocked with a message |
| Thai digits `HN-๐๐๔๕๑๒` | Saved as `HN-004512` |
| `12345/66` | Slash kept |
| Patient who set up earlier without an HN | Asked for it on next open; unsent assessment held until then, then sent with it |
| Tap HN in the header | Form reopens prefilled; onset date kept |
| Fix a typo in the HN | Unsent assessments re-labelled; already-sent ones untouched |
| No page or console errors | ✓ |

## Client end-to-end (both languages) — 32/32 passed

Fresh install → onboarding (HN, onset, consent) → add-to-home prompt →
3-step assessment (score buttons, ROM arc drag, Back/Next) → saved as numbers
→ single POST with `clientRecordId` and HN → all 8 tabs → language switch →
Reset App Data → onboarding again. Zero console or page errors.

Plus 20/20 on event delegation and CSP: no CSP violations, `app.js` loaded
externally, every tab, both language toggles, exercise toggle by click and by
keyboard (Space), video play, context-menu suppression on media, score
buttons producing numbers.

## Reference backend (`apps-script-backend.gs`, run in Node against in-memory fakes of SpreadsheetApp / CacheService / LockService / ContentService) — 12/12 passed

| Scenario | Result |
|---|---|
| First write to a header-only sheet | Row written |
| Same `clientRecordId` twice | Second deduped, no extra row |
| `rom.abduction` of 0 | Stored as 0, not blank |
| Any HN, with no patient list in the sheet | Accepted |
| HN with a slash (`12345/66`) | Accepted |
| HN with no number (`HN`), or formula characters (`=1+1`) | Rejected, nothing written |
| Bad token vs bad HN | Identical generic replies |
| Out-of-range score | Rejected |
| Text starting `=HYPERLINK(...)` | Written with a leading `'` (not a live formula) |
| 11+ requests for one HN in an hour | Throttled after 10 |
| Malformed `clientRecordId` | Rejected |

Run against the earlier draft of this file, the suite shows it rejected
**every** write on a fresh sheet (a zero-row `getRange` threw).

These fakes check the script's logic, not Google's runtime. Before relying
on it, run the checklist below against a copy of the real sheet.

## Not executed — needs the real deployment

- [ ] **Most important — is the POST reply readable?** On the live site, open
  DevTools → Network, complete an assessment, and check that the request to
  `script.google.com` returns a readable response (not a CORS error in the
  console). If it is readable, each record is sent once. If it is **not**,
  the request still reaches the sheet but the app can't confirm it, so it
  retries on the backoff schedule — and the currently deployed backend, which
  does not dedupe, would get a duplicate row per retry (several on day one,
  then one a day). If that happens, deploy the reference backend (it dedupes
  on `clientRecordId`) or put a small proxy in front that adds
  `Access-Control-Allow-Origin`.
- [ ] Deploy the reference backend against a **copy** of the sheet and
  repeat the backend table above with fake HNs. No patient list is needed:
  any HN containing a number is accepted.
- [ ] Confirm the live sheet's row layout matches `appendRow` in the reference
  script before switching the real deployment over.
