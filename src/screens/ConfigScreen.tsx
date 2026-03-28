import { useState } from 'react';
import { A, D, B, M } from '../constants/theme';
import { DB } from '../utils/db';
import { haptic } from '../utils/haptics';
import { getExercises, getTemplates } from '../utils/dataHelpers';
import { Back, Lbl, BigTitle } from '../components/shared';
import { PROVIDERS } from '../utils/ai';
import { LIBRARY, ALL_PARTS } from '../constants/exercises';
import type { ScreenName, AIProvider, Template, WeightUnit } from '../types';

/* ─── Library Screen ────────────────────────────────────────────────────────── */
function LibraryScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'exercises' | 'templates'>('exercises');
  const [customEx, setCustomEx] = useState(() => DB.get<Record<string, string[]>>('customExercises', {}));
  const [selPart, setSelPart] = useState('chest');
  const [newName, setNewName] = useState('');
  const [templates, setTemplates] = useState(() => getTemplates());
  const [editingTpl, setEditingTpl] = useState<Template | null>(null);
  const [tplName, setTplName] = useState('');
  const [tplPart, setTplPart] = useState('chest');

  const saveCEx = (u: Record<string, string[]>) => { setCustomEx(u); DB.set('customExercises', u); };
  const saveTpls = (u: Template[]) => { setTemplates(u); DB.set('templates', u); };
  const addEx = () => {
    const n = newName.trim(); if (!n) return;
    saveCEx({ ...customEx, [selPart]: [...(customEx[selPart] || []), n] });
    setNewName('');
  };
  const delEx = (part: string, name: string) => saveCEx({ ...customEx, [part]: (customEx[part] || []).filter(e => e !== name) });
  const toggleEx = (name: string, bodyPart: string) => {
    if (!editingTpl) return;
    const ex = editingTpl.exercises.find(e => e.name === name);
    setEditingTpl({ ...editingTpl, exercises: ex ? editingTpl.exercises.filter(e => e.name !== name) : [...editingTpl.exercises, { name, bodyPart }] });
  };
  const saveTpl = () => {
    const n = tplName.trim();
    if (!n || !editingTpl || !editingTpl.exercises.length) return;
    const t = { ...editingTpl, name: n };
    const ex = templates.find(x => x.id === t.id);
    saveTpls(ex ? templates.map(x => x.id === t.id ? t : x) : [...templates, t]);
    setEditingTpl(null);
  };

  const tabBtn = (key: typeof tab, label: string) => (
    <button onClick={() => setTab(key)} style={{ flex: 1, padding: '11px 0', background: tab === key ? A : 'transparent', border: `0.5px solid ${tab === key ? A : B}`, borderRadius: 8, color: tab === key ? '#000' : M, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer' }}>{label}</button>
  );

  if (editingTpl) {
    const allFP = getExercises(tplPart);
    const canSave = tplName.trim() && editingTpl.exercises.length > 0;
    return (
      <div style={{ minHeight: '100svh', background: '#080808', padding: 'max(44px,env(safe-area-inset-top)) 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>
        <Back onBack={() => setEditingTpl(null)} /><Lbl style={{ marginTop: 20 }}>TEMPLATE</Lbl>
        <BigTitle>{editingTpl.exercises.length === 0 ? 'BUILD\nTEMPLATE' : `${editingTpl.exercises.length} SELECTED`}</BigTitle>
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <Lbl style={{ marginBottom: 8 }}>TEMPLATE NAME</Lbl>
          <input value={tplName} onChange={e => setTplName(e.target.value)} placeholder="e.g. Push Day" style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 8, padding: '13px 14px', color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
        </div>
        {editingTpl.exercises.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Lbl style={{ marginBottom: 8 }}>SELECTED</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {editingTpl.exercises.map(e => <button key={e.name} onClick={() => toggleEx(e.name, e.bodyPart)} style={{ padding: '6px 12px', background: '#1a2a00', border: `0.5px solid #3a5010`, borderRadius: 6, color: A, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{e.name} ×</button>)}
            </div>
          </div>
        )}
        <Lbl style={{ marginBottom: 8 }}>ADD FROM</Lbl>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {ALL_PARTS.map(p => <button key={p.id} onClick={() => setTplPart(p.id)} style={{ padding: '6px 12px', background: tplPart === p.id ? '#2a2a2a' : 'transparent', border: `0.5px solid ${tplPart === p.id ? M : B}`, borderRadius: 6, color: tplPart === p.id ? '#fff' : '#333', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{p.label.toUpperCase()}</button>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {allFP.map(ex => {
            const sel = !!editingTpl.exercises.find(e => e.name === ex);
            return <button key={ex} onClick={() => toggleEx(ex, tplPart)} style={{ padding: '13px 16px', background: sel ? '#1a2a00' : D, border: `0.5px solid ${sel ? '#3a5010' : B}`, borderRadius: 8, color: sel ? A : '#888', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>{ex}{sel && <span>✓</span>}</button>;
          })}
        </div>
        <button onClick={() => { haptic.medium(); saveTpl(); }} disabled={!canSave} style={{ width: '100%', padding: '18px', background: canSave ? A : '#111', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer', color: canSave ? '#000' : '#333' }}>SAVE TEMPLATE ({editingTpl.exercises.length} EXERCISES)</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100svh', background: '#080808', padding: 'max(44px,env(safe-area-inset-top)) 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>
      <Back onBack={onBack} /><Lbl style={{ marginTop: 20 }}>CONFIG</Lbl><BigTitle>LIBRARY</BigTitle>
      <div style={{ display: 'flex', gap: 8, margin: '24px 0' }}>{tabBtn('exercises', 'EXERCISES')}{tabBtn('templates', 'TEMPLATES')}</div>

      {tab === 'exercises' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {ALL_PARTS.map(p => <button key={p.id} onClick={() => setSelPart(p.id)} style={{ padding: '6px 12px', background: selPart === p.id ? A : 'transparent', border: `0.5px solid ${selPart === p.id ? A : B}`, borderRadius: 6, color: selPart === p.id ? '#000' : '#444', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>{p.label.toUpperCase()}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEx()} placeholder="Exercise name..." style={{ flex: 1, background: D, border: `0.5px solid ${B}`, borderRadius: 8, padding: '13px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
            <button onClick={addEx} style={{ padding: '13px 20px', background: A, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', color: '#000' }}>ADD</button>
          </div>
          <Lbl style={{ marginBottom: 10 }}>DEFAULT</Lbl>
          {(LIBRARY[selPart] || []).map(ex => <div key={ex} style={{ padding: '10px 0', borderBottom: `0.5px solid #111`, fontSize: 13, color: '#666' }}>{ex}</div>)}
          {(customEx[selPart] || []).length > 0 && (
            <>
              <Lbl style={{ marginTop: 16, marginBottom: 10 }}>YOUR EXERCISES</Lbl>
              {(customEx[selPart] || []).map(ex => (
                <div key={ex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `0.5px solid #111` }}>
                  <span style={{ fontSize: 13, color: A, fontWeight: 600 }}>{ex}</span>
                  <button onClick={() => delEx(selPart, ex)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>DELETE</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'templates' && (
        <div>
          <button onClick={() => { setTplName(''); setEditingTpl({ id: Date.now().toString(), name: '', exercises: [] }); }} style={{ width: '100%', padding: '16px', marginBottom: 16, background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 10, color: A, fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer' }}>+ CREATE NEW TEMPLATE</button>
          {templates.map(tpl => (
            <div key={tpl.id} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{tpl.name}</div><div style={{ fontSize: 10, color: '#666', marginTop: 3, letterSpacing: '0.08em' }}>{tpl.exercises.length} EXERCISES</div></div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setEditingTpl({ ...tpl, exercises: [...tpl.exercises] }); setTplName(tpl.name); }} style={{ background: 'none', border: `0.5px solid ${B}`, borderRadius: 6, padding: '5px 10px', color: M, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>EDIT</button>
                  <button onClick={() => saveTpls(templates.filter(t => t.id !== tpl.id))} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>DELETE</button>
                </div>
              </div>
              <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tpl.exercises.slice(0, 6).map(e => <span key={e.name} style={{ fontSize: 10, color: '#666', background: '#111', padding: '3px 8px', borderRadius: 4 }}>{e.name}</span>)}
                {tpl.exercises.length > 6 && <span style={{ fontSize: 10, color: '#555' }}>+{tpl.exercises.length - 6} more</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Config Screen ─────────────────────────────────────────────────────────── */
export default function ConfigScreen({ navigate }: { navigate: (s: ScreenName) => void }) {
  const [restTime, setRestTime] = useState(() => DB.get<number>('restTime', 90));
  const [bodyweight, setBodyweight] = useState(() => DB.get<string>('bodyweight', ''));
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => DB.get<WeightUnit>('weightUnit', 'kg'));
  const [provider, setProvider] = useState<AIProvider>(() => DB.get<AIProvider>('aiProvider', 'anthropic'));
  const [keys, setKeys] = useState(() => ({
    anthropic: DB.get<string>('aiKey_anthropic', ''),
    openai:    DB.get<string>('aiKey_openai', ''),
    groq:      DB.get<string>('aiKey_groq', ''),
    gemini:    DB.get<string>('aiKey_gemini', ''),
  }));
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  if (showLibrary) return <LibraryScreen onBack={() => setShowLibrary(false)} />;

  const save = () => {
    DB.set('restTime', restTime); DB.set('bodyweight', bodyweight); DB.set('weightUnit', weightUnit); DB.set('aiProvider', provider);
    Object.entries(keys).forEach(([k, v]) => DB.set(`aiKey_${k}`, v.trim()));
    setSaved(true); setTimeout(() => { setSaved(false); navigate('home'); }, 800);
  };

  const pInfo = PROVIDERS[provider];
  const currentKey = keys[provider] || '';
  const hasKey = currentKey.length > 8;
  const tplCount = getTemplates().length;
  const cxCount = Object.values(DB.get<Record<string, string[]>>('customExercises', {})).reduce((a, v) => a + v.length, 0);

  return (
    <div style={{ minHeight: '100svh', padding: '52px 32px 40px', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <Back onBack={() => navigate('home')} />
      <Lbl style={{ marginTop: 36 }}>CONFIG</Lbl><BigTitle>SETTINGS</BigTitle>

      <div style={{ marginTop: 36, marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>REST TIMER</Lbl>
        <div style={{ display: 'flex', gap: 10 }}>
          {[60, 90, 120, 180].map(s => <button key={s} onClick={() => setRestTime(s)} style={{ flex: 1, padding: '14px 0', background: restTime === s ? A : 'transparent', border: `0.5px solid ${restTime === s ? A : B}`, borderRadius: 8, color: restTime === s ? '#000' : M, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>{s}s</button>)}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>BODYWEIGHT (KG)</Lbl>
        <input type="number" value={bodyweight} onChange={e => setBodyweight(e.target.value)} placeholder="75"
          style={{ background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 22, fontWeight: 700, width: '100%', outline: 'none' }} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>WEIGHT UNIT</Lbl>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['kg', 'KG'], ['lbs', 'LBS'], ['both', 'BOTH']] as [WeightUnit, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setWeightUnit(val)} style={{ flex: 1, padding: '14px 0', background: weightUnit === val ? A : 'transparent', border: `0.5px solid ${weightUnit === val ? A : B}`, borderRadius: 8, color: weightUnit === val ? '#000' : M, fontSize: 13, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.04em' }}>{label}</button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: '#555', letterSpacing: '0.06em', lineHeight: 1.7 }}>
          {weightUnit === 'both' ? 'A KG / LBS toggle appears in the set logger.' : weightUnit === 'lbs' ? 'All weights logged in pounds.' : 'All weights logged in kilograms.'}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Lbl style={{ marginBottom: 10 }}>AI PROVIDER</Lbl>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(Object.entries(PROVIDERS) as [AIProvider, typeof PROVIDERS[AIProvider]][]).map(([id, info]) => (
            <button key={id} onClick={() => setProvider(id)} style={{ padding: '12px 16px', background: provider === id ? '#1a2a00' : 'transparent', border: `0.5px solid ${provider === id ? '#3a5010' : B}`, borderRadius: 8, color: provider === id ? A : '#444', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div><span style={{ fontSize: 13, fontWeight: 700 }}>{info.label}</span>{info.free && <span style={{ fontSize: 9, color: '#3a5010', marginLeft: 8, letterSpacing: '0.08em', fontWeight: 700 }}>FREE TIER</span>}</div>
              {keys[id]?.length > 8 && <span style={{ fontSize: 9, color: A, letterSpacing: '0.1em', fontWeight: 700 }}>✓ KEY SET</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>API KEY FOR {pInfo.label.toUpperCase().split('(')[0].trim()}</Lbl>
        <div style={{ position: 'relative' }}>
          <input type={showKey ? 'text' : 'password'} value={currentKey} onChange={e => setKeys({ ...keys, [provider]: e.target.value })} placeholder={pInfo.hint}
            style={{ background: 'transparent', border: `0.5px solid ${hasKey ? '#2a3a10' : B}`, borderRadius: 8, padding: '13px 48px 13px 16px', color: '#fff', fontSize: 16, width: '100%', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.04em' }} />
          <button onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: M, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
            {showKey ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: '#555', letterSpacing: '0.06em', lineHeight: 1.7 }}>
          {provider === 'anthropic' && 'console.anthropic.com → API Keys'}
          {provider === 'openai'    && 'platform.openai.com → API Keys'}
          {provider === 'groq'      && 'console.groq.com → API Keys (free tier available)'}
          {provider === 'gemini'    && 'aistudio.google.com → Get API Key (free tier available)'}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>EXERCISE LIBRARY & TEMPLATES</Lbl>
        <button onClick={() => setShowLibrary(true)} style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Manage Library →</div>
            <div style={{ fontSize: 10, color: '#666', marginTop: 3, letterSpacing: '0.08em' }}>{tplCount} TEMPLATE{tplCount !== 1 ? 'S' : ''} · {cxCount} CUSTOM EXERCISE{cxCount !== 1 ? 'S' : ''}</div>
          </div>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <button onClick={() => { haptic.medium(); save(); }} style={{ width: '100%', padding: '18px', background: saved ? '#3a5010' : A, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', cursor: 'pointer', color: saved ? A : '#000', transition: 'background 0.2s' }}>
          {saved ? '✓ SAVED' : 'SAVE SETTINGS'}
        </button>
      </div>
    </div>
  );
}
