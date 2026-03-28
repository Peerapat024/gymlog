import { useState, useRef, useEffect } from 'react';
import { A, D, B, M } from '../../constants/theme';
import { DB } from '../../utils/db';
import { haptic } from '../../utils/haptics';
import { getExercises, getHistory, getPR, getTemplates, saveSession } from '../../utils/dataHelpers';
import { Back, Lbl, BigTitle } from '../../components/shared';
import RepWheel from '../../components/ui/RepWheel';
import RestBar from '../../components/ui/RestBar';
import RestTimer from '../../components/ui/RestTimer';
import ConfirmEnd from '../../components/ui/ConfirmEnd';
import MoodCharacter from '../../components/ui/MoodCharacter';
import { BODY_PARTS } from '../../constants/exercises';
import { BW_EXERCISES, DB_EXERCISES, CABLE_EXERCISES } from '../../constants/exercises';
import type { ScreenName, LoggedSet, Template, MoodId } from '../../types';

const KG_TO_LBS = 2.20462;

/* ─── WorkoutStartScreen ──────────────────────────────────────────────────── */
function WorkoutStartScreen({ sessionSets, onFresh, onTemplate, onFinish }: {
  sessionSets: LoggedSet[];
  onFresh: () => void;
  onTemplate: (tpl: Template) => void;
  onFinish: () => void;
}) {
  const templates = getTemplates();
  const inSession = sessionSets.length > 0;
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both' }}>
      <div style={{ padding: '52px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onFinish} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, padding: 0 }}>{inSession ? '← FINISH SESSION' : '← HOME'}</button>
        {inSession && <span style={{ fontSize: 10, color: M, letterSpacing: '0.12em' }}>{sessionSets.length} SETS</span>}
      </div>
      <div style={{ padding: '0 32px 20px' }}><Lbl>WORKOUT</Lbl><BigTitle>{inSession ? 'WHAT NEXT?' : "LET'S GO."}</BigTitle></div>
      <div style={{ flex: 1, padding: '8px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={onFresh} style={{ padding: '24px 22px', background: A, border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.01em' }}>{inSession ? 'SWITCH MUSCLE GROUP' : 'START FRESH'}</div>
            <div style={{ fontSize: 10, color: '#2a2a00', marginTop: 5, letterSpacing: '0.1em' }}>PICK ANY MUSCLE GROUP</div>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>&#8594;</span>
        </button>
        {templates.length > 0 && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px' }}>
            <div style={{ flex: 1, height: '0.5px', background: B }} />
            <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.2em', fontWeight: 700 }}>OR USE TEMPLATE</span>
            <div style={{ flex: 1, height: '0.5px', background: B }} />
          </div>
          {templates.map(tpl => (
            <button key={tpl.id} onClick={() => { haptic.light(); onTemplate(tpl); }} style={{ padding: '18px 22px', background: D, border: `0.5px solid ${B}`, borderRadius: 10, color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.02em', marginBottom: 6 }}>{tpl.name.toUpperCase()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tpl.exercises.slice(0, 5).map(e => <span key={e.name} style={{ fontSize: 9, color: '#666', background: '#111', padding: '3px 8px', borderRadius: 4 }}>{e.name.toUpperCase()}</span>)}
                {tpl.exercises.length > 5 && <span style={{ fontSize: 9, color: '#555' }}>+{tpl.exercises.length - 5}</span>}
              </div>
            </button>
          ))}
        </>)}
      </div>
    </div>
  );
}

/* ─── BodyPartScreen ──────────────────────────────────────────────────────── */
function BodyPartScreen({ onSelect, onBack, onFinish, sessionSets }: {
  onSelect: (id: string) => void;
  onBack: () => void;
  onFinish: () => void;
  sessionSets: LoggedSet[];
}) {
  const [armsOpen, setArmsOpen] = useState(false);
  const total = sessionSets.length;
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both' }}>
      <div style={{ padding: '52px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />{total > 0 && <span style={{ fontSize: 10, color: M, letterSpacing: '0.12em' }}>{total} SETS THIS SESSION</span>}
      </div>
      <div style={{ padding: '0 32px 16px' }}><Lbl>MUSCLE GROUP</Lbl><BigTitle>WHERE ARE<br />YOU TRAINING?</BigTitle></div>
      <div style={{ flex: 1, padding: '8px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BODY_PARTS.map(bp => (
          <div key={bp.id}>
            <button onClick={() => { haptic.light(); bp.children ? setArmsOpen(o => !o) : onSelect(bp.id); }}
              style={{ width: '100%', padding: 'clamp(20px,5vw,28px) 22px', background: D, border: `0.5px solid ${B}`, borderRadius: armsOpen && bp.children ? '10px 10px 0 0' : 10, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'clamp(22px,5.5vw,30px)', fontWeight: 800, letterSpacing: '0.02em' }}>{bp.label}</span>
              {bp.children && <span style={{ fontSize: 14, color: armsOpen ? A : M, display: 'inline-block', transform: armsOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s,color 0.2s' }}>→</span>}
            </button>
            {bp.children && armsOpen && (
              <div style={{ display: 'flex', border: `0.5px solid ${B}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                {bp.children.map((sub, i) => (
                  <button key={sub.id} onClick={() => { haptic.light(); onSelect(sub.id); }}
                    style={{ flex: 1, padding: '18px 8px', background: '#111', border: 'none', borderLeft: i > 0 ? `0.5px solid ${B}` : 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em' }}>{sub.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {total > 0 && <button onClick={onFinish} style={{ marginTop: 4, width: '100%', padding: '18px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 10, color: '#aaa', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em' }}>FINISH SESSION →</button>}
      </div>
    </div>
  );
}

/* ─── ExerciseScreen ──────────────────────────────────────────────────────── */
function ExerciseScreen({ bodyPartId, onSelect, onBack, onSwitchMuscle, restEndsAt }: {
  bodyPartId: string;
  onSelect: (ex: string) => void;
  onBack: () => void;
  onSwitchMuscle: () => void;
  restEndsAt: number | null;
}) {
  const [allExercises, setAllExercises] = useState(() => getExercises(bodyPartId));
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const exercises = search.trim() ? allExercises.filter(e => e.toLowerCase().includes(search.toLowerCase())) : allExercises;

  const addExercise = () => {
    const n = newName.trim(); if (!n) return;
    const c = DB.get<Record<string, string[]>>('customExercises', {});
    DB.set('customExercises', { ...c, [bodyPartId]: [...(c[bodyPartId] || []), n] });
    setAllExercises(getExercises(bodyPartId)); setNewName(''); setAdding(false);
  };

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both' }}>
      <div style={{ padding: '52px 32px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />
        <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ background: 'none', border: '0.5px solid #555', borderRadius: 6, padding: '5px 10px', color: '#aaa', cursor: 'pointer', fontSize: 10, letterSpacing: '0.12em', fontWeight: 700 }}>SWITCH MUSCLE</button>
      </div>
      <RestBar restEndsAt={restEndsAt} />
      <div style={{ padding: '0 20px 10px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${bodyPartId} exercises...`}
          style={{ width: '100%', background: '#111', border: '0.5px solid #333', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', letterSpacing: '0.01em' }} />
      </div>
      <div style={{ flex: 1, padding: '4px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {exercises.length === 0 && <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 11, color: '#666', letterSpacing: '0.12em' }}>NO MATCHES</div>}
        {exercises.map(ex => {
          const history = getHistory(ex); const pr = getPR(ex);
          const lastSession = history[0] || null;
          const lastTopW = lastSession ? Math.max(...lastSession.sets.map(x => x.weight)) : null;
          const lastSets = lastSession ? lastSession.sets.length : null;
          const lastDate = lastSession ? new Date(lastSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
          return (
            <div key={ex} style={{ border: `0.5px solid ${B}`, borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => { haptic.light(); onSelect(ex); }} style={{ width: '100%', padding: '14px 18px', background: '#1e1e1e', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: lastTopW ? 5 : 0 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{ex}</span>
                    {pr > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '2px 7px', borderRadius: 4, flexShrink: 0, animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>{pr}KG PR</span>}
                  </div>
                  {lastTopW && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>{lastDate}</span>
                      <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>{lastTopW}kg top</span>
                      <span style={{ fontSize: 10, color: '#777' }}>{lastSets} sets</span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 18, color: '#666', marginLeft: 8, flexShrink: 0 }}>›</span>
              </button>
            </div>
          );
        })}
        {!adding && <button onClick={() => setAdding(true)} style={{ padding: '15px 18px', background: 'transparent', border: '0.5px solid #666', borderRadius: 10, color: '#bbb', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginTop: 4 }}>+ ADD EXERCISE TO {bodyPartId.toUpperCase()}</button>}
        {adding && (
          <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '16px', marginTop: 4 }}>
            <Lbl style={{ marginBottom: 10 }}>NEW EXERCISE</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addExercise(); if (e.key === 'Escape') setAdding(false); }} placeholder="Exercise name..."
                style={{ flex: 1, background: '#111', border: `0.5px solid ${B}`, borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none' }} />
              <button onClick={addExercise} style={{ padding: '12px 16px', background: newName.trim() ? A : '#111', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', color: newName.trim() ? '#000' : '#666', flexShrink: 0 }}>ADD</button>
            </div>
            <button onClick={() => { setAdding(false); setNewName(''); }} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: 10, marginTop: 10, letterSpacing: '0.1em', fontWeight: 600 }}>CANCEL</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TemplateExerciseScreen ──────────────────────────────────────────────── */
function TemplateExerciseScreen({ template, sessionSets, onSelect, onSwitchMuscle, onBack, restEndsAt }: {
  template: Template;
  sessionSets: LoggedSet[];
  onSelect: (name: string, bodyPart: string) => void;
  onSwitchMuscle: () => void;
  onBack: () => void;
  restEndsAt: number | null;
}) {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both' }}>
      <div style={{ padding: '52px 32px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />{sessionSets.length > 0 && <span style={{ fontSize: 10, color: M, letterSpacing: '0.1em' }}>{sessionSets.length} SETS</span>}
      </div>
      <RestBar restEndsAt={restEndsAt} />
      <div style={{ padding: '0 32px 12px' }}><Lbl>{template.name.toUpperCase()}</Lbl><BigTitle>PICK AN<br />EXERCISE</BigTitle></div>
      <div style={{ flex: 1, padding: '4px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {template.exercises.map(ex => {
          const cnt = sessionSets.filter(s => s.exercise === ex.name).length;
          const pr = getPR(ex.name);
          const lw = getHistory(ex.name, 1)[0]?.sets?.slice(-1)[0]?.weight;
          return (
            <button key={ex.name} onClick={() => { haptic.light(); onSelect(ex.name, ex.bodyPart); }}
              style={{ padding: '16px 18px', background: D, border: `0.5px solid ${B}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: cnt >= 4 ? 0.4 : 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{ex.name}</span>
                  {pr > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '2px 6px', borderRadius: 3, animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>{pr}KG</span>}
                </div>
                <span style={{ fontSize: 9, color: '#777', letterSpacing: '0.1em', marginTop: 3, display: 'block' }}>{ex.bodyPart.toUpperCase()}{lw ? ` · LAST ${lw}KG` : ''}{cnt > 0 ? ` · ${cnt} SET${cnt !== 1 ? 'S' : ''} DONE` : ''}</span>
              </div>
              <span style={{ fontSize: 13, color: '#555' }}>→</span>
            </button>
          );
        })}
        <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ marginTop: 8, padding: '14px 18px', background: 'transparent', border: '0.5px solid #666', borderRadius: 10, color: '#bbb', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>+ SWITCH / ADD MUSCLE GROUP</button>
      </div>
    </div>
  );
}

/* ─── SetLogger ───────────────────────────────────────────────────────────── */
function SetLogger({ exercise, bodyPartId, setNumber, sessionSets, onLogSet, onChangeExercise, onSwitchMuscle, restDuration }: {
  exercise: string;
  bodyPartId: string;
  setNumber: number;
  sessionSets: LoggedSet[];
  onLogSet: (set: LoggedSet, andNext: boolean | 'end', restEndsAt?: number) => void;
  onChangeExercise: () => void;
  onSwitchMuscle: () => void;
  restDuration: number;
}) {
  const prev = sessionSets.filter(s => s.exercise === exercise).slice(-1)[0];
  const histLast = getHistory(exercise, 1)[0]?.sets?.slice(-1)[0];

  const unitPref = DB.get<string>('weightUnit', 'kg');
  const [unit, setUnit] = useState(() => unitPref === 'lbs' ? 'lbs' : 'kg');
  const showToggle = unitPref === 'both';

  const isBWExercise = BW_EXERCISES.has(exercise);
  const isDBExercise = DB_EXERCISES.has(exercise) || exercise.toLowerCase().includes('dumbbell');
  const isCableExercise = CABLE_EXERCISES.has(exercise) || exercise.toLowerCase().includes('cable');
  const weightHint = isDBExercise ? 'ENTER TOTAL WEIGHT (BOTH SIDES COMBINED)' : isCableExercise ? 'CABLE STACK WEIGHT (BOTH SIDES TOTAL)' : null;
  const bwKg = parseFloat(DB.get<string>('bodyweight', '')) || 0;
  const [bwMode, setBwMode] = useState(isBWExercise && bwKg > 0);
  const [bwSign, setBwSign] = useState('+');

  const prevWeightKg = prev?.weight || null;
  const prevWeightDisplay = prevWeightKg
    ? (bwMode
      ? String(Math.abs(Math.round((prevWeightKg - bwKg) * 10) / 10))
      : (unit === 'lbs' ? String(Math.round(prevWeightKg * KG_TO_LBS * 10) / 10) : String(prevWeightKg)))
    : '';
  const [weight, setWeight] = useState(prevWeightDisplay);
  const [reps, setReps] = useState('');
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [savedSet, setSavedSet] = useState<LoggedSet | null>(null);
  const [summaryRestEndsAt, setSummaryRestEndsAt] = useState<number | null>(null);
  const [summaryRem, setSummaryRem] = useState(0);
  const autoAdvanced = useRef(false);

  const toggleUnit = () => {
    haptic.light();
    const cur = parseFloat(weight) || 0;
    if (cur > 0) {
      const converted = unit === 'kg' ? Math.round(cur * KG_TO_LBS * 10) / 10 : Math.round(cur / KG_TO_LBS * 10) / 10;
      setWeight(converted.toString());
    }
    setUnit(u => u === 'kg' ? 'lbs' : 'kg');
  };

  const weightKg = () => {
    const w = parseFloat(weight) || 0;
    const wKg = unit === 'lbs' ? Math.round(w / KG_TO_LBS * 10) / 10 : w;
    if (!bwMode) return wKg;
    return bwSign === '+' ? Math.round((bwKg + wKg) * 10) / 10 : Math.max(0, Math.round((bwKg - wKg) * 10) / 10);
  };

  const pr = getPR(exercise);
  const prDisplay = pr > 0 ? (unit === 'lbs' ? Math.round(pr * KG_TO_LBS * 10) / 10 : pr) : 0;
  const vol = (parseFloat(weight) || 0) * (parseInt(reps) || 0);
  const isNewPR = weightKg() > pr && pr > 0;
  const done = sessionSets.filter(s => s.exercise === exercise);

  useEffect(() => {
    if (!showActions || !summaryRestEndsAt) return;
    autoAdvanced.current = false;
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((summaryRestEndsAt - Date.now()) / 1000));
      setSummaryRem(r);
      if (r <= 0 && !autoAdvanced.current) {
        autoAdvanced.current = true;
        clearInterval(id);
        haptic.medium();
        onLogSet(savedSet!, false, summaryRestEndsAt);
      }
    }, 250);
    return () => clearInterval(id);
  }, [showActions, summaryRestEndsAt]);

  const handleWeight = (v: string) => { if (v === '' || /^\d*\.?\d*$/.test(v)) setWeight(v); };
  const canSave = bwMode ? parseInt(reps) > 0 : !!(parseFloat(weight) > 0 && parseInt(reps) > 0);
  const step = unit === 'lbs' ? 5 : 2.5;

  const handleSave = () => {
    const addedKg = parseFloat(weight) || 0;
    const wkg = weightKg(), r = parseInt(reps);
    if (bwMode && !r) return;
    if (!bwMode && (!wkg || !r)) return;
    const isPR = wkg > pr;
    isPR ? haptic.pr() : haptic.success();
    const set: LoggedSet = { exercise, bodyPart: bodyPartId, weight: wkg, reps: r, setNumber, isPR, note: note.trim() || undefined, unit: unit as 'kg' | 'lbs', bwMode: bwMode || undefined, bwSign: bwMode ? (bwSign as '+' | '-') : undefined, addedKg: bwMode ? addedKg : undefined, _ts: Date.now() };
    setSavedSet(set);
    setSummaryRestEndsAt(Date.now() + restDuration * 1000);
    setSummaryRem(restDuration);
    setShowActions(true);
  };

  if (showActions && savedSet) {
    return (
      <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', overflow: 'hidden', animation: 'fadeIn 0.18s ease-out both' }}>
        <div style={{ padding: '52px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, color: '#777', letterSpacing: '0.25em', fontWeight: 700 }}>{bodyPartId.toUpperCase()} · SET {setNumber} SAVED</span>
            {savedSet.isPR && <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em', animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}>NEW PR</span>}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 24px 0', overflow: 'hidden' }}>
          <div style={{ fontSize: 'clamp(52px,14vw,96px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.92, color: '#fff', wordBreak: 'break-word', animation: 'fadeIn 0.2s ease-out 0.05s both' }}>{exercise.toUpperCase()}</div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(32px,8vw,52px)', fontWeight: 800, color: savedSet.isPR ? A : '#888', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {savedSet.bwMode ? 'BW' + (savedSet.addedKg && savedSet.addedKg > 0 ? (savedSet.bwSign || '+') + savedSet.addedKg : '') + '=' + savedSet.weight + 'KG'
                : (savedSet.unit === 'lbs' ? Math.round(savedSet.weight * 2.20462 * 10) / 10 : savedSet.weight) + (savedSet.unit || 'kg').toUpperCase()}
            </span>
            <span style={{ fontSize: 22, color: '#555', fontWeight: 400 }}>×</span>
            <span style={{ fontSize: 'clamp(32px,8vw,52px)', fontWeight: 800, color: '#888', letterSpacing: '-0.03em', lineHeight: 1 }}>{savedSet.reps}</span>
            <span style={{ fontSize: 14, color: '#666', fontWeight: 600, letterSpacing: '0.06em', alignSelf: 'center' }}>REPS</span>
          </div>
          {savedSet.note && <div style={{ marginTop: 12, fontSize: 13, color: '#777', fontStyle: 'italic' }}>"{savedSet.note}"</div>}
        </div>
        <div style={{ padding: '0 24px', flexShrink: 0 }}>
          {summaryRestEndsAt && (
            <div style={{ marginBottom: 16, animation: 'fadeIn 0.2s ease-out both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: '#555', letterSpacing: '0.2em', fontWeight: 700 }}>REST</span>
                <span style={{ fontSize: summaryRem > 0 ? 28 : 14, fontWeight: 900, color: summaryRem > 0 ? (summaryRem <= 10 ? '#ff4040' : A) : '#555', letterSpacing: '-0.02em', transition: 'color 0.3s', fontVariantNumeric: 'tabular-nums' }}>
                  {summaryRem > 0 ? (summaryRem >= 60 ? Math.floor(summaryRem / 60) + ':' + String(summaryRem % 60).padStart(2, '0') : summaryRem + 's') : 'GO →'}
                </span>
              </div>
              <div style={{ height: 3, background: '#111', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: summaryRem <= 10 ? '#ff4040' : A, borderRadius: 2, width: `${(summaryRem / restDuration) * 100}%`, transition: 'width 0.25s linear, background 0.3s' }} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center', marginBottom: 2, animation: 'fadeIn 0.18s ease-out both' }}>WHAT NEXT?</div>
            <button onClick={() => { haptic.medium(); onLogSet(savedSet, false, summaryRestEndsAt ?? undefined); }} style={{ width: '100%', padding: '22px 0', background: A, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000', animation: 'slideUp 0.18s ease-out 0.05s both' }}>NEXT SET</button>
            <button onClick={() => { haptic.light(); onLogSet(savedSet, true, summaryRestEndsAt ?? undefined); }} style={{ width: '100%', padding: '19px 0', background: '#1e1e1e', border: '0.5px solid #444', borderRadius: 12, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', color: '#fff', animation: 'slideUp 0.18s ease-out 0.1s both' }}>NEXT EXERCISE</button>
            <button onClick={() => { haptic.light(); onLogSet(savedSet, 'end'); }} style={{ width: '100%', padding: '16px 0', background: 'transparent', border: '0.5px solid #333', borderRadius: 12, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', color: '#666', animation: 'slideUp 0.18s ease-out 0.15s both' }}>END SESSION</button>
            <button disabled style={{ width: '100%', padding: '22px 0', background: '#080808', border: 'none', cursor: 'default', display: 'block' }} />
          </div>
        </div>
      </div>
    );
  }

  const lastKg = histLast?.weight || null;
  const lastDisplay = lastKg ? (unit === 'lbs' ? Math.round(lastKg * KG_TO_LBS * 10) / 10 : lastKg) : null;
  const lastIsPR = lastKg && lastKg === pr && pr > 0;
  const showBoth = prDisplay > 0 && lastDisplay && !lastIsPR;
  const showPROnly = prDisplay > 0 && (!lastDisplay || lastIsPR);

  return (
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: '#080808', animation: 'fadeIn 0.18s ease-out both', overflow: 'hidden' }}>
      <div style={{ padding: 'env(safe-area-inset-top, 44px) 20px 12px', paddingTop: 'max(44px,env(safe-area-inset-top))', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Back onBack={onChangeExercise} label="← EXERCISE" />
          <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ background: 'none', border: '0.5px solid #555', borderRadius: 6, padding: '5px 10px', color: '#aaa', cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', fontWeight: 700 }}>SWITCH MUSCLE</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#777', letterSpacing: '0.2em', fontWeight: 700 }}>{bodyPartId.toUpperCase()} · SET {setNumber}</span>
        </div>
        <div style={{ fontSize: 'clamp(18px,4.5vw,28px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4, color: '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.toUpperCase()}</div>
        {done.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {done.map((s, i) => <div key={i} style={{ padding: '3px 10px', background: '#111', borderRadius: 5, fontSize: 10, color: '#888', fontWeight: 700 }}>S{s.setNumber} {s.weight}x{s.reps}{s.note && <span style={{ color: '#666', marginLeft: 4 }}>✎</span>}</div>)}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '4px 20px 0', display: 'flex', flexDirection: 'column' }}>
        {/* Weight */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Lbl>{bwMode ? (bwSign === '+' ? 'EXTRA WEIGHT (KG)' : 'ASSIST WEIGHT (KG)') : `WEIGHT (${unit.toUpperCase()})`}</Lbl>
            {isBWExercise && bwKg > 0 && (
              <button onClick={() => { haptic.light(); setBwMode(m => !m); setWeight(''); setBwSign('+'); }} style={{ padding: '5px 12px', borderRadius: 6, border: `0.5px solid ${bwMode ? A : '#444'}`, background: bwMode ? '#1a2a00' : 'transparent', cursor: 'pointer', fontSize: 9, fontWeight: 800, color: bwMode ? A : '#555', letterSpacing: '0.1em' }}>{bwMode ? 'BW MODE ✓' : 'BW MODE'}</button>
            )}
          </div>
          {bwMode && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {[{ sign: '+', label: 'WEIGHTED', hint: 'BW + extra weight' }, { sign: '-', label: 'ASSISTED', hint: 'BW − assist weight' }].map(opt => (
                  <button key={opt.sign} onClick={() => { haptic.light(); setBwSign(opt.sign); setWeight(''); }} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center', background: bwSign === opt.sign ? '#1a2a00' : 'transparent', border: `0.5px solid ${bwSign === opt.sign ? A : '#333'}`, transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: bwSign === opt.sign ? A : '#444', letterSpacing: '0.04em' }}>{opt.sign} {opt.label}</div>
                    <div style={{ fontSize: 9, color: bwSign === opt.sign ? '#3a5010' : '#2a2a2a', marginTop: 2, letterSpacing: '0.06em' }}>{opt.hint}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: '#0c0c0c', borderRadius: 10, border: '0.5px solid #1a1a1a' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: A }}>{bwKg}KG</span>
                <span style={{ fontSize: 14, color: '#666', fontWeight: 700 }}>{bwSign}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: parseFloat(weight) > 0 ? '#fff' : '#2a2a2a' }}>{parseFloat(weight) > 0 ? weight + 'KG' : '?KG'}</span>
                <span style={{ fontSize: 14, color: '#666', fontWeight: 700 }}>=</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>
                  {parseFloat(weight) > 0 ? (bwSign === '+' ? Math.round((bwKg + (parseFloat(weight) || 0)) * 10) / 10 : Math.max(0, Math.round((bwKg - (parseFloat(weight) || 0)) * 10) / 10)) : bwKg}KG
                </span>
                <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.08em', fontWeight: 600 }}>LOGGED</span>
              </div>
            </div>
          )}
          {showToggle && (
            <div onClick={toggleUnit} style={{ display: 'flex', marginBottom: 10, background: '#111', border: '0.5px solid #333', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', userSelect: 'none' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', left: unit === 'lbs' ? '50%' : '0%', background: A, borderRadius: 9, transition: 'left 0.18s ease' }} />
              <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '13px 0', textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '0.08em', color: unit === 'kg' ? '#000' : '#444', transition: 'color 0.18s' }}>KG</div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '13px 0', textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '0.08em', color: unit === 'lbs' ? '#000' : '#444', transition: 'color 0.18s' }}>LBS</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => { haptic.light(); setWeight(w => Math.max(0, (parseFloat(w) || 0) - step).toFixed(1).replace(/\.0$/, '')); }} style={{ width: 44, height: 44, borderRadius: 10, background: '#222', border: '0.5px solid #404040', color: '#aaa', fontSize: 22, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
            <input type="text" inputMode="decimal" value={weight} onChange={e => handleWeight(e.target.value)} placeholder="0"
              style={{ flex: 1, minWidth: 0, background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '14px 8px', color: '#fff', fontSize: 'clamp(32px,9vw,44px)', fontWeight: 800, textAlign: 'center', outline: 'none', letterSpacing: '-0.02em' }} />
            <button onClick={() => { haptic.light(); setWeight(w => ((parseFloat(w) || 0) + step).toFixed(1).replace(/\.0$/, '')); }} style={{ width: 44, height: 44, borderRadius: 10, background: '#222', border: '0.5px solid #404040', color: '#aaa', fontSize: 22, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          {weightHint && !bwMode && <div style={{ marginTop: 4, textAlign: 'center', fontSize: 10, color: '#555', letterSpacing: '0.1em', fontWeight: 600, fontStyle: 'italic' }}>{weightHint}</div>}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, minHeight: 32, flexWrap: 'wrap' }}>
            {isNewPR && <span style={{ fontSize: 10, color: A, letterSpacing: '0.1em', fontWeight: 700, animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>NEW PR!</span>}
            {(showPROnly || showBoth) && (
              <button onClick={() => setWeight(String(prDisplay))} style={{ padding: '6px 14px', background: '#1e1e1e', border: '0.5px solid #444', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.08em' }}>PR</span>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 900, letterSpacing: '-0.01em' }}>{prDisplay}{unit.toUpperCase()}</span>
              </button>
            )}
            {showBoth && lastDisplay && (
              <button onClick={() => setWeight(String(lastDisplay))} style={{ padding: '6px 14px', background: '#1e1e1e', border: '0.5px solid #444', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: '0.08em' }}>LAST</span>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 900, letterSpacing: '-0.01em' }}>{lastDisplay}{unit.toUpperCase()}</span>
              </button>
            )}
          </div>
        </div>

        {/* Reps */}
        <div style={{ marginBottom: 12 }}>
          <Lbl style={{ marginBottom: 10 }}>REPS</Lbl>
          <RepWheel value={reps} onChange={setReps} />
          {vol > 0 && <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: '#666', letterSpacing: '0.1em' }}>SET VOLUME {vol.toLocaleString()} {unit.toUpperCase()}</div>}
        </div>

        {/* Note */}
        <div style={{ marginBottom: 8 }}>
          {!noteOpen && !note && <button onClick={() => setNoteOpen(true)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, padding: 0 }}>+ ADD NOTE</button>}
          {(noteOpen || note) && (
            <div>
              <Lbl style={{ marginBottom: 6 }}>NOTE</Lbl>
              <textarea autoFocus={noteOpen && !note} value={note} onChange={e => setNote(e.target.value)} placeholder="felt heavy, drop set, paused reps..." rows={2}
                style={{ width: '100%', background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: '10px 20px 0', flexShrink: 0 }}>
        <button onClick={handleSave} disabled={!canSave} style={{ width: '100%', padding: '22px 0', background: canSave ? A : '#111', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', cursor: canSave ? 'pointer' : 'default', color: canSave ? '#000' : '#2a2a2a', transition: 'background 0.15s', animation: canSave ? 'savePulse 0.6s ease-out' : 'none' }}>
          SAVE SET
        </button>
        <button disabled style={{ width: '100%', padding: '22px 0', background: '#080808', border: 'none', cursor: 'default', display: 'block' }} />
      </div>
    </div>
  );
}

/* ─── SessionSummary ──────────────────────────────────────────────────────── */
function SessionSummary({ sessionSets, startTime, onDone }: {
  sessionSets: LoggedSet[];
  startTime: number;
  onDone: (note: string) => void;
}) {
  const duration = Math.round((Date.now() - startTime) / 60000);
  const totalVol = sessionSets.reduce((a, s) => a + s.weight * s.reps, 0);
  const prs = sessionSets.filter(s => s.isPR);
  const byCnt: Record<string, number> = {};
  sessionSets.forEach(s => { byCnt[s.exercise] = (byCnt[s.exercise] || 0) + 1; });
  const [mood, setMood] = useState<MoodId | null>(null);
  const [note, setNote] = useState('');

  const MOOD_BTNS = [
    { id: 'crushed' as MoodId, emoji: '💪', label: 'CRUSHED IT', color: '#C8FF00', dark: true },
    { id: 'solid'   as MoodId, emoji: '👊', label: 'SOLID',      color: '#4CAF50', dark: true },
    { id: 'meh'     as MoodId, emoji: '😐', label: 'MEH',         color: '#FF9800', dark: false },
    { id: 'rough'   as MoodId, emoji: '😓', label: 'ROUGH',       color: '#f44336', dark: false },
  ];

  const handleDone = () => { haptic.medium(); onDone(JSON.stringify({ mood, note: note.trim() })); };
  const userName = DB.get<string>('userName', '');

  // Template saving
  const sessionExercises: { name: string; bodyPart: string }[] = [];
  const seen = new Set<string>();
  sessionSets.forEach(s => { if (!seen.has(s.exercise)) { seen.add(s.exercise); sessionExercises.push({ name: s.exercise, bodyPart: s.bodyPart }); } });
  const [tplOpen, setTplOpen] = useState(false);
  const [tplName, setTplName] = useState('');
  const [tplSaved, setTplSaved] = useState(false);

  const saveAsTemplate = () => {
    if (!tplName.trim()) return;
    haptic.success();
    const existing = DB.get<{ id: string; name: string; exercises: { name: string; bodyPart: string }[] }[]>('templates', []);
    existing.push({ id: Date.now().toString(), name: tplName.trim(), exercises: sessionExercises });
    DB.set('templates', existing);
    setTplSaved(true);
  };

  return (
    <div style={{ minHeight: '100svh', background: '#080808', animation: 'fadeIn 0.18s ease-out both', overflowY: 'auto' }}>
      <div style={{ padding: 'max(44px,env(safe-area-inset-top)) 28px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column' }}>
        <MoodCharacter mood={mood} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {MOOD_BTNS.map(b => (
            <button key={b.id} onClick={() => { haptic.light(); setMood(b.id); }} style={{ flex: 1, padding: '14px 0', background: mood === b.id ? b.color : '#111', border: `0.5px solid ${mood === b.id ? b.color : '#555'}`, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s', transform: mood === b.id ? 'scale(1.06)' : 'scale(1)' }}>
              <span style={{ fontSize: 22 }}>{b.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: mood === b.id ? (b.dark ? '#000' : '#fff') : '#444' }}>{b.label}</span>
            </button>
          ))}
        </div>
        <Lbl>SESSION COMPLETE</Lbl>
        <div style={{ fontSize: 'clamp(36px,9vw,56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10, marginBottom: 24 }}>
          {userName ? <>{`NICE WORK,`}<br />{userName.toUpperCase()}!</> : <>GREAT<br />WORK.</>}
        </div>

        {/* Exercise list — big, right under the compliment */}
        <div style={{ marginBottom: 8 }}>
          {Object.entries(byCnt).map(([ex, cnt]) => (
            <div key={ex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 10, marginBottom: 10, borderBottom: `0.5px solid ${B}` }}>
              <span style={{ fontSize: 'clamp(22px,5.5vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, flex: 1, paddingRight: 12 }}>{ex.toUpperCase()}</span>
              <span style={{ fontSize: 'clamp(14px,3.5vw,20px)', color: '#444', fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0 }}>{cnt} SET{cnt !== 1 ? 'S' : ''}</span>
            </div>
          ))}
        </div>

        {/* Save as template */}
        <div style={{ marginBottom: 28 }}>
          {!tplOpen && !tplSaved && (
            <button onClick={() => { haptic.light(); setTplOpen(true); }} style={{ background: 'none', border: `0.5px solid ${B}`, borderRadius: 8, padding: '10px 16px', color: '#555', cursor: 'pointer', fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, width: '100%' }}>
              + SAVE AS TEMPLATE
            </button>
          )}
          {tplOpen && !tplSaved && (
            <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '14px 16px', animation: 'fadeIn 0.15s ease-out both' }}>
              <Lbl style={{ marginBottom: 6 }}>TEMPLATE NAME</Lbl>
              <input autoFocus value={tplName} onChange={e => setTplName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveAsTemplate()} placeholder="e.g. PUSH DAY A"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${B}`, padding: '8px 0', fontSize: 22, fontWeight: 800, color: '#fff', outline: 'none', letterSpacing: '-0.01em', marginBottom: 14 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { haptic.light(); setTplOpen(false); }} style={{ padding: '12px 16px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#555', letterSpacing: '0.1em' }}>CANCEL</button>
                <button onClick={saveAsTemplate} disabled={!tplName.trim()} style={{ flex: 1, padding: '12px 0', background: tplName.trim() ? A : '#111', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: tplName.trim() ? 'pointer' : 'default', color: tplName.trim() ? '#000' : '#333', letterSpacing: '0.08em' }}>SAVE TEMPLATE</button>
              </div>
            </div>
          )}
          {tplSaved && (
            <div style={{ padding: '10px 0', fontSize: 11, color: A, letterSpacing: '0.15em', fontWeight: 700, animation: 'fadeIn 0.2s ease-out both' }}>
              ✓ "{tplName}" SAVED AS TEMPLATE
            </div>
          )}
        </div>

        {prs.length > 0 && (
          <div style={{ background: '#0c100a', border: '0.5px solid #2a3a10', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
            <Lbl style={{ color: '#3a5010', marginBottom: 8 }}>PERSONAL RECORDS</Lbl>
            {prs.map((s, i) => <div key={i} style={{ fontSize: 13, fontWeight: 800, color: A, padding: '3px 0' }}>{s.exercise} — {s.weight}KG × {s.reps}</div>)}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[{ l: 'DURATION', v: duration + 'MIN' }, { l: 'TOTAL SETS', v: sessionSets.length }, { l: 'VOLUME', v: totalVol.toLocaleString() + 'KG' }, { l: 'EXERCISES', v: Object.keys(byCnt).length }].map(s => (
            <div key={s.l} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 10, padding: '14px 16px' }}>
              <Lbl style={{ marginBottom: 6 }}>{s.l}</Lbl><div style={{ fontSize: 28, fontWeight: 800 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes for next time..." rows={2}
          style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', borderTop: '0.5px solid #141414', padding: '14px 0 0', color: '#555', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
        <button onClick={handleDone} style={{ marginTop: 20, width: '100%', padding: '20px 0', background: mood ? MOOD_BTNS.find(b => b.id === mood)?.color || A : A, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer', color: mood && !MOOD_BTNS.find(b => b.id === mood)?.dark ? '#fff' : '#000', transition: 'background 0.3s' }}>DONE</button>
        <button disabled style={{ width: '100%', padding: '22px 0', background: '#080808', border: 'none', cursor: 'default', display: 'block' }} />
      </div>
    </div>
  );
}

/* ─── WorkoutScreen (controller) ─────────────────────────────────────────── */
type WorkoutStep = 'start' | 'body_part' | 'exercise' | 'tpl_exercise' | 'set_logger' | 'rest' | 'summary';

export default function WorkoutScreen({ navigate }: { navigate: (s: ScreenName) => void }) {
  const [step, setStep] = useState<WorkoutStep>('start');
  const [activeTpl, setActiveTpl] = useState<Template | null>(null);
  const [bodyPart, setBodyPart] = useState<string | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [setNumber, setSetNumber] = useState(1);
  const [sessionSets, setSessionSets] = useState<LoggedSet[]>([]);
  const [lastSet, setLastSet] = useState<LoggedSet | null>(null);
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const startTime = useRef(Date.now());
  const setsRef = useRef<LoggedSet[]>([]);
  const restDuration = DB.get<number>('restTime', 90);

  const finish = (sets: LoggedSet[]) => { if (!sets || sets.length === 0) { navigate('home'); return; } saveSession(sets, startTime.current); setStep('summary'); };
  const tryEnd = () => setShowConfirmEnd(true);
  const confirmEnd = () => { haptic.heavy(); setShowConfirmEnd(false); finish(setsRef.current); };
  const cancelEnd = () => setShowConfirmEnd(false);

  const selectEx = (ex: string, bp?: string) => {
    const prev = sessionSets.filter(s => s.exercise === ex).length;
    setExercise(ex); setBodyPart(bp || bodyPart); setSetNumber(prev + 1); setRestEndsAt(null); setStep('set_logger');
  };

  const handleLog = (set: LoggedSet, andNext: boolean | 'end', endsAt?: number) => {
    const updated = [...sessionSets, set];
    setSessionSets(updated); setsRef.current = updated; setLastSet(set);
    if (andNext === 'end') { setShowConfirmEnd(true); return; }
    const finalEndsAt = endsAt ?? Date.now() + restDuration * 1000;
    setRestEndsAt(finalEndsAt);
    if (andNext === true) {
      setStep(activeTpl ? 'tpl_exercise' : 'exercise');
    } else {
      // If rest already expired (user waited on summary), go straight to set logger
      if (finalEndsAt <= Date.now()) {
        setSetNumber(n => n + 1); setStep('set_logger');
      } else {
        setStep('rest');
      }
    }
  };

  const handleRest = () => { setSetNumber(n => n + 1); setStep('set_logger'); };

  const overlay = showConfirmEnd ? <ConfirmEnd onConfirm={confirmEnd} onCancel={cancelEnd} /> : null;

  const screen = (() => {
    if (step === 'start') return <WorkoutStartScreen sessionSets={sessionSets} onFresh={() => setStep('body_part')} onTemplate={tpl => { setActiveTpl(tpl); setStep('tpl_exercise'); }} onFinish={tryEnd} />;
    if (step === 'body_part') return <BodyPartScreen onSelect={id => { setBodyPart(id); setStep('exercise'); }} onBack={() => sessionSets.length > 0 ? setStep('start') : navigate('home')} onFinish={tryEnd} sessionSets={sessionSets} />;
    if (step === 'tpl_exercise' && activeTpl) return <TemplateExerciseScreen template={activeTpl} sessionSets={sessionSets} onSelect={selectEx} onSwitchMuscle={() => { setRestEndsAt(null); setStep('body_part'); }} onBack={tryEnd} restEndsAt={restEndsAt} />;
    if (step === 'exercise' && bodyPart) return <ExerciseScreen bodyPartId={bodyPart} onSelect={ex => selectEx(ex, bodyPart)} onBack={() => { setRestEndsAt(null); setStep(activeTpl ? 'tpl_exercise' : 'body_part'); }} onSwitchMuscle={() => { setRestEndsAt(null); setStep('body_part'); }} restEndsAt={restEndsAt} />;
    if (step === 'set_logger' && exercise && bodyPart) return <SetLogger exercise={exercise} bodyPartId={bodyPart} setNumber={setNumber} sessionSets={sessionSets} onLogSet={handleLog} onChangeExercise={() => setStep(activeTpl ? 'tpl_exercise' : 'exercise')} onSwitchMuscle={() => setStep('body_part')} restDuration={restDuration} />;
    if (step === 'rest' && restEndsAt) return <RestTimer endTime={restEndsAt} onDone={handleRest} isPR={lastSet?.isPR} nextLabel={exercise?.toUpperCase() + ' SET ' + (setNumber + 1)} />;
    if (step === 'summary') return <SessionSummary sessionSets={sessionSets} startTime={startTime.current} onDone={(note) => { const sessions = DB.get<{ note?: string }[]>('sessions', []); if (sessions.length) { sessions[sessions.length - 1].note = note || undefined; DB.set('sessions', sessions); } navigate('home'); }} />;
    return null;
  })();

  return <>{screen}{overlay}</>;
}
