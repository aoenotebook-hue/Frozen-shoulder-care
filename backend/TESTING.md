# Sync/security test results

Scope: this covers what `index.html`'s client-side sync logic (`syncOne`,
`trySyncPending`, `makeRecordId`) does with a **mocked** backend — Playwright
intercepting `https://script.google.com/**` and returning canned responses.
The sandbox this was run in cannot reach `script.google.com` at all (network
egress is blocked for that host), so nothing here exercises the real Apps
Script endpoint or `backend/apps-script-backend.gs`. That half of the test
plan is listed at the bottom, unexecuted, for whoever has access to run it.

## Automated (client-side, mocked backend) — 12/12 passed

| # | Scenario | Result |
|---|---|---|
| 1 | Backend returns `200 {ok:true}` | Record marked `synced`, `clientRecordId` present, request body carried it |
| 2 | Backend returns `400 {ok:false}` (stands in for an unenrolled/unauthorized HN) | Record stays `synced:false`, no crash |
| 3 | Request throws (offline / DNS / TLS failure) | Record stays `synced:false`, caught and logged, no uncaught page error |
| 4 | Same record retried twice (simulating a race or a repeated retry) | `clientRecordId` identical on both attempts — a backend that dedupes on it (see `writeMeasureIdempotently` in the reference backend) would not create a second row |
| 5 | First attempt fails (offline), then an `online` event fires | Stays pending after the first failure, succeeds automatically on the retry — no page reload needed |
| 6 | Full tab walk (Home/About/Exercises/Progress/Sleep/Self-care/Resources/Alert) with one synced measure seeded | No console errors, sync-status line renders ("Shared with your care team") |
| — | Zero-measures state (`renderProgress()` with no records) | Renders the existing "no assessment yet" card, does not throw on the new `latestMeasure().synced` read (that read is inside the same `if(e)` guard `effectiveUcla()` already required) |
| — | Translation parity after adding `syncStatusDone`/`syncStatusPending` | EN and TH `CONTENT` blocks still have identical key sets (149/149) |
| — | JS syntax | `node --check` on the extracted inline script, clean |

Reproduce: the scripts this ran are not committed (they're throwaway
Playwright harnesses); the scenarios and mock shapes above are complete
enough to reconstruct them against any static file server pointed at this
`index.html`.

## Not executed — needs the real backend

These require an actual Apps Script deployment and were not run against
one; they should be run with synthetic data (fake HNs, not real patients)
against a **copy** of the production sheet before `backend/apps-script-backend.gs`
replaces anything live:

- [ ] An HN not present on the `Patients` tab is rejected (`assertPatientEnrolled` throws → generic `{ok:false}`), and specifically that the error response does **not** distinguish "unknown HN" from "bad token" from "malformed payload" (enumeration check).
- [ ] A request missing `token` or with the wrong one is rejected the same generic way as an unknown HN (same enumeration check, from the other direction).
- [ ] A payload with an out-of-range field (e.g. `ucla.pain: 999`, `rom.flexion: -5`) is rejected before it reaches `appendRow`.
- [ ] A payload with an extra/unexpected top-level key doesn't change behavior (validator only reads known fields; nothing is blindly spread into the row).
- [ ] A string field containing a leading `=`, `+`, `-`, or `@` is written to the sheet with a neutralizing prefix, not as a live formula (formula-injection check) — verify by opening the resulting cell in Sheets, not just reading the value back via API.
- [ ] Two requests with the same `clientRecordId` result in exactly one row (idempotency), and the second response reports `deduped:true`.
- [ ] More than `MAX_REQUESTS_PER_HN_PER_HOUR` requests for one HN in an hour get throttled; more than `MAX_REQUESTS_GLOBAL_PER_MINUTE` across all HNs in a minute get throttled.
- [ ] **CORS check**: from a page served on the real `frozen-shoulder-care.vercel.app` origin (or `localhost` during dev), confirm `fetch(SHEET_WEBHOOK_URL, {method:'POST', ...})` **without** `mode:'no-cors'` actually resolves readably (`response.ok` reachable, body parseable) rather than rejecting with a CORS/network error. If it rejects, `syncOne()` already fails safe (record just stays pending forever), but sync will never succeed until this is fixed — see the CORS caveat in `apps-script-backend.gs`'s header comment for the likely fix (a small proxy that adds `Access-Control-Allow-Origin`).
