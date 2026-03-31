import React from 'react';
import { M } from '../../constants/theme';

export const Lbl = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.18em', fontWeight: 700, ...style }}>{children}</div>
);

export const Back = ({ onBack, label = '← BACK' }: { onBack: () => void; label?: string }) => (
  <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, padding: 0 }}>
    {label}
  </button>
);

export const BigTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 'clamp(40px,10.5vw,68px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.96, marginTop: 8 }}>{children}</div>
);

export const AdjBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick} style={{ width: 52, height: 52, borderRadius: 14, background: '#161616', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 24, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {label}
  </button>
);

/** Segment / pill tab control container */
export const SegmentWrap = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ display: 'flex', background: '#0C0C0C', borderRadius: 10, padding: 3, gap: 2, ...style }}>{children}</div>
);

/** Single tab button inside a SegmentWrap */
export const SegBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} style={{ flex: 1, padding: '9px 4px', background: active ? '#C8FF00' : 'transparent', border: 'none', borderRadius: 7, color: active ? '#000' : 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', cursor: 'pointer', transition: 'background 0.15s, color 0.15s' }}>
    {children}
  </button>
);

export { M };
