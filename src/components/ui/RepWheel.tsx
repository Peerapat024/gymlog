import { useEffect, useRef } from 'react';
import { A } from '../../constants/theme';
import { haptic } from '../../utils/haptics';

interface RepWheelProps {
  value: string;
  onChange: (v: string) => void;
}

export default function RepWheel({ value, onChange }: RepWheelProps) {
  const COMMON = new Set([5, 8, 10, 12, 15]);
  const ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);
  const ITEM_W = 56;
  const scrollRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settling = useRef(false);
  const lastHapticN = useRef<number | null>(null);

  const selectedNum = parseInt(value) || null;

  const getScrollLeft = (n: number) => Math.max(0, (n - 1) * ITEM_W);

  const scrollTo = (n: number, smooth = true) => {
    if (!scrollRef.current) return;
    settling.current = true;
    scrollRef.current.scrollTo({ left: getScrollLeft(n), behavior: smooth ? 'smooth' : 'auto' });
    setTimeout(() => { settling.current = false; }, 400);
  };

  useEffect(() => {
    const n = selectedNum || 8;
    requestAnimationFrame(() => {
      scrollTo(n, false);
      if (!selectedNum) onChange(String(n));
    });
  }, []);

  const prevValue = useRef(value);
  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      if (selectedNum) scrollTo(selectedNum);
    }
  }, [value]);

  const snapToNearest = () => {
    if (!scrollRef.current || settling.current) return;
    const el = scrollRef.current;
    const idx = Math.round(el.scrollLeft / ITEM_W);
    const n = Math.max(1, Math.min(20, idx + 1));
    settling.current = true;
    el.scrollTo({ left: getScrollLeft(n), behavior: 'smooth' });
    setTimeout(() => { settling.current = false; }, 400);
    onChange(String(n));
  };

  const handleTouchMove = () => {
    if (settling.current || !scrollRef.current) return;
    const el = scrollRef.current;
    const idx = Math.round(el.scrollLeft / ITEM_W);
    const n = Math.max(1, Math.min(30, idx + 1));
    if (n !== lastHapticN.current) {
      lastHapticN.current = n;
      haptic.tick();
    }
  };

  const handleScroll = () => {
    if (settling.current) return;
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(snapToNearest, 100);
  };

  const selectItem = (n: number) => { haptic.tick(); onChange(String(n)); scrollTo(n); };

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 56, background: 'linear-gradient(to right,#080808,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 56, background: 'linear-gradient(to left,#080808,transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: ITEM_W, height: 64, border: '1px solid #3a3a3a', borderRadius: 10, background: 'rgba(255,255,255,0.03)', zIndex: 1, pointerEvents: 'none' }} />
      <div ref={scrollRef} onScroll={handleScroll} onTouchMove={handleTouchMove}
        style={{ overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: 'center', height: 80 }}>
        <style>{'div::-webkit-scrollbar{display:none}'}</style>
        <div style={{ flexShrink: 0, width: 'calc(50% - 28px)' }} />
        {ITEMS.map(n => {
          const isSelected = selectedNum === n;
          const isCommon = COMMON.has(n);
          return (
            <div key={n} onClick={() => selectItem(n)}
              style={{ flexShrink: 0, width: ITEM_W, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
              <span style={{ fontSize: isSelected ? 34 : isCommon ? 19 : 15, fontWeight: isSelected ? 900 : isCommon ? 700 : 400, color: isSelected ? A : isCommon ? '#ccc' : '#333', letterSpacing: '-0.02em', lineHeight: 1, transition: 'font-size 0.15s,color 0.15s' }}>{n}</span>
              <div style={{ width: isSelected ? 5 : isCommon ? 4 : 2, height: isSelected ? 5 : isCommon ? 4 : 2, borderRadius: '50%', background: isSelected ? A : isCommon ? '#555' : '#222', transition: 'all 0.15s' }} />
            </div>
          );
        })}
        <div style={{ flexShrink: 0, width: 'calc(50% - 28px)' }} />
      </div>
    </div>
  );
}
