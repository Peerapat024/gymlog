import { useState, useEffect, useRef } from 'react';
import { A, D, B } from '../../constants/theme';
import { DB } from '../../utils/db';
import { getPR } from '../../utils/dataHelpers';
import { Back, Lbl } from '../shared';
import { LineChart, BarChart } from './Charts';
import type { Session, ChartPoint, BarPoint } from '../../types';

export default function ExerciseDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const sessions = DB.get<Session[]>('sessions', []);
  const allSets: Array<{ weight: number; reps: number; setNumber: number; isPR: boolean; note?: string; sessionDate: string }> = [];
  sessions.forEach(s => (s.sets || []).filter(st => st.exercise === name).forEach(st => allSets.push({ ...st, sessionDate: s.date })));

  const byS: Record<string, { weight: number; isPR: boolean }> = {};
  allSets.forEach(st => { if (!byS[st.sessionDate] || st.weight > byS[st.sessionDate].weight) byS[st.sessionDate] = { weight: st.weight, isPR: st.isPR }; });
  const spts: ChartPoint[] = Object.entries(byS).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([date, st]) => ({ date, y: st.weight, isPR: st.isPR }));

  const volByS: Record<string, number> = {};
  allSets.forEach(st => { volByS[st.sessionDate] = (volByS[st.sessionDate] || 0) + st.weight * st.reps; });
  const vpts: BarPoint[] = Object.entries(volByS).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([date, v]) => ({ date, v }));

  const pr = getPR(name);
  const totalVol = allSets.reduce((a, st) => a + st.weight * st.reps, 0);
  const [chartW, setChartW] = useState(320);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) setChartW(ref.current.offsetWidth - 4); }, []);

  return (
    <div style={{ minHeight: '100svh', background: '#000', padding: 'max(44px,env(safe-area-inset-top)) 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>
      <Back onBack={onBack} />
      <Lbl style={{ marginTop: 20 }}>EXERCISE</Lbl>
      <div style={{ fontSize: 'clamp(20px,5vw,30px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8, marginBottom: 24, lineHeight: 1.1 }}>{name.toUpperCase()}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        {[{ l: 'PR', v: pr > 0 ? `${pr}KG` : '—' }, { l: 'TOTAL SETS', v: allSets.length || '—' }, { l: 'VOLUME', v: totalVol > 0 ? totalVol.toLocaleString() + 'KG' : '—' }].map(s => (
          <div key={s.l} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '12px 12px' }}><Lbl style={{ marginBottom: 4 }}>{s.l}</Lbl><div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.v}</div></div>
        ))}
      </div>
      <div ref={ref}>
        {spts.length >= 2 ? (
          <>
            <Lbl style={{ marginBottom: 12 }}>TOP WEIGHT PER SESSION</Lbl>
            <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '16px 8px 8px', marginBottom: 20 }}><LineChart points={spts} width={chartW} height={160} /></div>
            <Lbl style={{ marginBottom: 12 }}>VOLUME PER SESSION</Lbl>
            <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '16px 8px 8px', marginBottom: 20 }}><BarChart bars={vpts} width={chartW} height={140} /></div>
          </>
        ) : <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 11, color: '#555', letterSpacing: '0.12em' }}>LOG 2+ SESSIONS TO SEE TREND CHARTS</div>}
      </div>
      <Lbl style={{ marginBottom: 12 }}>ALL SETS</Lbl>
      {allSets.slice().reverse().slice(0, 30).map((st, i) => (
        <div key={i} style={{ padding: '9px 0', borderBottom: `0.5px solid #111` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#666' }}>{new Date(st.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span style={{ fontSize: 10, color: '#555' }}>SET {st.setNumber}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {st.isPR && <span style={{ fontSize: 8, fontWeight: 800, color: '#000', background: A, padding: '2px 6px', borderRadius: 3 }}>PR</span>}
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{st.weight}KG × {st.reps}</span>
            </div>
          </div>
          {st.note && <div style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic', marginTop: 3 }}>{st.note}</div>}
        </div>
      ))}
    </div>
  );
}
