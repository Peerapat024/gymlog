import { DB } from './db';
import { LIBRARY, EXERCISE_MAP, DEFAULT_SPLITS } from '../constants/exercises';
import type { Session, Template, HistoryEntry, LoggedSet, ExerciseInfo, CustomExercise, TrainingSplit } from '../types';

/** Read custom exercises, migrating old string[] entries to CustomExercise[] */
export function getCustomExercises(): Record<string, CustomExercise[]> {
  const raw = DB.get<Record<string, (string | CustomExercise)[]>>('customExercises', {});
  const migrated: Record<string, CustomExercise[]> = {};
  for (const [part, list] of Object.entries(raw)) {
    migrated[part] = list.map(e => typeof e === 'string' ? { name: e } : e);
  }
  return migrated;
}

export function saveCustomExercises(data: Record<string, CustomExercise[]>): void {
  DB.set('customExercises', data);
}

export function getExercises(id: string): string[] {
  const c = getCustomExercises();
  const builtIn = (LIBRARY[id] || []).map(e => e.name);
  return [...builtIn, ...(c[id] || []).map(e => e.name)];
}

export function getExerciseInfo(name: string): ExerciseInfo | CustomExercise | null {
  if (EXERCISE_MAP[name]) return EXERCISE_MAP[name];
  // Search custom exercises
  const all = getCustomExercises();
  for (const list of Object.values(all)) {
    const found = list.find(e => e.name === name);
    if (found) return found;
  }
  return null;
}

export function getHistory(name: string, n = 3): HistoryEntry[] {
  const s = DB.get<Session[]>('sessions', []);
  const o: HistoryEntry[] = [];
  for (let i = s.length - 1; i >= 0 && o.length < n; i--) {
    const sets = (s[i].sets || []).filter(x => x.exercise === name);
    if (sets.length) o.push({ date: s[i].date, sets });
  }
  return o;
}

export function getPR(name: string): number {
  return DB.get<Session[]>('sessions', []).reduce(
    (b, s) => (s.sets || []).reduce((bb, st) => (st.exercise === name && st.weight > bb ? st.weight : bb), b),
    0,
  );
}

export function getTemplates(): Template[] {
  const s = DB.get<Template[] | null>('templates', null);
  if (s !== null) return s;
  // First launch: seed from all split days, deduplicating by name
  const seenNames = new Set<string>();
  const fromSplits: Template[] = [];
  for (const split of DEFAULT_SPLITS) {
    for (let i = 0; i < split.days.length; i++) {
      const day = split.days[i];
      if (!seenNames.has(day.name)) {
        seenNames.add(day.name);
        fromSplits.push({ id: `split-${split.id}-${i}`, name: day.name, exercises: day.exercises });
      }
    }
  }
  return fromSplits;
}

export function getSplits(): TrainingSplit[] {
  const custom = DB.get<TrainingSplit[] | null>('customSplits', null);
  return custom ? [...DEFAULT_SPLITS, ...custom] : DEFAULT_SPLITS;
}

export function saveSplits(splits: TrainingSplit[]): void {
  // Only save the user-created splits (not defaults)
  const customOnly = splits.filter(s => !DEFAULT_SPLITS.find(d => d.id === s.id));
  DB.set('customSplits', customOnly);
}

export function saveSession(sets: LoggedSet[], startTime: number, note?: string): void {
  const s = DB.get<Session[]>('sessions', []);
  s.push({
    id: Date.now(),
    date: new Date().toISOString(),
    duration: Math.round((Date.now() - startTime) / 60000),
    sets,
    note: note || undefined,
  });
  DB.set('sessions', s);
}

export function exportCSV(sessions: Session[]): void {
  const rows: (string | number)[][] = [['Date', 'Exercise', 'Body Part', 'Set #', 'Weight (kg)', 'Reps', 'Volume', 'PR']];
  sessions.forEach(s =>
    (s.sets || []).forEach(st =>
      rows.push([
        new Date(s.date).toLocaleDateString('en-US'),
        st.exercise, st.bodyPart, st.setNumber,
        st.weight, st.reps, st.weight * st.reps,
        st.isPR ? 'YES' : '',
      ]),
    ),
  );
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymlog_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
