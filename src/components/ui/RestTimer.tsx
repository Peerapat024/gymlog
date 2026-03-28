import { useState, useEffect, useRef } from 'react';
import { A } from '../../constants/theme';
import { haptic } from '../../utils/haptics';

interface RestTimerProps {
  endTime: number;
  onDone: () => void;
  isPR?: boolean;
  nextLabel?: string;
}

export default function RestTimer({ endTime, onDone, isPR, nextLabel }: RestTimerProps) {
  const endAtRef = useRef(endTime);
  const initialRem = Math.max(1, Math.round((endTime - Date.now()) / 1000));
  const [rem, setRem] = useState(initialRem);
  const [total, setTotal] = useState(initialRem);
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((endAtRef.current - Date.now()) / 1000));
      setRem(r);
      if (r <= 0) { clearInterval(id); onDone(); }
    }, 250);
    return () => clearInterval(id);
  }, []);

  const addThirty = () => {
    haptic.medium();
    endAtRef.current += 30000;
    setTotal(t => t + 30);
    setBumped(true);
    setTimeout(() => setBumped(false), 600);
  };

  const pct = rem / total;
  const mins = Math.floor(rem / 60), secs = rem % 60;
  const ts = mins > 0 ? mins + ':' + (secs < 10 ? '0' : '') + secs : String(secs);
  const urgent = rem <= 10;
  const liquidColor = urgent ? 'rgba(255,60,60,0.2)' : 'rgba(200,255,0,0.13)';
  const liquidEdge = urgent ? 'rgba(255,60,60,0.45)' : 'rgba(200,255,0,0.35)';
  const numColor = urgent ? '#ff4040' : A;
  const fillPct = pct * 88 + 2;

  return (
    <div style={{ position: 'relative', height: '100svh', background: '#080808', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Liquid fill */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: fillPct + '%', transition: 'height 1s ease-out', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -28, left: 0, right: 0, height: 32, overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: '200%', height: '100%', animation: 'waveSlide 3s linear infinite' }}>
            <svg viewBox="0 0 400 32" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path d="M0,16 C50,2 100,30 150,16 C200,2 250,30 300,16 C350,2 400,30 400,16 L400,32 L0,32 Z" fill={liquidColor} />
            </svg>
            <svg viewBox="0 0 400 32" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path d="M0,16 C50,2 100,30 150,16 C200,2 250,30 300,16 C350,2 400,30 400,16 L400,32 L0,32 Z" fill={liquidColor} />
            </svg>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, background: liquidColor }} />
        <div style={{ position: 'absolute', top: -18, left: 0, right: 0, height: 24, overflow: 'hidden', opacity: 0.5 }}>
          <div style={{ display: 'flex', width: '200%', height: '100%', animation: 'waveSlide 4.5s linear infinite reverse' }}>
            <svg viewBox="0 0 400 24" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path d="M0,12 C66,0 133,24 200,12 C266,0 333,24 400,12 L400,24 L0,24 Z" fill={liquidEdge} />
            </svg>
            <svg viewBox="0 0 400 24" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path d="M0,12 C66,0 133,24 200,12 C266,0 333,24 400,12 L400,24 L0,24 Z" fill={liquidEdge} />
            </svg>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 4, left: 0, right: 0, height: '1px', background: liquidEdge }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '56px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#666', letterSpacing: '0.25em', fontWeight: 700 }}>RESTING</span>
          {isPR && <div style={{ fontSize: 10, fontWeight: 800, color: '#000', background: A, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.08em', animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}>NEW PR</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
          <div style={{ fontSize: 'clamp(110px,28vw,210px)', fontWeight: 900, color: numColor, letterSpacing: '-0.06em', lineHeight: 1, textAlign: 'center', transition: 'color 0.3s', fontVariantNumeric: 'tabular-nums' }}>
            {ts}
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: '#888', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}>
            {nextLabel}
          </div>
        </div>
        <div style={{ padding: '12px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={addThirty} style={{
            width: '100%', padding: '22px 0',
            background: bumped ? A : 'rgba(200,255,0,0.12)',
            border: '1.5px solid ' + (bumped ? A : 'rgba(200,255,0,0.4)'),
            borderRadius: 16, fontSize: 18, fontWeight: 900, letterSpacing: '0.02em', cursor: 'pointer',
            color: bumped ? '#000' : A, transform: bumped ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.18s',
            boxShadow: bumped ? '0 0 24px rgba(200,255,0,0.35)' : '0 0 12px rgba(200,255,0,0.12)',
            animation: bumped ? 'savePulse 0.5s ease-out' : 'none',
          }}>
            +30 seconds please 🙏
          </button>
          <button onClick={onDone} style={{ width: '100%', padding: '14px 0', background: 'transparent', border: '0.5px solid #333', borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', color: '#777' }}>
            SKIP
          </button>
          <button disabled style={{ width: '100%', padding: '22px 0', background: 'transparent', border: 'none', cursor: 'default', display: 'block' }} />
        </div>
      </div>
    </div>
  );
}
