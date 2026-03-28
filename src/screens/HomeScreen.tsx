import { useState } from 'react';
import { A, B, M } from '../constants/theme';
import { DB } from '../utils/db';
import { haptic } from '../utils/haptics';
import type { ScreenName, Session } from '../types';

export default function HomeScreen({ navigate }: { navigate: (s: ScreenName) => void }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const sessions = DB.get<Session[]>('sessions', []);
  const last = sessions.slice(-1)[0];
  const daysSinceLast = last ? Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000) : null;
  const lastLabel = daysSinceLast === 0 ? 'TODAY' : daysSinceLast === 1 ? 'YESTERDAY' : daysSinceLast != null ? daysSinceLast + 'D AGO' : null;
  const [pressed, setPressed] = useState<string | null>(null);

  const items: { key: ScreenName; label: string; sub: string }[] = [
    { key: 'workout', label: 'WORKOUT', sub: 'Start a new session' },
    { key: 'data',    label: 'DATA',    sub: 'Review your progress' },
    { key: 'config',  label: 'CONFIG',  sub: 'Exercises & settings' },
  ];

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both' }}>
      <div style={{ padding: 'max(44px,env(safe-area-inset-top)) 32px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span style={{ letterSpacing: '0.35em', fontSize: 11, color: M, fontWeight: 600 }}>GYMLOG</span>
          {DB.get('userName', '') && <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 3, letterSpacing: '-0.01em' }}>Hey, {DB.get<string>('userName', '')}.</div>}
        </div>
        {lastLabel && <span style={{ fontSize: 10, color: '#666', letterSpacing: '0.1em' }}>LAST {lastLabel}</span>}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <button key={item.key}
            onTouchStart={() => haptic.light()}
            onPointerDown={() => setPressed(item.key)}
            onPointerUp={() => { setPressed(null); navigate(item.key); }}
            onPointerLeave={() => setPressed(null)}
            style={{ flex: 1, background: pressed === item.key ? '#0f0f0f' : 'transparent', border: 'none', borderTop: i > 0 ? `0.5px solid ${B}` : 'none', cursor: 'pointer', padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', transition: 'background 0.08s, transform 0.12s', transform: pressed === item.key ? 'scale(0.97)' : 'scale(1)' }}>
            <span style={{ fontSize: 'clamp(52px,13vw,88px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{item.label}</span>
            <span style={{ fontSize: 12, color: '#777', marginTop: 6, letterSpacing: '0.06em', fontWeight: 500 }}>{item.sub.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: '16px 32px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: A }} />
        <span style={{ fontSize: 10, color: '#666', letterSpacing: '0.12em' }}>{today}</span>
      </div>
    </div>
  );
}
