# AI prompts for generating the media files

Ready-to-paste prompts for an AI image tool and an AI video tool, one pair
per file, in the same order as `media/README.md`. Filenames must still
match exactly what's listed there — these prompts just describe what to
put in each file.

## Before you generate anything

**Have a physiotherapist check every image and clip before it goes live.**
AI image and video generators regularly get exercise form wrong — a bent
elbow that should be straight, a hand rotated the wrong way, an extra
finger, a joint bending at an angle no shoulder actually bends at. For most
subjects that's a cosmetic flaw; here it's a demonstration a patient will
copy while rehabbing an actual injury. Treat every generated file as a
draft a clinician signs off on, not a finished asset.

**Workflow that keeps the image and its video matching:** generate the
still first. Once you're happy with it, feed that exact image into an
image-to-video tool (Runway Gen-3, Pika, Luma Dream Machine, Kling) using
just the "Motion" line from that topic's video prompt as the instruction,
instead of generating the video from text alone. That keeps the room, the
person, and the framing identical between the photo and the clip. If your
tool only does text-to-video, the full video prompt works standalone too.

**Suggested tools** — Images: Midjourney v6, DALL·E 3, Adobe Firefly, or
Stable Diffusion (SDXL). Video: Runway Gen-3 Alpha, Pika 1.5, Luma Dream
Machine, or Kling.

**Style line** — paste this at the start of every image prompt so all 26
photos share one look:

> Photorealistic stock-photo style; bright, uncluttered home physiotherapy
> room; soft neutral gray-blue wall; large window with soft natural light;
> adult patient in their mid-50s wearing a plain fitted short-sleeve t-shirt
> and comfortable pants; calm, neutral expression; 16:9 landscape; shot on a
> DSLR with a 50mm lens, shallow depth of field, high detail.

**Negative prompt** — add this to every image and video generation:

> extra limbs, distorted or extra fingers, warped hands, blurry face, text
> overlay, watermark, logo, brand name, jewelry, visible tattoos

**Video base line** — paste this at the start of every video prompt:

> Photorealistic 16:9 video, same room and same patient as the reference
> photo, camera locked on a tripod, smooth slow-motion demonstration
> performed with slow controlled form, 5–8 second seamless loop, no
> on-screen text, no watermark.

---

## Exercises tab — 18 topics, 36 files

### 1. Pendulum swing
**`fs-01-pendulum.jpg`** — [style line] + Patient stands bent forward from
the waist about 30–45°, unaffected arm resting on the back of a chair for
support, affected arm hanging straight down and relaxed, captured mid-swing
in a small gentle arc. Side-view camera, waist-up framing.

**`fs-01-pendulum.mp4`** — [video base line] + Motion: the hanging arm
swings in small, slow, relaxed circles and gentle front-to-back arcs,
entirely powered by a gentle sway of the body, never by arm muscles.

### 2. Finger walk up the wall
**`fs-02-finger-walk.jpg`** — [style line] + Patient stands facing a plain
wall at arm's length, fingertips of the affected arm placed on the wall at
shoulder height mid-"walk" upward, torso upright and facing forward.
Three-quarter front view showing the wall and the patient's torso.

**`fs-02-finger-walk.mp4`** — [video base line] + Motion: the fingers
slowly "walk" up the wall as high as comfortable, pause briefly, then walk
back down, torso staying still throughout.

### 3. Assisted outward rotation
**`fs-03-assisted-external-rotation.jpg`** — [style line] + Patient lying
on their back, both elbows bent 90° and tucked at the sides, holding a
short wooden stick horizontally across both palms, using the stick to
rotate the affected forearm outward. Camera from the foot of a treatment
table, waist-up.

**`fs-03-assisted-external-rotation.mp4`** — [video base line] + Motion:
the unaffected arm slowly pushes the stick sideways, rotating the affected
forearm outward and away from the body, then slowly returning to center.

### 4. Shoulder-blade setting
**`fs-04-scapular-setting.jpg`** — [style line] + Patient seated upright,
arms relaxed at the sides, shoulder blades gently drawn together and down,
chest open. Three-quarter rear view so the shoulder blade position is
visible.

**`fs-04-scapular-setting.mp4`** — [video base line] + Motion: the
shoulder blades slowly squeeze together and slide down the back, hold
briefly, then slowly release, with almost no arm movement.

### 5. Wall slide
**`fs-05-wall-slide.jpg`** — [style line] + Patient stands facing a wall,
forearms and palms flat against it, mid-slide with hands roughly at
forehead height, torso upright and not arching. Side-view camera, full
standing figure.

**`fs-05-wall-slide.mp4`** — [video base line] + Motion: forearms slide
slowly up the wall as high as is comfortable without the back arching,
pause, then slide back down.

### 6. Assisted overhead reach
**`fs-06-stick-assisted-elevation.jpg`** — [style line] + Patient lying on
their back, both hands gripping a stick overhead partway through lifting
it toward the ceiling, elbows only slightly bent. Side-view camera from a
treatment table.

**`fs-06-stick-assisted-elevation.mp4`** — [video base line] + Motion: the
unaffected arm slowly lifts the stick (and the affected arm with it)
overhead as far as comfortable, holds briefly, then slowly lowers it back
down.

### 7. Outward rotation stretch
**`fs-07-external-rotation-stretch.jpg`** — [style line] + Patient stands
in a doorway, affected forearm braced vertically against the door frame at
a 90° elbow bend, body turned slightly away from the frame to create a
gentle stretch. Three-quarter view showing the doorway.

**`fs-07-external-rotation-stretch.mp4`** — [video base line] + Motion:
keeping the forearm braced against the frame, the body slowly rotates a
few more degrees away from the doorway, holds the stretch, then slowly
returns.

### 8. Cross-body stretch
**`fs-08-cross-body-stretch.jpg`** — [style line] + Patient standing,
using the unaffected hand to gently pull the affected arm straight across
the chest at shoulder height. Front three-quarter view, waist-up.

**`fs-08-cross-body-stretch.mp4`** — [video base line] + Motion: the
unaffected hand slowly draws the affected arm further across the chest,
holds the stretch briefly, then slowly releases it back to center.

### 9. Towel stretch behind the back
**`fs-09-towel-internal-rotation.jpg`** — [style line] + Patient standing
with back to camera, holding a rolled towel vertically behind their back —
one hand reaching up and over the shoulder, the other reaching up from
below the lower back — mid-pull. Rear three-quarter view.

**`fs-09-towel-internal-rotation.mp4`** — [video base line] + Motion: the
top hand slowly pulls the towel upward, drawing the lower hand gently up
the back, holds briefly, then slowly releases.

### 10. Band outward rotation
**`fs-10-band-external-rotation.jpg`** — [style line] + Patient standing
side-on to a door anchor, elbow bent 90° and tucked against the ribs,
holding an elastic resistance band anchored in front of the body,
mid-rotation with the forearm pulled outward. Three-quarter side view.

**`fs-10-band-external-rotation.mp4`** — [video base line] + Motion: with
the elbow pinned to the side, the forearm slowly rotates outward against
the band's resistance, holds briefly, then slowly returns to center.

### 11. Band inward rotation
**`fs-11-band-internal-rotation.jpg`** — [style line] + Patient standing
side-on to a door anchor on the opposite side from Exercise 10, elbow bent
90° and tucked against the ribs, mid-rotation pulling the forearm inward
across the body against a resistance band. Three-quarter side view.

**`fs-11-band-internal-rotation.mp4`** — [video base line] + Motion: with
the elbow pinned to the side, the forearm slowly rotates inward across the
body against the band's resistance, holds briefly, then slowly returns.

### 12. Band row
**`fs-12-band-row.jpg`** — [style line] + Patient standing, holding a
resistance band anchored at chest height in front, mid-row with elbows
pulled back and shoulder blades squeezed together. Side-view camera.

**`fs-12-band-row.mp4`** — [video base line] + Motion: the arms slowly
pull the band back, elbows driving behind the torso as the shoulder blades
squeeze together, hold briefly, then slowly return arms forward.

### 13. Light forward raise
**`fs-13-light-forward-raise.jpg`** — [style line] + Patient standing,
holding a small light dumbbell (1–2 lb) in the affected hand, arm raised
straight forward to shoulder height. Side-view camera.

**`fs-13-light-forward-raise.mp4`** — [video base line] + Motion: the arm
slowly raises the light weight straight forward to shoulder height with
control, holds briefly, then slowly lowers back down.

### 14. Loaded carry
**`fs-14-loaded-carry.jpg`** — [style line] + Patient walking through the
room carrying a small dumbbell or filled water jug at their side in the
affected hand, mid-stride, upright relaxed posture. Wider three-quarter
view to show the walking motion.

**`fs-14-loaded-carry.mp4`** — [video base line] + Motion: the patient
walks slowly forward a few steps carrying the weight steadily at their
side, shoulder relaxed and not hiking up, then turns and walks back.

### 15. Level 1 — self-care
**`fs-15-level1-self-care.jpg`** — [style line] + Patient reaching the
affected hand up to touch the back of their head, as if combing their
hair, elbow lifted comfortably. Front three-quarter view.

**`fs-15-level1-self-care.mp4`** — [video base line] + Motion: the hand
slowly rises to the back of the head, performs a couple of small
combing-motion movements, then slowly lowers back down.

### 16. Level 2 — everyday reach
**`fs-16-level2-everyday-reach.jpg`** — [style line] + Kitchen or closet
setting; patient reaching up with the affected arm to a shelf at shoulder
height, hand touching a light object (a box or folded towel) as if placing
or retrieving it. Three-quarter front view.

**`fs-16-level2-everyday-reach.mp4`** — [video base line] + Motion: the
arm slowly reaches up to the shelf, hand grasps the object, lifts it down
a few inches, then the arm slowly returns it to the shelf.

### 17. Level 3 — load
**`fs-17-level3-load.jpg`** — [style line] + Patient at a kitchen counter
lifting a moderately weighted grocery bag or small box with both arms from
the counter, affected arm sharing the load. Three-quarter front view.

**`fs-17-level3-load.mp4`** — [video base line] + Motion: both arms slowly
lift the bag or box off the counter, hold it steady at waist height for a
moment, then slowly set it back down.

### 18. Level 4 — your life
**`fs-18-level4-return-to-life.jpg`** — [style line] + Bright laundry room
or backyard setting; patient reaching fully overhead with the affected arm
to hang a piece of clothing on a rail or line, arm extended near full
overhead range. Three-quarter front view, slightly wider shot.

**`fs-18-level4-return-to-life.mp4`** — [video base line] + Motion: the
arm slowly reaches all the way overhead, hangs the item on the rail, then
slowly lowers back down — a relaxed, everyday movement rather than an
exercise rep.

---

## Sleep tab — 4 topics, 8 files

### 1. On your back, arm supported
**`fs-sleep-01-back-supported.jpg`** — [style line, but set at night]
Bedroom scene, warm dim bedside-lamp lighting; patient lying on their back
in bed, affected arm resting on a pillow placed alongside the torso for
support, expression calm and relaxed as if settling to sleep. Overhead
three-quarter angle.

**`fs-sleep-01-back-supported.mp4`** — [video base line, dim warm bedroom
lighting] + Motion: the patient settles back onto the pillow, adjusts the
supporting pillow slightly under the arm, and relaxes into stillness — a
slow, restful settling motion, not an exercise.

### 2. On the good side, hugging a pillow
**`fs-sleep-02-side-lying-pillow.jpg`** — [style line, dim warm bedroom
lighting] Patient lying on their unaffected side in bed, arms wrapped
around a hugged pillow, with the affected arm draped over the top of the
pillow so no weight rests on that shoulder. Three-quarter side angle.

**`fs-sleep-02-side-lying-pillow.mp4`** — [video base line, dim warm
bedroom lighting] + Motion: the patient shifts onto their side, pulls the
pillow into a hug, and drapes the affected arm over it, then settles into
stillness.

### 3. Propped up
**`fs-sleep-03-propped-upright.jpg`** — [style line, dim warm bedroom
lighting] Patient semi-reclined in bed at roughly 30–45°, propped up on a
wedge pillow or stacked pillows, affected arm resting supported on a
pillow at their side. Three-quarter front angle.

**`fs-sleep-03-propped-upright.mp4`** — [video base line, dim warm bedroom
lighting] + Motion: the patient adjusts the pillow supporting the affected
arm, settles back against the propped pillows, and relaxes.

### 4. If stiffness wakes you
**`fs-sleep-04-night-waking-mobility.jpg`** — [style line, dim nightlight
lighting] Patient sitting up on the edge of the bed at night, mid a small
gentle shoulder roll or short pendulum swing to ease stiffness before
lying back down. Three-quarter side angle.

**`fs-sleep-04-night-waking-mobility.mp4`** — [video base line, dim
nightlight lighting] + Motion: the patient rolls the affected shoulder
slowly a couple of times, or performs a brief gentle pendulum swing, then
settles back down onto the bed.

---

## Self Care tab — 4 topics, 8 files

### 1. Ice or Heat
**`fs-selfcare-01-ice-or-heat.jpg`** — [style line] Patient seated,
holding a cloth-wrapped cold pack (or warm heating pad) against the front
of the affected shoulder with the opposite hand. Three-quarter front
close-up on the shoulder and upper torso.

**`fs-selfcare-01-ice-or-heat.mp4`** — [video base line] + Motion: the
patient settles the wrapped pack against the shoulder, adjusts it once,
and holds it in place, sitting calmly.

### 2. Keep Moving, Gently
**`fs-selfcare-02-gentle-movement.jpg`** — [style line] Patient standing
up from a desk or chair mid a gentle shoulder roll or easy arm swing, as
if taking a short movement break during the day. Three-quarter front view,
home-office setting.

**`fs-selfcare-02-gentle-movement.mp4`** — [video base line] + Motion: the
patient stands, rolls both shoulders gently a couple of times, and lets
the arms swing loosely at the sides before sitting back down.

### 3. Getting Dressed
**`fs-selfcare-03-getting-dressed.jpg`** — [style line] Bedroom/closet
setting; patient putting on a button-up shirt, guiding the affected arm
into its sleeve first while holding the collar with the unaffected hand.
Three-quarter front view.

**`fs-selfcare-03-getting-dressed.mp4`** — [video base line] + Motion: the
affected arm slides slowly into the sleeve first, then the unaffected arm
follows and the patient settles the shirt onto the shoulders.

### 4. Showering
**`fs-selfcare-04-showering.jpg`** — [style line] Bathroom setting;
patient wearing a robe, shown from behind at shoulder height, reaching
back with a long-handled shower brush to wash between the shoulder blades
without raising the affected arm overhead. Modest, tasteful framing from
behind — no exposed skin beyond shoulders.

**`fs-selfcare-04-showering.mp4`** — [video base line] + Motion: the
long-handled brush is drawn slowly across the upper back a couple of
times, the arm staying low and relaxed throughout.

---

## Quick reference — filenames in order

```
fs-01-pendulum.jpg / .mp4
fs-02-finger-walk.jpg / .mp4
fs-03-assisted-external-rotation.jpg / .mp4
fs-04-scapular-setting.jpg / .mp4
fs-05-wall-slide.jpg / .mp4
fs-06-stick-assisted-elevation.jpg / .mp4
fs-07-external-rotation-stretch.jpg / .mp4
fs-08-cross-body-stretch.jpg / .mp4
fs-09-towel-internal-rotation.jpg / .mp4
fs-10-band-external-rotation.jpg / .mp4
fs-11-band-internal-rotation.jpg / .mp4
fs-12-band-row.jpg / .mp4
fs-13-light-forward-raise.jpg / .mp4
fs-14-loaded-carry.jpg / .mp4
fs-15-level1-self-care.jpg / .mp4
fs-16-level2-everyday-reach.jpg / .mp4
fs-17-level3-load.jpg / .mp4
fs-18-level4-return-to-life.jpg / .mp4
fs-sleep-01-back-supported.jpg / .mp4
fs-sleep-02-side-lying-pillow.jpg / .mp4
fs-sleep-03-propped-upright.jpg / .mp4
fs-sleep-04-night-waking-mobility.jpg / .mp4
fs-selfcare-01-ice-or-heat.jpg / .mp4
fs-selfcare-02-gentle-movement.jpg / .mp4
fs-selfcare-03-getting-dressed.jpg / .mp4
fs-selfcare-04-showering.jpg / .mp4
```
