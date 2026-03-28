import { useState } from 'react';
import { A, B, M } from '../../constants/theme';
import { DB } from '../../utils/db';
import { callAI, buildPrompt, PROVIDERS } from '../../utils/ai';
import { Lbl } from '../shared';
import type { Session, AIProvider, AIStatus } from '../../types';

export default function AiCoach({ sessions }: { sessions: Session[] }) {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [text, setText] = useState('');
  const provider = DB.get<AIProvider>('aiProvider', 'anthropic');
  const key = DB.get<string>(`aiKey_${provider}`, '');
  const pInfo = PROVIDERS[provider];
  const hasKey = key.length > 8;
  const hasData = sessions.length >= 2;

  const run = async () => {
    if (!hasKey) { setStatus('nokey'); return; }
    if (!hasData) { setStatus('nodata'); return; }
    setStatus('loading'); setText('');
    const bw = DB.get<string>('bodyweight', '');
    try {
      const result = await callAI(provider, key, buildPrompt(sessions, bw), t => setText(t));
      setText(result); setStatus('done');
    } catch (e) {
      setText((e as Error).message); setStatus('error');
    }
  };

  const fmt = (t: string) => t.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 10 }} />;
    const isH = /^\d\.|^#+/.test(line.trim());
    const isBullet = /^[•\-*]/.test(line.trim());
    return <div key={i} style={{ fontSize: isH ? 12 : 13, fontWeight: isH ? 800 : 400, color: isH ? A : '#5a5a5a', lineHeight: 1.7, paddingLeft: isBullet ? 8 : 0, marginTop: isH ? 14 : 0, marginBottom: isH ? 4 : 0, letterSpacing: isH ? '0.08em' : '0.01em' }}>{line}</div>;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.12em', fontWeight: 700 }}>USING</div>
        <div style={{ fontSize: 9, color: hasKey ? A : '#333', background: '#0f0f0f', border: `0.5px solid ${B}`, padding: '3px 10px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.06em' }}>{pInfo.label.toUpperCase()}</div>
        {pInfo.free && <div style={{ fontSize: 9, color: '#3a5010', background: '#0c100a', border: `0.5px solid #2a3a10`, padding: '3px 8px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.06em' }}>FREE TIER</div>}
      </div>

      {status === 'nokey' && <div style={{ background: '#111', border: `0.5px solid ${B}`, borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}><div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.7 }}>No key for <span style={{ color: A }}>{pInfo.label}</span>. Go to <span style={{ color: A }}>CONFIG → AI PROVIDER</span> to add your key.</div></div>}
      {status === 'nodata' && <div style={{ background: '#111', border: `0.5px solid ${B}`, borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}><div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.7 }}>Need at least 2 sessions to analyse your training.</div></div>}
      {status === 'error' && <div style={{ background: '#150a0a', border: `0.5px solid #3a1010`, borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}><Lbl style={{ color: '#5a2020', marginBottom: 6 }}>ERROR</Lbl><div style={{ fontSize: 11, color: '#4a2a2a', lineHeight: 1.6, fontFamily: 'monospace' }}>{text}</div></div>}

      {(['idle', 'nokey', 'nodata', 'error'] as AIStatus[]).includes(status) && (
        <button onClick={run} style={{ width: '100%', padding: '20px 0', background: hasKey && hasData ? A : 'transparent', border: `0.5px solid ${hasKey && hasData ? A : B}`, borderRadius: 12, fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer', color: hasKey && hasData ? '#000' : '#333' }}>
          {status === 'error' ? 'TRY AGAIN' : 'ANALYSE MY TRAINING'}
        </button>
      )}

      {status === 'loading' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: 11, color: M, letterSpacing: '0.12em' }}>ANALYSING WITH {pInfo.label.split('(')[0].trim().toUpperCase()}...</span>
          </div>
          {text && <div style={{ background: '#0c0c0c', border: `0.5px solid ${B}`, borderRadius: 12, padding: '20px 18px' }}>{fmt(text)}<span style={{ display: 'inline-block', width: 2, height: 14, background: A, marginLeft: 2, verticalAlign: 'middle', animation: 'cursorBlink 0.8s infinite' }} /></div>}
        </div>
      )}

      {status === 'done' && (
        <div>
          <div style={{ background: '#0c0c0c', border: `0.5px solid #1a2a00`, borderRadius: 12, padding: '20px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Lbl style={{ color: '#3a5010' }}>AI COACH REPORT</Lbl>
              <span style={{ fontSize: 10, color: '#555' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            {fmt(text)}
          </div>
          <button onClick={run} style={{ width: '100%', padding: '14px 0', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 10, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', color: '#666' }}>REFRESH ANALYSIS</button>
        </div>
      )}
    </div>
  );
}
