import { A } from '../../constants/theme';
import type { ChartPoint, BarPoint } from '../../types';

export function Sparkline({ data, width = 80, height = 28 }: { data: number[]; width?: number; height?: number }) {
  if (!data || data.length < 2) return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 9, color: '#555' }}>—</span></div>;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - mn) / rng) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = pts.split(' ').slice(-1)[0].split(',');
  return (
    <svg width={width} height={height}>
      <polyline points={pts} fill="none" stroke={A} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={A} />
    </svg>
  );
}

export function LineChart({ points, width, height }: { points: ChartPoint[]; width: number; height: number; yLabel?: string }) {
  if (!points || points.length < 2) return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: '#555', letterSpacing: '0.1em' }}>LOG MORE SESSIONS TO SEE TREND</span></div>;
  const P = { t: 12, r: 16, b: 32, l: 44 };
  const W = width - P.l - P.r, H = height - P.t - P.b;
  const vals = points.map(p => p.y);
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  const toXY = (i: number, v: number) => ({ x: P.l + (i / (points.length - 1)) * W, y: P.t + H - ((v - mn) / rng) * H });
  const coords = points.map((p, i) => toXY(i, p.y));
  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const ticks = [0, 0.33, 0.67, 1].map(t => ({ y: P.t + H - t * H, val: Math.round(mn + t * rng) }));
  const lbls = [0, Math.floor((points.length - 1) / 2), points.length - 1].filter((v, i, a) => a.indexOf(v) === i);
  return (
    <svg width={width} height={height}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={P.l} y1={t.y} x2={P.l + W} y2={t.y} stroke="#1a1a1a" strokeWidth={0.5} />
          <text x={P.l - 6} y={t.y + 4} textAnchor="end" fill="#333" style={{ fontSize: 9, fontFamily: '-apple-system,sans-serif' }}>{t.val}</text>
        </g>
      ))}
      <path d={`${pathD} L${coords[coords.length - 1].x},${P.t + H} L${coords[0].x},${P.t + H} Z`} fill={A} fillOpacity={0.06} />
      <path d={pathD} fill="none" stroke={A} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={points[i].isPR ? 4 : 2.5} fill={points[i].isPR ? '#fff' : A} stroke={points[i].isPR ? A : 'none'} strokeWidth={1.5} />)}
      {lbls.map(i => <text key={i} x={coords[i].x} y={P.t + H + 18} textAnchor="middle" fill="#333" style={{ fontSize: 9, fontFamily: '-apple-system,sans-serif' }}>{new Date(points[i].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>)}
    </svg>
  );
}

export function BarChart({ bars, width, height }: { bars: BarPoint[]; width: number; height: number }) {
  if (!bars || bars.length === 0) return null;
  const P = { t: 12, r: 8, b: 32, l: 44 };
  const W = width - P.l - P.r, H = height - P.t - P.b;
  const maxV = Math.max(...bars.map(b => b.v));
  const bw = Math.min(28, W / bars.length - 4);
  const ticks = [0, 0.5, 1].map(t => ({ y: P.t + H - t * H, val: Math.round(maxV * t) }));
  return (
    <svg width={width} height={height}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={P.l} y1={t.y} x2={P.l + W} y2={t.y} stroke="#1a1a1a" strokeWidth={0.5} />
          <text x={P.l - 6} y={t.y + 4} textAnchor="end" fill="#333" style={{ fontSize: 9, fontFamily: '-apple-system,sans-serif' }}>{t.val > 999 ? `${(t.val / 1000).toFixed(1)}k` : t.val}</text>
        </g>
      ))}
      {bars.map((b, i) => {
        const x = P.l + (i / bars.length) * W + (W / bars.length - bw) / 2;
        const bh = (b.v / maxV) * H;
        const y = P.t + H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={Math.max(bh, 2)} rx={2} fill={A} fillOpacity={0.7} />
            <text x={x + bw / 2} y={P.t + H + 18} textAnchor="middle" fill="#2a2a2a" style={{ fontSize: 8, fontFamily: '-apple-system,sans-serif' }}>{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>
          </g>
        );
      })}
    </svg>
  );
}
