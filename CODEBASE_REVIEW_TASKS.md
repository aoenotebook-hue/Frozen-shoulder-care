# Codebase review task proposals

Reviewed: `index.html`, `media/README.md`, `README.md`, and the files currently present in `media/`.

## Media folder check

`media/README.md` documents 52 optional media slots: 26 JPEG stills and 26 MP4 videos. The folder currently contains 22 media files and no unexpected filenames. Thirty documented files are not present yet, so the app will render those topics as text-only or video-only/image-only depending on what exists.

Present media files:

- `fs-01-pendulum.jpg`
- `fs-02-finger-walk.mp4`
- `fs-03-assisted-external-rotation.jpg`
- `fs-04-scapular-setting.mp4`
- `fs-05-wall-slide.jpg`
- `fs-05-wall-slide.mp4`
- `fs-06-stick-assisted-elevation.jpg`
- `fs-07-external-rotation-stretch.jpg`
- `fs-08-cross-body-stretch.mp4`
- `fs-09-towel-internal-rotation.jpg`
- `fs-10-band-external-rotation.jpg`
- `fs-11-band-internal-rotation.jpg`
- `fs-12-band-row.jpg`
- `fs-13-light-forward-raise.jpg`
- `fs-14-loaded-carry.jpg`
- `fs-selfcare-01-ice-or-heat.mp4`
- `fs-selfcare-03-getting-dressed.mp4`
- `fs-selfcare-04-showering.jpg`
- `fs-sleep-01-back-supported.mp4`
- `fs-sleep-02-side-lying-pillow.mp4`
- `fs-sleep-03-propped-upright.mp4`
- `fs-sleep-04-night-waking-mobility.mp4`

Highest-priority missing assets:

- `fs-02-finger-walk.jpg`, `fs-04-scapular-setting.jpg`, and `fs-08-cross-body-stretch.jpg` because their videos exist but no still image can be shown as a thumbnail.
- `fs-selfcare-02-gentle-movement.jpg` and `fs-selfcare-02-gentle-movement.mp4` because that entire self-care topic currently has no media.
- The stage 4 return-to-life files `fs-15-*` through `fs-18-*`, because none of those documented exercise media files are present.

## Proposed task 1 — typo / wording fix

Fix the English onboarding hint from “The month and year is enough” to “The month and year are enough.” This is a subject-verb agreement typo in the patient-facing English copy.

## Proposed task 2 — bug fix

Fix the media discovery fallback so a server that refuses `HEAD` still tries the ranged `GET`. The current `mediaProbe()` catches any `HEAD` network/fetch exception and immediately returns `false`, so the documented fallback only runs when the `HEAD` request completes with status `405`. On static hosts or local development setups where `HEAD` fails but `GET` works, valid uploaded media can remain invisible.

Acceptance criteria:

- `mediaProbe()` returns `true` when `HEAD` throws but a ranged `GET` succeeds.
- `mediaProbe()` still returns `false` when both `HEAD` and fallback `GET` fail.
- Add a small testable helper or manual smoke test for the fallback behavior if the project remains dependency-free.

## Proposed task 3 — comment / documentation discrepancy fix

Align assessment cadence comments and labels. The UI copy and `ASSESS_INTERVAL_DAYS` use a monthly cadence, but several code comments and CSS labels still call it a weekly assessment. Update those comments to “monthly” and ensure adherence comments match the fields named `daysExercisedThisMonth`, `exercisesDoneThisMonth`, and `exercisesPossibleThisMonth`.

## Proposed task 4 — app improvement

Add an in-app media coverage checklist for maintainers or clinic staff. The app already knows the expected media filenames from content definitions and discovers which files exist at runtime. A lightweight admin/diagnostic panel, hidden behind a query parameter such as `?media=1`, could show each topic’s image/video status and make it easier to upload missing assets without comparing the folder to `media/README.md` manually.

Acceptance criteria:

- The checklist groups assets by Exercises, Sleep, and Self Care.
- Each expected image/video is marked present, missing, or still checking.
- The diagnostic UI is hidden for normal patient use.
