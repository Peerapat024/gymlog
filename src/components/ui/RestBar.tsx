import { useState, useEffect, useRef } from 'react';
import { A } from '../../constants/theme';

export default function RestBar({ restEndsAt }: { restEndsAt: number | null }) {
  const calc = () => restEndsAt ? Math.max(0, Math.round((restEndsAt - Date.now()) / 1000)) : 0;
  const [rem, setRem] = useState(calc);
  const total = useRef(rem);

  useEffect(() => {
    if (!restEndsAt) return;
    total.current = calc();
    const id = setInterval(() => {
      const r = calc();
      setRem(r);
      if (r <= 0) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [restEndsAt]);

  if (!restEndsAt || rem <= 0) return null;
  const pct = Math.min(rem / total.current, 1);
  const mins = Math.floor(rem / 60), secs = rem % 60;
  const ts = mins > 0 ? mins + ':' + (secs < 10 ? '0' : '') + secs : secs + 's';

  return (
    <div style={{ padding: '0 20px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
        <div style={{ flex: 1, height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: (pct * 100) + '%', height: '100%', background: A, borderRadius: 2, transition: 'width 0.5s linear' }} />
        </div>
        <span style={{ fontSize: 10, color: rem < 10 ? A : '#aaa', fontWeight: 700, letterSpacing: '0.06em', minWidth: 28, textAlign: 'right' }}>{ts}</span>
      </div>
    </div>
  );
}
