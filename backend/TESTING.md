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

## Sheet script (`apps-script-backend.gs`, run in Node against a strict fake of SpreadsheetApp / CacheService / LockService / ContentService that only exposes real Apps Script method names) — 31/31 passed

| Scenario | Result |
|---|---|
| First submission | Creates "ผลการประเมิน" and "สรุปผู้ป่วย" tabs; header bold and frozen, date + HN columns frozen, filter on, Record ID column hidden, grade colours + overdue rule |
| Row content | Real date; stage, grade and satisfaction in words; external rotation and internal-rotation landmark kept; adherence as `18/24 (75%)`; onset as `เม.ย. 2026` |
| App sends a wrong total/grade | Ignored — total and grade recomputed from the answers |
| Second visit, HN typed `004512` vs `HN-004512` | Same patient; change `+16`; summary shows first → latest, 2 assessments, next due date |
| Older assessment arrives late | Becomes "first"; every row's change recomputed |
| Same Record ID twice | Written once |
| Odd optional value (e.g. negative months) | Left blank; assessment still saved |
| Two patients | Summary sorted by most recent assessment |
| Bad token, formula-looking HN, out-of-range score | Rejected, nothing written |
| 12 submissions for one HN in an hour | 10 written, rest rejected |
| `SHEET_LANG = 'en'` | English tabs, headers and labels |

Plus a real payload captured from the app (full assessment in a browser)
fed into the script: accepted, every column filled, and the sheet's
recomputed UCLA total and grade match the app's.

The fake checks the script's logic and API usage, not Google's runtime —
do the one-row test in the install steps before relying on it.

## Checks on the real deployment

- [x] **Is the POST reply readable?** Confirmed on the live site (25 Sep
  2026): the app showed "✓ ส่งถึงทีมผู้ดูแลแล้ว" after a real assessment, so
  each record is acknowledged and sent once.
- [ ] After installing the sheet script (steps at the top of the file),
  submit one assessment with a test HN, check both tabs, delete the test
  row. The previous tab is left untouched.
