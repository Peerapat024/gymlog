import { useState } from 'react';
import { A, D, B } from '../../constants/theme';
import type { Session } from '../../types';

interface HistoryCardProps {
  session: Session;
  vol: number;
  prs: number;
  date: Date;
}

export default function HistoryCard({ session, vol, prs, date }: HistoryCardProps) {
  const [open, setOpen] = useState(false);
  const byCnt: Record<string, number> = {};
  (session.sets || []).forEach(s => { byCnt[s.exercise] = (byCnt[s.exercise] || 0) + 1; });

  return (
    <div style={{ border: `0.5px solid ${B}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: D, border: 'none', padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#888' }}>{session.sets?.length || 0} SETS</span>
            <span style={{ fontSize: 10, color: '#888' }}>{session.duration || 0}MIN</span>
            <span style={{ fontSize: 10, color: '#888' }}>{vol.toLocaleString()} VOL</span>
            {prs > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '1px 6px', borderRadius: 3 }}>{prs} PR{prs > 1 ? 'S' : ''}</span>}
          </div>
        </div>
        <span style={{ fontSize: 15, color: '#888', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div style={{ background: '#0a0a0a', padding: '10px 16px', borderTop: `0.5px solid #111` }}>
          {Object.entries(byCnt).map(([ex, cnt], i) => {
            const sets = (session.sets || []).filter(s => s.exercise === ex);
            const best = Math.max(...sets.map(s => s.weight));
            return (
              <div key={ex} style={{ padding: '7px 0', borderBottom: i < Object.keys(byCnt).length - 1 ? `0.5px solid #111` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{ex}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 10, color: '#555' }}>{cnt} sets</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#383838' }}>{best}KG top</span>
                  </div>
                </div>
                {sets.filter(s => s.note).map((s, ni) => (
                  <div key={ni} style={{ fontSize: 10, color: '#555', fontStyle: 'italic', marginTop: 2 }}>S{s.setNumber}: {s.note}</div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
