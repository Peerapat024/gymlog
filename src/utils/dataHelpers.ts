import { DB } from './db';
import { LIBRARY, DEFAULT_TEMPLATES } from '../constants/exercises';
import type { Session, Template, HistoryEntry, LoggedSet } from '../types';

export function getExercises(id: string): string[] {
  const c = DB.get<Record<string, string[]>>('customExercises', {});
  return [...(LIBRARY[id] || []), ...(c[id] || [])];
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
  return s !== null ? s : DEFAULT_TEMPLATES;
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
