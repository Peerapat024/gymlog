import type { BodyPart, AllPart, Template, ExerciseInfo, TrainingSplit } from '../types';

// ─── Body part hierarchy (for picker UI) ─────────────────────────────────────
export const BODY_PARTS: BodyPart[] = [
  { id: 'chest',     label: 'CHEST' },
  { id: 'back',      label: 'BACK' },
  { id: 'legs',      label: 'LEGS' },
  { id: 'shoulders', label: 'SHOULDERS' },
  {
    id: 'arms', label: 'ARMS',
    children: [
      { id: 'biceps',   label: 'BICEPS' },
      { id: 'triceps',  label: 'TRICEPS' },
      { id: 'forearms', label: 'FOREARMS' },
    ],
  },
  { id: 'core', label: 'CORE' },
];

// ─── Flat list for template/library pickers ───────────────────────────────────
export const ALL_PARTS: AllPart[] = [
  { id: 'chest',     label: 'Chest' },
  { id: 'back',      label: 'Back' },
  { id: 'legs',      label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'biceps',    label: 'Biceps' },
  { id: 'triceps',   label: 'Triceps' },
  { id: 'forearms',  label: 'Forearms' },
  { id: 'core',      label: 'Core' },
];

// ─── Built-in exercise library ────────────────────────────────────────────────
export const LIBRARY: Record<string, ExerciseInfo[]> = {
  chest: [
    { name: 'Flat Barbell Bench Press',   focus: 'Middle chest — overall mass and strength',              equipment: 'Barbell'    },
    { name: 'Flat Dumbbell Bench Press',  focus: 'Middle chest — deeper stretch than barbell',            equipment: 'Dumbbell'   },
    { name: 'Incline Barbell Bench Press',focus: 'Upper chest',                                            equipment: 'Barbell'    },
    { name: 'Incline Dumbbell Bench Press',focus: 'Upper chest — deeper stretch, arms move independently', equipment: 'Dumbbell'   },
    { name: 'Decline Barbell Bench Press',focus: 'Lower chest',                                            equipment: 'Barbell'    },
    { name: 'Decline Dumbbell Bench Press',focus: 'Lower chest',                                           equipment: 'Dumbbell'   },
    { name: 'Chest Dips',                 focus: 'Lower chest and back of arms',                           equipment: 'Bodyweight' },
    { name: 'Push-Ups',                   focus: 'Overall chest and front core',                           equipment: 'Bodyweight' },
    { name: 'Cable Crossovers',           focus: 'Inner and outer chest — constant tension through range', equipment: 'Cable'      },
    { name: 'Pec Deck Machine',           focus: 'Inner chest isolation',                                  equipment: 'Machine'    },
    { name: 'Dumbbell Pullovers',         focus: 'Chest expansion and middle chest',                       equipment: 'Dumbbell'   },
    { name: 'Smith Machine Bench Press',  focus: 'Overall chest — guided motion, no spotter needed',       equipment: 'Machine'    },
  ],
  back: [
    { name: 'Deadlift',                   focus: 'Overall back thickness, lower back, glutes and hamstrings', equipment: 'Barbell'    },
    { name: 'Pull-Ups',                   focus: 'Upper back width — builds the V-shape',                     equipment: 'Bodyweight' },
    { name: 'Chin-Ups',                   focus: 'Upper back width and biceps',                               equipment: 'Bodyweight' },
    { name: 'Lat Pulldowns',              focus: 'Upper back width — machine alternative to pull-ups',        equipment: 'Cable'      },
    { name: 'Barbell Rows',               focus: 'Middle back thickness',                                     equipment: 'Barbell'    },
    { name: 'Dumbbell Rows',              focus: 'One-arm middle back thickness',                             equipment: 'Dumbbell'   },
    { name: 'Seated Cable Rows',          focus: 'Middle and lower back',                                     equipment: 'Cable'      },
    { name: 'T-Bar Rows',                 focus: 'Inner and middle back',                                     equipment: 'Barbell'    },
    { name: 'Shrugs',                     focus: 'Traps — the muscle connecting neck to shoulders',           equipment: 'Dumbbell'   },
    { name: 'Back Extensions',            focus: 'Lower back strength',                                       equipment: 'Bodyweight' },
    { name: 'Straight-Arm Pulldowns',     focus: 'Lower lats — the bottom of the wide back muscle',          equipment: 'Cable'      },
    { name: 'Machine Rows',               focus: 'Middle back — chest supported, less lower back stress',     equipment: 'Machine'    },
  ],
  legs: [
    { name: 'Barbell Back Squat',         focus: 'Quads and glutes — king of leg exercises',                      equipment: 'Barbell'  },
    { name: 'Leg Press',                  focus: 'Quads and glutes — machine alternative to squats',              equipment: 'Machine'  },
    { name: 'Romanian Deadlifts',         focus: 'Hamstrings and glutes — hip hinge movement',                    equipment: 'Barbell'  },
    { name: 'Bulgarian Split Squats',     focus: 'Quads and glutes — single leg, hits each side independently',   equipment: 'Dumbbell' },
    { name: 'Lunges',                     focus: 'Overall legs and balance',                                      equipment: 'Dumbbell' },
    { name: 'Lying Leg Curls',            focus: 'Hamstring isolation — lying flat',                              equipment: 'Machine'  },
    { name: 'Seated Leg Curls',           focus: 'Hamstring isolation — different angle from lying version',      equipment: 'Machine'  },
    { name: 'Leg Extensions',             focus: 'Quad isolation — front of thigh',                               equipment: 'Machine'  },
    { name: 'Standing Calf Raises',       focus: 'Gastrocnemius — the large visible calf muscle',                 equipment: 'Machine'  },
    { name: 'Seated Calf Raises',         focus: 'Soleus — the lower calf closer to the ankle',                   equipment: 'Machine'  },
    { name: 'Hip Thrusts',                focus: 'Glute isolation and maximum glute strength',                    equipment: 'Barbell'  },
    { name: 'Goblet Squats',              focus: 'Quads and core — one dumbbell held at chest height',            equipment: 'Dumbbell' },
  ],
  shoulders: [
    { name: 'Seated Dumbbell Press',      focus: 'Overall shoulder size',                                         equipment: 'Dumbbell' },
    { name: 'Military Press',             focus: 'Front and overall shoulders — also works the core',             equipment: 'Barbell'  },
    { name: 'Arnold Press',               focus: 'Front and side shoulders — twisting motion hits all three heads', equipment: 'Dumbbell' },
    { name: 'Dumbbell Lateral Raises',    focus: 'Side delts — the main builder of shoulder width',               equipment: 'Dumbbell' },
    { name: 'Cable Lateral Raises',       focus: 'Side delts — constant tension through full range of motion',    equipment: 'Cable'    },
    { name: 'Dumbbell Front Raises',      focus: 'Front delts',                                                   equipment: 'Dumbbell' },
    { name: 'Cable Front Raises',         focus: 'Front delts with constant tension',                             equipment: 'Cable'    },
    { name: 'Reverse Pec Deck',           focus: 'Rear delts',                                                    equipment: 'Machine'  },
    { name: 'Dumbbell Rear Delt Flyes',   focus: 'Rear delts',                                                    equipment: 'Dumbbell' },
    { name: 'Cable Face Pulls',           focus: 'Rear delts and upper back — great for posture and shoulder health', equipment: 'Cable' },
    { name: 'Upright Rows',               focus: 'Front delts and traps',                                         equipment: 'Barbell'  },
    { name: 'Smith Machine Overhead Press', focus: 'Overall shoulders — guided motion',                           equipment: 'Machine'  },
  ],
  biceps: [
    { name: 'Barbell Bicep Curls',        focus: 'Overall bicep mass and strength',                               equipment: 'Barbell'  },
    { name: 'Dumbbell Bicep Curls',       focus: 'Overall bicep — arms move independently',                      equipment: 'Dumbbell' },
    { name: 'Hammer Curls',               focus: 'Outer bicep and brachialis — adds arm thickness',              equipment: 'Dumbbell' },
    { name: 'Preacher Curls',             focus: 'Bicep isolation — focuses on the lower portion',               equipment: 'Barbell'  },
    { name: 'Concentration Curls',        focus: 'Bicep peak — maximum contraction at the top',                  equipment: 'Dumbbell' },
    { name: 'Cable Bicep Curls',          focus: 'Constant tension on the bicep through full range',             equipment: 'Cable'    },
    { name: 'Incline Dumbbell Curls',     focus: 'Long head stretch — adds height and peak to the bicep',        equipment: 'Dumbbell' },
    { name: 'Reverse Curls',              focus: 'Brachialis and forearm extensors — adds arm width',            equipment: 'Barbell'  },
    { name: 'Cable Hammer Curls',         focus: 'Outer bicep and brachialis with constant tension',             equipment: 'Cable'    },
    { name: 'Machine Preacher Curls',     focus: 'Bicep isolation — machine version, easier to learn',          equipment: 'Machine'  },
    { name: 'Spider Curls',               focus: 'Lower bicep peak — chest rests on an incline bench',           equipment: 'Dumbbell' },
    { name: 'Drag Curls',                 focus: 'Long head of the bicep — drag the bar up your torso',          equipment: 'Barbell'  },
  ],
  triceps: [
    { name: 'Tricep Pushdowns',           focus: 'Overall tricep — lateral and medial heads',                    equipment: 'Cable'      },
    { name: 'Rope Pushdowns',             focus: 'Outer lateral head — rope spreads apart at the bottom',        equipment: 'Cable'      },
    { name: 'Skull Crushers',             focus: 'Long head — the biggest tricep head, adds overall mass',       equipment: 'Barbell'    },
    { name: 'Overhead Tricep Extension',  focus: 'Long head with a full stretch at the top',                     equipment: 'Dumbbell'   },
    { name: 'Close-Grip Bench Press',     focus: 'Overall triceps and inner chest',                              equipment: 'Barbell'    },
    { name: 'Tricep Dips',                focus: 'Overall triceps — bodyweight version',                         equipment: 'Bodyweight' },
    { name: 'Cable Overhead Extension',   focus: 'Long head of the tricep with constant cable tension',          equipment: 'Cable'      },
    { name: 'Tricep Kickbacks',           focus: 'Lateral head isolation at full extension',                     equipment: 'Dumbbell'   },
    { name: 'Diamond Push-Ups',           focus: 'Overall triceps — hands form a diamond shape',                 equipment: 'Bodyweight' },
    { name: 'French Press',               focus: 'Long head of the tricep — EZ bar version',                    equipment: 'Barbell'    },
    { name: 'Single-Arm Cable Pushdown',  focus: 'One-arm tricep isolation — good for fixing imbalances',       equipment: 'Cable'      },
    { name: 'Seated Machine Dips',        focus: 'Overall triceps — machine version, easy to load',             equipment: 'Machine'    },
  ],
  forearms: [
    { name: 'Wrist Curls',                focus: 'Inner forearm flexors — palm facing up',                       equipment: 'Dumbbell'   },
    { name: 'Reverse Wrist Curls',        focus: 'Outer forearm extensors — palm facing down',                   equipment: 'Dumbbell'   },
    { name: 'Reverse Curls',              focus: 'Brachioradialis — the thick outer forearm muscle',             equipment: 'Barbell'    },
    { name: 'Farmers Walk',               focus: 'Overall grip strength and forearm endurance',                  equipment: 'Dumbbell'   },
    { name: 'Wrist Roller',               focus: 'Overall forearm strength — winding up a weight on a rod',     equipment: 'Bodyweight' },
    { name: 'Plate Pinch',                focus: 'Finger and pinch grip strength',                               equipment: 'Dumbbell'   },
    { name: 'Behind-the-Back Wrist Curls',focus: 'Inner forearm with better isolation — bar behind the body',   equipment: 'Barbell'    },
    { name: 'Cable Wrist Curls',          focus: 'Forearm flexors with constant cable tension',                  equipment: 'Cable'      },
    { name: 'Zottman Curls',              focus: 'Both forearm flexors and extensors in one movement',           equipment: 'Dumbbell'   },
    { name: 'Pinwheel Curls',             focus: 'Outer forearm and upper arm — cross-body hammer curl',         equipment: 'Dumbbell'   },
    { name: 'Towel Pull-Ups',             focus: 'Grip and overall forearm — hanging from a towel',              equipment: 'Bodyweight' },
    { name: 'Dead Hangs',                 focus: 'Grip endurance and spinal decompression',                      equipment: 'Bodyweight' },
  ],
  core: [
    { name: 'Plank',                      focus: 'Overall core stability — front and back',                      equipment: 'Bodyweight' },
    { name: 'Crunches',                   focus: 'Upper abs',                                                    equipment: 'Bodyweight' },
    { name: 'Hanging Leg Raises',         focus: 'Lower abs and hip flexors',                                    equipment: 'Bodyweight' },
    { name: 'Russian Twist',              focus: 'Obliques — rotational movement',                               equipment: 'Bodyweight' },
    { name: 'Cable Crunch',               focus: 'Upper and middle abs with added resistance',                   equipment: 'Cable'      },
    { name: 'Ab Wheel Rollout',           focus: 'Full core and shoulder stability',                             equipment: 'Bodyweight' },
    { name: 'Bicycle Crunches',           focus: 'Abs and obliques — alternating elbow to knee',                 equipment: 'Bodyweight' },
    { name: 'Lying Leg Raises',           focus: 'Lower abs — lying flat, legs rise to 90 degrees',             equipment: 'Bodyweight' },
    { name: 'Dead Bug',                   focus: 'Deep core stability — opposite arm and leg extend',            equipment: 'Bodyweight' },
    { name: 'Pallof Press',               focus: 'Anti-rotation core stability — resisting the cable pull',      equipment: 'Cable'      },
    { name: 'Dragon Flag',                focus: 'Full core strength — advanced movement',                       equipment: 'Bodyweight' },
    { name: 'Hollow Body Hold',           focus: 'Full core tension — foundational gymnastic movement',          equipment: 'Bodyweight' },
  ],
};

// ─── Flat name → info map for O(1) lookup ─────────────────────────────────────
export const EXERCISE_MAP: Record<string, ExerciseInfo> = Object.values(LIBRARY)
  .flat()
  .reduce((acc, ex) => { acc[ex.name] = ex; return acc; }, {} as Record<string, ExerciseInfo>);

// ─── Bodyweight exercises (weight field = added/assisted weight) ──────────────
export const BW_EXERCISES = new Set([
  'Pull-Ups', 'Chin-Ups', 'Chest Dips', 'Push-Ups', 'Back Extensions',
  'Tricep Dips', 'Diamond Push-Ups', 'Towel Pull-Ups', 'Dead Hangs', 'Wrist Roller',
  'Lunges', 'Bulgarian Split Squats',
  'Plank', 'Crunches', 'Hanging Leg Raises', 'Russian Twist',
  'Ab Wheel Rollout', 'Bicycle Crunches', 'Lying Leg Raises',
  'Dead Bug', 'Dragon Flag', 'Hollow Body Hold',
]);

// ─── Dumbbell exercises (log total weight — both sides combined) ───────────────
export const DB_EXERCISES = new Set([
  'Flat Dumbbell Bench Press', 'Incline Dumbbell Bench Press', 'Decline Dumbbell Bench Press',
  'Dumbbell Pullovers', 'Dumbbell Rows', 'Shrugs',
  'Seated Dumbbell Press', 'Arnold Press', 'Dumbbell Lateral Raises',
  'Dumbbell Front Raises', 'Dumbbell Rear Delt Flyes',
  'Bulgarian Split Squats', 'Lunges', 'Goblet Squats',
  'Dumbbell Bicep Curls', 'Hammer Curls', 'Concentration Curls',
  'Incline Dumbbell Curls', 'Spider Curls',
  'Overhead Tricep Extension', 'Tricep Kickbacks',
  'Wrist Curls', 'Reverse Wrist Curls', 'Farmers Walk',
  'Plate Pinch', 'Zottman Curls', 'Pinwheel Curls',
]);

// ─── Cable exercises ──────────────────────────────────────────────────────────
export const CABLE_EXERCISES = new Set([
  'Cable Crossovers', 'Lat Pulldowns', 'Seated Cable Rows', 'Straight-Arm Pulldowns',
  'Cable Lateral Raises', 'Cable Front Raises', 'Cable Face Pulls',
  'Cable Bicep Curls', 'Cable Hammer Curls', 'Cable Overhead Extension',
  'Tricep Pushdowns', 'Rope Pushdowns', 'Single-Arm Cable Pushdown',
  'Cable Crunch', 'Pallof Press', 'Cable Wrist Curls',
]);

// ─── Default workout templates ────────────────────────────────────────────────
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'push', name: 'Push Day',
    exercises: [
      { name: 'Flat Barbell Bench Press',   bodyPart: 'chest' },
      { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest' },
      { name: 'Military Press',             bodyPart: 'shoulders' },
      { name: 'Dumbbell Lateral Raises',    bodyPart: 'shoulders' },
      { name: 'Tricep Pushdowns',           bodyPart: 'triceps' },
      { name: 'Skull Crushers',             bodyPart: 'triceps' },
    ],
  },
  {
    id: 'pull', name: 'Pull Day',
    exercises: [
      { name: 'Deadlift',             bodyPart: 'back' },
      { name: 'Pull-Ups',             bodyPart: 'back' },
      { name: 'Barbell Rows',         bodyPart: 'back' },
      { name: 'Lat Pulldowns',        bodyPart: 'back' },
      { name: 'Barbell Bicep Curls',  bodyPart: 'biceps' },
      { name: 'Hammer Curls',         bodyPart: 'biceps' },
    ],
  },
  {
    id: 'legs', name: 'Leg Day',
    exercises: [
      { name: 'Barbell Back Squat',   bodyPart: 'legs' },
      { name: 'Leg Press',            bodyPart: 'legs' },
      { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
      { name: 'Lying Leg Curls',      bodyPart: 'legs' },
      { name: 'Leg Extensions',       bodyPart: 'legs' },
      { name: 'Standing Calf Raises', bodyPart: 'legs' },
    ],
  },
  {
    id: 'upper', name: 'Upper Body',
    exercises: [
      { name: 'Flat Barbell Bench Press', bodyPart: 'chest' },
      { name: 'Barbell Rows',             bodyPart: 'back' },
      { name: 'Military Press',           bodyPart: 'shoulders' },
      { name: 'Lat Pulldowns',            bodyPart: 'back' },
      { name: 'Barbell Bicep Curls',      bodyPart: 'biceps' },
      { name: 'Tricep Pushdowns',         bodyPart: 'triceps' },
    ],
  },
];

// ─── Training splits ──────────────────────────────────────────────────────────
export const DEFAULT_SPLITS: TrainingSplit[] = [
  {
    id: 'bro',
    name: 'Bro Split',
    tag: '5-DAY SPLIT',
    description: 'One muscle group per day. Maximum volume per session.',
    days: [
      {
        name: 'Chest Day',
        muscles: 'Chest',
        exercises: [
          { name: 'Flat Barbell Bench Press',    bodyPart: 'chest' },
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest' },
          { name: 'Decline Barbell Bench Press', bodyPart: 'chest' },
          { name: 'Cable Crossovers',            bodyPart: 'chest' },
          { name: 'Pec Deck Machine',            bodyPart: 'chest' },
        ],
      },
      {
        name: 'Back Day',
        muscles: 'Back',
        exercises: [
          { name: 'Deadlift',             bodyPart: 'back' },
          { name: 'Pull-Ups',             bodyPart: 'back' },
          { name: 'Barbell Rows',         bodyPart: 'back' },
          { name: 'Seated Cable Rows',    bodyPart: 'back' },
          { name: 'Lat Pulldowns',        bodyPart: 'back' },
        ],
      },
      {
        name: 'Shoulders Day',
        muscles: 'Shoulders',
        exercises: [
          { name: 'Military Press',          bodyPart: 'shoulders' },
          { name: 'Dumbbell Lateral Raises', bodyPart: 'shoulders' },
          { name: 'Arnold Press',            bodyPart: 'shoulders' },
          { name: 'Cable Face Pulls',        bodyPart: 'shoulders' },
          { name: 'Reverse Pec Deck',        bodyPart: 'shoulders' },
        ],
      },
      {
        name: 'Legs Day',
        muscles: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Lying Leg Curls',      bodyPart: 'legs' },
          { name: 'Leg Extensions',       bodyPart: 'legs' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
      {
        name: 'Arms Day',
        muscles: 'Biceps · Triceps',
        exercises: [
          { name: 'Barbell Bicep Curls',       bodyPart: 'biceps'  },
          { name: 'Hammer Curls',              bodyPart: 'biceps'  },
          { name: 'Preacher Curls',            bodyPart: 'biceps'  },
          { name: 'Tricep Pushdowns',          bodyPart: 'triceps' },
          { name: 'Skull Crushers',            bodyPart: 'triceps' },
          { name: 'Overhead Tricep Extension', bodyPart: 'triceps' },
        ],
      },
    ],
  },
  {
    id: 'ppl',
    name: 'Push-Pull-Legs',
    tag: '3-DAY SPLIT',
    description: 'Run 3 or 6 days a week. Balanced push and pull volume.',
    days: [
      {
        name: 'Push',
        muscles: 'Chest · Shoulders · Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press',    bodyPart: 'chest'     },
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'    },
          { name: 'Military Press',              bodyPart: 'shoulders' },
          { name: 'Dumbbell Lateral Raises',     bodyPart: 'shoulders' },
          { name: 'Tricep Pushdowns',            bodyPart: 'triceps'   },
          { name: 'Skull Crushers',              bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Pull',
        muscles: 'Back · Biceps',
        exercises: [
          { name: 'Deadlift',            bodyPart: 'back'    },
          { name: 'Pull-Ups',            bodyPart: 'back'    },
          { name: 'Barbell Rows',        bodyPart: 'back'    },
          { name: 'Lat Pulldowns',       bodyPart: 'back'    },
          { name: 'Barbell Bicep Curls', bodyPart: 'biceps'  },
          { name: 'Hammer Curls',        bodyPart: 'biceps'  },
        ],
      },
      {
        name: 'Legs',
        muscles: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Lying Leg Curls',      bodyPart: 'legs' },
          { name: 'Leg Extensions',       bodyPart: 'legs' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
    ],
  },
  {
    id: 'upper_lower',
    name: 'Upper-Lower',
    tag: '4-DAY SPLIT',
    description: 'Each muscle hit twice a week. Great for strength and size.',
    days: [
      {
        name: 'Upper A',
        muscles: 'Chest · Back · Shoulders · Arms',
        exercises: [
          { name: 'Flat Barbell Bench Press', bodyPart: 'chest'     },
          { name: 'Barbell Rows',             bodyPart: 'back'      },
          { name: 'Military Press',           bodyPart: 'shoulders' },
          { name: 'Pull-Ups',                 bodyPart: 'back'      },
          { name: 'Barbell Bicep Curls',      bodyPart: 'biceps'    },
          { name: 'Tricep Pushdowns',         bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Lower A',
        muscles: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Lying Leg Curls',      bodyPart: 'legs' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
      {
        name: 'Upper B',
        muscles: 'Chest · Back · Shoulders · Arms',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'     },
          { name: 'Seated Cable Rows',            bodyPart: 'back'      },
          { name: 'Arnold Press',                 bodyPart: 'shoulders' },
          { name: 'Lat Pulldowns',                bodyPart: 'back'      },
          { name: 'Hammer Curls',                 bodyPart: 'biceps'    },
          { name: 'Skull Crushers',               bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Lower B',
        muscles: 'Posterior chain focus',
        exercises: [
          { name: 'Deadlift',              bodyPart: 'legs' },
          { name: 'Hip Thrusts',           bodyPart: 'legs' },
          { name: 'Bulgarian Split Squats', bodyPart: 'legs' },
          { name: 'Seated Leg Curls',      bodyPart: 'legs' },
          { name: 'Leg Extensions',        bodyPart: 'legs' },
          { name: 'Seated Calf Raises',    bodyPart: 'legs' },
        ],
      },
    ],
  },
  {
    id: 'full_body',
    name: 'Full Body',
    tag: '3-DAY SPLIT',
    description: 'Train every muscle every session. Best for beginners and athletes.',
    days: [
      {
        name: 'Full Body A',
        muscles: 'Full body',
        exercises: [
          { name: 'Flat Barbell Bench Press', bodyPart: 'chest'     },
          { name: 'Barbell Rows',             bodyPart: 'back'      },
          { name: 'Barbell Back Squat',       bodyPart: 'legs'      },
          { name: 'Military Press',           bodyPart: 'shoulders' },
          { name: 'Barbell Bicep Curls',      bodyPart: 'biceps'    },
          { name: 'Tricep Pushdowns',         bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Full Body B',
        muscles: 'Full body',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'     },
          { name: 'Pull-Ups',                     bodyPart: 'back'      },
          { name: 'Romanian Deadlifts',           bodyPart: 'legs'      },
          { name: 'Dumbbell Lateral Raises',      bodyPart: 'shoulders' },
          { name: 'Hammer Curls',                 bodyPart: 'biceps'    },
          { name: 'Skull Crushers',               bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Full Body C',
        muscles: 'Full body',
        exercises: [
          { name: 'Chest Dips',          bodyPart: 'chest'     },
          { name: 'Seated Cable Rows',   bodyPart: 'back'      },
          { name: 'Leg Press',           bodyPart: 'legs'      },
          { name: 'Arnold Press',        bodyPart: 'shoulders' },
          { name: 'Cable Bicep Curls',   bodyPart: 'biceps'    },
          { name: 'Rope Pushdowns',      bodyPart: 'triceps'   },
          { name: 'Standing Calf Raises', bodyPart: 'legs'     },
        ],
      },
    ],
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    tag: '6-DAY SPLIT',
    description: 'The bodybuilder\'s 3-day cycle run twice per week. High volume.',
    days: [
      {
        name: 'Chest & Back',
        muscles: 'Chest · Back',
        exercises: [
          { name: 'Flat Barbell Bench Press',    bodyPart: 'chest' },
          { name: 'Incline Barbell Bench Press', bodyPart: 'chest' },
          { name: 'Deadlift',                    bodyPart: 'back'  },
          { name: 'Pull-Ups',                    bodyPart: 'back'  },
          { name: 'Barbell Rows',                bodyPart: 'back'  },
          { name: 'Cable Crossovers',            bodyPart: 'chest' },
        ],
      },
      {
        name: 'Shoulders & Arms',
        muscles: 'Shoulders · Biceps · Triceps',
        exercises: [
          { name: 'Military Press',            bodyPart: 'shoulders' },
          { name: 'Dumbbell Lateral Raises',   bodyPart: 'shoulders' },
          { name: 'Arnold Press',              bodyPart: 'shoulders' },
          { name: 'Barbell Bicep Curls',       bodyPart: 'biceps'    },
          { name: 'Hammer Curls',              bodyPart: 'biceps'    },
          { name: 'Skull Crushers',            bodyPart: 'triceps'   },
          { name: 'Tricep Pushdowns',          bodyPart: 'triceps'   },
        ],
      },
      {
        name: 'Legs',
        muscles: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Lying Leg Curls',      bodyPart: 'legs' },
          { name: 'Leg Extensions',       bodyPart: 'legs' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
    ],
  },
  {
    id: 'powerlifting',
    name: 'Powerlifting',
    tag: '4-DAY SPLIT',
    description: 'Built around the big three. Strength first, hypertrophy second.',
    days: [
      {
        name: 'Squat Day',
        muscles: 'Quads · Glutes · Lower back',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Lying Leg Curls',      bodyPart: 'legs' },
          { name: 'Back Extensions',      bodyPart: 'back' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
      {
        name: 'Bench Day',
        muscles: 'Chest · Shoulders · Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press',  bodyPart: 'chest'     },
          { name: 'Close-Grip Bench Press',    bodyPart: 'triceps'   },
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'  },
          { name: 'Dumbbell Lateral Raises',   bodyPart: 'shoulders' },
          { name: 'Tricep Pushdowns',          bodyPart: 'triceps'   },
          { name: 'Cable Face Pulls',          bodyPart: 'shoulders' },
        ],
      },
      {
        name: 'Deadlift Day',
        muscles: 'Back · Hamstrings · Traps',
        exercises: [
          { name: 'Deadlift',             bodyPart: 'back' },
          { name: 'Pull-Ups',             bodyPart: 'back' },
          { name: 'Barbell Rows',         bodyPart: 'back' },
          { name: 'T-Bar Rows',           bodyPart: 'back' },
          { name: 'Shrugs',               bodyPart: 'back' },
          { name: 'Seated Cable Rows',    bodyPart: 'back' },
        ],
      },
      {
        name: 'Accessory Day',
        muscles: 'Weak points · Arms · Core',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'   },
          { name: 'Lat Pulldowns',               bodyPart: 'back'     },
          { name: 'Hip Thrusts',                 bodyPart: 'legs'     },
          { name: 'Barbell Bicep Curls',         bodyPart: 'biceps'   },
          { name: 'Skull Crushers',              bodyPart: 'triceps'  },
          { name: 'Cable Crunch',                bodyPart: 'core'     },
        ],
      },
    ],
  },
  {
    id: 'phul',
    name: 'PHUL',
    tag: '4-DAY SPLIT',
    description: 'Power + Hypertrophy Upper Lower. The best of strength and size.',
    days: [
      {
        name: 'Upper Power',
        muscles: 'Chest · Back · Shoulders · Arms',
        exercises: [
          { name: 'Flat Barbell Bench Press', bodyPart: 'chest'     },
          { name: 'Barbell Rows',             bodyPart: 'back'      },
          { name: 'Military Press',           bodyPart: 'shoulders' },
          { name: 'Pull-Ups',                 bodyPart: 'back'      },
          { name: 'Close-Grip Bench Press',   bodyPart: 'triceps'   },
          { name: 'Barbell Bicep Curls',      bodyPart: 'biceps'    },
        ],
      },
      {
        name: 'Lower Power',
        muscles: 'Quads · Hamstrings · Glutes',
        exercises: [
          { name: 'Barbell Back Squat',   bodyPart: 'legs' },
          { name: 'Deadlift',             bodyPart: 'legs' },
          { name: 'Leg Press',            bodyPart: 'legs' },
          { name: 'Romanian Deadlifts',   bodyPart: 'legs' },
          { name: 'Standing Calf Raises', bodyPart: 'legs' },
        ],
      },
      {
        name: 'Upper Hypertrophy',
        muscles: 'Chest · Back · Shoulders · Arms',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', bodyPart: 'chest'     },
          { name: 'Seated Cable Rows',            bodyPart: 'back'      },
          { name: 'Dumbbell Lateral Raises',      bodyPart: 'shoulders' },
          { name: 'Lat Pulldowns',                bodyPart: 'back'      },
          { name: 'Hammer Curls',                 bodyPart: 'biceps'    },
          { name: 'Skull Crushers',               bodyPart: 'triceps'   },
          { name: 'Cable Face Pulls',             bodyPart: 'shoulders' },
        ],
      },
      {
        name: 'Lower Hypertrophy',
        muscles: 'Posterior chain · Quads · Calves',
        exercises: [
          { name: 'Romanian Deadlifts',    bodyPart: 'legs' },
          { name: 'Bulgarian Split Squats', bodyPart: 'legs' },
          { name: 'Leg Extensions',        bodyPart: 'legs' },
          { name: 'Lying Leg Curls',       bodyPart: 'legs' },
          { name: 'Hip Thrusts',           bodyPart: 'legs' },
          { name: 'Seated Calf Raises',    bodyPart: 'legs' },
        ],
      },
    ],
  },
];
