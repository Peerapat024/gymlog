import { useState } from 'react';
import { A, B } from '../constants/theme';
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
    { key: 'workout', label: 'WORKOUT', sub: 'Start a session' },
    { key: 'data',    label: 'DATA',    sub: 'Review progress' },
    { key: 'config',  label: 'CONFIG',  sub: 'Exercises & settings' },
  ];

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#000', animation: 'fadeIn 0.2s ease-out both' }}>
      {/* Header */}
      <div style={{ padding: 'max(48px,env(safe-area-inset-top)) 28px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ letterSpacing: '0.3em', fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>GYMLOG</span>
          {DB.get('userName', '') && (
            <div style={{ fontSize: 15, color: '#fff', fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>
              Hey, {DB.get<string>('userName', '')}.
            </div>
          )}
        </div>
        {lastLabel && (
          <div style={{ textAlign: 'right', paddingTop: 2 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', fontWeight: 700 }}>LAST SESSION</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', fontWeight: 700, marginTop: 2 }}>{lastLabel}</div>
          </div>
        )}
      </div>

      {/* Nav tiles */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <button
            key={item.key}
            onTouchStart={() => haptic.light()}
            onPointerDown={(e) => { e.preventDefault(); setPressed(item.key); }}
            onPointerUp={(e) => { e.preventDefault(); setPressed(null); navigate(item.key); }}
            onPointerLeave={() => setPressed(null)}
            style={{
              flex: 1,
              background: pressed === item.key ? '#111' : 'transparent',
              border: 'none',
              borderTop: i > 0 ? `0.5px solid ${B}` : 'none',
              cursor: 'pointer',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.06s',
              transform: pressed === item.key ? 'scale(0.985)' : 'scale(1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 'clamp(50px,13vw,84px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 5, letterSpacing: '0.1em', fontWeight: 600 }}>
                {item.sub.toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 28px',
        paddingBottom: 'max(120px,calc(env(safe-area-inset-bottom)+90px))',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, animation: 'breathe 3s ease-in-out infinite' }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', fontWeight: 600 }}>{today}</span>
      </div>
    </div>
  );
}
