import React from 'react';
import { M } from '../../constants/theme';

export const Lbl = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontSize: 10, color: '#666', letterSpacing: '0.28em', fontWeight: 700, ...style }}>{children}</div>
);

export const Back = ({ onBack, label = '← BACK' }: { onBack: () => void; label?: string }) => (
  <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, padding: 0 }}>
    {label}
  </button>
);

export const BigTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 'clamp(42px,11vw,72px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.98, marginTop: 10 }}>{children}</div>
);

export const AdjBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick} style={{ width: 50, height: 50, borderRadius: 10, background: '#111', border: `0.5px solid #282828`, color: '#888', fontSize: 24, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {label}
  </button>
);

export { M };
