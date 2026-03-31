import { useState, useEffect, useRef } from 'react';
import { A, D, B } from '../constants/theme';
import { DB } from '../utils/db';
import { exportCSV } from '../utils/dataHelpers';
import { Back, Lbl, BigTitle, SegmentWrap, SegBtn } from '../components/shared';
import { LineChart } from '../components/ui/Charts';
import { Sparkline } from '../components/ui/Charts';
import HistoryCard from '../components/ui/HistoryCard';
import AiCoach from '../components/ui/AiCoach';
import ExerciseDetail from '../components/ui/ExerciseDetail';
import type { Session, ScreenName, ChartPoint, ExerciseSummary } from '../types';

export default function DataScreen({ navigate }: { navigate: (s: ScreenName) => void }) {
  const [tab, setTab] = useState<'overview' | 'exercises' | 'history' | 'coach'>('overview');
  const [selEx, setSelEx] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [chartW, setChartW] = useState(320);
  const ref = useRef<HTMLDivElement>(null);
  const sessions = DB.get<Session[]>('sessions', []);
  useEffect(() => { if (ref.current) setChartW(ref.current.offsetWidth - 4); }, [tab]);

  if (selEx) return <ExerciseDetail name={selEx} onBack={() => setSelEx(null)} />;

  const totalPRs = sessions.reduce((a, s) => a + (s.sets || []).filter(st => st.isPR).length, 0);
  const avgDuration = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / sessions.length) : 0;
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); weekStart.setHours(0, 0, 0, 0);
  const volThisWeek = sessions.filter(s => new Date(s.date) >= weekStart).reduce((a, s) => a + (s.sets || []).reduce((b, st) => b + st.weight * st.reps, 0), 0);
  const sessionsThisMonth = sessions.filter(s => { const d = new Date(s.date); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;

  const volLine: ChartPoint[] = sessions.slice(-12).map(s => ({ date: s.date, y: (s.sets || []).reduce((a, st) => a + st.weight * st.reps, 0), isPR: false }));
  const mCount: Record<string, number> = {};
  sessions.forEach(s => { new Set((s.sets || []).map(st => st.bodyPart)).forEach(p => { mCount[p] = (mCount[p] || 0) + 1; }); });
  const mMax = Math.max(...Object.values(mCount), 1);

  const exMap: Record<string, { bodyPart: string; weights: number[]; dates: string[] }> = {};
  sessions.forEach(s => (s.sets || []).forEach(st => {
    if (!exMap[st.exercise]) exMap[st.exercise] = { bodyPart: st.bodyPart, weights: [], dates: [] };
    exMap[st.exercise].weights.push(st.weight);
    exMap[st.exercise].dates.push(s.date);
  }));
  const exList: ExerciseSummary[] = Object.entries(exMap)
    .map(([name, d]) => ({ name, bodyPart: d.bodyPart, pr: Math.max(...d.weights), sessions: new Set(d.dates).size, sparkData: d.weights.slice(-8) }))
    .sort((a, b) => b.sessions - a.sessions)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { l: 'VOL THIS WEEK', v: volThisWeek > 0 ? volThisWeek.toLocaleString() + 'KG' : '—' },
    { l: 'PRs SET',       v: totalPRs || '—' },
    { l: 'THIS MONTH',    v: sessionsThisMonth ? sessionsThisMonth + (sessionsThisMonth === 1 ? ' SESSION' : ' SESSIONS') : '—' },
    { l: 'AVG DURATION',  v: avgDuration ? avgDuration + 'MIN' : '—' },
  ];

  return (
    <div style={{ minHeight: '100svh', background: '#000', animation: 'fadeIn 0.2s ease-out both' }}>
      {/* Header */}
      <div style={{ padding: '52px 28px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Back onBack={() => navigate('home')} />
        <button onClick={() => exportCSV(sessions)} style={{ background: 'none', border: `0.5px solid ${B}`, borderRadius: 7, padding: '7px 14px', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700 }}>
          EXPORT CSV
        </button>
      </div>
      <div style={{ padding: '0 28px 20px' }}>
        <Lbl>DATA</Lbl>
        <BigTitle>YOUR<br />PROGRESS</BigTitle>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 28px 20px' }}>
        {stats.map(s => (
          <div key={s.l} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '16px 16px' }}>
            <Lbl style={{ marginBottom: 6 }}>{s.l}</Lbl>
            <div style={{ fontSize: String(s.v).length > 6 ? 18 : 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Segment tab control */}
      <div style={{ padding: '0 28px 24px' }}>
        <SegmentWrap>
          <SegBtn active={tab === 'overview'}   onClick={() => setTab('overview')}>OVERVIEW</SegBtn>
          <SegBtn active={tab === 'exercises'}  onClick={() => setTab('exercises')}>EXERCISES</SegBtn>
          <SegBtn active={tab === 'history'}    onClick={() => setTab('history')}>HISTORY</SegBtn>
          <SegBtn active={tab === 'coach'}      onClick={() => setTab('coach')}>AI COACH</SegBtn>
        </SegmentWrap>
      </div>

      <div ref={ref} style={{ padding: '0 28px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>

        {tab === 'overview' && (sessions.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', fontWeight: 600 }}>NO SESSIONS YET</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 10, letterSpacing: '0.06em' }}>GO LIFT SOMETHING</div>
            </div>
          ) : (
            <>
              <Lbl style={{ marginBottom: 12 }}>VOLUME TREND (LAST 12 SESSIONS)</Lbl>
              <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 14, padding: '16px 6px 8px', marginBottom: 24 }}>
                <LineChart points={volLine} width={chartW} height={160} />
              </div>
              <Lbl style={{ marginBottom: 12 }}>MUSCLE FREQUENCY</Lbl>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {Object.entries(mCount).sort((a, b) => b[1] - a[1]).map(([part, cnt]) => (
                  <div key={part} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', fontWeight: 700, width: 85, flexShrink: 0 }}>{part.toUpperCase()}</span>
                    <div style={{ flex: 1, height: 6, background: '#0D0D0D', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(cnt / mMax) * 100}%`, height: '100%', background: A, borderRadius: 3, opacity: 0.85 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', width: 32, textAlign: 'right', fontWeight: 700 }}>{cnt}×</span>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {tab === 'exercises' && (
          <div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH EXERCISES..."
              style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 13, outline: 'none', letterSpacing: '0.06em', marginBottom: 14 }}
            />
            {exList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em' }}>
                {sessions.length === 0 ? 'NO SESSIONS YET — GO LIFT' : 'NO MATCHES'}
              </div>
            )}
            {exList.map(ex => (
              <button key={ex.name} onClick={() => setSelEx(ex.name)} style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 11, padding: '15px 16px', marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{ex.name}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', fontWeight: 700 }}>{ex.bodyPart?.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 5 }}>
                    <span style={{ fontSize: 12, color: A, fontWeight: 700 }}>PR {ex.pr}KG</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{ex.sessions} SESSION{ex.sessions !== 1 ? 'S' : ''}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkline data={ex.sparkData} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>›</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div>
            {sessions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em' }}>NO SESSIONS YET</div>
            )}
            {sessions.slice().reverse().map((s, i) => {
              const vol = (s.sets || []).reduce((a, st) => a + st.weight * st.reps, 0);
              const prs = (s.sets || []).filter(st => st.isPR).length;
              return <HistoryCard key={s.id || i} session={s} vol={vol} prs={prs} date={new Date(s.date)} />;
            })}
          </div>
        )}

        {tab === 'coach' && (
          <div>
            <div style={{ fontSize: 'clamp(26px,6vw,38px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>AI COACH</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em', lineHeight: 1.6, marginBottom: 20 }}>
              Analyses your full training history — plateaus, imbalances, volume trends, what to focus on next.
            </div>
            <AiCoach sessions={sessions} />
          </div>
        )}
      </div>
    </div>
  );
}
