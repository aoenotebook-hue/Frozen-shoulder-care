/* =====================================================================
   CONTENT-PROTECTION DETERRENTS. A web page cannot actually refuse to be
   copied or screen-captured: rendering it means handing the device real
   pixels and, for typed fields, real text, and every OS provides a
   screenshot/recording path and a camera outside this page's reach. What
   follows only raises friction for the casual case (right-click save,
   drag-out, long-press copy, the OS app-switcher thumbnail) — it is not
   a security boundary and must not be represented as one.
   ===================================================================== */
document.addEventListener('contextmenu', e => {
  if(!e.target.closest('input, textarea, select')) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if(e.target.closest('img, video')) e.preventDefault();
});
document.addEventListener('copy', e => {
  if(!e.target.closest('input, textarea, select')) e.preventDefault();
});
document.addEventListener('visibilitychange', () => {
  document.getElementById('privacy-cover').classList.toggle('hidden', !document.hidden);
});

/* =====================================================================
   EXERCISE ICONS — inline SVG, stroked with currentColor.
   ===================================================================== */
const ICONS = {
  pendulum:'<circle cx="12" cy="4" r="2.2"/><path d="M12 6.2v8"/><path d="M6.5 17.5a5.5 5.5 0 0 0 11 0"/><path d="M9 20.5l-1.6-1.2M15 20.5l1.6-1.2"/>',
  wallwalk:'<path d="M4 3v18"/><path d="M7.5 18l2.6-2.6M11 14.4L13.6 12M14.5 10.9L17 8.4"/><circle cx="18.6" cy="6.8" r="1.9"/>',
  extrot:'<path d="M9 4v6"/><path d="M9 10h6"/><path d="M15 10a5 5 0 0 1 0 10"/><path d="M13 18l2 2-2 2"/><circle cx="9" cy="4" r="1.6"/>',
  scapula:'<path d="M12 3v8"/><path d="M9 6L4.5 9.5 7 14"/><path d="M15 6l4.5 3.5L17 14"/><path d="M8 19h8"/>',
  wallslide:'<path d="M4 3v18"/><path d="M7 20V9a2 2 0 0 1 2-2h1"/><path d="M12 11V5"/><path d="M9.5 7.5L12 5l2.5 2.5"/>',
  stick:'<path d="M3 9h18"/><path d="M7 7v4M17 7v4"/><path d="M12 12v8"/><path d="M9 20h6"/>',
  crossbody:'<circle cx="8" cy="5" r="2"/><path d="M8 8v6"/><path d="M8 10h9"/><path d="M15 7.5L17.5 10 15 12.5"/>',
  towel:'<path d="M7 3v11a3 3 0 0 0 6 0"/><path d="M13 14v4a2.5 2.5 0 0 1-5 0"/><path d="M5 3h4M15 8h4"/>',
  bander:'<path d="M4 12h2l2-3 2 6 2-6 2 6 2-3h2"/><path d="M20 9v6M4 9v6"/>',
  bandir:'<path d="M20 12h-2l-2-3-2 6-2-6-2 6-2-3H4"/><path d="M4 9v6M20 9v6"/>',
  row:'<circle cx="17" cy="6" r="2"/><path d="M17 9v5"/><path d="M17 11H8"/><path d="M10 8.5L7.5 11l2.5 2.5"/><path d="M14 18h6"/>',
  raise:'<circle cx="7" cy="7" r="2"/><path d="M7 10v9"/><path d="M7 12h8"/><path d="M15 12V6"/><path d="M12.5 8.5L15 6l2.5 2.5"/>',
  carry:'<circle cx="12" cy="4" r="2"/><path d="M12 6.5v6"/><path d="M9 8h6"/><rect x="14" y="13" width="6" height="6" rx="1"/><rect x="4" y="13" width="6" height="6" rx="1"/>',
  selfcare:'<path d="M7 8a5 5 0 0 1 10 0v2"/><path d="M5 21v-4a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4"/><path d="M9 13l3 3 3-3"/>',
  reach:'<path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="9" r="1.6"/><path d="M8 10.6V16"/>',
  load:'<path d="M4 9v6M20 9v6"/><path d="M7 7v10M17 7v10"/><path d="M7 12h10"/>',
  life:'<circle cx="13" cy="4" r="2"/><path d="M13 6.5L10 11l3 3v6"/><path d="M10 11L6 13"/><path d="M13 14l4 2"/>'
};
function icon(name){
  return '<svg viewBox="0 0 24 24">' + (ICONS[name]||ICONS.pendulum) + '</svg>';
}

/* =====================================================================
   UCLA SHOULDER RATING SCALE (Amstutz 1981) — 35 points total.
   Pain 10 + Function 10 + Active forward flexion 5 + Strength 5 + Satisfaction 5.
   Forward flexion points are derived from the degrees the patient dials in,
   so the arc control feeds the score directly.
   ===================================================================== */
const FLEXION_BANDS = [
  {min:150, pts:5}, {min:120, pts:4}, {min:90, pts:3},
  {min:45,  pts:2}, {min:30,  pts:1}, {min:0,  pts:0}
];
function flexionPoints(deg){
  for(const b of FLEXION_BANDS){ if(deg >= b.min) return b.pts; }
  return 0;
}
const UCLA_MAX = 35;
function uclaTotal(u, flexionDeg){
  return u.pain + u.func + flexionPoints(flexionDeg) + u.strength + u.satisfaction;
}
function uclaGrade(total){
  if(total >= 34) return 'excellent';
  if(total >= 29) return 'good';
  return 'poor';
}

/* ============================= CONTENT ============================= */
const CONTENT = {
en: {
  appName:"Frozen shoulder recovery",
  uclaLabel:"UCLA shoulder score",
  surgeonName:"Dr. Sorawut Thamyongkit",
  durationLabel:"months since your symptoms started",
  durationLabelOne:"month since your symptoms started",
  durationUnknown:"symptom duration not recorded",
  onsetPrefix:"since ",
  uclaCardTitle:"UCLA shoulder score",
  uclaDomains:["Pain","Function","Elevation","Strength","Satisfaction"],
  uclaCardFoot:"Out of 35. Above 33 is excellent, 29 to 33 is good. Recorded once a month.",
  syncStatusDone:"✓ Shared with your care team.",
  syncStatusPending:"Not shared yet — the app will keep trying quietly, no action needed.",
  gradeNames:{excellent:"Excellent", good:"Good", poor:"Needs work"},
  remeasureBtn:"Update my assessment",
  roadmapTitle:"Your Recovery Roadmap",
  roadmapNote:"You move between stages when your shoulder changes, not on a fixed timetable. Some people move faster, some slower — both are normal.",
  todayTitle:"Today's Reminders",
  goalsTitleByPhase:[
    "Your goals in the pre-freezing stage",
    "Your goals in the freezing stage",
    "Your goals in the frozen stage",
    "Your goals in the thawing stage"
  ],
  goalsSub:"These change as your shoulder changes. Work on these four until the app moves you on.",
  goalsByPhase:[
    ["Keep moving the shoulder through its full range every day","Do not let the arm go unused because it feels touchy","Deal with night pain early so sleep does not suffer","Tell your doctor now, while the range is still good"],
    ["Get the pain under control — everything else depends on it","Hold on to the range you have; do not chase range you have lost","Keep using the arm for anything that is comfortable","Protect your sleep with position and support"],
    ["Stretch every day, little and often","Hold at the end of range rather than pulling harder","Win back the reaches you have lost: overhead, out to the side, behind your back","Accept that this is the slow stage and keep going anyway"],
    ["Keep stretching — range you stop using, you lose","Add strengthening now that movement allows it","Return to work, sport and hobbies step by step","Keep a short maintenance routine so stiffness does not return"]
  ],
  todayReminders:[
    ["Move the shoulder gently through its full range several times a day.","This is the best time to act — range is easier to keep than to win back.","Stretch to the point of tension, never through sharp pain.","Mention the night pain to your doctor rather than waiting it out."],
    ["Pain comes first. Exercise goes better once pain is controlled.","Do not force the shoulder — forcing during this stage makes the pain worse.","Little and often beats one long session.","Support the arm on a pillow at night and avoid lying on that side."],
    ["This is the stage where stretching earns its keep. Little and often.","Hold each stretch longer rather than pulling harder.","Record your best wall-slide height — it is the clearest sign of progress.","Soreness that settles by morning is fine. Soreness that lasts is not."],
    ["Keep stretching daily — range you don't use, you lose.","Add resistance slowly: assisted, then active, then resisted.","Slow on the way back is where the strength comes from.","Muscle soreness after exercise is normal; sharp joint pain is not."]
  ],
  weeklyDueKicker:"Monthly assessment",
  weeklyDueTitle:"Time for this month's assessment",
  weeklyDueBody:"Once a month is enough. It takes about two minutes and it is what keeps your programme matched to your shoulder.",
  weeklyDueBtn:"Start this month's assessment",
  weeklyOverdueTitle:"Your assessment is {n} months overdue",
  weeklyOverdueTitleOne:"Your assessment is a month overdue",
  weeklyOverdueBody:"Your programme is still showing results from your last assessment, so it may no longer match how your shoulder is now.",
  weeklyDoneKicker:"Monthly assessment",
  weeklyDoneTitle:"Done for this month",
  weeklyDoneBody:"Recorded {d}. Your next one is due {next}. Keep doing your exercises daily in the meantime.",
  weeklyDoneBtn:"Update it anyway",
  weeklyNoneTitle:"Start with your first assessment",
  weeklyNoneBody:"The app needs one assessment before it can show you the right programme.",
  measureValidation:"Please answer both questions before continuing.",
  privacyTitle:"Your privacy",
  privacyIntro:"What this app stores, and where.",
  privacyPoints:[
    ["📱","Your answers are kept on this phone. Clearing the app data or changing device erases them."],
    ["🎯","Your record is used only to show how your shoulder is progressing and to suggest the care that suits you. It is not used for anything else."],
    ["🏥","Each monthly assessment is sent once to your care team, together with your HN so it can be matched to your hospital record."],
    ["🔒","Nothing is sent until you have agreed, and the app never sends anything automatically in the background."],
    ["🙈","If you share this phone, remember that anyone opening the app can see your record."],
    ["🗑️","You can erase everything on this device at any time with Reset App Data, at the bottom of the Home tab."]
  ],

  scopeNote:"This app gives general guidance for frozen shoulder. Every shoulder recovers at its own pace, and your own condition may differ from what is described here. Where your doctor's advice differs from this app, follow your doctor.",
  surgeonLabel:"Your doctor",
  resetBtn:"Reset App Data",
  resetConfirm:"This will erase your HN, assessments, exercise progress and check-ins on this device. This can't be undone. Continue?",
  hnPrefix:"HN: ",
  tabHome:"Home", tabAbout:"About", tabExercises:"Exercises", tabProgress:"Progress", tabSleep:"Sleep", tabSelfCare:"Self Care", tabResources:"Resources", tabSOS:"Alert",

  /* ---- Resources ----
     Each entry shows a title and a one-line description, never the raw URL.
     Edit titles and descriptions here; the same `url` is shared by both
     languages so a link only has to be changed once. */
  resTitle:"Learn more",
  resIntro:"Trusted background reading and video on frozen shoulder. These open outside the app.",
  resNote:"These are for general understanding.",
  resGroupVideo:"Video",
  resGroupArticle:"Reading",
  resLangEn:"English", resLangTh:"ไทย",
  resources:[
    { type:"article", lang:"th", src:"Rue Ortho", featured:true, icon:"media/rueortho-logo.png",
      url:"https://rueortho.vercel.app",
      title:"Rue Ortho — our clinic's website",
      desc:"More about our orthopaedic clinic and the care we offer." },
    { type:"video", lang:"th", src:"YouTube",
      url:"https://www.youtube.com/watch?v=UNYZMvQLSKs",
      title:"Frozen shoulder explained — video 1",
      desc:"What frozen shoulder is, why it happens, and what recovery usually looks like." },
    { type:"video", lang:"th", src:"YouTube",
      url:"https://www.youtube.com/watch?v=OBARxLSol3I",
      title:"Frozen shoulder explained — video 2",
      desc:"A walk-through of the shoulder exercises and how to do them safely." },
    { type:"article", lang:"th", src:"Rama Channel",
      url:"https://www.rama.mahidol.ac.th/ramachannel/article/%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%84%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%95%E0%B8%B4%E0%B8%94-%E0%B8%97%E0%B8%B3%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%81%E0%B9%87%E0%B8%9B%E0%B8%A7%E0%B8%94-%E0%B8%9F/",
      title:"Frozen shoulder: painful whatever you do",
      desc:"Ramathibodi's own patient guide, in Thai — symptoms, causes and treatment." },
    { type:"article", lang:"en", src:"Harvard Health",
      url:"https://www.health.harvard.edu/stretching-exercises-frozen-shoulder",
      title:"7 stretching and strengthening exercises",
      desc:"Pendulum, towel, finger walk, cross-body and armpit stretches, plus band rotations." }
  ],

  /* UCLA items */
  uclaPainQ:"Pain",
  uclaPainSub:"Which best describes your shoulder pain?",
  uclaPainOpts:[
    {v:1,  t:"Present all the time and unbearable; I need strong painkillers frequently"},
    {v:2,  t:"Present all the time but bearable; I need strong painkillers occasionally"},
    {v:4,  t:"None or little at rest, but present with light activity; simple painkillers frequently"},
    {v:6,  t:"Present only with heavy or particular activities; simple painkillers occasionally"},
    {v:8,  t:"Occasional and slight"},
    {v:10, t:"None"}
  ],
  uclaFuncQ:"Function",
  uclaFuncSub:"How much can you do with the shoulder?",
  uclaFuncOpts:[
    {v:1,  t:"Unable to use the limb"},
    {v:2,  t:"Only light activities are possible"},
    {v:4,  t:"Able to do light housework or most daily activities"},
    {v:6,  t:"Most housework, shopping and driving; able to do my hair and dress myself"},
    {v:8,  t:"Slight restriction only; able to work above shoulder level"},
    {v:10, t:"Normal activities"}
  ],
  uclaStrengthQ:"Strength of forward flexion",
  uclaStrengthSub:"Raise the arm forward. How strong does it feel? If your physiotherapist has graded it, use their grade.",
  uclaStrengthOpts:[
    {v:0, t:"Grade 0 — no muscle contraction at all"},
    {v:1, t:"Grade 1 — a flicker of contraction, no movement"},
    {v:2, t:"Grade 2 — can move only with gravity taken away"},
    {v:3, t:"Grade 3 — can lift against gravity but not against resistance"},
    {v:4, t:"Grade 4 — can lift against some resistance"},
    {v:5, t:"Grade 5 — normal strength"}
  ],
  uclaSatQ:"Satisfaction",
  uclaSatSub:"Overall, how do you feel about your shoulder?",
  uclaSatOpts:[
    {v:5, t:"Satisfied and better"},
    {v:0, t:"Not satisfied and worse"}
  ],
  uclaFlexQ:"Active forward flexion",
  uclaFlexSub:"Raise the arm forward and up as far as you can without sharp pain, then drag the arc to match.",
  ptsSuffix:" pt",

  phaseShort:["Pre-freezing","Freezing","Frozen","Thawing"],
  phaseNames:["Stage 1","Stage 2","Stage 3","Stage 4"],
  phaseTitles:["Pre-freezing","Freezing","Frozen","Thawing"],
  phaseMonths:["Typically months 1–3","Typically months 4–9","Typically months 10–14","Typically months 15–24"],
  phaseHeadline:[
    "Keep the range you still have",
    "Control the pain, protect the movement",
    "Pain is settling — now work on the stiffness",
    "Movement is returning — rebuild range and strength"
  ],
  phaseDesc:[
    "The shoulder is sore, achy and a little stiff. Pain is mild to moderate and often worse at night or reaching in certain directions. Range of motion is still mostly normal, but the shoulder feels touchy. Moving it gently and often now is the best thing you can do.",
    "The capsule around the joint is inflamed and beginning to thicken. Pain is much more severe, especially on movement and at night, and stiffness is increasing quickly. Do not try to force the shoulder. Control the pain first, and keep the movement you have.",
    "The inflammation is quietening down but the capsule is now tight, and the joint feels stuck. Pain often eases and is felt mainly when you push to the limit. Stiffness is at its worst, particularly reaching out, up, and behind your back. This is the stage where patient, regular stretching earns its keep.",
    "The capsule is starting to loosen. Movement and flexibility come back gradually and pain continues to fade. Most people regain a great deal, though some keep a little stiffness or occasional ache. Regular practice is what turns range you have borrowed into range you keep."
  ],
  phaseWhatLabel:"What is happening",
  phaseSymptomsLabel:"What you may notice",
  phaseWhat:[
    "The shoulder starts to feel sore, achy and slightly stiff.",
    "The joint capsule becomes heavily inflamed, irritated, and starts to thicken.",
    "Active inflammation decreases, but capsular stiffness peaks and the joint feels stuck.",
    "The tight joint capsule finally begins to relax and loosen."
  ],
  phaseSymptoms:[
    "Mild to moderate pain, often worse at night or reaching in certain directions. Range of motion is still mostly normal but feels touchy.",
    "Pain is much more severe, especially with movement and at night. Stiffness increases rapidly and daily tasks become difficult.",
    "Pain often lessens and aches mainly when you push past your limit. Stiffness is at its maximum, restricting reaching out, up, and behind your back.",
    "Movement and flexibility return gradually and pain fades. Most people recover well, though a minority keep some stiffness or mild ache long term."
  ],
  phaseTimingNote:"Your stage is set from these months, counted from when your symptoms started. Without an onset date, your symptoms decide it instead. Your own recovery time may differ from this pattern and from other patients.",
  monthsTypicalPrefix:"you are in month ",
  aboutTitle:"What is frozen shoulder?",
  aboutBody:"Frozen shoulder (adhesive capsulitis) happens when the capsule surrounding your shoulder joint thickens and tightens, so the joint stiffens and movement becomes painful and limited. It usually settles on its own over time, though recovery can take many months to a few years.",
  causesTitle:"What causes it",
  causesList:[
    "Often no clear cause is found.",
    "More common with diabetes and thyroid conditions.",
    "Can follow a shoulder injury, surgery, or a period of not moving the arm — for example after a stroke or a fracture.",
    "More common in women, and in people aged 40 to 60."
  ],
  stagesCardTitle:"The four stages of frozen shoulder",
  stagesCardIntro:"Frozen shoulder usually follows a recognisable course.",
  stagesCardOutcome:"Most people improve a great deal; serious long-term problems are uncommon. A little stiffness sometimes remains but rarely limits daily life. Ask your doctor what to expect in your case.",
  stageYouAreHere:"you are here",
  recoveredChip:"Recovered",
  recoveredDesc:"Your movement is back to normal and your pain is minimal. Keep a short maintenance routine going so the stiffness does not creep back.",
  noBaselineChip:"Complete your first assessment",
  noBaselineDesc:"Tap \"Update my assessment\" so the app can show the right programme for where you are today.",

  exPhaseDefTitle:"What this stage is for",
  exCaution:"Stretch to tension, not to pain. If it is still worse the next morning, you went too far.",
  exercises:[
    [
      {id:"p1_1", ic:"pendulum", img:"fs-01-pendulum.jpg", vid:"fs-01-pendulum.mp4", name:"Pendulum swing", dose:"10 each direction", desc:"Lean forward and let the arm hang completely loose. Small circles, then small forward-and-back swings.", cue:"If your shoulder is working, you are doing it too big."},
      {id:"p1_2", ic:"wallwalk", img:"fs-02-finger-walk.jpg", vid:"fs-02-finger-walk.mp4", name:"Finger walk up the wall", dose:"5 slow reps", desc:"Face the wall and walk your fingers upward until you feel a stretch. Hold, then walk back down.", cue:"Stop at a stretch, not at a sting."},
      {id:"p1_3", ic:"extrot", img:"fs-03-assisted-external-rotation.jpg", vid:"fs-03-assisted-external-rotation.mp4", name:"Assisted outward rotation", dose:"8 reps, hold 5 sec", desc:"Elbow tucked at your side and bent to 90°. Use a stick or your other hand to turn the forearm outward.", cue:"The elbow stays against your ribs the whole time."},
      {id:"p1_4", ic:"scapula", img:"fs-04-scapular-setting.jpg", vid:"fs-04-scapular-setting.mp4", name:"Shoulder-blade setting", dose:"10 reps", desc:"Gently draw the shoulder blades back and down. Small movement, no shrugging.", cue:"Your neck should stay relaxed."}
    ],
    [
      {id:"p2_1", ic:"wallslide", img:"fs-05-wall-slide.jpg", vid:"fs-05-wall-slide.mp4", name:"Wall slide", dose:"8 reps", desc:"Forearm on the wall, slide it upward as far as is comfortable. Note the highest point you reach.", cue:"Log your best height — it is the clearest sign of progress."},
      {id:"p2_2", ic:"stick", img:"fs-06-stick-assisted-elevation.jpg", vid:"fs-06-stick-assisted-elevation.mp4", name:"Assisted overhead reach", dose:"8 reps, hold 10 sec", desc:"Hold a stick with both hands and use the good arm to push the stiff arm upward.", cue:"Breathe out as you move into the stretch."},
      {id:"p2_3", ic:"extrot", img:"fs-07-external-rotation-stretch.jpg", vid:"fs-07-external-rotation-stretch.mp4", name:"Outward rotation stretch", dose:"5 reps, hold 20 sec", desc:"Elbow supported at your side, rotate outward and hold at the end of the comfortable range.", cue:"This is the movement that stays stuck longest. Be patient with it."},
      {id:"p2_4", ic:"crossbody", img:"fs-08-cross-body-stretch.jpg", vid:"fs-08-cross-body-stretch.mp4", name:"Cross-body stretch", dose:"5 reps, hold 20 sec", desc:"Bring the arm across your chest, supporting it with the other hand above the elbow.", cue:"Pull at the upper arm, never at the wrist."},
      {id:"p2_5", ic:"towel", img:"fs-09-towel-internal-rotation.jpg", vid:"fs-09-towel-internal-rotation.mp4", name:"Towel stretch behind the back", dose:"6 reps, hold 10 sec", desc:"Towel over the good shoulder. Grip the low end with the stiff arm and gently pull it upward.", cue:"This is what gets you back into a jacket."}
    ],
    [
      {id:"p3_1", ic:"bander", img:"fs-10-band-external-rotation.jpg", vid:"fs-10-band-external-rotation.mp4", name:"Band outward rotation", dose:"2 sets of 12", desc:"Band anchored at waist height, elbow at your side, rotate the forearm outward against the band.", cue:"Slow on the way back is where the strength comes from."},
      {id:"p3_2", ic:"bandir", img:"fs-11-band-internal-rotation.jpg", vid:"fs-11-band-internal-rotation.mp4", name:"Band inward rotation", dose:"2 sets of 12", desc:"Same setup, rotating the forearm in toward your stomach.", cue:"Keep a rolled towel under the elbow if it drifts."},
      {id:"p3_3", ic:"row", img:"fs-12-band-row.jpg", vid:"fs-12-band-row.mp4", name:"Band row", dose:"2 sets of 12", desc:"Pull both elbows back past your ribs, squeezing the shoulder blades together.", cue:"Lead with the elbows, not the hands."},
      {id:"p3_4", ic:"raise", img:"fs-13-light-forward-raise.jpg", vid:"fs-13-light-forward-raise.mp4", name:"Light forward raise", dose:"2 sets of 10", desc:"Light weight or no weight. Raise the arm forward to shoulder height and lower slowly.", cue:"Add weight only once this is easy without a shrug."},
      {id:"p3_5", ic:"carry", img:"fs-14-loaded-carry.jpg", vid:"fs-14-loaded-carry.mp4", name:"Loaded carry", dose:"3 x 30 sec", desc:"Carry a bag or weight at your side, walking tall.", cue:"The most useful strength exercise there is."}
    ],
    [
      {id:"p4_1", ic:"selfcare", img:"fs-15-level1-self-care.jpg", vid:"fs-15-level1-self-care.mp4", name:"Level 1 — self-care", dose:"Daily", desc:"Put on a shirt, wash your face, comb your hair — without planning around the shoulder.", cue:""},
      {id:"p4_2", ic:"reach", img:"fs-16-level2-everyday-reach.jpg", vid:"fs-16-level2-everyday-reach.mp4", name:"Level 2 — everyday reach", dose:"Daily", desc:"Reach a shelf, put on a seatbelt, reach behind your back.", cue:""},
      {id:"p4_3", ic:"load", img:"fs-17-level3-load.jpg", vid:"fs-17-level3-load.mp4", name:"Level 3 — load", dose:"3 times a week", desc:"Carry a full bag, lift overhead, do resistance work.", cue:""},
      {id:"p4_4", ic:"life", img:"fs-18-level4-return-to-life.jpg", vid:"fs-18-level4-return-to-life.mp4", name:"Level 4 — your life", dose:"As before", desc:"Back to the gym, the sport, or the specific thing your job asks of your shoulder.", cue:""}
    ]
  ],

  zoneTitle:"How hard should it feel?",
  zones:[
    ["g","Green","<b>A pulling stretch.</b> Keep going — this is the target."],
    ["y","Yellow","<b>Moderate discomfort.</b> Reduce the range or the number of repetitions, but keep moving."],
    ["r","Red","<b>Sharp or severe pain, or pain that stays much worse afterwards.</b> Stop and change what you are doing."]
  ],

  measureTitles:["Pain and function","Movement","Strength and satisfaction"],
  measureLeads:[
    "These two questions carry the most weight in the UCLA score. Pick the line that fits you best.",
    "Drag each arc to the furthest point you can reach without sharp pain. Forward flexion is the one that scores.",
    "Two last questions and your score is complete."
  ],
  moves:[
    {key:"flexion",   name:"Reach forward and up", clin:"Forward elevation", max:180, unit:"°", scored:true},
    {key:"abduction", name:"Reach out to the side", clin:"Abduction", max:180, unit:"°", scored:false},
    {key:"er",        name:"Rotate outward", clin:"External rotation", max:90, unit:"°", scored:false},
    {key:"ir",        name:"Reach behind your back", clin:"Internal rotation", max:8, unit:"", scored:false}
  ],
  irLandmarks:["Outer thigh","Buttock","Back pocket","Sacrum","Waistband","Low back","Mid back","Shoulder blade","Between blades"],
  measureNext:"Next", measureFinish:"Save my assessment", measureBack:"Back", measureCancel:"Close without saving",

  progNoData:"No assessment yet",
  progNoDataBody:"Complete your first assessment and this page will graph every parameter as it changes.",
  progStartBtn:"Start my assessment",
  progCount:"{n} assessments recorded",
  progFooter:"Your shoulder will not improve every day. Look for progress across weeks.",
  chartEmpty:"One more entry and this graph appears. Frozen shoulder moves week to week, not day to day.",
  charts:{
    total:{title:"UCLA total", sub:"out of 35 — the headline number"},
    pain:{title:"Pain", sub:"0–10, higher is better"},
    func:{title:"Function", sub:"0–10, higher is better"},
    flexdeg:{title:"Forward elevation", sub:"degrees you can raise the arm"},
    abduction:{title:"Abduction", sub:"degrees out to the side"},
    er:{title:"External rotation", sub:"degrees — usually the last to return"},
    ir:{title:"Internal rotation", sub:"how far up your back you can reach"},
    strength:{title:"Strength", sub:"manual muscle grade, 0 to 5"}
  },
  deltaSince:"since you started",
  chartUp:"Up <b>{d}</b> — from <b>{a}</b> to <b>{b}</b>. That is progress.",
  chartDown:"Down — from <b>{a}</b> to <b>{b}</b>. Mention this at your next visit.",
  chartFlat:"Unchanged at <b>{b}</b>.",
  chartNeedTwo:"Two assessments and this graph appears.",
  mediaWatch:"Watch the video",

  sleepTitle:"Sleeping With a Frozen Shoulder",
  sleepIntro:"Night pain is the hardest part of the painful stage for most people. These positions help while it settles.",
  sleep:[
    {icon:"🛏️", img:"fs-sleep-01-back-supported.jpg", vid:"fs-sleep-01-back-supported.mp4", title:"On your back, arm supported", desc:"Lie on your back with a pillow under the affected forearm so the arm is not hanging or dropping backwards.", avoid:false},
    {icon:"↔️", img:"fs-sleep-02-side-lying-pillow.jpg", vid:"fs-sleep-02-side-lying-pillow.mp4", title:"On the good side, hugging a pillow", desc:"Lie on the unaffected side and rest the sore arm forward on a pillow at chest height.", avoid:false},
    {icon:"🪑", img:"fs-sleep-03-propped-upright.jpg", vid:"fs-sleep-03-propped-upright.mp4", title:"Propped up", desc:"A recliner or a wedge of pillows often hurts less than lying flat in the painful stage.", avoid:false},
    {icon:"🌙", img:"fs-sleep-04-night-waking-mobility.jpg", vid:"fs-sleep-04-night-waking-mobility.mp4", title:"If stiffness wakes you", desc:"Do a few gentle pendulum swings or slow movements rather than lying still and waiting it out.", avoid:false},
    {icon:"🚫", img:"", vid:"", title:"Do not lie on the painful shoulder", desc:"Direct pressure on the affected shoulder is the most common cause of night waking.", avoid:true}
  ],

  selfcareTitle:"Everyday Self-Care",
  selfcareIntro:"Simple ways to manage daily tasks and symptoms at home.",
  selfcare:[
    {icon:"🌡️", img:"fs-selfcare-01-ice-or-heat.jpg", vid:"fs-selfcare-01-ice-or-heat.mp4", title:"Ice or Heat", desc:"An ice pack or a warm pad wrapped in a towel, up to 20 minutes, eases aching muscles — use whichever feels better for you."},
    {icon:"🙌", img:"fs-selfcare-02-gentle-movement.jpg", vid:"fs-selfcare-02-gentle-movement.mp4", title:"Keep Moving, Gently", desc:"Stopping all movement makes stiffness worse. Stretch to a mild pull, stop at the first sign of sharp pain, and avoid sudden or jerky reaches."},
    {icon:"👕", img:"fs-selfcare-03-getting-dressed.jpg", vid:"fs-selfcare-03-getting-dressed.mp4", title:"Getting Dressed", desc:"Injured arm first when dressing, injured arm last when undressing. Loose tops, button-up shirts, and slip-on shoes make this easier."},
    {icon:"🚿", img:"fs-selfcare-04-showering.jpg", vid:"fs-selfcare-04-showering.mp4", title:"Showering", desc:"Wash and rinse with your good arm and let the injured one hang relaxed. A long-handled sponge reaches your back; pat dry rather than rubbing."}
  ],

  sosTitle:"When to Get Help",
  sosSub:"If you notice any of the signs below, contact your care team right away.",
  sosInfoNote:"Frozen shoulder is painful and slow, but it is not dangerous. The signs below are not part of the usual pattern — they mean something else may be going on.",
  flagsHardLabel:"See your doctor before your next appointment",
  flagsHard:[
    "New weakness — the arm gives way or cannot lift",
    "Fever, redness or marked swelling around the joint",
    "A new fall or injury to the shoulder"
  ],
  escalateTitle:"What your doctor might add",
  escalateIntro:"Decisions for your doctor, not choices made in the app.",
  escalate:[
    "An injection into the joint, when pain is the thing blocking rehabilitation",
    "Injection combined with physiotherapy rather than either on its own",
    "Other injectable options where a steroid is not suitable"
  ],
  escalateNoDose:"This app gives no medication or dosing advice.",
  appDisclaimer:"This app provides general guidance only and does not replace advice from your doctor or physiotherapist. Always follow the instructions given by your care team.",
  callBtnPrefix:"Call ",

  onboardTitle:"Welcome — let's set up your recovery",
  onboardLead:"Frozen shoulder improves at a different speed for everyone, so this app follows your symptoms rather than a fixed schedule.",
  onboardOnsetLabel:"When did the shoulder problem start?",
  onboardOnsetHint:"The month and year are enough. This is for your record only — it does not decide your programme.",
  onboardHNLabel:"Hospital Number (HN)",
  onboardHNHint:"Helps hospital staff find your records quickly.",
  monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
  monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  selectMonth:"Month", selectYear:"Year",
  consentTitle:"Your Privacy",
  consentText:"By continuing, your HN, monthly shoulder scores and exercise progress are recorded and shared only with your care team, under Thailand's PDPA — used only to guide your care, nothing else. This is sent once a month when you complete an assessment, so use your own phone to keep it private.",
  consentCheckboxLabel:"I have read and agree to the above.",
  consentValidation:"Please confirm to continue.",
  onboardSave:"Save & Continue",
  addHomeTitle:"Add to Home Screen?",
  addHomeBody:"Add this app to your home screen for one-tap access anytime, just like a regular app.",
  addHomeAccept:"Add to Home Screen", addHomeDecline:"Not Now", addHomeGotIt:"Got it",
  addHomeIOSSteps:"Tap the Share icon in your browser, then choose \"Add to Home Screen.\"",
  addHomeGenericSteps:"Look for \"Add to Home Screen\" or \"Install App\" in your browser's menu."
},

th: {
  appName:"ฟื้นฟูไหล่ติด",
  uclaLabel:"คะแนนไหล่ UCLA",
  surgeonName:"นพ.สรวุฒิ ธรรมยงค์กิจ",
  durationLabel:"เดือน นับตั้งแต่เริ่มมีอาการ",
  durationLabelOne:"เดือน นับตั้งแต่เริ่มมีอาการ",
  durationUnknown:"ยังไม่ได้บันทึกระยะเวลาที่มีอาการ",
  onsetPrefix:"ตั้งแต่ ",
  uclaCardTitle:"คะแนนไหล่ UCLA",
  uclaDomains:["ความปวด","การใช้งาน","การยกแขน","กำลัง","ความพึงพอใจ"],
  uclaCardFoot:"เต็ม 35 คะแนน มากกว่า 33 คือดีเยี่ยม 29 ถึง 33 คือดี บันทึกเดือนละครั้ง",
  syncStatusDone:"✓ ส่งถึงทีมผู้ดูแลแล้ว",
  syncStatusPending:"ยังไม่ได้ส่ง — แอปจะลองส่งอีกให้เองเงียบ ๆ ไม่ต้องทำอะไรเพิ่ม",
  gradeNames:{excellent:"ดีเยี่ยม", good:"ดี", poor:"ต้องปรับปรุง"},
  remeasureBtn:"ทำแบบประเมินใหม่",
  roadmapTitle:"เส้นทางการฟื้นตัวของคุณ",
  roadmapNote:"คุณจะเลื่อนไปยังระยะถัดไปเมื่ออาการของไหล่เปลี่ยนแปลง ไม่ใช่ตามตารางเวลาที่ตายตัว บางคนเร็วกว่า บางคนช้ากว่า ซึ่งเป็นเรื่องปกติทั้งคู่",
  todayTitle:"สิ่งที่ต้องทำวันนี้",
  goalsTitleByPhase:[
    "เป้าหมายของคุณในระยะก่อนข้อติด",
    "เป้าหมายของคุณในระยะเริ่มติด",
    "เป้าหมายของคุณในระยะข้อติด",
    "เป้าหมายของคุณในระยะคลายตัว"
  ],
  goalsSub:"เป้าหมายจะเปลี่ยนไปตามอาการของไหล่ ทำสี่ข้อนี้ไปเรื่อย ๆ จนกว่าอาการของคุณจะเข้าสู่ระยะถัดไป",
  goalsByPhase:[
    ["ขยับไหล่ให้ได้เต็มที่ทุกวัน","อย่าหยุดใช้แขนเพียงเพราะรู้สึกไหล่ไว","จัดการความปวดตอนกลางคืนตั้งแต่เนิ่น ๆ เพื่อไม่ให้กระทบการนอน","ปรึกษาแพทย์ตั้งแต่ตอนนี้ ขณะที่ยังขยับได้ดีอยู่"],
    ["ควบคุมความปวดให้ได้ก่อน เพราะทุกอย่างขึ้นอยู่กับข้อนี้","รักษาระดับการขยับที่ยังทำได้อยู่ไว้ก่อน อย่าเพิ่งพยายามเอาส่วนที่เสียไปกลับคืนมา","ใช้แขนทำสิ่งที่ยังทำได้อย่างสบายต่อไป","ดูแลการนอนด้วยการจัดท่าและใช้หมอนรอง"],
    ["ยืดทุกวัน ครั้งละน้อยแต่บ่อย ๆ","ค้างไว้ที่จุดตึงสุด ดีกว่าดึงให้แรงขึ้น","เอาการเอื้อมที่เสียไปกลับมา ทั้งยกเหนือศีรษะ กางออกข้าง และไพล่หลัง","ยอมรับว่าระยะนี้ช้า แล้วทำต่อไปอย่างสม่ำเสมอ"],
    ["ยืดต่อไปเรื่อย ๆ เพราะส่วนที่หยุดขยับจะค่อย ๆ ติดแข็ง","เริ่มเพิ่มความแข็งแรงได้แล้ว เมื่อการเคลื่อนไหวเอื้ออำนวย","กลับไปทำงาน เล่นกีฬา และงานอดิเรกอย่างเป็นขั้นตอน","คงท่าบริหารสั้น ๆ ไว้ เพื่อไม่ให้อาการติดกลับมา"]
  ],
  todayReminders:[
    ["ขยับไหล่เบา ๆ ให้ได้เต็มที่หลายครั้งต่อวัน","ช่วงนี้คือเวลาที่ดีที่สุดในการเริ่มดูแล เพราะรักษาการเคลื่อนไหวที่มีอยู่ไว้ง่ายกว่าเอากลับคืนภายหลัง","ยืดจนรู้สึกตึง ไม่ใช่จนปวดแปลบ","แจ้งแพทย์เรื่องอาการปวดตอนกลางคืน อย่ารอให้หายเอง"],
    ["จัดการความปวดก่อนเป็นอันดับแรก การออกกำลังกายจะง่ายขึ้นเมื่อควบคุมความปวดได้","อย่าฝืนไหล่ การฝืนในระยะนี้จะทำให้ปวดมากขึ้น","ทำครั้งละน้อยแต่บ่อย ๆ ดีกว่าทำครั้งเดียวนาน ๆ","หนุนแขนด้วยหมอนตอนกลางคืน และหลีกเลี่ยงการนอนทับข้างนั้น"],
    ["ระยะนี้คือช่วงที่การยืดได้ผลมากที่สุด ทำครั้งละน้อยแต่บ่อย ๆ","ค้างท่ายืดให้นานขึ้น ดีกว่าดึงให้แรงขึ้น","จดความสูงที่ดีที่สุดของท่าไถผนัง เป็นสัญญาณความก้าวหน้าที่ชัดที่สุด","ปวดเมื่อยที่หายภายในเช้าวันถัดไปถือว่าปกติ แต่ถ้ายังปวดค้างถือว่ามากเกินไป"],
    ["ยืดทุกวันต่อไป เพราะส่วนที่ไม่ได้ขยับจะค่อย ๆ ติดแข็ง","เพิ่มแรงต้านทีละน้อย จากมีคนช่วย เป็นทำเอง แล้วจึงมีแรงต้าน","ความแข็งแรงเกิดจากการผ่อนกลับอย่างช้า ๆ","ปวดเมื่อยกล้ามเนื้อหลังออกกำลังกายเป็นเรื่องปกติ แต่ปวดแปลบในข้อไม่ปกติ"]
  ],
  weeklyDueKicker:"แบบประเมินประจำเดือน",
  weeklyDueTitle:"ถึงเวลาทำแบบประเมินของเดือนนี้",
  weeklyDueBody:"ทำเดือนละครั้งก็เพียงพอ ใช้เวลาประมาณ 2 นาที และเป็นสิ่งที่ทำให้โปรแกรมของคุณตรงกับอาการไหล่ในปัจจุบัน",
  weeklyDueBtn:"เริ่มทำแบบประเมินของเดือนนี้",
  weeklyOverdueTitle:"เลยกำหนดแบบประเมินมาแล้ว {n} เดือน",
  weeklyOverdueTitleOne:"เลยกำหนดแบบประเมินมาแล้ว 1 เดือน",
  weeklyOverdueBody:"โปรแกรมที่แสดงอยู่ยังอ้างอิงผลประเมินครั้งล่าสุด จึงอาจไม่ตรงกับอาการไหล่ของคุณในตอนนี้",
  weeklyDoneKicker:"แบบประเมินประจำเดือน",
  weeklyDoneTitle:"ทำครบแล้วสำหรับเดือนนี้",
  weeklyDoneBody:"บันทึกเมื่อ {d} ครั้งถัดไปกำหนด {next} ระหว่างนี้ให้ทำท่าบริหารทุกวันตามปกติ",
  weeklyDoneBtn:"แก้ไขผลประเมิน",
  weeklyNoneTitle:"เริ่มจากแบบประเมินครั้งแรก",
  weeklyNoneBody:"แอปต้องมีผลประเมินหนึ่งครั้งก่อน จึงจะแสดงโปรแกรมที่เหมาะกับคุณได้",
  measureValidation:"กรุณาตอบทั้งสองคำถามก่อนไปต่อ",
  privacyTitle:"ความเป็นส่วนตัวของคุณ",
  privacyIntro:"แอปนี้เก็บข้อมูลอะไร และเก็บไว้ที่ไหน",
  privacyPoints:[
    ["📱","คำตอบของคุณถูกเก็บไว้ในโทรศัพท์เครื่องนี้ หากล้างข้อมูลแอปหรือเปลี่ยนเครื่อง ข้อมูลจะหายไป"],
    ["🎯","ข้อมูลของคุณใช้เพื่อแสดงความก้าวหน้าของอาการไหล่ และแนะนำการดูแลที่เหมาะสมกับคุณเท่านั้น ไม่ใช้เพื่อวัตถุประสงค์อื่น"],
    ["🏥","ผลประเมินประจำเดือนจะถูกส่งไปยังทีมผู้ดูแลครั้งละหนึ่งครั้ง พร้อมกับ HN เพื่อให้จับคู่กับเวชระเบียนของคุณได้"],
    ["🔒","ไม่มีการส่งข้อมูลใดก่อนที่คุณจะยินยอม และแอปไม่ส่งข้อมูลเองโดยอัตโนมัติเบื้องหลัง"],
    ["🙈","หากคุณใช้โทรศัพท์ร่วมกับผู้อื่น โปรดทราบว่าผู้ที่เปิดแอปนี้จะเห็นข้อมูลของคุณได้"],
    ["🗑️","คุณสามารถลบข้อมูลทั้งหมดบนเครื่องนี้ได้ทุกเมื่อ ด้วยปุ่ม “ล้างข้อมูลแอป” ที่ด้านล่างของแท็บหน้าแรก"]
  ],

  scopeNote:"แอปนี้ให้คำแนะนำทั่วไปสำหรับภาวะข้อไหล่ติด ผู้ป่วยแต่ละคนฟื้นตัวด้วยความเร็วต่างกัน และอาการของคุณอาจต่างจากที่อธิบายไว้ที่นี่ หากคำแนะนำของแพทย์ต่างจากในแอป ให้ยึดตามคำแนะนำของแพทย์เป็นหลัก",
  surgeonLabel:"แพทย์ผู้ดูแล",
  resetBtn:"ล้างข้อมูลแอป",
  resetConfirm:"การทำเช่นนี้จะลบ HN ผลการประเมิน ความก้าวหน้าการออกกำลังกาย และบันทึกประจำวันบนอุปกรณ์นี้ ไม่สามารถย้อนกลับได้ ต้องการดำเนินการต่อหรือไม่",
  hnPrefix:"HN: ",
  tabHome:"หน้าแรก", tabAbout:"รู้จักโรค", tabExercises:"ท่าบริหาร", tabProgress:"ความก้าวหน้า", tabSleep:"การนอน", tabSelfCare:"ดูแลตัวเอง", tabResources:"แหล่งข้อมูล", tabSOS:"สัญญาณเตือน",

  resTitle:"ความรู้เพิ่มเติม",
  resIntro:"แหล่งข้อมูลและวิดีโอที่เชื่อถือได้เกี่ยวกับภาวะข้อไหล่ติด ลิงก์เหล่านี้จะเปิดนอกแอป",
  resNote:"ข้อมูลเหล่านี้ใช้เพื่อความเข้าใจทั่วไป",
  resGroupVideo:"วิดีโอ",
  resGroupArticle:"บทความ",
  resLangEn:"English", resLangTh:"ไทย",
  resources:[
    { type:"article", lang:"th", src:"Rue Ortho", featured:true, icon:"media/rueortho-logo.png",
      url:"https://rueortho.vercel.app",
      title:"เว็บไซต์ของ Rue Ortho",
      desc:"ข้อมูลเพิ่มเติมเกี่ยวกับคลินิกออร์โธปิดิกส์และการดูแลของเรา" },
    { type:"video", lang:"th", src:"YouTube",
      url:"https://www.youtube.com/watch?v=UNYZMvQLSKs",
      title:"ทำความรู้จักภาวะข้อไหล่ติด — วิดีโอที่ 1",
      desc:"ข้อไหล่ติดคืออะไร เกิดจากอะไร และการฟื้นตัวมักเป็นอย่างไร" },
    { type:"video", lang:"th", src:"YouTube",
      url:"https://www.youtube.com/watch?v=OBARxLSol3I",
      title:"ทำความรู้จักภาวะข้อไหล่ติด — วิดีโอที่ 2",
      desc:"แนะนำท่าบริหารไหล่และวิธีทำอย่างปลอดภัย" },
    { type:"article", lang:"th", src:"Rama Channel",
      url:"https://www.rama.mahidol.ac.th/ramachannel/article/%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%84%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%95%E0%B8%B4%E0%B8%94-%E0%B8%97%E0%B8%B3%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%81%E0%B9%87%E0%B8%9B%E0%B8%A7%E0%B8%94-%E0%B8%9F/",
      title:"ข้อไหล่ติด ทำอะไรก็ปวด",
      desc:"บทความสำหรับผู้ป่วยจากรามาธิบดี อธิบายอาการ สาเหตุ และแนวทางการรักษา" },
    { type:"article", lang:"en", src:"Harvard Health",
      url:"https://www.health.harvard.edu/stretching-exercises-frozen-shoulder",
      title:"ท่ายืดและเสริมความแข็งแรง 7 ท่า",
      desc:"ท่าลูกตุ้ม ผ้าขนหนู ไต่นิ้ว ยืดข้ามลำตัว ยืดรักแร้ และหมุนแขนด้วยยางยืด" }
  ],

  uclaPainQ:"ความปวด",
  uclaPainSub:"ข้อใดตรงกับอาการปวดไหล่ของคุณมากที่สุด",
  uclaPainOpts:[
    {v:1,  t:"ปวดตลอดเวลาและทนไม่ไหว ต้องใช้ยาแก้ปวดชนิดแรงบ่อย ๆ"},
    {v:2,  t:"ปวดตลอดเวลาแต่ยังทนได้ ใช้ยาแก้ปวดชนิดแรงเป็นครั้งคราว"},
    {v:4,  t:"ขณะพักไม่ปวดหรือปวดเล็กน้อย แต่ปวดเมื่อทำกิจกรรมเบา ๆ ใช้ยาแก้ปวดทั่วไปบ่อย ๆ"},
    {v:6,  t:"ปวดเฉพาะเมื่อใช้งานหนักหรือท่าบางท่า ใช้ยาแก้ปวดทั่วไปเป็นครั้งคราว"},
    {v:8,  t:"ปวดเป็นครั้งคราวและเพียงเล็กน้อย"},
    {v:10, t:"ไม่ปวดเลย"}
  ],
  uclaFuncQ:"การใช้งาน",
  uclaFuncSub:"คุณใช้ไหล่ทำอะไรได้มากน้อยเพียงใด",
  uclaFuncOpts:[
    {v:1,  t:"ใช้แขนข้างนี้ไม่ได้เลย"},
    {v:2,  t:"ทำได้เฉพาะกิจกรรมเบา ๆ เท่านั้น"},
    {v:4,  t:"ทำงานบ้านเบา ๆ หรือกิจวัตรประจำวันส่วนใหญ่ได้"},
    {v:6,  t:"ทำงานบ้านส่วนใหญ่ ซื้อของ ขับรถได้ หวีผมและแต่งตัวเองได้"},
    {v:8,  t:"ติดขัดเพียงเล็กน้อย ทำงานเหนือระดับไหล่ได้"},
    {v:10, t:"ทำกิจกรรมได้ตามปกติทุกอย่าง"}
  ],
  uclaStrengthQ:"กำลังในการยกแขนไปข้างหน้า",
  uclaStrengthSub:"ยกแขนไปข้างหน้า รู้สึกว่ามีกำลังแค่ไหน หากนักกายภาพบำบัดเคยประเมินเกรดไว้ ให้ใช้เกรดนั้น",
  uclaStrengthOpts:[
    {v:0, t:"เกรด 0 — ไม่มีการหดตัวของกล้ามเนื้อเลย"},
    {v:1, t:"เกรด 1 — มีการหดตัวเล็กน้อย แต่ขยับไม่ได้"},
    {v:2, t:"เกรด 2 — ขยับได้เมื่อไม่มีแรงโน้มถ่วงต้าน"},
    {v:3, t:"เกรด 3 — ยกต้านแรงโน้มถ่วงได้ แต่ต้านแรงกดไม่ได้"},
    {v:4, t:"เกรด 4 — ยกต้านแรงกดได้บ้าง"},
    {v:5, t:"เกรด 5 — กำลังปกติ"}
  ],
  uclaSatQ:"ความพึงพอใจ",
  uclaSatSub:"โดยรวมแล้ว คุณรู้สึกอย่างไรกับไหล่ของคุณ",
  uclaSatOpts:[
    {v:5, t:"พอใจ และดีขึ้นกว่าเดิม"},
    {v:0, t:"ไม่พอใจ และแย่ลงกว่าเดิม"}
  ],
  uclaFlexQ:"การยกแขนไปข้างหน้าด้วยตนเอง",
  uclaFlexSub:"ยกแขนไปข้างหน้าและขึ้นบนให้สูงที่สุดเท่าที่ไม่ปวดแปลบ แล้วลากส่วนโค้งให้ตรงกับที่ทำได้",
  ptsSuffix:" คะแนน",

  phaseShort:["ก่อนข้อติด","เริ่มติด","ข้อติด","คลายตัว"],
  phaseNames:["ระยะที่ 1","ระยะที่ 2","ระยะที่ 3","ระยะที่ 4"],
  phaseTitles:["ระยะก่อนข้อติด","ระยะเริ่มติด","ระยะข้อติด","ระยะคลายตัว"],
  phaseMonths:["โดยทั่วไปเดือนที่ 1–3","โดยทั่วไปเดือนที่ 4–9","โดยทั่วไปเดือนที่ 10–14","โดยทั่วไปเดือนที่ 15–24"],
  phaseHeadline:[
    "รักษาพิสัยการเคลื่อนไหวที่ยังมีอยู่",
    "ควบคุมความปวด และรักษาการเคลื่อนไหวไว้",
    "ความปวดเริ่มลดลง ถึงเวลาจัดการกับข้อที่ติด",
    "การเคลื่อนไหวกำลังกลับมา ถึงเวลาเสริมสร้างความแข็งแรงและเพิ่มระยะการขยับให้เต็มที่"
  ],
  phaseDesc:[
    "ไหล่เริ่มรู้สึกเมื่อย ปวดตื้อ ๆ และติดเล็กน้อย ความปวดอยู่ในระดับเล็กน้อยถึงปานกลาง มักปวดมากขึ้นตอนกลางคืนหรือเมื่อเอื้อมไปบางทิศทาง พิสัยการเคลื่อนไหวยังใกล้เคียงปกติ แต่รู้สึกไหล่ไวต่อการกระตุ้น การขยับเบา ๆ อย่างสม่ำเสมอในช่วงนี้คือสิ่งที่ดีที่สุดที่ทำได้",
    "เยื่อหุ้มข้อกำลังอักเสบและเริ่มหนาตัวขึ้น ความปวดรุนแรงขึ้นมาก โดยเฉพาะเวลาขยับและตอนกลางคืน อาการติดเพิ่มขึ้นอย่างรวดเร็ว อย่าฝืนไหล่ในช่วงนี้ ให้ควบคุมความปวดก่อน และรักษาระดับการเคลื่อนไหวที่ยังมีอยู่ไว้",
    "การอักเสบเริ่มสงบลง แต่เยื่อหุ้มข้อตึงมากและข้อรู้สึกเหมือนติดแน่น ความปวดมักลดลงและจะรู้สึกเมื่อพยายามฝืนไปจนสุดช่วงที่ขยับได้ อาการติดรุนแรงที่สุดในระยะนี้ โดยเฉพาะการกางแขน ยกขึ้น และเอื้อมไพล่หลัง ระยะนี้คือช่วงที่การยืดอย่างสม่ำเสมอและใจเย็นได้ผลมากที่สุด",
    "เยื่อหุ้มข้อเริ่มคลายตัว การเคลื่อนไหวและความยืดหยุ่นค่อย ๆ กลับมา และความปวดลดลงเรื่อย ๆ ผู้ป่วยส่วนใหญ่ดีขึ้นมาก แม้บางคนอาจยังมีอาการติดเล็กน้อยหรือปวดเป็นครั้งคราว การฝึกอย่างสม่ำเสมอคือสิ่งที่ทำให้การเคลื่อนไหวที่ได้กลับคืนมานั้นอยู่กับเราไปอย่างถาวร"
  ],
  phaseWhatLabel:"เกิดอะไรขึ้นในระยะนี้",
  phaseSymptomsLabel:"อาการที่อาจพบ",
  phaseWhat:[
    "ไหล่เริ่มรู้สึกเมื่อย ปวดตื้อ ๆ และติดเล็กน้อย",
    "เยื่อหุ้มข้ออักเสบมาก ระคายเคือง และเริ่มหนาตัวขึ้น",
    "การอักเสบลดลง แต่เยื่อหุ้มข้อตึงมากที่สุด และข้อรู้สึกเหมือนติดแน่น",
    "เยื่อหุ้มข้อที่ตึงเริ่มคลายตัวและผ่อนลง"
  ],
  phaseSymptoms:[
    "ปวดเล็กน้อยถึงปานกลาง มักปวดมากขึ้นตอนกลางคืนหรือเมื่อเอื้อมไปบางทิศทาง พิสัยการเคลื่อนไหวยังใกล้เคียงปกติแต่รู้สึกไว",
    "ปวดรุนแรงขึ้นมาก โดยเฉพาะเวลาขยับและตอนกลางคืน อาการติดเพิ่มขึ้นเร็ว ทำให้กิจวัตรประจำวันลำบาก",
    "ความปวดมักลดลง และจะปวดเมื่อพยายามฝืนไปจนสุดช่วงที่ขยับได้ อาการติดรุนแรงที่สุด ทำให้กางแขน ยกขึ้น และเอื้อมไพล่หลังได้จำกัดมาก",
    "การเคลื่อนไหวและความยืดหยุ่นค่อย ๆ กลับมา ความปวดลดลง ผู้ป่วยส่วนใหญ่ฟื้นตัวได้ดี แม้ส่วนน้อยอาจยังมีอาการติดหรือปวดเล็กน้อยในระยะยาว"
  ],
  phaseTimingNote:"ระยะของคุณกำหนดจากช่วงเดือนเหล่านี้ นับจากวันที่เริ่มมีอาการ หากไม่ได้ระบุวันเริ่มมีอาการ จะใช้อาการของคุณเป็นตัวกำหนดแทน ระยะเวลาการฟื้นตัวของคุณอาจแตกต่างจากรูปแบบนี้และแตกต่างจากผู้ป่วยรายอื่น",
  monthsTypicalPrefix:"คุณอยู่ในเดือนที่ ",
  aboutTitle:"ภาวะข้อไหล่ติดคืออะไร",
  aboutBody:"ภาวะข้อไหล่ติด (adhesive capsulitis) เกิดจากเยื่อหุ้มข้อไหล่หนาตัวและตึงขึ้น ทำให้ข้อไหล่ติดขัด เคลื่อนไหวได้น้อยลงและรู้สึกเจ็บ อาการมักค่อย ๆ ดีขึ้นเองตามเวลา แต่การฟื้นตัวอาจใช้เวลาหลายเดือนถึงหลายปี",
  causesTitle:"สาเหตุที่อาจเกี่ยวข้อง",
  causesList:[
    "ส่วนใหญ่ไม่พบสาเหตุที่ชัดเจน",
    "พบได้บ่อยขึ้นในผู้ที่เป็นเบาหวานหรือโรคไทรอยด์",
    "อาจเกิดตามหลังการบาดเจ็บที่ไหล่ การผ่าตัด หรือการไม่ได้ขยับแขนเป็นเวลานาน เช่น หลังโรคหลอดเลือดสมองหรือกระดูกหัก",
    "พบได้บ่อยในผู้หญิง และในช่วงอายุ 40 ถึง 60 ปี"
  ],
  stagesCardTitle:"4 ระยะของภาวะข้อไหล่ติด",
  stagesCardIntro:"ภาวะข้อไหล่ติดมักดำเนินไปตามรูปแบบที่พอคาดเดาได้",
  stagesCardOutcome:"ผู้ป่วยส่วนใหญ่ดีขึ้นมาก ปัญหารุนแรงระยะยาวพบได้ไม่บ่อย บางรายอาจมีอาการติดเล็กน้อยหลงเหลือแต่มักไม่รบกวนชีวิตประจำวัน สอบถามแพทย์เพื่อทราบแนวโน้มของคุณ",
  stageYouAreHere:"คุณอยู่ระยะนี้",
  recoveredChip:"ฟื้นตัวแล้ว",
  recoveredDesc:"การเคลื่อนไหวของคุณกลับมาเป็นปกติและความปวดเหลือน้อยมาก ให้คงท่าบริหารสั้น ๆ ไว้อย่างสม่ำเสมอ เพื่อไม่ให้อาการติดกลับมาอีก",
  noBaselineChip:"ทำแบบประเมินครั้งแรก",
  noBaselineDesc:"กด \"ทำแบบประเมินใหม่\" เพื่อให้แอปแสดงโปรแกรมที่เหมาะกับอาการของคุณในวันนี้",

  exPhaseDefTitle:"ระยะนี้มีไว้เพื่ออะไร",
  exCaution:"ยืดจนรู้สึกตึง ไม่ใช่จนปวด ถ้าเช้าวันถัดไปยังแย่กว่าเดิม แสดงว่าทำมากเกินไป",
  exercises:[
    [
      {id:"p1_1", ic:"pendulum", img:"fs-01-pendulum.jpg", vid:"fs-01-pendulum.mp4", name:"แกว่งแขนแบบลูกตุ้ม", dose:"10 ครั้งต่อทิศทาง", desc:"โน้มตัวไปข้างหน้าและปล่อยแขนห้อยให้ผ่อนคลายเต็มที่ แกว่งเป็นวงกลมเล็ก ๆ แล้วแกว่งหน้า-หลังเบา ๆ", cue:"ถ้ารู้สึกว่าไหล่ต้องออกแรง แสดงว่าแกว่งกว้างเกินไป"},
      {id:"p1_2", ic:"wallwalk", img:"fs-02-finger-walk.jpg", vid:"fs-02-finger-walk.mp4", name:"ไต่นิ้วขึ้นผนัง", dose:"5 ครั้ง ช้า ๆ", desc:"หันหน้าเข้าผนัง ไต่นิ้วขึ้นไปจนรู้สึกตึง ค้างไว้ แล้วไต่กลับลงมา", cue:"หยุดที่ความตึง ไม่ใช่ที่ความปวด"},
      {id:"p1_3", ic:"extrot", img:"fs-03-assisted-external-rotation.jpg", vid:"fs-03-assisted-external-rotation.mp4", name:"หมุนแขนออกแบบมีตัวช่วย", dose:"8 ครั้ง ค้าง 5 วินาที", desc:"หนีบข้อศอกไว้ข้างลำตัวและงอ 90 องศา ใช้ไม้หรือมือข้างที่ดีช่วยหมุนแขนออกด้านนอก", cue:"ข้อศอกต้องแนบชายโครงตลอดเวลา"},
      {id:"p1_4", ic:"scapula", img:"fs-04-scapular-setting.jpg", vid:"fs-04-scapular-setting.mp4", name:"จัดตำแหน่งสะบัก", dose:"10 ครั้ง", desc:"ค่อย ๆ ดึงสะบักไปด้านหลังและลงล่าง ขยับเล็กน้อย ไม่ยักไหล่", cue:"คอต้องผ่อนคลายอยู่ตลอด"}
    ],
    [
      {id:"p2_1", ic:"wallslide", img:"fs-05-wall-slide.jpg", vid:"fs-05-wall-slide.mp4", name:"ไถแขนขึ้นผนัง", dose:"8 ครั้ง", desc:"วางท่อนแขนบนผนัง ไถขึ้นไปให้สูงที่สุดเท่าที่ยังสบาย จดจุดสูงสุดที่ทำได้", cue:"จดความสูงที่ดีที่สุด เป็นสัญญาณความก้าวหน้าที่ชัดที่สุด"},
      {id:"p2_2", ic:"stick", img:"fs-06-stick-assisted-elevation.jpg", vid:"fs-06-stick-assisted-elevation.mp4", name:"ยกแขนเหนือศีรษะแบบมีตัวช่วย", dose:"8 ครั้ง ค้าง 10 วินาที", desc:"จับไม้ด้วยมือทั้งสองข้าง ใช้แขนข้างที่ดีดันแขนข้างที่ติดขึ้นไป", cue:"หายใจออกขณะดันเข้าสู่ช่วงที่ตึง"},
      {id:"p2_3", ic:"extrot", img:"fs-07-external-rotation-stretch.jpg", vid:"fs-07-external-rotation-stretch.mp4", name:"ยืดหมุนแขนออก", dose:"5 ครั้ง ค้าง 20 วินาที", desc:"ประคองข้อศอกไว้ข้างลำตัว หมุนแขนออกและค้างไว้ที่จุดตึงสุดที่ยังสบาย", cue:"ท่านี้มักติดนานที่สุด ต้องใจเย็น"},
      {id:"p2_4", ic:"crossbody", img:"fs-08-cross-body-stretch.jpg", vid:"fs-08-cross-body-stretch.mp4", name:"ยืดแขนข้ามลำตัว", dose:"5 ครั้ง ค้าง 20 วินาที", desc:"นำแขนพาดข้ามหน้าอก ใช้มืออีกข้างประคองเหนือข้อศอก", cue:"ดึงที่ต้นแขน ห้ามดึงที่ข้อมือ"},
      {id:"p2_5", ic:"towel", img:"fs-09-towel-internal-rotation.jpg", vid:"fs-09-towel-internal-rotation.mp4", name:"ยืดด้วยผ้าขนหนูไพล่หลัง", dose:"6 ครั้ง ค้าง 10 วินาที", desc:"พาดผ้าขนหนูข้ามไหล่ข้างที่ดี ใช้แขนข้างที่ติดจับปลายล่างแล้วค่อย ๆ ดึงขึ้น", cue:"ท่านี้คือท่าที่ทำให้คุณกลับมาใส่เสื้อแขนยาวได้"}
    ],
    [
      {id:"p3_1", ic:"bander", img:"fs-10-band-external-rotation.jpg", vid:"fs-10-band-external-rotation.mp4", name:"หมุนแขนออกด้วยยางยืด", dose:"2 เซต เซตละ 12 ครั้ง", desc:"ยึดยางยืดระดับเอว ข้อศอกแนบลำตัว หมุนท่อนแขนออกต้านยางยืด", cue:"ความแข็งแรงเกิดจากการผ่อนกลับอย่างช้า ๆ"},
      {id:"p3_2", ic:"bandir", img:"fs-11-band-internal-rotation.jpg", vid:"fs-11-band-internal-rotation.mp4", name:"หมุนแขนเข้าด้วยยางยืด", dose:"2 เซต เซตละ 12 ครั้ง", desc:"ท่าตั้งต้นเหมือนเดิม แต่หมุนท่อนแขนเข้าหาหน้าท้อง", cue:"ถ้าข้อศอกเลื่อนออก ให้หนีบผ้าขนหนูม้วนไว้"},
      {id:"p3_3", ic:"row", img:"fs-12-band-row.jpg", vid:"fs-12-band-row.mp4", name:"ดึงยางยืดเข้าหาลำตัว", dose:"2 เซต เซตละ 12 ครั้ง", desc:"ดึงข้อศอกทั้งสองข้างไปด้านหลังเลยชายโครง พร้อมบีบสะบักเข้าหากัน", cue:"นำด้วยข้อศอก ไม่ใช่มือ"},
      {id:"p3_4", ic:"raise", img:"fs-13-light-forward-raise.jpg", vid:"fs-13-light-forward-raise.mp4", name:"ยกแขนไปข้างหน้าแบบเบา", dose:"2 เซต เซตละ 10 ครั้ง", desc:"ใช้น้ำหนักเบาหรือไม่ใช้เลย ยกแขนไปข้างหน้าถึงระดับไหล่แล้วค่อย ๆ ลดลง", cue:"เพิ่มน้ำหนักเมื่อทำได้สบายโดยไม่ต้องยักไหล่"},
      {id:"p3_5", ic:"carry", img:"fs-14-loaded-carry.jpg", vid:"fs-14-loaded-carry.mp4", name:"ถือของเดิน", dose:"3 ครั้ง ครั้งละ 30 วินาที", desc:"ถือกระเป๋าหรือน้ำหนักไว้ข้างลำตัว เดินตัวตรง", cue:"เป็นท่าสร้างความแข็งแรงที่ใช้ได้จริงที่สุด"}
    ],
    [
      {id:"p4_1", ic:"selfcare", img:"fs-15-level1-self-care.jpg", vid:"fs-15-level1-self-care.mp4", name:"ระดับ 1 — ดูแลตัวเอง", dose:"ทุกวัน", desc:"ใส่เสื้อ ล้างหน้า หวีผม โดยไม่ต้องวางแผนหลบไหล่", cue:""},
      {id:"p4_2", ic:"reach", img:"fs-16-level2-everyday-reach.jpg", vid:"fs-16-level2-everyday-reach.mp4", name:"ระดับ 2 — เอื้อมในชีวิตประจำวัน", dose:"ทุกวัน", desc:"หยิบของบนชั้นสูง คาดเข็มขัดนิรภัย เอื้อมไพล่หลัง", cue:""},
      {id:"p4_3", ic:"load", img:"fs-17-level3-load.jpg", vid:"fs-17-level3-load.mp4", name:"ระดับ 3 — ลงน้ำหนัก", dose:"สัปดาห์ละ 3 ครั้ง", desc:"ถือกระเป๋าที่มีของเต็ม ยกของเหนือศีรษะ ออกกำลังกายแบบมีแรงต้าน", cue:""},
      {id:"p4_4", ic:"life", img:"fs-18-level4-return-to-life.jpg", vid:"fs-18-level4-return-to-life.mp4", name:"ระดับ 4 — ชีวิตของคุณ", dose:"เหมือนเดิม", desc:"กลับไปเข้ายิม เล่นกีฬา หรือทำสิ่งที่งานของคุณต้องใช้ไหล่", cue:""}
    ]
  ],

  zoneTitle:"ควรรู้สึกตึงแค่ไหน",
  zones:[
    ["g","เขียว","<b>รู้สึกตึงแบบถูกยืด</b> ทำต่อได้ นี่คือเป้าหมาย"],
    ["y","เหลือง","<b>รู้สึกไม่สบายปานกลาง</b> ลดระยะที่ขยับหรือจำนวนครั้งลง แต่ยังขยับต่อได้"],
    ["r","แดง","<b>ปวดแปลบหรือปวดรุนแรง หรือปวดค้างแย่ลงมากหลังทำ</b> หยุดทันที แล้วปรับท่าหรือความหนักเบาลง"]
  ],

  measureTitles:["ความปวดและการใช้งาน","การเคลื่อนไหว","กำลังและความพึงพอใจ"],
  measureLeads:[
    "สองคำถามนี้มีน้ำหนักมากที่สุดในคะแนน UCLA เลือกข้อที่ตรงกับคุณมากที่สุด",
    "ลากส่วนโค้งไปยังจุดไกลที่สุดที่คุณเอื้อมได้โดยไม่ปวดแปลบ ข้อที่นำไปคิดคะแนนคือการยกแขนไปข้างหน้า",
    "อีกสองคำถามก็จะได้คะแนนครบ"
  ],
  moves:[
    {key:"flexion",   name:"เอื้อมไปข้างหน้าและขึ้นบน", clin:"ยกแขนไปข้างหน้า", max:180, unit:"°", scored:true},
    {key:"abduction", name:"กางแขนออกด้านข้าง", clin:"กางแขน", max:180, unit:"°", scored:false},
    {key:"er",        name:"หมุนแขนออกด้านนอก", clin:"หมุนออก", max:90, unit:"°", scored:false},
    {key:"ir",        name:"เอื้อมไพล่หลัง", clin:"หมุนเข้า", max:8, unit:"", scored:false}
  ],
  irLandmarks:["ต้นขาด้านนอก","สะโพก","กระเป๋ากางเกงหลัง","กระเบนเหน็บ","ขอบเอว","หลังส่วนล่าง","กลางหลัง","สะบัก","ระหว่างสะบัก"],
  measureNext:"ถัดไป", measureFinish:"บันทึกผลการประเมิน", measureBack:"ย้อนกลับ", measureCancel:"ปิดโดยไม่บันทึก",

  progNoData:"ยังไม่มีผลการประเมิน",
  progNoDataBody:"ทำแบบประเมินครั้งแรก แล้วหน้านี้จะแสดงกราฟของแต่ละตัวชี้วัดตามการเปลี่ยนแปลง",
  progStartBtn:"เริ่มทำแบบประเมิน",
  progCount:"บันทึกผลการประเมินแล้ว {n} ครั้ง",
  progFooter:"ไหล่ของคุณจะไม่ดีขึ้นทุกวัน ให้มองความก้าวหน้าเป็นรายสัปดาห์",
  chartEmpty:"เมื่อมีข้อมูลอีกหนึ่งครั้ง กราฟนี้จะปรากฏขึ้น ภาวะข้อไหล่ติดเปลี่ยนแปลงเป็นรายสัปดาห์ ไม่ใช่รายวัน",
  charts:{
    total:{title:"คะแนน UCLA รวม", sub:"เต็ม 35 — ตัวเลขหลัก"},
    pain:{title:"ความปวด", sub:"หมวดความปวดของ UCLA เต็ม 10 — ยิ่งสูงยิ่งดี"},
    func:{title:"การใช้งาน", sub:"หมวดการใช้งานของ UCLA เต็ม 10 — ยิ่งสูงยิ่งดี"},
    flexdeg:{title:"ยกแขนไปข้างหน้า", sub:"องศาที่ยกแขนขึ้นได้"},
    abduction:{title:"กางแขน", sub:"องศาที่กางออกด้านข้างได้"},
    er:{title:"หมุนออก", sub:"องศา — มักเป็นทิศทางที่กลับมาช้าที่สุด"},
    ir:{title:"หมุนเข้า", sub:"เอื้อมขึ้นหลังได้สูงแค่ไหน"},
    strength:{title:"กำลัง", sub:"เกรดกำลังกล้ามเนื้อ 0 ถึง 5"}
  },
  deltaSince:"ตั้งแต่เริ่ม",
  chartUp:"เพิ่มขึ้น <b>{d}</b> จาก <b>{a}</b> เป็น <b>{b}</b> ถือว่าดีขึ้น",
  chartDown:"ลดลงจาก <b>{a}</b> เหลือ <b>{b}</b> ควรแจ้งแพทย์ในการนัดถัดไป",
  chartFlat:"คงที่ที่ <b>{b}</b>",
  chartNeedTwo:"เมื่อมีผลประเมินสองครั้ง กราฟนี้จะปรากฏขึ้น",
  mediaWatch:"ดูวิดีโอ",

  sleepTitle:"การนอนเมื่อมีภาวะข้อไหล่ติด",
  sleepIntro:"สำหรับคนส่วนใหญ่ ความปวดตอนกลางคืนคือส่วนที่ยากที่สุดของระยะปวด ท่าเหล่านี้ช่วยได้ระหว่างรออาการสงบ",
  sleep:[
    {icon:"🛏️", img:"fs-sleep-01-back-supported.jpg", vid:"fs-sleep-01-back-supported.mp4", title:"นอนหงาย มีหมอนรองแขน", desc:"นอนหงายและวางหมอนรองใต้ท่อนแขนข้างที่มีอาการ เพื่อไม่ให้แขนห้อยหรือตกไปด้านหลัง", avoid:false},
    {icon:"↔️", img:"fs-sleep-02-side-lying-pillow.jpg", vid:"fs-sleep-02-side-lying-pillow.mp4", title:"นอนตะแคงข้างที่ดี กอดหมอน", desc:"นอนตะแคงทับข้างที่ไม่มีอาการ และวางแขนข้างที่ปวดไว้บนหมอนด้านหน้าระดับอก", avoid:false},
    {icon:"🪑", img:"fs-sleep-03-propped-upright.jpg", vid:"fs-sleep-03-propped-upright.mp4", title:"นอนหนุนสูง", desc:"เก้าอี้ปรับเอนหรือหมอนหนุนเป็นชั้น ๆ มักปวดน้อยกว่านอนราบในระยะที่ปวดมาก", avoid:false},
    {icon:"🌙", img:"fs-sleep-04-night-waking-mobility.jpg", vid:"fs-sleep-04-night-waking-mobility.mp4", title:"ถ้าอาการติดทำให้ตื่น", desc:"ลองแกว่งแขนแบบลูกตุ้มเบา ๆ หรือขยับช้า ๆ ดีกว่านอนนิ่งรอให้หายเอง", avoid:false},
    {icon:"🚫", img:"", vid:"", title:"อย่านอนทับไหล่ข้างที่ปวด", desc:"การกดทับไหล่ข้างที่มีอาการโดยตรงเป็นสาเหตุที่พบบ่อยที่สุดของการตื่นกลางดึก", avoid:true}
  ],

  selfcareTitle:"การดูแลตัวเองในชีวิตประจำวัน",
  selfcareIntro:"วิธีง่าย ๆ ในการดูแลอาการและทำกิจวัตรประจำวันที่บ้าน",
  selfcare:[
    {icon:"🌡️", img:"fs-selfcare-01-ice-or-heat.jpg", vid:"fs-selfcare-01-ice-or-heat.mp4", title:"ประคบร้อนหรือเย็น", desc:"ใช้แผ่นประคบเย็นหรือแผ่นประคบร้อนห่อผ้าขนหนู นานไม่เกิน 20 นาที ช่วยลดอาการปวดเมื่อยกล้ามเนื้อ เลือกแบบที่รู้สึกสบายกว่าสำหรับคุณ"},
    {icon:"🙌", img:"fs-selfcare-02-gentle-movement.jpg", vid:"fs-selfcare-02-gentle-movement.mp4", title:"ขยับเบา ๆ อย่างสม่ำเสมอ", desc:"การหยุดขยับแขนไปเลยจะทำให้ข้อติดมากขึ้น ยืดแค่พอตึงเบา ๆ หยุดทันทีถ้าปวดแปลบ และหลีกเลี่ยงการเอื้อมหรือกระตุกแขนแรง ๆ"},
    {icon:"👕", img:"fs-selfcare-03-getting-dressed.jpg", vid:"fs-selfcare-03-getting-dressed.mp4", title:"การแต่งตัว", desc:"ใส่เสื้อโดยสอดแขนข้างที่บาดเจ็บก่อน และถอดเสื้อโดยดึงแขนข้างที่บาดเจ็บออกเป็นลำดับสุดท้าย เลือกเสื้อหลวม ๆ เสื้อผ่าหน้า และรองเท้าแบบสวม จะช่วยให้ง่ายขึ้น"},
    {icon:"🚿", img:"fs-selfcare-04-showering.jpg", vid:"fs-selfcare-04-showering.mp4", title:"การอาบน้ำ", desc:"ใช้แขนข้างที่ดีในการฟอกและล้าง ปล่อยแขนข้างที่บาดเจ็บห้อยตามสบาย ใช้ฟองน้ำด้ามยาวช่วยเอื้อมถึงหลัง แล้วซับให้แห้งแทนการถู"}
  ],

  sosTitle:"เมื่อไรควรขอความช่วยเหลือ",
  sosSub:"หากคุณสังเกตเห็นอาการใดด้านล่างนี้ ให้ติดต่อทีมผู้ดูแลทันที",
  sosInfoNote:"ภาวะข้อไหล่ติดทำให้ปวดและใช้เวลานาน แต่ไม่ใช่ภาวะอันตราย อาการด้านล่างนี้ไม่ใช่รูปแบบปกติของโรค และอาจหมายถึงมีปัญหาอื่นเกิดขึ้น",
  flagsHardLabel:"ควรมาพบแพทย์ก่อนนัด",
  flagsHard:[
    "อ่อนแรงที่เพิ่งเกิดขึ้น แขนตกหรือยกไม่ขึ้น",
    "มีไข้ ผิวแดง หรือบวมมากรอบข้อไหล่",
    "เพิ่งหกล้มหรือได้รับบาดเจ็บที่ไหล่"
  ],
  escalateTitle:"สิ่งที่แพทย์อาจพิจารณาเพิ่มเติม",
  escalateIntro:"การตัดสินใจของแพทย์ ไม่ใช่ตัวเลือกในแอป",
  escalate:[
    "การฉีดยาเข้าข้อ เมื่อความปวดเป็นอุปสรรคต่อการทำกายภาพบำบัด",
    "การฉีดยาร่วมกับกายภาพบำบัด แทนการใช้อย่างใดอย่างหนึ่งเพียงอย่างเดียว",
    "ทางเลือกยาฉีดชนิดอื่นในกรณีที่ไม่เหมาะกับสเตียรอยด์"
  ],
  escalateNoDose:"แอปนี้ไม่ให้คำแนะนำเรื่องยาหรือขนาดยา",
  appDisclaimer:"แอปนี้ให้คำแนะนำทั่วไปเท่านั้น ไม่สามารถใช้แทนคำแนะนำจากแพทย์หรือนักกายภาพบำบัดของคุณได้ กรุณาปฏิบัติตามคำแนะนำของทีมผู้ดูแลเสมอ",
  callBtnPrefix:"โทร ",

  onboardTitle:"ยินดีต้อนรับ — มาตั้งค่าการฟื้นฟูของคุณกัน",
  onboardLead:"ภาวะข้อไหล่ติดดีขึ้นด้วยความเร็วที่ต่างกันในแต่ละคน แอปนี้จึงติดตามอาการของคุณ แทนที่จะใช้ตารางเวลาตายตัว",
  onboardOnsetLabel:"ไหล่เริ่มมีอาการเมื่อไร",
  onboardOnsetHint:"ระบุเดือนและปีก็เพียงพอ ข้อมูลนี้ใช้เป็นบันทึกเท่านั้น ไม่ได้เป็นตัวกำหนดโปรแกรมของคุณ",
  onboardHNLabel:"เลขประจำตัวผู้ป่วย (HN)",
  onboardHNHint:"ช่วยให้เจ้าหน้าที่ค้นหาเวชระเบียนของคุณได้เร็วขึ้น",
  monthNames:["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
  monthNamesShort:["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],
  selectMonth:"เดือน", selectYear:"ปี",
  consentTitle:"ความเป็นส่วนตัวของคุณ",
  consentText:"เมื่อดำเนินการต่อ ระบบจะบันทึก HN คะแนนไหล่ และความก้าวหน้าการออกกำลังกายของคุณ และแบ่งปันกับทีมผู้ดูแลเท่านั้น ตาม PDPA เพื่อใช้ติดตามการดูแลของคุณเท่านั้น ข้อมูลจะถูกส่งเดือนละครั้งเมื่อคุณทำแบบประเมินเสร็จ จึงควรใช้โทรศัพท์ของคุณเองเพื่อความเป็นส่วนตัว",
  consentCheckboxLabel:"ฉันได้อ่านและยอมรับข้อความข้างต้นแล้ว",
  consentValidation:"กรุณายืนยันเพื่อดำเนินการต่อ",
  onboardSave:"บันทึกและดำเนินการต่อ",
  addHomeTitle:"เพิ่มลงหน้าจอหลักหรือไม่",
  addHomeBody:"เพิ่มแอปนี้ลงหน้าจอหลักเพื่อเปิดใช้งานได้ในแตะเดียว เหมือนแอปทั่วไป",
  addHomeAccept:"เพิ่มลงหน้าจอหลัก", addHomeDecline:"ไว้ภายหลัง", addHomeGotIt:"เข้าใจแล้ว",
  addHomeIOSSteps:"แตะไอคอนแชร์ในเบราว์เซอร์ แล้วเลือก \"เพิ่มไปยังหน้าจอโฮม\"",
  addHomeGenericSteps:"มองหา \"เพิ่มลงหน้าจอหลัก\" หรือ \"ติดตั้งแอป\" ในเมนูของเบราว์เซอร์"
}
};

/* ============================= STATE ============================= */
let STATE = {
  lang:"th", hn:"", onsetMonth:null, onsetYear:null, consentGiven:false,
  logDate:null, doneIds:[], adherence:{}, measures:[], homeScreenPromptShown:false
};

/* =====================================================================
   MEDIA DISCOVERY
   Upload a file into media/ under the name the topic expects and it
   appears. There is no list to maintain: the page asks the server
   whether each file is there and remembers the answer.

   A static page cannot read its own folder, so each candidate name gets
   one HEAD request — a few hundred bytes of headers, not the file. The
   answers are cached for the session, and the affected tabs re-render
   once the replies arrive, so a topic never flashes an empty box while
   a probe is in flight. Files are looked up under media/.

   media/README.md lists the filename every topic expects.
   ===================================================================== */
const IMAGE_DIR = "media/";
const VIDEO_DIR = "media/";

const MEDIA_FOUND = new Map();    // filename -> true | false, once known
const MEDIA_ASKED = new Set();    // filename -> a probe is already in flight
let mediaRepaintTimer = null;

const hasImage = f => !!f && MEDIA_FOUND.get(f) === true;
const hasVideo = f => !!f && MEDIA_FOUND.get(f) === true;

/* HEAD is enough on any ordinary static host. A host that refuses it
   (405) still answers a one-byte ranged GET, so fall back to that
   rather than leaving the media invisible. */
async function mediaProbe(url){
  try{
    const head = await fetch(url, {method:'HEAD'});
    if(head.ok) return true;
    if(head.status !== 405) return false;
  }catch(e){ /* host errored on HEAD itself — fall through to the ranged GET below */ }
  try{
    const ranged = await fetch(url, {headers:{Range:'bytes=0-0'}});
    return ranged.ok;
  }catch(e){ return false; }
}

function discoverMedia(file, dir){
  if(!file || MEDIA_FOUND.has(file) || MEDIA_ASKED.has(file)) return;
  MEDIA_ASKED.add(file);
  mediaProbe(dir + file).then(found=>{
    MEDIA_ASKED.delete(file);
    MEDIA_FOUND.set(file, found);
    if(found) scheduleMediaRepaint();
  });
}

/* One repaint for a burst of replies, rather than one per file. Only the
   tabs that carry media need it, and re-rendering them cannot start a
   loop: by then every filename has a cached answer. */
function scheduleMediaRepaint(){
  if(mediaRepaintTimer) return;
  mediaRepaintTimer = setTimeout(()=>{
    mediaRepaintTimer = null;
    renderExerciseList(); renderSleep(); renderSelfCare();
  }, 80);
}
/* For values dropped into an HTML attribute, including the data-arg
   that carries a filename through to the player. */
const escapeAttr = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ==================== EVENT DELEGATION (no inline handlers) ====================
   Every interactive element in this app is wired through data-action (and an
   optional data-arg) instead of onclick/onkeydown, so the CSP can drop
   script-src 'unsafe-inline'. A click anywhere delegates to the named
   top-level function; data-arg is passed through as a string unless it looks
   like a plain number (the UCLA score buttons pass numbers, e.g.
   setDraftUclaPain(3) — as a string that would break the strict === compare
   renderMeasure() uses to highlight the selected option, and would corrupt
   the score math). playVideo(btn, file) is special-cased because its first
   argument is the button element itself, not something data-arg can carry. */
// Only these may be triggered from markup. Looking names up on `window`
// without a list would let injected HTML (no script needed) call any global
// function — e.g. <button data-action="close">.
const ACTIONS = new Set([
  'setLang', 'switchTab', 'handleResetApp', 'saveOnboard',
  'openMeasure', 'measureNext', 'measureBack', 'cancelMeasure',
  'setDraftUclaPain', 'setDraftUclaFunc', 'setDraftUclaStrength', 'setDraftUclaSat',
  'acceptAddHome', 'closeAddHomePrompt', 'toggleExercise', 'playVideo'
]);
function dispatchAction(el, action, arg){
  if(!ACTIONS.has(action)) return;
  if(action === 'playVideo'){ playVideo(el, arg); return; }
  const fn = window[action];
  if(typeof fn !== 'function') return;
  if(arg === undefined){ fn(); return; }
  fn(/^-?\d+(\.\d+)?$/.test(arg) ? Number(arg) : arg);
}
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-action]');
  if(el) dispatchAction(el, el.dataset.action, el.dataset.arg);
});
// role="checkbox" is currently unique to the exercise-toggle control, which
// is the only element that needs Space/Enter to act like a click (native
// <button>s already get this for free from the browser).
document.addEventListener('keydown', e=>{
  if(e.key !== ' ' && e.key !== 'Enter') return;
  const el = e.target.closest('[role="checkbox"][data-action]');
  if(!el) return;
  e.preventDefault();
  dispatchAction(el, el.dataset.action, el.dataset.arg);
});
document.addEventListener('contextmenu', e=>{
  if(e.target.closest('[data-no-contextmenu]')) e.preventDefault();
});

function todayISO(){ return new Date().toISOString().slice(0,10); }
function checkDayRollover(){
  if(STATE.logDate !== todayISO()){ STATE.logDate = todayISO(); STATE.doneIds = []; return true; }
  return false;
}
/* An HN is a hospital number, so letters, digits and dashes are all it can be.
   Stripping everything else keeps stray input out of the record and, because
   the HN is written into a spreadsheet cell downstream, also drops the leading
   =, +, - and @ that a spreadsheet would otherwise read as a formula. */
function sanitiseHN(value){
  return String(value || '')
    .replace(/[^A-Za-z0-9-]/g, '')
    .replace(/^[-]+/, '')
    .slice(0, 20);
}

/* Saved state is read back into a live object, so a half-written or edited
   entry could otherwise throw on the first render and leave the patient with a
   blank screen and no way to reach the reset button. Anything of the wrong
   shape is dropped and the app starts clean instead. */
function sanitiseState(saved){
  if(!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
  const out = {};
  if(saved.lang === 'en' || saved.lang === 'th') out.lang = saved.lang;
  out.hn = sanitiseHN(saved.hn);
  const mo = parseInt(saved.onsetMonth, 10), yr = parseInt(saved.onsetYear, 10);
  out.onsetMonth = (mo >= 1 && mo <= 12) ? mo : null;
  out.onsetYear  = (yr >= 1900 && yr <= 2200) ? yr : null;
  out.consentGiven = !!saved.consentGiven;
  out.homeScreenPromptShown = !!saved.homeScreenPromptShown;
  out.logDate = typeof saved.logDate === 'string' ? saved.logDate : null;
  out.doneIds = Array.isArray(saved.doneIds) ? saved.doneIds : [];
  out.adherence = (saved.adherence && typeof saved.adherence === 'object'
    && !Array.isArray(saved.adherence)) ? saved.adherence : {};
  out.measures = Array.isArray(saved.measures) ? saved.measures.filter(m =>
    m && typeof m === 'object'
    && m.ucla && typeof m.ucla === 'object'
    && m.rom  && typeof m.rom  === 'object'
    && typeof m.rom.flexion === 'number'
    && typeof m.ucla.pain === 'number' && typeof m.ucla.func === 'number'
    && typeof m.ucla.strength === 'number' && typeof m.ucla.satisfaction === 'number'
  ) : [];
  return out;
}

async function loadState(){
  try{
    const raw = localStorage.getItem('frozenshoulder-app-state');
    if(raw) STATE = Object.assign(STATE, sanitiseState(JSON.parse(raw)));
  }catch(e){}
  checkDayRollover();
}
async function saveState(){
  try{ localStorage.setItem('frozenshoulder-app-state', JSON.stringify(STATE)); }catch(e){ console.error('save failed', e); }
}
function handleResetApp(){
  if(!confirm(CONTENT[STATE.lang].resetConfirm)) return;
  try{ localStorage.removeItem('frozenshoulder-app-state'); }catch(e){}
  location.reload();
}
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) return;
  if(checkDayRollover()){ saveState(); renderAll(); }
  trySyncPending();
});
window.addEventListener('online', trySyncPending);

function t(key){ return CONTENT[STATE.lang][key]; }
function applyStaticI18n(){
  document.querySelectorAll('[data-t]').forEach(el=>{
    const val = CONTENT[STATE.lang][el.getAttribute('data-t')];
    if(typeof val === 'string') el.textContent = val;
  });
  document.documentElement.lang = STATE.lang;
  ['btn-lang-en','ob-lang-en'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.classList.toggle('active', STATE.lang==='en');
  });
  ['btn-lang-th','ob-lang-th'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.classList.toggle('active', STATE.lang==='th');
  });
}
function setLang(lang){
  STATE.lang = lang; saveState();
  buildOnsetSelects();
  renderAll();
  if(!document.getElementById('measure-modal').classList.contains('hidden')) renderMeasure();
}

/* ============================= CLINIC ============================= */
/* Doctor's name is per-language and lives in CONTENT[lang].surgeonName */
const CLINIC_PHONE = "02 839 6000";
/* Shared secret checked by the Apps Script before it writes a row. This stops
   casual and automated posting to your sheet. It is NOT strong security: the
   token ships inside this file and anyone who views source can read it. Its
   job is to raise the cost of abuse, not to make it impossible. Change it here
   and in apps-script-backend.gs together. */
const APP_TOKEN = "mBXvt5FYGIgaShK6NNu8_dfTAs508xRD";
const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyJXgcm0q20rPqoYgjZaq3eelyku_BbXbn_xFWIypn5Kq4tDUVtuwjQmM-z44nztlyv/exec";

let deferredInstallPrompt = null;
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const IS_STANDALONE = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredInstallPrompt = e; });

function maybeShowAddHomePrompt(){
  if(IS_STANDALONE || STATE.homeScreenPromptShown || !STATE.consentGiven) return;
  document.getElementById('addhome-modal').classList.remove('hidden');
}
async function acceptAddHome(){
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    try{ await deferredInstallPrompt.userChoice; }catch(e){}
    deferredInstallPrompt = null; closeAddHomePrompt(); return;
  }
  document.getElementById('addhome-buttons').classList.add('hidden');
  document.getElementById('addhome-steps-text').textContent = IS_IOS ? t('addHomeIOSSteps') : t('addHomeGenericSteps');
  document.getElementById('addhome-steps').classList.remove('hidden');
}
function closeAddHomePrompt(){
  document.getElementById('addhome-modal').classList.add('hidden');
  STATE.homeScreenPromptShown = true; saveState();
  if(!latestMeasure()) openMeasure();
}

/* ================== SYMPTOM-DRIVEN STAGE LOGIC ==================
   Stage comes from the UCLA domains, never from a calendar. Daily
   check-ins refresh pain and function, so the stage responds between
   full assessments. Flexion/strength/satisfaction come from the last
   full assessment because they need the arc and a strength grade. */
function latestMeasure(){ return STATE.measures.length ? STATE.measures[STATE.measures.length-1] : null; }
function baselineMeasure(){ return STATE.measures.length ? STATE.measures[0] : null; }

/* The UCLA scale is completed once a month, not daily. Everything the app
   shows comes from the most recent monthly assessment. */
function effectiveUcla(){
  const m = latestMeasure();
  if(!m) return null;
  return { u:m.ucla, flexionDeg:m.rom.flexion };
}

const DAY_MS = 86400000;
function daysSinceLastMeasure(){
  const m = latestMeasure();
  if(!m) return null;
  const then = new Date(m.date + 'T00:00:00');
  const now = new Date(todayISO() + 'T00:00:00');
  return Math.round((now - then) / DAY_MS);
}
/* The UCLA scale is completed once a month. Frozen shoulder changes over
   weeks to months, so a monthly cadence matches the pace of the condition
   and keeps the burden on the patient low. */
const ASSESS_INTERVAL_DAYS = 30;
function assessmentDue(){
  const d = daysSinceLastMeasure();
  return d === null ? true : d >= ASSESS_INTERVAL_DAYS;
}
/* Whole months *past the due date*, not months since the last assessment.
   An assessment recorded 60 days ago became due at day 30, so it is one
   month overdue, not two. */
function monthsOverdue(){
  const d = daysSinceLastMeasure();
  if(d === null) return 0;
  return Math.max(0, Math.floor(d / ASSESS_INTERVAL_DAYS) - 1);
}
function formatDate(iso){
  const c = CONTENT[STATE.lang];
  const dt = new Date(iso + 'T00:00:00');
  return dt.getDate() + ' ' + c.monthNamesShort[dt.getMonth()];
}
function nextDueDate(){
  const m = latestMeasure();
  if(!m) return '';
  const dt = new Date(new Date(m.date + 'T00:00:00').getTime() + ASSESS_INTERVAL_DAYS*DAY_MS);
  return formatDate(dt.toISOString().slice(0,10));
}
function currentTotal(){
  const e = effectiveUcla();
  return e ? uclaTotal(e.u, e.flexionDeg) : null;
}
/* Direction of travel across the last two assessments. One UCLA pain point
   is treated as roughly equivalent to five degrees of elevation. */
function romTrend(){
  const ms = STATE.measures;
  if(ms.length < 2) return 0;
  const a = ms[ms.length-2], b = ms[ms.length-1];
  const d = (b.rom.flexion - a.rom.flexion) + (b.ucla.pain - a.ucla.pain) * 5;
  if(d > 8) return 1;
  if(d < -8) return -1;
  return 0;
}

/* Pre-freezing sits at the front of the course only. Once a shoulder has
   been through severe pain or lost elevation below 90 degrees, it cannot be
   pre-freezing again, however good it later looks. */
function everPastPreFreezing(){
  return STATE.measures.some(m => m.ucla.pain <= 4 || flexionPoints(m.rom.flexion) <= 2);
}

/* Stage is read primarily from time since symptom onset, following the
   typical clinical course: pre-freezing months 1-3, freezing months 4-9,
   frozen months 10-14, thawing month 15 on. When no onset date is on file
   the stage falls back to an estimate from the patient's own symptoms. */
function currentStageIndex(){
  const mo = monthsSinceOnset();
  if(mo !== null){
    if(mo <= 2)  return 0;   // Pre-freezing: months 1-3
    if(mo <= 8)  return 1;   // Freezing: months 4-9
    if(mo <= 13) return 2;   // Frozen: months 10-14
    return 3;                // Thawing: month 15 on
  }

  const e = effectiveUcla();
  if(!e) return 0;
  const pain = e.u.pain, func = e.u.func, fx = flexionPoints(e.flexionDeg);

  if(pain <= 4) return 1;   // Freezing: pain at rest or constant
  if(fx <= 2)   return 2;   // Frozen: cannot raise the arm past 90 degrees

  const nearNormal = fx >= 4 && func >= 8;
  const total = uclaTotal(e.u, e.flexionDeg);
  // Pre-freezing describes a shoulder that is sore and becoming touchy — not
  // one that is essentially well. An excellent score rules it out.
  if(nearNormal && total < 34 && !everPastPreFreezing() && romTrend() <= 0) return 0;
  return 3;                 // Thawing
}

/** Recovered: full forward elevation and pain that is absent or mild
    (UCLA pain domain 8 or 10 — "occasional and slight" or "none"),
    regardless of what stage the calendar would otherwise suggest. */
function isRecovered(){
  const e = effectiveUcla();
  return e !== null && e.flexionDeg >= 150 && e.u.pain >= 8;
}

/* ============================= ARC DIAL ============================= */
function arcPath(cx, cy, r, frac){
  if(frac <= 0.001) return "";
  const a = frac * Math.PI;
  return `M ${cx.toFixed(2)} ${(cy+r).toFixed(2)} A ${r} ${r} 0 0 0 ${(cx + r*Math.sin(a)).toFixed(2)} ${(cy + r*Math.cos(a)).toFixed(2)}`;
}
function arcSvg(frac, key, max){
  const cx=60, cy=60, r=44, a=frac*Math.PI;
  const hx = cx + r*Math.sin(a), hy = cy + r*Math.cos(a);
  return `<svg viewBox="0 0 120 120" data-arc="${key}" data-max="${max}">
    <path class="arc-track" d="${arcPath(cx,cy,r,1)}"/>
    <path class="arc-now" d="${arcPath(cx,cy,r,frac)}"/>
    <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(2)}" y2="${hy.toFixed(2)}" stroke="#2E7D6E" stroke-width="1.5" opacity="0.3"/>
    <circle cx="${cx}" cy="${cy}" r="2.5" fill="#B7BEC9"/>
    <circle cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" r="8" fill="#2E7D6E" stroke="#fff" stroke-width="2.5"/>
  </svg>`;
}
function moveValueLabel(m, v){ return m.key === 'ir' ? t('irLandmarks')[v] : (v + m.unit); }

/* ============================= MEDIA SLOTS =============================
   A topic only takes up room once its file is actually on the server.
   Nothing there means nothing rendered — no placeholder, no reserved
   space — so a half-filled library reads as a clean list rather than a
   page of empty boxes.

   With a video, the slot is a thumbnail carrying a play badge: the still if
   one was uploaded, otherwise a plain panel. Tapping it swaps in the player.
   An image on its own is just the image, with no badge to press. */
const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

function mediaSlot(imgFile, vidFile){
  // Asking costs nothing once an answer is cached, so every render is also
  // the point at which a newly uploaded file gets noticed.
  discoverMedia(imgFile, IMAGE_DIR);
  discoverMedia(vidFile, VIDEO_DIR);

  const img = hasImage(imgFile), vid = hasVideo(vidFile);
  if(!img && !vid) return '';

  const still = img ? `<img src="${IMAGE_DIR}${imgFile}" alt="" loading="lazy" draggable="false" data-no-contextmenu="1">` : '';
  if(!vid) return `<div class="media">${still}</div>`;

  return `<div class="media">
    <button class="media-thumb ${img ? '' : 'no-still'}" type="button"
            aria-label="${escapeAttr(t('mediaWatch'))}" data-action="playVideo" data-arg="${escapeAttr(vidFile)}">
      ${still}
      <span class="media-play">${ICON_PLAY}</span>
    </button>
  </div>`;
}

function playVideo(btn, file){
  const wrap = btn.closest('.media');
  wrap.innerHTML = `<video controls playsinline preload="metadata" src="${VIDEO_DIR}${file}"
    controlsList="nodownload noremoteplayback" disablePictureInPicture
    data-no-contextmenu="1"></video>`;
  wrap.querySelector('video').play().catch(()=>{});
}

/** Whole months elapsed since the recorded month/year of symptom onset. */
function monthsSinceOnset(){
  if(!STATE.onsetMonth || !STATE.onsetYear) return null;
  const now = new Date();
  const m = (now.getFullYear() - (+STATE.onsetYear)) * 12 + (now.getMonth() + 1 - (+STATE.onsetMonth));
  return m < 0 ? null : m;
}
function onsetLabel(){
  if(!STATE.onsetMonth || !STATE.onsetYear) return '';
  return t('onsetPrefix') + t('monthNames')[(+STATE.onsetMonth) - 1] + ' ' + STATE.onsetYear;
}

/* Stage palette. Deliberately narrative: stage 1 warming irritation,
   stage 2 peak inflammation, stage 3 cold and stuck, stage 4 recovery. */
const PHASE_THEME = [
  { main:'#C08A2E', soft:'#FBF3E2', ink:'#7A5410', ring:'rgba(192,138,46,0.18)' },
  { main:'#C25A3E', soft:'#FBEDE9', ink:'#7E3626', ring:'rgba(194,90,62,0.18)'  },
  { main:'#3D6E96', soft:'#EAF1F7', ink:'#254764', ring:'rgba(61,110,150,0.18)' },
  { main:'#2E7D6E', soft:'#E9F4F1', ink:'#1D5349', ring:'rgba(46,125,110,0.18)' }
];
function applyPhaseTheme(stage){
  const p = PHASE_THEME[stage] || PHASE_THEME[3];
  const r = document.documentElement.style;
  r.setProperty('--phase', p.main);
  r.setProperty('--phase-soft', p.soft);
  r.setProperty('--phase-ink', p.ink);
  r.setProperty('--phase-ring', p.ring);
}

/* ============================= HOME ============================= */
function renderHome(){
  const c = CONTENT[STATE.lang];
  const e = effectiveUcla();
  const stage = currentStageIndex();
  const CIRC = 440;

  const dayEl = document.getElementById('ring-day');
  const labelEl = document.getElementById('ring-daylabel');
  const gradeEl = document.getElementById('ring-grade');
  const chipEl = document.getElementById('ring-phase-chip');
  const descEl = document.getElementById('ring-phase-desc');
  const ringFg = document.getElementById('ring-fg');

  // Home shows how long this has been going on and which stage they are in.
  // The UCLA score lives on the Progress tab.
  const months = monthsSinceOnset();
  if(months === null){
    dayEl.innerHTML = "—";
    labelEl.textContent = c.durationUnknown;
  } else {
    dayEl.innerHTML = String(months);
    labelEl.textContent = months === 1 ? c.durationLabelOne : c.durationLabel;
  }
  gradeEl.textContent = onsetLabel();
  gradeEl.style.color = 'var(--muted)';
  gradeEl.style.textTransform = 'none';
  gradeEl.style.letterSpacing = '0';
  gradeEl.style.fontWeight = '600';

  if(!e){
    chipEl.textContent = c.noBaselineChip;
    descEl.textContent = c.noBaselineDesc;
    ringFg.style.strokeDashoffset = CIRC;
  } else if(isRecovered()){
    chipEl.textContent = c.recoveredChip;
    descEl.textContent = c.recoveredDesc;
    ringFg.style.strokeDashoffset = 0;
  } else {
    chipEl.textContent = c.phaseNames[stage] + " · " + c.phaseTitles[stage];
    // The months are shown as context — currentStageIndex() already used them
    // as the primary gate whenever an onset date is on file.
    descEl.innerHTML = `<b>${c.phaseHeadline[stage]}</b><br>${c.phaseDesc[stage]}`
      + `<br><span style="font-size:11.5px;color:var(--dim,#8a8a8a);">${c.phaseMonths[stage]}</span>`;
    ringFg.style.strokeDashoffset = CIRC * (1 - (stage + 1) / 4);
  }

  document.getElementById('goals-title').textContent = c.goalsTitleByPhase[stage];
  document.getElementById('goals-sub').textContent = c.goalsSub;
  document.getElementById('goals-list').innerHTML = c.goalsByPhase[stage]
    .map((g,i)=>`<div class="goal-item"><div class="goal-num">${i+1}</div><div>${g}</div></div>`).join('');

  document.getElementById('home-stepper').innerHTML = c.phaseShort.map((label,i)=>{
    let cls = 'step';
    if(e){ if(i < stage) cls += ' done'; else if(i === stage) cls += ' current'; }
    return `<div class="${cls}"><div class="dot">${i+1}</div><div class="lbl">${label}</div></div>`;
  }).join('');

  document.getElementById('surgeon-name').textContent = c.surgeonName;
  renderIdBar();
}

/* The one nudge in the app: the monthly UCLA assessment. Green once it is
   done, amber once the interval has passed. */
/* HN and current stage stay visible at the top of every tab. */
function renderIdBar(){
  const c = CONTENT[STATE.lang];
  const stage = currentStageIndex();
  applyPhaseTheme(stage);
  // Most patients type the number as it is printed on the card, "HN-004512",
  // so prefixing it again would read "HN: HN-004512".
  document.getElementById('header-hn').textContent =
    !STATE.hn ? '' : (/^HN/i.test(STATE.hn) ? STATE.hn : c.hnPrefix + STATE.hn);
  const ph = document.getElementById('header-phase');
  if(!latestMeasure()){
    ph.textContent = c.noBaselineChip;
  } else if(isRecovered()){
    ph.textContent = c.recoveredChip;
  } else {
    ph.textContent = c.phaseNames[stage] + ' · ' + c.phaseTitles[stage];
  }
  // Older browsers without :has() would leave an empty coloured strip behind.
  document.getElementById('idbar').hidden = !ph.textContent;
}

function renderWeeklyReminder(){
  const c = CONTENT[STATE.lang];
  const wrap = document.getElementById('weekly-reminder');
  const m = latestMeasure();

  if(!m){
    wrap.innerHTML = `<div class="weekly due">
      <div class="weekly-kicker">${c.weeklyDueKicker}</div>
      <div class="weekly-title">${c.weeklyNoneTitle}</div>
      <div class="weekly-body">${c.weeklyNoneBody}</div>
      <button class="primary-btn" data-action="openMeasure">${c.weeklyDueBtn}</button>
    </div>`;
    return;
  }
  if(assessmentDue()){
    const over = monthsOverdue();
    const overTpl = over === 1 ? c.weeklyOverdueTitleOne : c.weeklyOverdueTitle;
    const title = over >= 1 ? overTpl.replace('{n}', over) : c.weeklyDueTitle;
    const body  = over >= 1 ? c.weeklyOverdueBody : c.weeklyDueBody;
    wrap.innerHTML = `<div class="weekly due">
      <div class="weekly-kicker">${c.weeklyDueKicker}</div>
      <div class="weekly-title">${title}</div>
      <div class="weekly-body">${body}</div>
      <button class="primary-btn" data-action="openMeasure">${c.weeklyDueBtn}</button>
    </div>`;
    return;
  }
  wrap.innerHTML = `<div class="weekly done">
    <div class="weekly-kicker">${c.weeklyDoneKicker}</div>
    <div class="weekly-title">${c.weeklyDoneTitle}</div>
    <div class="weekly-body">${c.weeklyDoneBody.replace('{d}', formatDate(m.date)).replace('{next}', nextDueDate())}</div>
    <button class="primary-btn" data-action="openMeasure">${c.weeklyDoneBtn}</button>
  </div>`;
}

/* ===================== SHARED UCLA OPTION LIST ===================== */
function uclaOptionList(opts, selected, handler, locked){
  return `<div class="ucla-opts">` + opts.map(o=>
    `<button class="ucla-opt ${selected===o.v?'selected':''} ${locked?'locked':''}"
      ${locked?'':`data-action="${handler}" data-arg="${o.v}"`}>
      <span class="ucla-pts">${o.v}</span><span>${o.t}</span></button>`
  ).join('') + `</div>`;
}

function makeRecordId(){
  if(window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Fallback for older WebViews without crypto.randomUUID: not
  // cryptographically strong, but only needs to be unique per device, not
  // unguessable — it is a dedupe key, not a credential.
  return 'r-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/* No `mode:'no-cors'` here on purpose: that mode makes the response opaque,
   so there is no way to tell a real save from a dropped request.

   A record counts as delivered only on a *readable* 2xx reply that is not an
   Apps Script HTML error page and not an explicit {"ok":false}. Requiring an
   exact {"ok":true} instead would be wrong for the deployed backend, whose
   reply format predates this code: any other reply ("OK", {"status":...})
   would leave the record pending, and every retry would append the same
   assessment to the sheet again, since that backend does not dedupe.

   Retries are the other duplicate risk: a request can reach the backend and
   still fail on the way back (e.g. the connection drops mid-response). So a
   record is never sent twice at once, and after a failed attempt it waits
   before trying again (1 min, doubling, capped at a day) rather than
   re-sending on every app focus. While the device reports itself offline no
   attempt is made or counted, so reconnecting still retries straight away.
   clientRecordId lets a backend that dedupes on it (see
   backend/apps-script-backend.gs) absorb whatever duplicates remain. */
const syncInFlight = new Set();
const SYNC_FIELDS_LOCAL_ONLY = ['syncAttempts', 'lastSyncAttemptAt', 'syncedAt'];
function syncBackoffMs(attempts){ return Math.min(60000 * 2 ** Math.max(attempts - 1, 0), DAY_MS); }

async function syncOne(bucket, key){
  const entry = STATE.measures[key];
  if(!entry || entry.synced) return;
  if(!SHEET_WEBHOOK_URL || SHEET_WEBHOOK_URL.indexOf("PASTE_YOUR") === 0) return;
  if(navigator.onLine === false) return;
  if(!entry.clientRecordId) entry.clientRecordId = makeRecordId();
  if(syncInFlight.has(entry.clientRecordId)) return;
  if(entry.lastSyncAttemptAt &&
     Date.now() - Date.parse(entry.lastSyncAttemptAt) < syncBackoffMs(entry.syncAttempts || 0)) return;

  syncInFlight.add(entry.clientRecordId);
  entry.syncAttempts = (entry.syncAttempts || 0) + 1;
  entry.lastSyncAttemptAt = new Date().toISOString();
  saveState();
  const payload = Object.assign({token:APP_TOKEN, recordType:bucket}, entry);
  SYNC_FIELDS_LOCAL_ONLY.forEach(f => delete payload[f]);
  try{
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });
    const isHtml = (res.headers.get('Content-Type') || '').includes('text/html');
    const body = await res.json().catch(()=>null);
    if(res.ok && !isHtml && !(body && body.ok === false)){
      entry.synced = true;
      entry.syncedAt = new Date().toISOString();
      saveState();
    }
  }catch(err){
    console.warn('Sync failed, will retry later:', err);
  }finally{
    syncInFlight.delete(entry.clientRecordId);
  }
}
async function trySyncPending(){
  for(let i=0;i<STATE.measures.length;i++){ if(!STATE.measures[i].synced) await syncOne('measures', i); }
  renderProgress();
}

/* ============================= EXERCISES =============================
   Group 0 gentle mobility · 1 stretches · 2 strengthening · 3 return to life.
   Pre-freezing and freezing share the gentle programme; what differs between
   them is dose and intent, which the stage text carries. */
const EXERCISE_GROUPS = [ [0], [0], [0,1], [1,2] ];
function exerciseGroupsFor(stage){
  if(stage !== 3) return EXERCISE_GROUPS[stage];
  // Late thawing: swap the gentle stretches for return-to-life work.
  const tot = currentTotal();
  return (tot !== null && tot >= 29) ? [2,3] : [1,2];
}

function renderExerciseList(){
  const c = CONTENT[STATE.lang];
  const i = currentStageIndex();
  document.getElementById('ex-phase-def').innerHTML =
    `<div class="ex-caution">⚠️ ${c.exCaution}</div>`;
  document.getElementById('today-reminders').innerHTML =
    c.todayReminders[i].map(r=>`• ${r}`).join('<br><br>');

  const list = exerciseGroupsFor(i).flatMap(src => c.exercises[src]);
  const doneSet = new Set(STATE.doneIds);
  const doneCount = list.filter(x=>doneSet.has(x.id)).length;

  document.getElementById('ex-progress-fill').style.width = (list.length ? (doneCount/list.length*100) : 0) + '%';
  document.getElementById('ex-progress-label').textContent = `${doneCount} / ${list.length}`;

  document.getElementById('ex-list').innerHTML = list.map((x,idx)=>{
    const done = doneSet.has(x.id);
    return `<div class="ex-row">
      <div class="ex-check ${done?'checked':''}" role="checkbox" tabindex="0"
        aria-checked="${done}" aria-label="${escapeAttr(x.name)}"
        data-action="toggleExercise" data-arg="${escapeAttr(x.id)}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L19 7"/></svg>
      </div>
      <div class="ex-icon">${icon(x.ic)}<span class="ex-num">${idx+1}</span></div>
      <div class="ex-body">
        <div class="ex-name ${done?'checked-text':''}">${x.name}</div>
        <div class="ex-desc">${x.desc}</div>
        <div class="ex-dose">${x.dose}</div>
        ${x.cue ? `<div class="ex-cue">${x.cue}</div>` : ''}
        ${mediaSlot(x.img, x.vid)}
      </div>
    </div>`;
  }).join('');

  document.getElementById('zone-list').innerHTML = c.zones.map(z=>
    `<div class="zone-row"><div class="zone-text zone-text-${z[0]}">${z[2]}</div></div>`
  ).join('');
}
function toggleExercise(id){
  const s = new Set(STATE.doneIds);
  s.has(id) ? s.delete(id) : s.add(id);
  STATE.doneIds = [...s];
  recordAdherence();
  saveState(); renderExerciseList();
}

/* Daily exercise completion is kept on the device and summarised into the
   monthly assessment, so the patient never has to submit anything daily. */
function recordAdherence(){
  const c = CONTENT[STATE.lang];
  const stage = currentStageIndex();
  const list = exerciseGroupsFor(stage).flatMap(src => c.exercises[src]);
  const doneSet = new Set(STATE.doneIds);
  STATE.adherence[todayISO()] = {
    done: list.filter(x=>doneSet.has(x.id)).length,
    total: list.length
  };
  // keep the map small
  const keys = Object.keys(STATE.adherence).sort();
  while(keys.length > 90){ delete STATE.adherence[keys.shift()]; }
}
/** Days in the current assessment window with at least one exercise ticked. */
function adherenceSummary(){
  const now = new Date(todayISO() + 'T00:00:00').getTime();
  let daysActive = 0, doneSum = 0, totalSum = 0;
  for(const d in STATE.adherence){
    const age = (now - new Date(d + 'T00:00:00').getTime()) / DAY_MS;
    if(age >= 0 && age < ASSESS_INTERVAL_DAYS){
      const a = STATE.adherence[d];
      if(a.done > 0) daysActive++;
      doneSum += a.done; totalSum += a.total;
    }
  }
  return { daysActive, doneSum, totalSum };
}

/* ============================= PROGRESS CHARTS ============================= */
/* One chart per parameter. Higher is better for every series here, so a
   rising line always means improvement — including pain, because the UCLA
   pain domain scores 10 for no pain. */
function lineChart(vals, opts){
  const c = CONTENT[STATE.lang];
  if(!vals || vals.length < 2) return `<div class="chart-empty">${c.chartEmpty}</div>`;
  const w=320, h=80, pad=8;
  const lo = opts.min !== undefined ? opts.min : 0;
  const hi = opts.max !== undefined ? opts.max : Math.max.apply(null, vals);
  const span = (hi - lo) || 1;
  const pts = vals.map((v,i)=>[
    pad + (i/(vals.length-1))*(w-pad*2),
    pad + (1 - (Math.max(lo,Math.min(hi,v)) - lo)/span)*(h-pad*2)
  ]);
  const d = pts.map((p,i)=>`${i?'L':'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L ${pts[pts.length-1][0].toFixed(1)} ${h} L ${pts[0][0].toFixed(1)} ${h} Z`;
  const col = opts.color || '#2E7D6E';
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <line x1="0" y1="${h-1}" x2="${w}" y2="${h-1}" stroke="#E9EDF3" stroke-width="1"/>
    <path d="${area}" fill="${col}22"/>
    <path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p,i)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===pts.length-1?4:3}" fill="${col}"/>`).join('')}
  </svg>`;
}

function chartCard(cfg){
  const c = CONTENT[STATE.lang];
  const vals = cfg.vals.filter(v=>v!==null && v!==undefined && !isNaN(v));
  const fmt = v => cfg.fmt ? cfg.fmt(v) : (v===null ? '—' : v);
  const now = vals.length ? vals[vals.length-1] : null;
  const first = vals.length ? vals[0] : null;

  let delta = '', dcls = 'flat', readout = '';
  if(vals.length >= 2){
    const d = Math.round((now - first) * 10) / 10;
    dcls = d > 0 ? 'up' : (d < 0 ? 'down' : 'flat');
    delta = `${d>0?'+':''}${d} ${c.deltaSince}`;
    // Plain-language line so the graph is readable without interpreting it.
    const tpl = d > 0 ? c.chartUp : (d < 0 ? c.chartDown : c.chartFlat);
    readout = `<div class="chart-read">${tpl
      .replace('{d}', Math.abs(d) + (cfg.suffix || ''))
      .replace('{a}', fmt(first) + (cfg.suffix || ''))
      .replace('{b}', fmt(now) + (cfg.suffix || ''))}</div>`;
  } else {
    readout = `<div class="chart-read">${c.chartNeedTwo}</div>`;
  }

  // date axis: first and latest assessment
  const axis = (cfg.dates && cfg.dates.length >= 2)
    ? `<div class="chart-axis"><span>${formatDate(cfg.dates[0])}</span><span>${formatDate(cfg.dates[cfg.dates.length-1])}</span></div>`
    : '';

  return `<div class="chart-card">
    <div class="chart-head">
      <div>
        <div class="chart-title">${cfg.title}</div>
        <div class="chart-sub">${cfg.sub}</div>
      </div>
      <div style="text-align:right;">
        <div class="chart-now">${fmt(now)}${cfg.suffix?`<small>${cfg.suffix}</small>`:''}</div>
        ${delta?`<div class="chart-delta ${dcls}">${delta}</div>`:''}
      </div>
    </div>
    ${lineChart(vals, cfg)}
    ${axis}
    ${readout}
  </div>`;
}

function renderProgress(){
  const c = CONTENT[STATE.lang];
  const wrap = document.getElementById('progress-body');
  const ms = STATE.measures;

  if(!ms.length){
    // The no-data card below already offers the "start" call to action, so
    // the assessment-due nudge stays out to avoid asking twice on one screen.
    document.getElementById('weekly-reminder').innerHTML = '';
    wrap.innerHTML = `<div class="card">
      <h2>${c.progNoData}</h2>
      <p class="muted" style="line-height:1.55;margin-top:6px;">${c.progNoDataBody}</p>
      <button class="primary-btn" data-action="openMeasure">${c.progStartBtn}</button>
    </div>`;
    return;
  }

  renderWeeklyReminder();

  const stage = currentStageIndex();
  const dates = ms.map(m=>m.date);
  const CH = c.charts;
  const chart = (cfg) => chartCard(Object.assign({ dates:dates }, cfg));

  // Headline UCLA score, with the five domains broken out beneath it.
  const e = effectiveUcla();
  let scoreCard = '';
  if(e){
    const total = uclaTotal(e.u, e.flexionDeg);
    const domains = [
      [c.uclaDomains[0], e.u.pain, 10],
      [c.uclaDomains[1], e.u.func, 10],
      [c.uclaDomains[2], flexionPoints(e.flexionDeg), 5],
      [c.uclaDomains[3], e.u.strength, 5],
      [c.uclaDomains[4], e.u.satisfaction, 5]
    ];
    scoreCard = `<div class="ucla-score-card">
      <h2>${c.uclaCardTitle}</h2>
      <div class="ucla-score-row">
        <div class="ucla-score-big">${total}<small> / ${UCLA_MAX}</small></div>
        <div class="ucla-score-grade">${c.gradeNames[uclaGrade(total)]}</div>
      </div>
      <div class="ucla-bars">${domains.map(([name,val,max])=>`
        <div class="ucla-bar-row">
          <div class="ucla-bar-name">${name}</div>
          <div class="ucla-bar-track"><div class="ucla-bar-fill" style="width:${(val/max*100).toFixed(0)}%"></div></div>
          <div class="ucla-bar-val">${val} / ${max}</div>
        </div>`).join('')}</div>
      <div class="ucla-score-foot">${c.uclaCardFoot}</div>
      <div class="ucla-sync-status ${latestMeasure().synced?'synced':'pending'}">${latestMeasure().synced?c.syncStatusDone:c.syncStatusPending}</div>
    </div>`;
  }

  wrap.innerHTML = `
    ${scoreCard}
    <div class="card">
      <h2>${c.phaseNames[stage]} · ${c.phaseTitles[stage]}</h2>
      <p class="muted" style="margin-top:6px;font-size:12px;">${c.progCount.replace('{n}', ms.length)}</p>
      <button class="primary-btn" data-action="openMeasure">${c.remeasureBtn}</button>
    </div>
    ${chart({ ...CH.total, vals: ms.map(m=>uclaTotal(m.ucla, m.rom.flexion)), max:35, suffix:' / 35', color:'#1F3864' })}
    ${chart({ ...CH.pain, vals: ms.map(m=>m.ucla.pain), max:10, suffix:' / 10', color:'#E8B860' })}
    ${chart({ ...CH.func, vals: ms.map(m=>m.ucla.func), max:10, suffix:' / 10', color:'#2C5F8A' })}
    ${chart({ ...CH.flexdeg, vals: ms.map(m=>m.rom.flexion), max:180, suffix:'°', color:'#2E7D6E' })}
    ${chart({ ...CH.abduction, vals: ms.map(m=>m.rom.abduction), max:180, suffix:'°', color:'#2E7D6E' })}
    ${chart({ ...CH.er, vals: ms.map(m=>m.rom.er), max:90, suffix:'°', color:'#3f9a89' })}
    ${chart({ ...CH.ir, vals: ms.map(m=>m.rom.ir), max:8, color:'#3f9a89',
              fmt:v=> v===null?'—':t('irLandmarks')[v] })}
    ${chart({ ...CH.strength, vals: ms.map(m=>m.ucla.strength), max:5, suffix:' / 5', color:'#2C5F8A' })}
    <p class="app-disclaimer">${c.progFooter}</p>`;
}

function renderResources(){
  const c = CONTENT[STATE.lang];
  const ICON_VIDEO = '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/></svg>';
  const ICON_ARTICLE = '<svg viewBox="0 0 24 24"><path d="M5 3h11l4 4v14H5z"/><path d="M16 3v4h4"/><path d="M9 12h7M9 16h7"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7"/><path d="M9 7h8v8"/></svg>';

  const card = r => `<a class="res-card ${r.type}" href="${r.url}" target="_blank" rel="noopener noreferrer">
      <div class="res-icon">${r.icon?`<img src="${r.icon}" alt="" loading="lazy">`:(r.type==='video'?ICON_VIDEO:ICON_ARTICLE)}</div>
      <div class="res-body">
        <div class="res-title">${r.title}</div>
        <div class="res-desc">${r.desc}</div>
        <div class="res-meta">
          <span class="res-src">${r.src}</span>
          <span class="res-lang">${r.lang==='th'?c.resLangTh:c.resLangEn}</span>
        </div>
      </div>
      <div class="res-arrow">${ARROW}</div>
    </a>`;

  // Featured entries (our own site) are pinned above the video/article
  // groups regardless of type, rather than sorting into "Reading" behind
  // every video the way a plain type-grouped list would place them.
  const featured = c.resources.filter(r=>r.featured);
  const videos = c.resources.filter(r=>r.type==='video' && !r.featured);
  const articles = c.resources.filter(r=>r.type==='article' && !r.featured);
  document.getElementById('res-list').innerHTML =
    featured.map(card).join('') +
    (videos.length ? `<div class="res-group">${c.resGroupVideo}</div>` + videos.map(card).join('') : '') +
    (articles.length ? `<div class="res-group">${c.resGroupArticle}</div>` + articles.map(card).join('') : '');
}

/* ============================= ABOUT ============================= */
function renderAbout(){
  const c = CONTENT[STATE.lang];
  const stage = currentStageIndex();

  document.getElementById('causes-list').innerHTML =
    c.causesList.map(x=>`<div class="goal-item"><div class="goal-num">•</div><div>${x}</div></div>`).join('');

  document.getElementById('stages-list').innerHTML = c.phaseTitles.map((title,i)=>`
    <div class="stage-row ${i===stage?'now':''}">
      <div class="stage-num">${i+1}</div>
      <div class="stage-body">
        <div class="stage-title">${title}${i===stage?` <span class="stage-you">${c.stageYouAreHere}</span>`:''}</div>
        <div class="stage-months">${c.phaseMonths[i]}</div>
        <div class="stage-line"><b>${c.phaseWhatLabel}:</b> ${c.phaseWhat[i]}</div>
        <div class="stage-line"><b>${c.phaseSymptomsLabel}:</b> ${c.phaseSymptoms[i]}</div>
      </div>
    </div>`).join('');

  document.getElementById('escalate-list').innerHTML =
    c.escalate.map(e=>`<div class="goal-item"><div class="goal-num">•</div><div>${e}</div></div>`).join('');
}

/* ============================= SLEEP / ALERT ============================= */
function renderSleep(){
  // The "avoid" card is a warning, not a technique to follow in sequence,
  // so it is left out of the numbering rather than breaking the run 1-4.
  let n = 0;
  document.getElementById('sleep-list').innerHTML = CONTENT[STATE.lang].sleep.map(s=>{
    const badge = s.avoid ? '' : `<span class="sleep-num">${++n}</span>`;
    return `<div class="sleep-card ${s.avoid?'avoid':''}">
      <div class="sleep-head">
        <div class="sleep-icon">${s.icon}${badge}</div>
        <div><div class="sleep-title">${s.title}</div><div class="sleep-desc">${s.desc}</div></div>
      </div>
      ${mediaSlot(s.img, s.vid)}
    </div>`;
  }).join('');
}
function renderSelfCare(){
  document.getElementById('selfcare-list').innerHTML = CONTENT[STATE.lang].selfcare.map(s=>
    `<div class="sleep-card">
      <div class="sleep-head">
        <div class="sleep-icon">${s.icon}</div>
        <div><div class="sleep-title">${s.title}</div><div class="sleep-desc">${s.desc}</div></div>
      </div>
      ${mediaSlot(s.img, s.vid)}
    </div>`).join('');
}
function renderSOS(){
  const c = CONTENT[STATE.lang];
  document.getElementById('flag-list').innerHTML =
    `<div class="flag-section-label">${c.flagsHardLabel}</div>` +
    c.flagsHard.map(f=>`<div class="flag-item"><div class="flag-dot"></div><div class="flag-text">${f}</div></div>`).join('');
  document.getElementById('call-btn').href = 'tel:' + CLINIC_PHONE.replace(/\s/g,'');
  document.getElementById('call-btn-text').textContent = c.callBtnPrefix + CLINIC_PHONE;
  document.getElementById('privacy-list').innerHTML =
    c.privacyPoints.map(p=>`<div class="privacy-row"><span class="pi">${p[0]}</span><span>${p[1]}</span></div>`).join('');
}

/* ============================= ASSESSMENT FLOW ============================= */
let measureStep = 0;
let draft = null;

/* Last month's range is a sensible place to leave the dials — the patient
   drags from where they were. Last month's answers are not: carrying them
   over pre-selects every option, which both leads the answer and lets the
   whole assessment be clicked through without reading a single question,
   filing a copy of last month as though it were new. They start empty, so
   the validation in measureNext() means something. */
function defaultDraft(){
  const prev = latestMeasure();
  const rom = prev ? JSON.parse(JSON.stringify(prev.rom))
                   : { flexion:95, abduction:80, er:20, ir:2 };
  return { ucla:{ pain:null, func:null, strength:null, satisfaction:null }, rom };
}
function openMeasure(){
  if(!STATE.consentGiven){ openOnboard(true); return; }
  draft = defaultDraft(); measureStep = 0;
  document.getElementById('measure-modal').classList.remove('hidden');
  renderMeasure();
}
function closeMeasure(){ document.getElementById('measure-modal').classList.add('hidden'); }
/* Nothing is written to STATE until the final step, so cancelling is safe.
   Only blocked before the very first assessment, which the app needs. */
function cancelMeasure(){
  if(!latestMeasure()) return;
  draft = null; measureStep = 0; closeMeasure();
}

function renderMeasure(){
  const c = CONTENT[STATE.lang];
  document.getElementById('measure-title').textContent = c.measureTitles[measureStep];
  document.getElementById('measure-lead').textContent = c.measureLeads[measureStep];
  document.querySelectorAll('.measure-steps i').forEach((el,i)=> el.classList.toggle('on', i<=measureStep));
  document.getElementById('measure-next').textContent = measureStep < 2 ? c.measureNext : c.measureFinish;
  const back = document.getElementById('measure-back');
  back.textContent = c.measureBack;
  back.classList.toggle('hidden', measureStep === 0);
  const cancel = document.getElementById('measure-cancel');
  cancel.textContent = c.measureCancel;
  cancel.classList.toggle('hidden', !latestMeasure());

  const body = document.getElementById('measure-body');

  if(measureStep === 0){
    body.innerHTML = `
      <div class="ucla-block">
        <div class="ucla-q">${c.uclaPainQ}</div><div class="ucla-sub">${c.uclaPainSub}</div>
        ${uclaOptionList(c.uclaPainOpts, draft.ucla.pain, 'setDraftUclaPain', false)}
      </div>
      <div class="ucla-block">
        <div class="ucla-q">${c.uclaFuncQ}</div><div class="ucla-sub">${c.uclaFuncSub}</div>
        ${uclaOptionList(c.uclaFuncOpts, draft.ucla.func, 'setDraftUclaFunc', false)}
      </div>`;
  }

  if(measureStep === 1){
    body.innerHTML = `
      <div class="ucla-block" style="margin-bottom:10px;">
        <div class="ucla-q">${c.uclaFlexQ}</div><div class="ucla-sub">${c.uclaFlexSub}</div>
      </div>
      <div class="arc-grid">` + c.moves.map(m=>{
        const v = draft.rom[m.key];
        return `<div class="arc-cell">
          ${arcSvg(v/m.max, m.key, m.max)}
          <div class="arc-name">${m.name}</div>
          <div class="arc-val">${moveValueLabel(m, v)}</div>
          <div class="arc-pts">${m.scored ? flexionPoints(v) + c.ptsSuffix : '&nbsp;'}</div>
        </div>`;
      }).join('') + `</div>`;
    bindArcDrag();
  }

  if(measureStep === 2){
    body.innerHTML = `
      <div class="ucla-block">
        <div class="ucla-q">${c.uclaStrengthQ}</div><div class="ucla-sub">${c.uclaStrengthSub}</div>
        ${uclaOptionList(c.uclaStrengthOpts, draft.ucla.strength, 'setDraftUclaStrength', false)}
      </div>
      <div class="ucla-block">
        <div class="ucla-q">${c.uclaSatQ}</div><div class="ucla-sub">${c.uclaSatSub}</div>
        ${uclaOptionList(c.uclaSatOpts, draft.ucla.satisfaction, 'setDraftUclaSat', false)}
      </div>`;
  }
}
function setDraftUclaPain(v){ draft.ucla.pain = v; renderMeasure(); }
function setDraftUclaFunc(v){ draft.ucla.func = v; renderMeasure(); }
function setDraftUclaStrength(v){ draft.ucla.strength = v; renderMeasure(); }
function setDraftUclaSat(v){ draft.ucla.satisfaction = v; renderMeasure(); }

function bindArcDrag(){
  const moves = CONTENT[STATE.lang].moves;
  document.querySelectorAll('#measure-body svg[data-arc]').forEach(svg=>{
    const key = svg.getAttribute('data-arc');
    const max = +svg.getAttribute('data-max');
    const move = moves.find(m=>m.key===key);
    const cell = svg.closest('.arc-cell');
    let dragging = false;

    // Repaint this arc in place — re-rendering the step would replace the
    // <svg> node mid-gesture and drop pointer capture after one move.
    const paint = (v)=>{
      const frac = v/max, a = frac*Math.PI;
      const hx = 60 + 44*Math.sin(a), hy = 60 + 44*Math.cos(a);
      svg.querySelector('.arc-now').setAttribute('d', arcPath(60,60,44,frac));
      const line = svg.querySelector('line');
      line.setAttribute('x2', hx.toFixed(2)); line.setAttribute('y2', hy.toFixed(2));
      const handle = svg.querySelectorAll('circle')[1];
      handle.setAttribute('cx', hx.toFixed(2)); handle.setAttribute('cy', hy.toFixed(2));
      cell.querySelector('.arc-val').textContent = moveValueLabel(move, v);
      if(move.scored) cell.querySelector('.arc-pts').textContent = flexionPoints(v) + t('ptsSuffix');
    };
    const update = (ev)=>{
      const rect = svg.getBoundingClientRect();
      const px = ((ev.clientX - rect.left)/rect.width)*120;
      const py = ((ev.clientY - rect.top)/rect.height)*120;
      let a = Math.atan2(px-60, py-60);
      if(a < 0) a = 0;
      const v = Math.round(Math.min(1, a/Math.PI)*max);
      if(v !== draft.rom[key]){ draft.rom[key] = v; paint(v); }
    };
    svg.addEventListener('pointerdown', e=>{
      dragging = true; e.preventDefault();
      try{ svg.setPointerCapture(e.pointerId); }catch(err){}
      update(e);
    });
    svg.addEventListener('pointermove', e=>{ if(dragging) update(e); });
    svg.addEventListener('pointerup', ()=>{ dragging = false; });
    svg.addEventListener('pointercancel', ()=>{ dragging = false; });
  });
}

async function measureNext(){
  const c = CONTENT[STATE.lang];
  if(measureStep === 0){
    if(draft.ucla.pain === null || draft.ucla.func === null){ alert(c.measureValidation); return; }
    measureStep = 1; renderMeasure(); return;
  }
  if(measureStep === 1){ measureStep = 2; renderMeasure(); return; }
  if(draft.ucla.strength === null || draft.ucla.satisfaction === null){ alert(c.measureValidation); return; }

  const entry = {
    clientRecordId: makeRecordId(),
    recordedAt: new Date().toISOString(),
    date: todayISO(),
    hn: STATE.hn || "",
    ucla: draft.ucla,
    rom: draft.rom,
    flexionPts: flexionPoints(draft.rom.flexion),
    uclaTotal: uclaTotal(draft.ucla, draft.rom.flexion),
    onsetMonthYear: (STATE.onsetMonth && STATE.onsetYear) ? (STATE.onsetYear + "-" + String(STATE.onsetMonth).padStart(2,'0')) : "",
    monthsSinceOnset: monthsSinceOnset(),
    synced: false
  };
  // exercise adherence over the past week travels with the assessment
  const ad = adherenceSummary();
  entry.daysExercisedThisMonth = ad.daysActive;
  entry.exercisesDoneThisMonth = ad.doneSum;
  entry.exercisesPossibleThisMonth = ad.totalSum;
  entry.uclaGrade = uclaGrade(entry.uclaTotal);
  STATE.measures.push(entry);
  entry.stage = CONTENT.en.phaseNames[currentStageIndex()] + " - " + CONTENT.en.phaseTitles[currentStageIndex()];
  saveState(); closeMeasure(); renderAll();
  await syncOne('measures', STATE.measures.length - 1);
}
function measureBack(){ if(measureStep > 0){ measureStep--; renderMeasure(); } }

/* ============================= TABS / ONBOARD ============================= */
function switchTab(tab){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  if(tab === 'exercises'){ renderExerciseList(); }
  if(tab === 'progress') renderProgress();
  // The shell grows with its content, so <main> never overflows — the window is
  // the scroller. Reset both so a new tab always opens at the top.
  document.querySelector('main').scrollTop = 0;
  window.scrollTo(0, 0);
}

function buildOnsetSelects(){
  const c = CONTENT[STATE.lang];
  const mSel = document.getElementById('input-onset-month');
  const ySel = document.getElementById('input-onset-year');
  if(!mSel || !ySel) return;
  const keepM = STATE.onsetMonth || mSel.value;
  const keepY = STATE.onsetYear || ySel.value;
  mSel.innerHTML = `<option value="">${c.selectMonth}</option>` +
    c.monthNames.map((n,i)=>`<option value="${i+1}">${n}</option>`).join('');
  const thisYear = new Date().getFullYear();
  ySel.innerHTML = `<option value="">${c.selectYear}</option>` +
    Array.from({length:11},(_,i)=>thisYear-i).map(y=>`<option value="${y}">${y}</option>`).join('');
  if(keepM) mSel.value = keepM;
  if(keepY) ySel.value = keepY;
}

function openOnboard(prefill){
  buildOnsetSelects();
  if(prefill){
    document.getElementById('input-hn').value = STATE.hn || '';
    document.getElementById('input-consent').checked = !!STATE.consentGiven;
  }
  document.getElementById('onboard').classList.remove('hidden');
}
function saveOnboard(){
  const c = CONTENT[STATE.lang];
  if(!document.getElementById('input-consent').checked){
    document.getElementById('consent-validation').textContent = c.consentValidation; return;
  }
  STATE.onsetMonth = document.getElementById('input-onset-month').value || null;
  STATE.onsetYear  = document.getElementById('input-onset-year').value || null;
  STATE.hn = sanitiseHN(document.getElementById('input-hn').value);
  STATE.consentGiven = true;
  saveState();
  document.getElementById('onboard').classList.add('hidden');
  renderAll();
  const willPromptAddHome = !IS_STANDALONE && !STATE.homeScreenPromptShown;
  maybeShowAddHomePrompt();
  if(!willPromptAddHome && !latestMeasure()) openMeasure();
}

/* ============================= INIT ============================= */
function renderAll(){
  applyStaticI18n();
  renderHome();
  renderAbout();
  renderExerciseList();
  renderProgress();
  renderSleep();
  renderSelfCare();
  renderResources();
  renderSOS();
}
(async function init(){
  await loadState();
  buildOnsetSelects();
  renderAll();
  if(!STATE.consentGiven) openOnboard(true);
  else if(!latestMeasure()) openMeasure();
  else maybeShowAddHomePrompt();
  trySyncPending();
})();
