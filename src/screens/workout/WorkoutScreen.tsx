import { useState, useRef, useEffect } from 'react';
import { A, D, B, M, BG } from '../../constants/theme';
import { DB } from '../../utils/db';
import { haptic } from '../../utils/haptics';
import { getExercises, getExerciseInfo, getCustomExercises, saveCustomExercises, getHistory, getPR, getTemplates, getSplits, saveSession } from '../../utils/dataHelpers';
import { DEFAULT_TEMPLATES } from '../../constants/exercises';
import type { EquipmentType } from '../../types';
import { Back, Lbl, BigTitle } from '../../components/shared';
import RepWheel from '../../components/ui/RepWheel';
import RestBar from '../../components/ui/RestBar';
import RestTimer from '../../components/ui/RestTimer';
import ConfirmEnd from '../../components/ui/ConfirmEnd';
import MoodCharacter from '../../components/ui/MoodCharacter';
import { BODY_PARTS } from '../../constants/exercises';
import { BW_EXERCISES, DB_EXERCISES, CABLE_EXERCISES } from '../../constants/exercises';
import type { ScreenName, LoggedSet, Template, MoodId, TrainingSplit } from '../../types';

type WorkoutStep = 'start' | 'body_part' | 'exercise' | 'tpl_exercise' | 'set_logger' | 'rest' | 'summary';

const KG_TO_LBS = 2.20462;

/* ─── Equipment badge ─────────────────────────────────────────────────────── */
const EQUIP: Record<EquipmentType, { label: string; bg: string; text: string }> = {
  Barbell:    { label: 'BARBELL',    bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.45)' },
  Dumbbell:   { label: 'DUMBBELL',   bg: 'rgba(80,160,255,0.1)',   text: 'rgba(110,180,255,0.85)' },
  Cable:      { label: 'CABLE',      bg: 'rgba(200,255,0,0.08)',   text: 'rgba(200,255,0,0.7)'    },
  Machine:    { label: 'MACHINE',    bg: 'rgba(180,110,255,0.1)',  text: 'rgba(190,130,255,0.85)' },
  Bodyweight: { label: 'BW',         bg: 'rgba(255,165,50,0.1)',   text: 'rgba(255,175,60,0.85)'  },
};

function EquipBadge({ type }: { type: EquipmentType }) {
  const e = EQUIP[type];
  return (
    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', background: e.bg, color: e.text, padding: '3px 7px', borderRadius: 5, flexShrink: 0 }}>
      {e.label}
    </span>
  );
}

const EQUIPMENT_OPTIONS: EquipmentType[] = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'];
const EQUIP_LABELS: Record<EquipmentType, string> = { Barbell: 'BARBELL', Dumbbell: 'DUMBBELL', Cable: 'CABLE', Machine: 'MACHINE', Bodyweight: 'BW' };

function InlineAddExerciseForm({ bodyPartId, onAdd, onCancel }: {
  bodyPartId: string;
  onAdd: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [focus, setFocus] = useState('');
  const [equipment, setEquipment] = useState<EquipmentType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const canAdd = name.trim().length > 0;
  const handleAdd = () => {
    if (!canAdd) return;
    const c = getCustomExercises();
    saveCustomExercises({ ...c, [bodyPartId]: [...(c[bodyPartId] || []), { name: name.trim(), focus: focus.trim() || undefined, equipment: equipment ?? undefined }] });
    onAdd();
  };

  return (
    <div style={{ background: '#0A0A0A', border: `0.5px solid ${B}`, borderRadius: 14, padding: '16px', marginTop: 4, animation: 'fadeIn 0.15s ease-out both' }}>
      <Lbl style={{ marginBottom: 10 }}>NEW EXERCISE</Lbl>
      <input autoFocus value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && canAdd) handleAdd(); if (e.key === 'Escape') onCancel(); }}
        placeholder="Exercise name..."
        style={{ width: '100%', background: '#161616', border: `0.5px solid ${B}`, borderRadius: 9, padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none', marginBottom: 10 }} />
      {!showDetails ? (
        <button onClick={() => setShowDetails(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: 0, marginBottom: 12 }}>
          + ADD DETAILS (OPTIONAL)
        </button>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <Lbl style={{ marginBottom: 6 }}>WHAT IT TARGETS</Lbl>
          <input value={focus} onChange={e => setFocus(e.target.value)} placeholder="e.g. Upper chest and front of shoulders"
            style={{ width: '100%', background: '#161616', border: `0.5px solid ${B}`, borderRadius: 9, padding: '11px 14px', color: '#fff', fontSize: 13, outline: 'none', marginBottom: 12 }} />
          <Lbl style={{ marginBottom: 8 }}>EQUIPMENT</Lbl>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {EQUIPMENT_OPTIONS.map(eq => {
              const active = equipment === eq;
              const color = EQUIP[eq].text;
              return (
                <button key={eq} onClick={() => setEquipment(active ? null : eq)}
                  style={{ padding: '6px 12px', background: active ? EQUIP[eq].bg : 'transparent', border: `0.5px solid ${active ? 'rgba(255,255,255,0.12)' : B}`, borderRadius: 7, color: active ? color : 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.06em' }}>
                  {EQUIP_LABELS[eq]}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{ padding: '11px 16px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>CANCEL</button>
        <button onClick={handleAdd} disabled={!canAdd}
          style={{ flex: 1, padding: '11px 0', background: canAdd ? A : '#111', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: canAdd ? 'pointer' : 'default', color: canAdd ? '#000' : 'rgba(255,255,255,0.15)' }}>
          ADD EXERCISE
        </button>
      </div>
    </div>
  );
}

/* ─── SplitCard ───────────────────────────────────────────────────────────── */
function SplitCard({ split, onSelectDay }: { split: TrainingSplit; onSelectDay: (split: TrainingSplit, dayIdx: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 14, border: `0.5px solid ${B}`, overflow: 'hidden', background: D }}>
      {/* Header row */}
      <button
        onClick={() => { haptic.light(); setOpen(o => !o); }}
        style={{ width: '100%', padding: '20px 22px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{split.name.toUpperCase()}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.18em', fontWeight: 700, marginTop: 4 }}>{split.tag}</div>
        </div>
        <span style={{ fontSize: 13, color: open ? A : 'rgba(255,255,255,0.25)', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.22s ease, color 0.18s ease', fontWeight: 700 }}>›</span>
      </button>

      {/* Description + days */}
      {open && (
        <div style={{ borderTop: `0.5px solid ${B}`, animation: 'fadeIn 0.15s ease-out both' }}>
          {split.description && (
            <p style={{ margin: 0, padding: '12px 22px 8px', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, fontWeight: 500 }}>{split.description}</p>
          )}
          {split.days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => { haptic.medium(); onSelectDay(split, idx); }}
              style={{ width: '100%', padding: '14px 22px', background: 'transparent', border: 'none', borderTop: idx === 0 ? `0.5px solid ${B}` : 'none', borderBottom: idx < split.days.length - 1 ? `0.5px solid rgba(255,255,255,0.04)` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.04em', marginBottom: 3 }}>{day.name.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.muscles}</div>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 700, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── WorkoutStartScreen ──────────────────────────────────────────────────── */
function WorkoutStartScreen({ sessionSets, onFresh, onTemplate, onFinish }: {
  sessionSets: LoggedSet[];
  onFresh: () => void;
  onTemplate: (tpl: Template) => void;
  onFinish: () => void;
}) {
  const splits = getSplits();
  const defaultIds = new Set(DEFAULT_TEMPLATES.map(t => t.id));
  const userTemplates = getTemplates().filter(t => !defaultIds.has(t.id));
  const inSession = sessionSets.length > 0;

  const handleSelectDay = (split: TrainingSplit, dayIdx: number) => {
    const day = split.days[dayIdx];
    onTemplate({
      id: `split-${split.id}-${dayIdx}`,
      name: `${split.name} · ${day.name}`,
      exercises: day.exercises,
    });
  };

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: BG, animation: 'fadeIn 0.2s ease-out both' }}>
      <div style={{ padding: '52px 28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onFinish} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, padding: 0 }}>
          {inSession ? '← FINISH SESSION' : '← HOME'}
        </button>
        {inSession && <span style={{ fontSize: 10, color: M, letterSpacing: '0.12em' }}>{sessionSets.length} SETS</span>}
      </div>
      <div style={{ padding: '0 28px 20px' }}>
        <Lbl>WORKOUT</Lbl>
        <BigTitle>{inSession ? 'WHAT NEXT?' : "LET'S GO."}</BigTitle>
      </div>

      <div style={{ flex: 1, padding: '8px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Start fresh */}
        <button onClick={onFresh} style={{ padding: '26px 22px', background: A, border: 'none', borderRadius: 14, color: '#000', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.01em' }}>{inSession ? 'SWITCH MUSCLE GROUP' : 'START FRESH'}</div>
            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', marginTop: 5, letterSpacing: '0.12em', fontWeight: 700 }}>PICK ANY MUSCLE GROUP</div>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>→</span>
        </button>

        {/* User's custom templates */}
        {userTemplates.length > 0 && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px 2px' }}>
            <div style={{ flex: 1, height: '0.5px', background: B }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontWeight: 700 }}>MY TEMPLATES</span>
            <div style={{ flex: 1, height: '0.5px', background: B }} />
          </div>
          {userTemplates.map(tpl => (
            <button key={tpl.id} onClick={() => { haptic.light(); onTemplate(tpl); }} style={{ padding: '18px 22px', background: D, border: `0.5px solid ${B}`, borderRadius: 12, color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8 }}>{tpl.name.toUpperCase()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {tpl.exercises.slice(0, 5).map(e => (
                  <span key={e.name} style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', background: '#1A1A1A', padding: '3px 8px', borderRadius: 5, fontWeight: 700, letterSpacing: '0.04em' }}>{e.name.toUpperCase()}</span>
                ))}
                {tpl.exercises.length > 5 && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>+{tpl.exercises.length - 5}</span>}
              </div>
            </button>
          ))}
        </>)}

        {/* Splits */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px 2px' }}>
          <div style={{ flex: 1, height: '0.5px', background: B }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontWeight: 700 }}>TRAINING SPLITS</span>
          <div style={{ flex: 1, height: '0.5px', background: B }} />
        </div>

        {splits.map(split => (
          <SplitCard key={split.id} split={split} onSelectDay={handleSelectDay} />
        ))}
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
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: BG, animation: 'fadeIn 0.2s ease-out both' }}>
      <div style={{ padding: '52px 28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />
        {total > 0 && <span style={{ fontSize: 10, color: M, letterSpacing: '0.12em' }}>{total} SETS THIS SESSION</span>}
      </div>
      <div style={{ padding: '0 28px 16px' }}>
        <Lbl>MUSCLE GROUP</Lbl>
        <BigTitle>WHERE ARE<br />YOU TRAINING?</BigTitle>
      </div>
      <div style={{ flex: 1, padding: '8px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BODY_PARTS.map(bp => (
          <div key={bp.id}>
            <button
              onClick={() => { haptic.light(); bp.children ? setArmsOpen(o => !o) : onSelect(bp.id); }}
              style={{
                width: '100%',
                padding: 'clamp(20px,5vw,26px) 22px',
                background: D,
                border: `0.5px solid ${B}`,
                borderRadius: armsOpen && bp.children ? '12px 12px 0 0' : 12,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.1s',
              }}
            >
              <span style={{ fontSize: 'clamp(22px,5.5vw,30px)', fontWeight: 800, letterSpacing: '-0.01em' }}>{bp.label}</span>
              {bp.children && (
                <span style={{ fontSize: 14, color: armsOpen ? A : 'rgba(255,255,255,0.3)', display: 'inline-block', transform: armsOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s, color 0.2s' }}>→</span>
              )}
            </button>
            {bp.children && armsOpen && (
              <div style={{ display: 'flex', border: `0.5px solid ${B}`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                {bp.children.map((sub, i) => (
                  <button key={sub.id} onClick={() => { haptic.light(); onSelect(sub.id); }}
                    style={{ flex: 1, padding: '18px 8px', background: '#0D0D0D', border: 'none', borderLeft: i > 0 ? `0.5px solid ${B}` : 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em' }}>
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {total > 0 && (
          <button onClick={onFinish} style={{ marginTop: 4, width: '100%', padding: '18px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em' }}>
            FINISH SESSION →
          </button>
        )}
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
  const exercises = search.trim() ? allExercises.filter(e => e.toLowerCase().includes(search.toLowerCase())) : allExercises;

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: BG, animation: 'fadeIn 0.2s ease-out both' }}>
      <div style={{ padding: '52px 28px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />
        <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ background: 'none', border: `0.5px solid rgba(255,255,255,0.15)`, borderRadius: 7, padding: '6px 12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 10, letterSpacing: '0.12em', fontWeight: 700 }}>
          SWITCH MUSCLE
        </button>
      </div>
      <RestBar restEndsAt={restEndsAt} />
      <div style={{ padding: '0 20px 10px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${bodyPartId} exercises...`}
          style={{ width: '100%', background: '#0C0C0C', border: `0.5px solid ${B}`, borderRadius: 12, padding: '13px 18px', color: '#fff', fontSize: 15, outline: 'none', letterSpacing: '0.01em' }}
        />
      </div>
      <div style={{ flex: 1, padding: '4px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {exercises.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em' }}>NO MATCHES</div>
        )}
        {exercises.map(ex => {
          const info = getExerciseInfo(ex);
          const history = getHistory(ex); const pr = getPR(ex);
          const lastSession = history[0] || null;
          const lastTopW = lastSession ? Math.max(...lastSession.sets.map(x => x.weight)) : null;
          const lastSets = lastSession ? lastSession.sets.length : null;
          const lastDate = lastSession ? new Date(lastSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
          return (
            <button
              key={ex}
              onClick={() => { haptic.light(); onSelect(ex); }}
              style={{ width: '100%', padding: '18px 18px', background: D, border: `0.5px solid ${B}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name row + equipment badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: info ? 6 : (lastTopW ? 7 : 0) }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>{ex}</span>
                  {info?.equipment && <EquipBadge type={info.equipment} />}
                </div>
                {/* Focus area */}
                {info && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: lastTopW || pr > 0 ? 8 : 0, lineHeight: 1.4 }}>
                    {info.focus}
                  </div>
                )}
                {/* History + PR row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {pr > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '2px 7px', borderRadius: 5, flexShrink: 0 }}>
                      {pr}KG PR
                    </span>
                  )}
                  {lastTopW && (
                    <>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{lastDate}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 700 }}>{lastTopW}kg</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{lastSets}s</span>
                    </>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.18)', flexShrink: 0, marginTop: 3 }}>›</span>
            </button>
          );
        })}
        {!adding && (
          <button onClick={() => setAdding(true)} style={{ padding: '15px 18px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 11, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginTop: 4 }}>
            + ADD EXERCISE TO {bodyPartId.toUpperCase()}
          </button>
        )}
        {adding && (
          <InlineAddExerciseForm
            bodyPartId={bodyPartId}
            onAdd={() => { setAllExercises(getExercises(bodyPartId)); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
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
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: BG, animation: 'fadeIn 0.2s ease-out both' }}>
      <div style={{ padding: '52px 28px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Back onBack={onBack} />
        {sessionSets.length > 0 && <span style={{ fontSize: 10, color: M, letterSpacing: '0.1em' }}>{sessionSets.length} SETS</span>}
      </div>
      <RestBar restEndsAt={restEndsAt} />
      <div style={{ padding: '0 28px 12px' }}>
        <Lbl>{template.name.toUpperCase()}</Lbl>
        <BigTitle>PICK AN<br />EXERCISE</BigTitle>
      </div>
      <div style={{ flex: 1, padding: '4px 20px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {template.exercises.map(ex => {
          const cnt = sessionSets.filter(s => s.exercise === ex.name).length;
          const pr = getPR(ex.name);
          const lw = getHistory(ex.name, 1)[0]?.sets?.slice(-1)[0]?.weight;
          const info = getExerciseInfo(ex.name);
          return (
            <button key={ex.name} onClick={() => { haptic.light(); onSelect(ex.name, ex.bodyPart); }}
              style={{ padding: '18px 18px', background: D, border: `0.5px solid ${B}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, opacity: cnt >= 4 ? 0.35 : 1 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: info ? 6 : 4 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{ex.name}</span>
                  {info?.equipment && <EquipBadge type={info.equipment} />}
                </div>
                {info && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 7, lineHeight: 1.4 }}>{info.focus}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {pr > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '2px 6px', borderRadius: 4 }}>{pr}KG PR</span>}
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', fontWeight: 700 }}>
                    {ex.bodyPart.toUpperCase()}{lw ? ` · LAST ${lw}KG` : ''}{cnt > 0 ? ` · ${cnt}S DONE` : ''}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.18)', flexShrink: 0, marginTop: 3 }}>›</span>
            </button>
          );
        })}
        <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ marginTop: 8, padding: '14px 18px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 11, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
          + SWITCH / ADD MUSCLE GROUP
        </button>
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

  const prevWeightKg = prev?.weight || null;
  const prevWeightDisplay = prevWeightKg
    ? (bwMode
      ? String(Math.round((prevWeightKg - bwKg) * 10) / 10)  // signed: positive=weighted, negative=assisted
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
    return Math.max(0, Math.round((bwKg + wKg) * 10) / 10);
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

  const handleWeight = (v: string) => {
    if (isBWExercise) {
      if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) setWeight(v);
    } else {
      if (v === '' || /^\d*\.?\d*$/.test(v)) setWeight(v);
    }
  };
  const canSave = bwMode ? parseInt(reps) > 0 : !!(parseFloat(weight) > 0 && parseInt(reps) > 0);
  const step = unit === 'lbs' ? 5 : 2.5;

  const handleSave = () => {
    const addedVal = parseFloat(weight) || 0;
    const wkg = weightKg(), r = parseInt(reps);
    if (bwMode && !r) return;
    if (!bwMode && (!wkg || !r)) return;
    const isPR = wkg > pr;
    isPR ? haptic.pr() : haptic.success();
    const derivedSign: '+' | '-' = addedVal >= 0 ? '+' : '-';
    const set: LoggedSet = { exercise, bodyPart: bodyPartId, weight: wkg, reps: r, setNumber, isPR, note: note.trim() || undefined, unit: unit as 'kg' | 'lbs', bwMode: bwMode || undefined, bwSign: bwMode ? derivedSign : undefined, addedKg: bwMode ? Math.abs(addedVal) : undefined, _ts: Date.now() };
    setSavedSet(set);
    setSummaryRestEndsAt(Date.now() + restDuration * 1000);
    setSummaryRem(restDuration);
    setShowActions(true);
  };

  /* ── Post-save summary ── */
  if (showActions && savedSet) {
    return (
      <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: BG, overflow: 'hidden', animation: 'fadeIn 0.18s ease-out both' }}>
        <div style={{ padding: '52px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.22em', fontWeight: 700 }}>{bodyPartId.toUpperCase()} · SET {setNumber} SAVED</span>
            {savedSet.isPR && (
              <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: A, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.06em', animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both, prGlow 1.2s ease-out 0.3s' }}>
                NEW PR
              </span>
            )}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 24px 0', overflow: 'hidden' }}>
          <div style={{ fontSize: 'clamp(48px,13vw,88px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.92, color: '#fff', wordBreak: 'break-word', animation: 'fadeIn 0.2s ease-out 0.05s both' }}>
            {exercise.toUpperCase()}
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(30px,8vw,50px)', fontWeight: 800, color: savedSet.isPR ? A : 'rgba(255,255,255,0.5)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {savedSet.bwMode
                ? 'BW' + (savedSet.addedKg && savedSet.addedKg > 0 ? (savedSet.bwSign || '+') + savedSet.addedKg : '') + '=' + savedSet.weight + 'KG'
                : (savedSet.unit === 'lbs' ? Math.round(savedSet.weight * 2.20462 * 10) / 10 : savedSet.weight) + (savedSet.unit || 'kg').toUpperCase()}
            </span>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>×</span>
            <span style={{ fontSize: 'clamp(30px,8vw,50px)', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.03em', lineHeight: 1 }}>{savedSet.reps}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', fontWeight: 600, letterSpacing: '0.06em', alignSelf: 'center' }}>REPS</span>
          </div>
          {savedSet.note && <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>"{savedSet.note}"</div>}
        </div>
        <div style={{ padding: '0 24px', flexShrink: 0 }}>
          {summaryRestEndsAt && (
            <div style={{ marginBottom: 16, animation: 'fadeIn 0.2s ease-out both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', fontWeight: 700 }}>REST</span>
                <span style={{ fontSize: summaryRem > 0 ? 26 : 13, fontWeight: 900, color: summaryRem > 0 ? (summaryRem <= 10 ? '#FF453A' : A) : 'rgba(255,255,255,0.3)', letterSpacing: '-0.02em', transition: 'color 0.3s, font-size 0.15s', fontVariantNumeric: 'tabular-nums' }}>
                  {summaryRem > 0 ? (summaryRem >= 60 ? Math.floor(summaryRem / 60) + ':' + String(summaryRem % 60).padStart(2, '0') : summaryRem + 's') : 'GO →'}
                </span>
              </div>
              <div style={{ height: 2, background: '#111', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: summaryRem <= 10 ? '#FF453A' : A, borderRadius: 1, width: `${(summaryRem / restDuration) * 100}%`, transition: 'width 0.25s linear, background 0.3s' }} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center', marginBottom: 2, animation: 'fadeIn 0.18s ease-out both' }}>WHAT NEXT?</div>
            <button onClick={() => { haptic.medium(); onLogSet(savedSet, false, summaryRestEndsAt ?? undefined); }}
              style={{ width: '100%', padding: '22px 0', background: A, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000', animation: 'slideUp 0.18s ease-out 0.05s both' }}>
              NEXT SET
            </button>
            <button onClick={() => { haptic.light(); onLogSet(savedSet, true, summaryRestEndsAt ?? undefined); }}
              style={{ width: '100%', padding: '19px 0', background: D, border: `0.5px solid ${B}`, borderRadius: 14, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', color: '#fff', animation: 'slideUp 0.18s ease-out 0.1s both' }}>
              NEXT EXERCISE
            </button>
            <button onClick={() => { haptic.light(); onLogSet(savedSet, 'end'); }}
              style={{ width: '100%', padding: '16px 0', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 14, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', animation: 'slideUp 0.18s ease-out 0.15s both' }}>
              END SESSION
            </button>
            <button disabled style={{ width: '100%', padding: '22px 0', background: BG, border: 'none', cursor: 'default', display: 'block' }} />
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
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: BG, animation: 'fadeIn 0.2s ease-out both', overflow: 'hidden' }}>
      <div style={{ padding: 'env(safe-area-inset-top, 44px) 20px 12px', paddingTop: 'max(44px,env(safe-area-inset-top))', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Back onBack={onChangeExercise} label="← EXERCISE" />
          <button onClick={() => { haptic.light(); onSwitchMuscle(); }} style={{ background: 'none', border: `0.5px solid rgba(255,255,255,0.15)`, borderRadius: 7, padding: '5px 12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', fontWeight: 700 }}>
            SWITCH MUSCLE
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', fontWeight: 700 }}>{bodyPartId.toUpperCase()} · SET {setNumber}</span>
        </div>
        <div style={{ fontSize: 'clamp(18px,4.5vw,28px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4, color: '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {exercise.toUpperCase()}
        </div>
        {done.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
            {done.map((s, i) => (
              <div key={i} style={{ padding: '3px 10px', background: '#0F0F0F', border: `0.5px solid ${B}`, borderRadius: 6, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                S{s.setNumber} {s.weight}×{s.reps}{s.note && <span style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>✎</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '4px 20px 0', display: 'flex', flexDirection: 'column' }}>
        {/* Weight */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Lbl>{bwMode ? ((parseFloat(weight) || 0) < 0 ? 'ASSIST WEIGHT (KG)' : 'EXTRA WEIGHT (KG)') : `WEIGHT (${unit.toUpperCase()})`}</Lbl>
            {isBWExercise && bwKg > 0 && (
              <button onClick={() => { haptic.light(); setBwMode(m => !m); setWeight(''); }}
                style={{ padding: '5px 12px', borderRadius: 7, border: `0.5px solid ${bwMode ? 'rgba(200,255,0,0.4)' : B}`, background: bwMode ? 'rgba(200,255,0,0.08)' : 'transparent', cursor: 'pointer', fontSize: 9, fontWeight: 800, color: bwMode ? A : 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                {bwMode ? 'BW MODE ✓' : 'BW MODE'}
              </button>
            )}
          </div>
          {bwMode && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: '#080808', borderRadius: 10, border: `0.5px solid ${B}` }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: A }}>{bwKg}KG</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{(parseFloat(weight) || 0) < 0 ? '−' : '+'}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: weight && weight !== '-' ? '#fff' : 'rgba(255,255,255,0.15)' }}>
                  {weight && weight !== '-' ? Math.abs(parseFloat(weight) || 0) + 'KG' : '?KG'}
                </span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>=</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>
                  {Math.max(0, Math.round((bwKg + (parseFloat(weight) || 0)) * 10) / 10)}KG
                </span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', fontWeight: 600 }}>LOGGED</span>
              </div>
              <div style={{ marginTop: 5, textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', fontWeight: 600 }}>
                NEGATIVE = ASSISTED · POSITIVE = WEIGHTED
              </div>
            </div>
          )}
          {showToggle && (
            <div onClick={toggleUnit} style={{ display: 'flex', marginBottom: 10, background: '#0C0C0C', border: `0.5px solid ${B}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative', userSelect: 'none' }}>
              <div style={{ position: 'absolute', top: 2, bottom: 2, width: 'calc(50% - 2px)', left: unit === 'lbs' ? 'calc(50% + 2px)' : '2px', background: A, borderRadius: 9, transition: 'left 0.18s ease' }} />
              <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '13px 0', textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '0.08em', color: unit === 'kg' ? '#000' : 'rgba(255,255,255,0.3)', transition: 'color 0.18s' }}>KG</div>
              <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '13px 0', textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '0.08em', color: unit === 'lbs' ? '#000' : 'rgba(255,255,255,0.3)', transition: 'color 0.18s' }}>LBS</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => { haptic.light(); setWeight(w => { const next = (parseFloat(w) || 0) - step; const clamped = isBWExercise ? next : Math.max(0, next); return clamped.toFixed(1).replace(/\.0$/, ''); }); }}
              style={{ width: 52, height: 52, borderRadius: 14, background: '#161616', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              −
            </button>
            <input type="text" inputMode="decimal" value={weight} onChange={e => handleWeight(e.target.value)} placeholder="0"
              style={{ flex: 1, minWidth: 0, background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '14px 8px', color: '#fff', fontSize: 'clamp(32px,9vw,44px)', fontWeight: 800, textAlign: 'center', outline: 'none', letterSpacing: '-0.02em' }} />
            <button onClick={() => { haptic.light(); setWeight(w => ((parseFloat(w) || 0) + step).toFixed(1).replace(/\.0$/, '')); }}
              style={{ width: 52, height: 52, borderRadius: 14, background: '#161616', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, fontWeight: 300, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              +
            </button>
          </div>
          {weightHint && !bwMode && (
            <div style={{ marginTop: 4, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', fontWeight: 600 }}>{weightHint}</div>
          )}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, minHeight: 32, flexWrap: 'wrap' }}>
            {isNewPR && (
              <span style={{ fontSize: 10, color: A, letterSpacing: '0.1em', fontWeight: 800, animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>NEW PR!</span>
            )}
            {(showPROnly || showBoth) && (
              <button onClick={() => setWeight(String(prDisplay))} style={{ padding: '6px 14px', background: D, border: `0.5px solid ${B}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em' }}>PR</span>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 900, letterSpacing: '-0.01em' }}>{prDisplay}{unit.toUpperCase()}</span>
              </button>
            )}
            {showBoth && lastDisplay && (
              <button onClick={() => setWeight(String(lastDisplay))} style={{ padding: '6px 14px', background: D, border: `0.5px solid ${B}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em' }}>LAST</span>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 900, letterSpacing: '-0.01em' }}>{lastDisplay}{unit.toUpperCase()}</span>
              </button>
            )}
          </div>
        </div>

        {/* Reps */}
        <div style={{ marginBottom: 12 }}>
          <Lbl style={{ marginBottom: 10 }}>REPS</Lbl>
          <RepWheel value={reps} onChange={setReps} />
          {vol > 0 && (
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
              SET VOLUME {vol.toLocaleString()} {unit.toUpperCase()}
            </div>
          )}
        </div>

        {/* Note */}
        <div style={{ marginBottom: 8 }}>
          {!noteOpen && !note && (
            <button onClick={() => setNoteOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, padding: 0 }}>
              + ADD NOTE
            </button>
          )}
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
        <button onClick={handleSave} disabled={!canSave}
          style={{ width: '100%', padding: '22px 0', background: canSave ? A : '#111', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', cursor: canSave ? 'pointer' : 'default', color: canSave ? '#000' : 'rgba(255,255,255,0.12)', transition: 'background 0.15s', animation: canSave ? 'savePulse 0.6s ease-out' : 'none' }}>
          SAVE SET
        </button>
        <button disabled style={{ width: '100%', padding: '22px 0', background: BG, border: 'none', cursor: 'default', display: 'block' }} />
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
    <div style={{ minHeight: '100svh', background: BG, animation: 'fadeIn 0.2s ease-out both', overflowY: 'auto' }}>
      <div style={{ padding: 'max(44px,env(safe-area-inset-top)) 28px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', display: 'flex', flexDirection: 'column' }}>
        <MoodCharacter mood={mood} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {MOOD_BTNS.map(b => (
            <button key={b.id} onClick={() => { haptic.light(); setMood(b.id); }}
              style={{ flex: 1, padding: '14px 0', background: mood === b.id ? b.color : '#0D0D0D', border: `0.5px solid ${mood === b.id ? b.color : B}`, borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s', transform: mood === b.id ? 'scale(1.06)' : 'scale(1)' }}>
              <span style={{ fontSize: 22 }}>{b.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: mood === b.id ? (b.dark ? '#000' : '#fff') : 'rgba(255,255,255,0.3)' }}>{b.label}</span>
            </button>
          ))}
        </div>
        <Lbl>SESSION COMPLETE</Lbl>
        <div style={{ fontSize: 'clamp(36px,9vw,56px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10, marginBottom: 24 }}>
          {userName ? <>{`NICE WORK,`}<br />{userName.toUpperCase()}!</> : <>GREAT<br />WORK.</>}
        </div>

        <div style={{ marginBottom: 8 }}>
          {Object.entries(byCnt).map(([ex, cnt]) => (
            <div key={ex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 10, marginBottom: 10, borderBottom: `0.5px solid ${B}` }}>
              <span style={{ fontSize: 'clamp(20px,5.5vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, flex: 1, paddingRight: 12 }}>{ex.toUpperCase()}</span>
              <span style={{ fontSize: 'clamp(13px,3.5vw,18px)', color: 'rgba(255,255,255,0.28)', fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0 }}>{cnt} SET{cnt !== 1 ? 'S' : ''}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          {!tplOpen && !tplSaved && (
            <button onClick={() => { haptic.light(); setTplOpen(true); }}
              style={{ background: 'rgba(200,255,0,0.06)', border: `0.5px solid rgba(200,255,0,0.25)`, borderRadius: 10, padding: '12px 16px', color: 'rgba(200,255,0,0.7)', cursor: 'pointer', fontSize: 11, letterSpacing: '0.15em', fontWeight: 800, width: '100%' }}>
              + SAVE AS TEMPLATE
            </button>
          )}
          {tplOpen && !tplSaved && (
            <div style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 14, padding: '14px 16px', animation: 'fadeIn 0.15s ease-out both' }}>
              <Lbl style={{ marginBottom: 6 }}>TEMPLATE NAME</Lbl>
              <input autoFocus value={tplName} onChange={e => setTplName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveAsTemplate()} placeholder="e.g. PUSH DAY A"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${B}`, padding: '8px 0', fontSize: 22, fontWeight: 800, color: '#fff', outline: 'none', letterSpacing: '-0.01em', marginBottom: 14 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { haptic.light(); setTplOpen(false); }} style={{ padding: '12px 16px', background: 'transparent', border: `0.5px solid ${B}`, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>CANCEL</button>
                <button onClick={saveAsTemplate} disabled={!tplName.trim()} style={{ flex: 1, padding: '12px 0', background: tplName.trim() ? A : '#111', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: tplName.trim() ? 'pointer' : 'default', color: tplName.trim() ? '#000' : 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>SAVE TEMPLATE</button>
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
          <div style={{ background: 'rgba(200,255,0,0.05)', border: '0.5px solid rgba(200,255,0,0.18)', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
            <Lbl style={{ color: 'rgba(200,255,0,0.5)', marginBottom: 8 }}>PERSONAL RECORDS</Lbl>
            {prs.map((s, i) => <div key={i} style={{ fontSize: 13, fontWeight: 800, color: A, padding: '3px 0' }}>{s.exercise} — {s.weight}KG × {s.reps}</div>)}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[
            { l: 'DURATION', v: duration + 'MIN' },
            { l: 'TOTAL SETS', v: sessionSets.length },
            { l: 'VOLUME', v: totalVol.toLocaleString() + 'KG' },
            { l: 'EXERCISES', v: Object.keys(byCnt).length },
          ].map(s => (
            <div key={s.l} style={{ background: D, border: `0.5px solid ${B}`, borderRadius: 12, padding: '16px 16px' }}>
              <Lbl style={{ marginBottom: 6 }}>{s.l}</Lbl>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any notes for next time..." rows={2}
          style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', borderTop: `0.5px solid ${B}`, padding: '14px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
        <button onClick={handleDone}
          style={{ marginTop: 20, width: '100%', padding: '20px 0', background: mood ? MOOD_BTNS.find(b => b.id === mood)?.color || A : A, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer', color: mood && !MOOD_BTNS.find(b => b.id === mood)?.dark ? '#fff' : '#000', transition: 'background 0.3s' }}>
          DONE
        </button>
        <button disabled style={{ width: '100%', padding: '22px 0', background: BG, border: 'none', cursor: 'default', display: 'block' }} />
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
  const [fromNextEx, setFromNextEx] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const startTime = useRef(Date.now());
  const setsRef = useRef<LoggedSet[]>([]);
  const restDuration = DB.get<number>('restTime', 90);

  // Reset to start screen on mount
  useEffect(() => {
    setStep('start');
    setBodyPart(null);
    setActiveTpl(null);
    setExercise(null);
    setSessionSets([]);
    setsRef.current = [];
    setLastSet(null);
    setRestEndsAt(null);
    setFromNextEx(false);
    setShowConfirmEnd(false);
    startTime.current = Date.now();
    setSetNumber(1);
  }, []);

  const finish = (sets: LoggedSet[]) => { if (!sets || sets.length === 0) { navigate('home'); return; } saveSession(sets, startTime.current); setStep('summary'); };
  const tryEnd = () => setShowConfirmEnd(true);
  const confirmEnd = () => { haptic.heavy(); setShowConfirmEnd(false); finish(setsRef.current); };
  const cancelEnd = () => setShowConfirmEnd(false);

  const selectEx = (ex: string, bp?: string) => {
    const prev = sessionSets.filter(s => s.exercise === ex).length;
    setExercise(ex); setBodyPart(bp || bodyPart); setSetNumber(prev + 1);
    if (restEndsAt && restEndsAt > Date.now()) {
      setFromNextEx(true);
      setStep('rest');
    } else {
      setFromNextEx(false);
      setRestEndsAt(null); setStep('set_logger');
    }
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
      if (finalEndsAt <= Date.now()) {
        setSetNumber(n => n + 1); setStep('set_logger');
      } else {
        setStep('rest');
      }
    }
  };

  const handleRest = () => {
    if (!fromNextEx) setSetNumber(n => n + 1);
    setFromNextEx(false);
    setStep('set_logger');
  };

  const overlay = showConfirmEnd ? <ConfirmEnd onConfirm={confirmEnd} onCancel={cancelEnd} /> : null;

  const screen = (() => {
    if (step === 'start') return <WorkoutStartScreen sessionSets={sessionSets} onFresh={() => setStep('body_part')} onTemplate={tpl => { setActiveTpl(tpl); setStep('tpl_exercise'); }} onFinish={tryEnd} />;
    if (step === 'body_part') return <BodyPartScreen onSelect={id => { setBodyPart(id); setStep('exercise'); }} onBack={() => sessionSets.length > 0 ? setStep('start') : navigate('home')} onFinish={tryEnd} sessionSets={sessionSets} />;
    if (step === 'tpl_exercise' && activeTpl) return <TemplateExerciseScreen template={activeTpl} sessionSets={sessionSets} onSelect={selectEx} onSwitchMuscle={() => { setRestEndsAt(null); setStep('body_part'); }} onBack={tryEnd} restEndsAt={restEndsAt} />;
    if (step === 'exercise' && bodyPart) return <ExerciseScreen bodyPartId={bodyPart} onSelect={ex => selectEx(ex, bodyPart)} onBack={() => { setRestEndsAt(null); setStep(activeTpl ? 'tpl_exercise' : 'body_part'); }} onSwitchMuscle={() => { setRestEndsAt(null); setStep('body_part'); }} restEndsAt={restEndsAt} />;
    if (step === 'set_logger' && exercise && bodyPart) return <SetLogger exercise={exercise} bodyPartId={bodyPart} setNumber={setNumber} sessionSets={sessionSets} onLogSet={handleLog} onChangeExercise={() => setStep(activeTpl ? 'tpl_exercise' : 'exercise')} onSwitchMuscle={() => setStep('body_part')} restDuration={restDuration} />;
    if (step === 'rest' && restEndsAt) return <RestTimer endTime={restEndsAt} onDone={handleRest} isPR={lastSet?.isPR} nextLabel={exercise?.toUpperCase() + ' SET ' + (fromNextEx ? setNumber : setNumber + 1)} />;
    if (step === 'summary') return <SessionSummary sessionSets={sessionSets} startTime={startTime.current} onDone={(note) => { const sessions = DB.get<{ note?: string }[]>('sessions', []); if (sessions.length) { sessions[sessions.length - 1].note = note || undefined; DB.set('sessions', sessions); } navigate('home'); }} />;
    return null;
  })();

  return <>{screen}{overlay}</>;
}
