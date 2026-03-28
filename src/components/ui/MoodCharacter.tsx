import type { MoodId } from '../../types';

const MOODS = {
  crushed: { bg: '#C8FF00', pupilColor: '#000', label: 'CRUSHED IT',     sublabel: 'Absolute beast mode' },
  solid:   { bg: '#4CAF50', pupilColor: '#000', label: 'SOLID SESSION',   sublabel: 'Good solid work' },
  meh:     { bg: '#FF9800', pupilColor: '#000', label: 'JUST OK',         sublabel: 'Some days are like that' },
  rough:   { bg: '#f44336', pupilColor: '#fff', label: 'ROUGH DAY',       sublabel: 'Rest up, come back stronger' },
};

export default function MoodCharacter({ mood }: { mood: MoodId | null }) {
  const m = mood ? MOODS[mood] : { bg: '#222', pupilColor: '#fff', label: 'HOW DO YOU FEEL?', sublabel: 'Tap a face below' };
  const pc = m.pupilColor;

  const eyes = mood ? {
    crushed: {
      left:  <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="32" r="8" fill={pc}/><path d="M 18 20 Q 30 10 42 20" stroke={pc} strokeWidth="3" fill="none" strokeLinecap="round"/></>,
      right: <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="32" r="8" fill={pc}/><path d="M 18 20 Q 30 10 42 20" stroke={pc} strokeWidth="3" fill="none" strokeLinecap="round"/></>,
      mouth: <path d="M 20 10 Q 40 28 60 10" stroke={pc} strokeWidth="5" fill="none" strokeLinecap="round"/>,
    },
    solid: {
      left:  <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="34" r="9" fill={pc}/></>,
      right: <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="34" r="9" fill={pc}/></>,
      mouth: <path d="M 20 8 Q 40 22 60 8" stroke={pc} strokeWidth="4.5" fill="none" strokeLinecap="round"/>,
    },
    meh: {
      left:  <><ellipse cx="30" cy="32" rx="18" ry="15" fill="#fff"/><circle cx="30" cy="33" r="8" fill={pc}/></>,
      right: <><ellipse cx="30" cy="32" rx="18" ry="15" fill="#fff"/><circle cx="30" cy="33" r="8" fill={pc}/></>,
      mouth: <path d="M 20 10 Q 40 10 60 10" stroke={pc} strokeWidth="4" fill="none" strokeLinecap="round"/>,
    },
    rough: {
      left:  <><ellipse cx="30" cy="34" rx="18" ry="16" fill="#fff"/><circle cx="30" cy="36" r="8" fill={pc}/><path d="M 18 24 Q 30 30 42 24" stroke={pc} strokeWidth="3" fill="none" strokeLinecap="round"/></>,
      right: <><ellipse cx="30" cy="34" rx="18" ry="16" fill="#fff"/><circle cx="30" cy="36" r="8" fill={pc}/><path d="M 18 24 Q 30 30 42 24" stroke={pc} strokeWidth="3" fill="none" strokeLinecap="round"/></>,
      mouth: <path d="M 20 16 Q 40 4 60 16" stroke={pc} strokeWidth="4.5" fill="none" strokeLinecap="round"/>,
    },
  }[mood] : null;

  const e = eyes || {
    left:  <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="34" r="9" fill="#888"/></>,
    right: <><ellipse cx="30" cy="32" rx="18" ry="18" fill="#fff"/><circle cx="30" cy="34" r="9" fill="#888"/></>,
    mouth: <path d="M 20 10 Q 40 14 60 10" stroke="#888" strokeWidth="4" fill="none" strokeLinecap="round"/>,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 16px' }}>
      <div style={{ width: 140, height: 140, borderRadius: 32, background: m.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'breathe 3s ease-in-out infinite', transition: 'background 0.3s', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <svg width="60" height="60" viewBox="0 0 60 60" style={{ animation: mood ? 'blink 4s ease-in-out infinite' : 'blink 2.5s ease-in-out infinite' }}>{e.left}</svg>
          <svg width="60" height="60" viewBox="0 0 60 60" style={{ animation: mood ? 'blink 4s ease-in-out infinite 0.1s' : 'blink 2.5s ease-in-out infinite 0.1s' }}>{e.right}</svg>
        </div>
        <svg width="80" height="28" viewBox="0 0 80 28" style={{ marginTop: -4 }}>{e.mouth}</svg>
      </div>
      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: mood ? m.bg : '#333', letterSpacing: '0.04em', transition: 'color 0.3s' }}>{m.label}</div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 4, letterSpacing: '0.06em' }}>{m.sublabel}</div>
      </div>
    </div>
  );
}
