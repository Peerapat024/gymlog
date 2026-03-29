import { useState } from 'react';
import { A, D, B, M } from '../constants/theme';
import { DB } from '../utils/db';
import { haptic } from '../utils/haptics';
import { getExercises, getTemplates } from '../utils/dataHelpers';
import { Back, Lbl, BigTitle, SegmentWrap, SegBtn } from '../components/shared';
import { PROVIDERS } from '../utils/ai';
import { LIBRARY, ALL_PARTS } from '../constants/exercises';
import type { EquipmentType } from '../types';
import type { ScreenName, AIProvider, Template, WeightUnit } from '../types';

/* ─── Equipment badge (for library screen) ──────────────────────────────────── */
const EQUIP_CONFIG: Record<EquipmentType, { label: string; text: string }> = {
  Barbell:    { label: 'BARBELL',  text: 'rgba(255,255,255,0.35)' },
  Dumbbell:   { label: 'DUMBBELL', text: 'rgba(110,180,255,0.75)' },
  Cable:      { label: 'CABLE',    text: 'rgba(200,255,0,0.6)'    },
  Machine:    { label: 'MACHINE',  text: 'rgba(190,130,255,0.75)' },
  Bodyweight: { label: 'BW',       text: 'rgba(255,175,60,0.75)'  },
};
function LibEquipBadge({ type }: { type: EquipmentType }) {
  const e = EQUIP_CONFIG[type];
  return <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', color: e.text, flexShrink: 0 }}>{e.label}</span>;
}

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

  if (editingTpl) {
    const allFP = getExercises(tplPart);
    const canSave = tplName.trim() && editingTpl.exercises.length > 0;
    return (
      <div style={{ minHeight: '100svh', background: '#000', padding: 'max(44px,env(safe-area-inset-top)) 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>
        <Back onBack={() => setEditingTpl(null)} />
        <Lbl style={{ marginTop: 20 }}>TEMPLATE</Lbl>
        <BigTitle>{editingTpl.exercises.length === 0 ? 'BUILD\nTEMPLATE' : `${editingTpl.exercises.length} SELECTED`}</BigTitle>
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <Lbl style={{ marginBottom: 8 }}>TEMPLATE NAME</Lbl>
          <input value={tplName} onChange={e => setTplName(e.target.value)} placeholder="e.g. Push Day"
            style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '13px 14px', color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
        </div>
        {editingTpl.exercises.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Lbl style={{ marginBottom: 8 }}>SELECTED</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {editingTpl.exercises.map(e => (
                <button key={e.name} onClick={() => toggleEx(e.name, e.bodyPart)}
                  style={{ padding: '6px 12px', background: 'rgba(200,255,0,0.08)', border: `0.5px solid rgba(200,255,0,0.3)`, borderRadius: 7, color: A, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {e.name} ×
                </button>
              ))}
            </div>
          </div>
        )}
        <Lbl style={{ marginBottom: 8 }}>ADD FROM</Lbl>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {ALL_PARTS.map(p => (
            <button key={p.id} onClick={() => setTplPart(p.id)}
              style={{ padding: '6px 12px', background: tplPart === p.id ? D : 'transparent', border: `0.5px solid ${tplPart === p.id ? 'rgba(255,255,255,0.2)' : B}`, borderRadius: 7, color: tplPart === p.id ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {p.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 24 }}>
          {allFP.map(ex => {
            const sel = !!editingTpl.exercises.find(e => e.name === ex);
            return (
              <button key={ex} onClick={() => toggleEx(ex, tplPart)}
                style={{ padding: '13px 16px', background: sel ? 'rgba(200,255,0,0.07)' : D, border: `0.5px solid ${sel ? 'rgba(200,255,0,0.25)' : B}`, borderRadius: 10, color: sel ? A : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                {ex}{sel && <span style={{ color: A }}>✓</span>}
              </button>
            );
          })}
        </div>
        <button onClick={() => { haptic.medium(); saveTpl(); }} disabled={!canSave}
          style={{ width: '100%', padding: '18px', background: canSave ? A : '#111', border: 'none', borderRadius: 14, fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer', color: canSave ? '#000' : 'rgba(255,255,255,0.15)' }}>
          SAVE TEMPLATE ({editingTpl.exercises.length} EXERCISES)
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100svh', background: '#000', padding: 'max(44px,env(safe-area-inset-top)) 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))' }}>
      <Back onBack={onBack} />
      <Lbl style={{ marginTop: 20 }}>CONFIG</Lbl>
      <BigTitle>LIBRARY</BigTitle>
      <div style={{ margin: '24px 0' }}>
        <SegmentWrap>
          <SegBtn active={tab === 'exercises'} onClick={() => setTab('exercises')}>EXERCISES</SegBtn>
          <SegBtn active={tab === 'templates'} onClick={() => setTab('templates')}>TEMPLATES</SegBtn>
        </SegmentWrap>
      </div>

      {tab === 'exercises' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {ALL_PARTS.map(p => (
              <button key={p.id} onClick={() => setSelPart(p.id)}
                style={{ padding: '6px 12px', background: selPart === p.id ? A : 'transparent', border: `0.5px solid ${selPart === p.id ? A : B}`, borderRadius: 7, color: selPart === p.id ? '#000' : 'rgba(255,255,255,0.28)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                {p.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEx()} placeholder="Exercise name..."
              style={{ flex: 1, background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '13px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
            <button onClick={addEx} style={{ padding: '13px 20px', background: A, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', color: '#000' }}>ADD</button>
          </div>
          <Lbl style={{ marginBottom: 10 }}>DEFAULT</Lbl>
          {(LIBRARY[selPart] || []).map(ex => (
            <div key={ex.name} style={{ padding: '11px 0', borderBottom: `0.5px solid ${B}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{ex.name}</span>
                <LibEquipBadge type={ex.equipment} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', lineHeight: 1.4 }}>{ex.focus}</div>
            </div>
          ))}
          {(customEx[selPart] || []).length > 0 && (
            <>
              <Lbl style={{ marginTop: 20, marginBottom: 10 }}>YOUR EXERCISES</Lbl>
              {(customEx[selPart] || []).map(ex => (
                <div key={ex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `0.5px solid ${B}` }}>
                  <span style={{ fontSize: 13, color: A, fontWeight: 600 }}>{ex}</span>
                  <button onClick={() => delEx(selPart, ex)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>DELETE</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'templates' && (
        <div>
          <button onClick={() => { setTplName(''); setEditingTpl({ id: Date.now().toString(), name: '', exercises: [] }); }}
            style={{ width: '100%', padding: '16px', marginBottom: 16, background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 11, color: A, fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer' }}>
            + CREATE NEW TEMPLATE
          </button>
          {templates.map(tpl => (
            <div key={tpl.id} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{tpl.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, letterSpacing: '0.08em' }}>{tpl.exercises.length} EXERCISES</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setEditingTpl({ ...tpl, exercises: [...tpl.exercises] }); setTplName(tpl.name); }}
                    style={{ background: 'none', border: `0.5px solid ${B}`, borderRadius: 6, padding: '5px 10px', color: M, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>EDIT</button>
                  <button onClick={() => saveTpls(templates.filter(t => t.id !== tpl.id))}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>DELETE</button>
                </div>
              </div>
              <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tpl.exercises.slice(0, 6).map(e => (
                  <span key={e.name} style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: '#0F0F0F', padding: '3px 8px', borderRadius: 5 }}>{e.name}</span>
                ))}
                {tpl.exercises.length > 6 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>+{tpl.exercises.length - 6} more</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Selector pill row (rest timer, weight unit, etc.) ─────────────────── */
function PillSelector<T extends string>({ options, value, onChange }: {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', background: '#0C0C0C', borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map(([val, label]) => (
        <button key={val} onClick={() => onChange(val)}
          style={{ flex: 1, padding: '13px 0', background: value === val ? A : 'transparent', border: 'none', borderRadius: 7, color: value === val ? '#000' : 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em' }}>
          {label}
        </button>
      ))}
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
    <div style={{ minHeight: '100svh', padding: '52px 28px 40px', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <Back onBack={() => navigate('home')} />
      <Lbl style={{ marginTop: 36 }}>CONFIG</Lbl>
      <BigTitle>SETTINGS</BigTitle>

      {/* Rest Timer */}
      <div style={{ marginTop: 36, marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>REST TIMER</Lbl>
        <PillSelector
          options={[[60, '60s'], [90, '90s'], [120, '120s'], [180, '180s']] as [number, string][] as any}
          value={restTime as any}
          onChange={(v: any) => setRestTime(Number(v))}
        />
      </div>

      {/* Bodyweight */}
      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>BODYWEIGHT (KG)</Lbl>
        <input type="number" value={bodyweight} onChange={e => setBodyweight(e.target.value)} placeholder="75"
          style={{ background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 22, fontWeight: 700, width: '100%', outline: 'none' }} />
      </div>

      {/* Weight Unit */}
      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>WEIGHT UNIT</Lbl>
        <PillSelector<WeightUnit>
          options={[['kg', 'KG'], ['lbs', 'LBS'], ['both', 'BOTH']]}
          value={weightUnit}
          onChange={setWeightUnit}
        />
        <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', lineHeight: 1.7 }}>
          {weightUnit === 'both' ? 'A KG / LBS toggle appears in the set logger.' : weightUnit === 'lbs' ? 'All weights logged in pounds.' : 'All weights logged in kilograms.'}
        </div>
      </div>

      {/* AI Provider */}
      <div style={{ marginBottom: 20 }}>
        <Lbl style={{ marginBottom: 10 }}>AI PROVIDER</Lbl>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {(Object.entries(PROVIDERS) as [AIProvider, typeof PROVIDERS[AIProvider]][]).map(([id, info]) => (
            <button key={id} onClick={() => setProvider(id)}
              style={{ padding: '13px 16px', background: provider === id ? 'rgba(200,255,0,0.07)' : D, border: `0.5px solid ${provider === id ? 'rgba(200,255,0,0.28)' : B}`, borderRadius: 10, color: provider === id ? A : 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: 'all 0.15s' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{info.label}</span>
                {info.free && <span style={{ fontSize: 9, color: 'rgba(200,255,0,0.5)', marginLeft: 8, letterSpacing: '0.08em', fontWeight: 700 }}>FREE TIER</span>}
              </div>
              {keys[id]?.length > 8 && <span style={{ fontSize: 9, color: A, letterSpacing: '0.1em', fontWeight: 700 }}>✓ KEY SET</span>}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>API KEY FOR {pInfo.label.toUpperCase().split('(')[0].trim()}</Lbl>
        <div style={{ position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={currentKey}
            onChange={e => setKeys({ ...keys, [provider]: e.target.value })}
            placeholder={pInfo.hint}
            style={{ background: 'transparent', border: `0.5px solid ${hasKey ? 'rgba(200,255,0,0.25)' : B}`, borderRadius: 10, padding: '13px 52px 13px 16px', color: '#fff', fontSize: 16, width: '100%', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.04em' }}
          />
          <button onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: M, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
            {showKey ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em', lineHeight: 1.7 }}>
          {provider === 'anthropic' && 'console.anthropic.com → API Keys'}
          {provider === 'openai'    && 'platform.openai.com → API Keys'}
          {provider === 'groq'      && 'console.groq.com → API Keys (free tier available)'}
          {provider === 'gemini'    && 'aistudio.google.com → Get API Key (free tier available)'}
        </div>
      </div>

      {/* Library */}
      <div style={{ marginBottom: 28 }}>
        <Lbl style={{ marginBottom: 10 }}>EXERCISE LIBRARY & TEMPLATES</Lbl>
        <button onClick={() => setShowLibrary(true)} style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Manage Library →</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, letterSpacing: '0.08em' }}>
              {tplCount} TEMPLATE{tplCount !== 1 ? 'S' : ''} · {cxCount} CUSTOM EXERCISE{cxCount !== 1 ? 'S' : ''}
            </div>
          </div>
        </button>
      </div>

      {/* Save */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <button onClick={() => { haptic.medium(); save(); }}
          style={{ width: '100%', padding: '18px', background: saved ? 'rgba(200,255,0,0.12)' : A, border: saved ? `0.5px solid rgba(200,255,0,0.4)` : 'none', borderRadius: 14, fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', cursor: 'pointer', color: saved ? A : '#000', transition: 'all 0.2s' }}>
          {saved ? '✓ SAVED' : 'SAVE SETTINGS'}
        </button>
      </div>
    </div>
  );
}
