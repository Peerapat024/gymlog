import { useState } from 'react';
import { A } from '../constants/theme';
import { DB } from '../utils/db';
import { haptic } from '../utils/haptics';

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'right' | 'left'>('right');
  const [name, setName] = useState('');
  const [bodyweight, setBodyweight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const goTo = (n: number) => { setDir(n > step ? 'right' : 'left'); setStep(n); };

  const finish = () => {
    if (name.trim()) DB.set('userName', name.trim());
    if (bodyweight) DB.set('bodyweight', bodyweight);
    DB.set('weightUnit', unit);
    DB.set('onboarded', true);
    onDone();
  };

  const anim = dir === 'right' ? 'slideRight 0.22s ease-out both' : 'slideLeft 0.22s ease-out both';

  const Progress = ({ total, current }: { total: number; current: number }) => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 24 : 6, height: 6, borderRadius: 3, background: i === current ? A : i < current ? '#3a5010' : '#1e1e1e', transition: 'all 0.3s ease' }} />
      ))}
    </div>
  );

  const screens = [
    // Step 0 — welcome
    <div key="welcome" style={{ animation: anim, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px' }}>
        <div style={{ fontSize: 11, color: '#3a5010', letterSpacing: '0.3em', fontWeight: 700, marginBottom: 16 }}>WELCOME TO</div>
        <div style={{ fontSize: 'clamp(56px,16vw,96px)', fontWeight: 900, color: A, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 24 }}>GYM<br />LOG</div>
        <div style={{ fontSize: 15, color: '#555', lineHeight: 1.7, fontWeight: 500 }}>Your personal training log.<br />No account. No cloud. Just you and your weights.</div>
      </div>
      <Progress total={3} current={0} />
      <div style={{ padding: '0 24px' }}>
        <button onClick={() => { haptic.light(); goTo(1); }} style={{ width: '100%', padding: '22px', background: A, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000' }}>LET'S SET UP →</button>
        <button disabled style={{ width: '100%', padding: '22px 0', background: '#000', border: 'none', cursor: 'default', display: 'block' }} />
      </div>
    </div>,

    // Step 1 — name
    <div key="name" style={{ animation: anim, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px' }}>
        <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 12 }}>STEP 1 OF 2</div>
        <div style={{ fontSize: 'clamp(32px,8vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>WHAT SHOULD<br />WE CALL YOU?</div>
        <div style={{ fontSize: 13, color: '#444', marginBottom: 36, lineHeight: 1.6 }}>Optional — we'll personalise your session summaries.</div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && goTo(2)} placeholder="Your name..."
          style={{ background: 'transparent', border: 'none', borderBottom: '1.5px solid #2a2a2a', padding: '12px 0', fontSize: 32, fontWeight: 800, color: '#fff', outline: 'none', letterSpacing: '-0.01em', width: '100%' }} />
      </div>
      <Progress total={3} current={1} />
      <div style={{ margin: '0 24px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { haptic.light(); goTo(0); }} style={{ padding: '18px 20px', background: 'transparent', border: '0.5px solid #2a2a2a', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#555' }}>←</button>
          <button onClick={() => { haptic.light(); goTo(2); }} style={{ flex: 1, padding: '20px', background: A, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000' }}>
            {name.trim() ? 'NICE TO MEET YOU, ' + name.trim().toUpperCase() + ' →' : 'SKIP →'}
          </button>
        </div>
        <button disabled style={{ width: '100%', padding: '22px 0', background: '#000', border: 'none', cursor: 'default', display: 'block' }} />
      </div>
    </div>,

    // Step 2 — bodyweight + unit
    <div key="bw" style={{ animation: anim, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px' }}>
        <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 12 }}>STEP 2 OF 2</div>
        <div style={{ fontSize: 'clamp(32px,8vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>YOUR BODY<br />WEIGHT?</div>
        <div style={{ fontSize: 13, color: '#444', marginBottom: 32, lineHeight: 1.6 }}>Used for bodyweight exercises like pull-ups and dips. You can update this anytime in CONFIG.</div>
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#111', border: '0.5px solid #222', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', left: unit === 'lbs' ? '50%' : '0%', background: A, borderRadius: 11, transition: 'left 0.18s ease' }} />
          <button onClick={() => setUnit('kg')} style={{ flex: 1, position: 'relative', zIndex: 1, padding: '14px 0', background: 'transparent', border: 'none', fontSize: 15, fontWeight: 900, color: unit === 'kg' ? '#000' : '#444', cursor: 'pointer', letterSpacing: '0.06em' }}>KG</button>
          <button onClick={() => setUnit('lbs')} style={{ flex: 1, position: 'relative', zIndex: 1, padding: '14px 0', background: 'transparent', border: 'none', fontSize: 15, fontWeight: 900, color: unit === 'lbs' ? '#000' : '#444', cursor: 'pointer', letterSpacing: '0.06em' }}>LBS</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <input type="text" inputMode="decimal" value={bodyweight} onChange={e => { if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) setBodyweight(e.target.value); }} placeholder="75"
            style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1.5px solid #2a2a2a', padding: '12px 0', fontSize: 48, fontWeight: 900, color: '#fff', outline: 'none', letterSpacing: '-0.02em', minWidth: 0 }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>{unit.toUpperCase()}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: '#333', letterSpacing: '0.1em' }}>This also sets your default weight unit across the app.</div>
      </div>
      <Progress total={3} current={2} />
      <div style={{ margin: '0 24px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { haptic.light(); goTo(1); }} style={{ padding: '18px 20px', background: 'transparent', border: '0.5px solid #2a2a2a', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#555' }}>←</button>
          <button onClick={() => { haptic.medium(); finish(); }} style={{ flex: 1, padding: '20px', background: A, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000' }}>
            {bodyweight ? "ALL SET, LET'S LIFT →" : 'SKIP →'}
          </button>
        </div>
        <button disabled style={{ width: '100%', padding: '22px 0', background: '#000', border: 'none', cursor: 'default', display: 'block' }} />
      </div>
    </div>,
  ];

  return (
    <div style={{ height: '100svh', background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 6, background: '#111', flexShrink: 0 }}>
        <div style={{ height: '100%', background: A, width: ((step / 2) * 100) + '%', transition: 'width 0.3s ease', borderRadius: 3 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 0 0', overflow: 'hidden' }}>
        {screens[step]}
      </div>
    </div>
  );
}
