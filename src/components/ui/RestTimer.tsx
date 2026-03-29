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
  const totalRef = useRef(Math.max(1, (endTime - Date.now()) / 1000));
  const initialRem = Math.max(1, Math.round((endTime - Date.now()) / 1000));
  const [rem, setRem] = useState(initialRem);
  const [progress, setProgress] = useState(1); // 1 → 0, continuous
  const [bumped, setBumped] = useState(false);
  const lastHapticSec = useRef<number | null>(null);
  const doneRef = useRef(false);

  // rAF loop — drives the fill height continuously (no stepping)
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const msLeft = endAtRef.current - Date.now();
      const p = Math.max(0, msLeft / (totalRef.current * 1000));
      setProgress(p);
      if (msLeft <= 0) {
        if (!doneRef.current) { doneRef.current = true; onDone(); }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Separate interval — drives the countdown display + haptics
  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((endAtRef.current - Date.now()) / 1000));
      setRem(r);
      if (r <= 3 && r > 0 && r !== lastHapticSec.current) {
        lastHapticSec.current = r;
        haptic.medium();
      }
      if (r <= 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const addThirty = () => {
    haptic.medium();
    endAtRef.current += 30000;
    totalRef.current += 30;
    setRem(r => r + 30);
    setBumped(true);
    setTimeout(() => setBumped(false), 600);
  };

  const mins = Math.floor(rem / 60), secs = rem % 60;
  const ts = mins > 0 ? mins + ':' + (secs < 10 ? '0' : '') + secs : String(secs);
  const urgent = rem <= 10;
  const fillPct = progress * 88 + 2;
  const waveColor = urgent ? 'rgba(255,60,60,0.18)' : 'rgba(200,255,0,0.12)';
  const numColor = urgent ? '#FF453A' : A;

  return (
    <div style={{ position: 'relative', height: '100svh', background: '#000', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Liquid fill — height driven by rAF, no CSS transition needed */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: fillPct + '%', zIndex: 0 }}>
        {/* Single wave at the top edge */}
        <div style={{ position: 'absolute', top: -30, left: 0, right: 0, height: 34, overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: '200%', height: '100%', animation: 'waveSlide 4s linear infinite' }}>
            <svg viewBox="0 0 800 34" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path
                d="M0,17 C100,2 200,32 300,17 C400,2 500,32 600,17 C700,2 800,32 800,17 L800,34 L0,34 Z"
                fill={waveColor}
              />
            </svg>
            <svg viewBox="0 0 800 34" preserveAspectRatio="none" style={{ width: '50%', height: '100%', flexShrink: 0 }}>
              <path
                d="M0,17 C100,2 200,32 300,17 C400,2 500,32 600,17 C700,2 800,32 800,17 L800,34 L0,34 Z"
                fill={waveColor}
              />
            </svg>
          </div>
        </div>
        {/* Solid fill body */}
        <div style={{ position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, background: waveColor }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '56px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', fontWeight: 700 }}>RESTING</span>
          {isPR && (
            <div style={{ fontSize: 10, fontWeight: 800, color: '#000', background: A, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.08em', animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              NEW PR
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
          <div style={{ fontSize: 'clamp(110px,28vw,210px)', fontWeight: 900, color: numColor, letterSpacing: '-0.06em', lineHeight: 1, textAlign: 'center', transition: 'color 0.3s', fontVariantNumeric: 'tabular-nums' }}>
            {ts}
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}>
            {nextLabel}
          </div>
        </div>
        <div style={{ padding: '12px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={addThirty} style={{
            width: '100%', padding: '22px 0',
            background: bumped ? A : 'rgba(200,255,0,0.1)',
            border: '1.5px solid ' + (bumped ? A : 'rgba(200,255,0,0.3)'),
            borderRadius: 16, fontSize: 18, fontWeight: 900, letterSpacing: '0.02em', cursor: 'pointer',
            color: bumped ? '#000' : A,
            transform: bumped ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.18s',
            boxShadow: bumped ? '0 0 24px rgba(200,255,0,0.3)' : 'none',
          }}>
            +30 seconds please 🙏
          </button>
          <button onClick={onDone} style={{ width: '100%', padding: '14px 0', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
            SKIP
          </button>
          <button disabled style={{ width: '100%', padding: '22px 0', background: 'transparent', border: 'none', cursor: 'default', display: 'block' }} />
        </div>
      </div>
    </div>
  );
}
