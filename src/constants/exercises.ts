import type { BodyPart, AllPart, Template } from '../types';

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
export const LIBRARY: Record<string, string[]> = {
  chest:     ['Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Flyes', 'Cable Crossover', 'Chest Dips', 'Push-ups'],
  back:      ['Deadlift', 'Pull-ups', 'Bent-over Row', 'Lat Pulldown', 'Seated Cable Row', 'T-Bar Row', 'Face Pulls', 'Shrugs'],
  legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl', 'Leg Extension', 'Calf Raises', 'Lunges', 'Hack Squat', 'Bulgarian Split Squat'],
  shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Arnold Press', 'Upright Row', 'Cable Lateral Raise'],
  biceps:    ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl', 'Concentration Curl', 'Incline Dumbbell Curl'],
  triceps:   ['Tricep Pushdown', 'Skull Crushers', 'Overhead Tricep Extension', 'Close-grip Bench Press', 'Tricep Dips', 'Cable Overhead Extension'],
  forearms:  ['Wrist Curl', 'Reverse Wrist Curl', 'Reverse Curl', 'Farmers Walk', 'Wrist Roller', 'Plate Pinch'],
  core:      ['Plank', 'Crunches', 'Hanging Leg Raises', 'Russian Twist', 'Cable Crunch', 'Ab Wheel Rollout', 'Bicycle Crunches'],
};

// ─── Bodyweight exercises (weight field = added/assisted weight) ──────────────
export const BW_EXERCISES = new Set([
  'Pull-ups', 'Push-ups', 'Dips', 'Tricep Dips', 'Chin-ups', 'Muscle-ups',
  'Inverted Row', 'Pike Push-ups', 'Handstand Push-ups', 'Hanging Leg Raises',
  'Ab Wheel Rollout', 'Plank', 'Crunches', 'Bicycle Crunches', 'Russian Twist',
  'Lunges', 'Bulgarian Split Squat',
]);

// ─── Dumbbell exercises (user enters weight per DB — hint: log total) ─────────
export const DB_EXERCISES = new Set([
  'Dumbbell Curl', 'Hammer Curl', 'Concentration Curl', 'Incline Dumbbell Curl',
  'Dumbbell Flyes', 'Dumbbell Row', 'Dumbbell Press', 'Incline Dumbbell Press',
  'Decline Dumbbell Press', 'Dumbbell Shoulder Press', 'Arnold Press',
  'Lateral Raises', 'Front Raises', 'Rear Delt Flyes',
  'Dumbbell Lunges', 'Dumbbell Romanian Deadlift', 'Dumbbell Squat',
  'Tricep Kickbacks', 'Overhead Tricep Extension',
]);

// ─── Cable exercises ──────────────────────────────────────────────────────────
export const CABLE_EXERCISES = new Set([
  'Cable Crossover', 'Cable Curl', 'Cable Lateral Raise', 'Cable Overhead Extension',
  'Cable Crunch', 'Face Pulls', 'Seated Cable Row', 'Lat Pulldown',
  'Tricep Pushdown', 'Cable Row',
]);

// ─── Default workout templates ────────────────────────────────────────────────
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'push', name: 'Push Day',
    exercises: [
      { name: 'Bench Press',          bodyPart: 'chest' },
      { name: 'Incline Bench Press',  bodyPart: 'chest' },
      { name: 'Overhead Press',       bodyPart: 'shoulders' },
      { name: 'Lateral Raises',       bodyPart: 'shoulders' },
      { name: 'Tricep Pushdown',      bodyPart: 'triceps' },
      { name: 'Skull Crushers',       bodyPart: 'triceps' },
    ],
  },
  {
    id: 'pull', name: 'Pull Day',
    exercises: [
      { name: 'Deadlift',      bodyPart: 'back' },
      { name: 'Pull-ups',      bodyPart: 'back' },
      { name: 'Bent-over Row', bodyPart: 'back' },
      { name: 'Lat Pulldown',  bodyPart: 'back' },
      { name: 'Barbell Curl',  bodyPart: 'biceps' },
      { name: 'Hammer Curl',   bodyPart: 'biceps' },
    ],
  },
  {
    id: 'legs', name: 'Leg Day',
    exercises: [
      { name: 'Squat',              bodyPart: 'legs' },
      { name: 'Leg Press',          bodyPart: 'legs' },
      { name: 'Romanian Deadlift',  bodyPart: 'legs' },
      { name: 'Leg Curl',           bodyPart: 'legs' },
      { name: 'Leg Extension',      bodyPart: 'legs' },
      { name: 'Calf Raises',        bodyPart: 'legs' },
    ],
  },
  {
    id: 'upper', name: 'Upper Body',
    exercises: [
      { name: 'Bench Press',     bodyPart: 'chest' },
      { name: 'Bent-over Row',   bodyPart: 'back' },
      { name: 'Overhead Press',  bodyPart: 'shoulders' },
      { name: 'Lat Pulldown',    bodyPart: 'back' },
      { name: 'Barbell Curl',    bodyPart: 'biceps' },
      { name: 'Tricep Pushdown', bodyPart: 'triceps' },
    ],
  },
];
