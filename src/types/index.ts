// ─── Theme ───────────────────────────────────────────────────────────────────
export type WeightUnit = 'kg' | 'lbs' | 'both';
export type BwSign = '+' | '-';
export type MoodId = 'crushed' | 'solid' | 'meh' | 'rough';

// ─── Exercises ───────────────────────────────────────────────────────────────
export type EquipmentType = 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight';

export interface ExerciseInfo {
  name: string;
  focus: string;
  equipment: EquipmentType;
}

export interface BodyPart {
  id: string;
  label: string;
  children?: BodyPart[];
}

export interface AllPart {
  id: string;
  label: string;
}

export interface TemplateExercise {
  name: string;
  bodyPart: string;
}

export interface Template {
  id: string;
  name: string;
  exercises: TemplateExercise[];
}

// ─── Sets / Sessions ─────────────────────────────────────────────────────────
export interface LoggedSet {
  exercise: string;
  bodyPart: string;
  weight: number;
  reps: number;
  setNumber: number;
  isPR: boolean;
  note?: string;
  unit?: WeightUnit;
  bwMode?: boolean;
  bwSign?: BwSign;
  addedKg?: number;
  _ts: number;
}

export interface Session {
  id: number;
  date: string;
  duration: number;
  sets: LoggedSet[];
  note?: string;
}

// ─── Data analytics helpers ──────────────────────────────────────────────────
export interface ChartPoint {
  date: string;
  y: number;
  isPR: boolean;
}

export interface BarPoint {
  date: string;
  v: number;
}

export interface ExerciseSummary {
  name: string;
  bodyPart: string;
  pr: number;
  sessions: number;
  sparkData: number[];
}

export interface HistoryEntry {
  date: string;
  sets: LoggedSet[];
}

// ─── AI ──────────────────────────────────────────────────────────────────────
export type AIProvider = 'anthropic' | 'openai' | 'groq' | 'gemini';

export interface AIProviderInfo {
  label: string;
  hint: string;
  free: boolean;
}

export type AIStatus = 'idle' | 'loading' | 'done' | 'error' | 'nokey' | 'nodata';

// ─── Navigation ──────────────────────────────────────────────────────────────
export type ScreenName = 'home' | 'workout' | 'data' | 'config';
