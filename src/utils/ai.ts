import type { AIProvider, Session } from '../types';

export const PROVIDERS = {
  anthropic: { label: 'Claude (Anthropic)', hint: 'sk-ant-api03-...', free: false },
  openai:    { label: 'GPT-4o (OpenAI)',    hint: 'sk-...',           free: false },
  groq:      { label: 'Llama 3 (Groq)',     hint: 'gsk_...',          free: true  },
  gemini:    { label: 'Gemini (Google)',     hint: 'AIza...',          free: true  },
};

async function SSE(
  url: string,
  headers: Record<string, string>,
  body: unknown,
  onChunk: (t: string) => void,
): Promise<string> {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const e = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(e?.error?.message || `HTTP ${res.status}`);
  }
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    dec.decode(value).split('\n').filter(l => l.startsWith('data: ')).forEach(line => {
      const raw = line.slice(6);
      if (raw === '[DONE]') return;
      try {
        const j = JSON.parse(raw) as { delta?: { text?: string }; choices?: [{ delta?: { content?: string } }] };
        const t = j?.delta?.text || j?.choices?.[0]?.delta?.content || '';
        full += t;
        onChunk(full);
      } catch {}
    });
  }
  return full;
}

export async function callAI(
  provider: AIProvider,
  key: string,
  prompt: string,
  onChunk: (t: string) => void,
): Promise<string> {
  if (provider === 'anthropic') {
    return SSE(
      'https://api.anthropic.com/v1/messages',
      { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      { model: 'claude-sonnet-4-20250514', max_tokens: 1024, stream: true, messages: [{ role: 'user', content: prompt }] },
      onChunk,
    );
  }
  if (provider === 'openai') {
    return SSE(
      'https://api.openai.com/v1/chat/completions',
      { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      { model: 'gpt-4o', max_tokens: 1024, stream: true, messages: [{ role: 'user', content: prompt }] },
      onChunk,
    );
  }
  if (provider === 'groq') {
    return SSE(
      'https://api.groq.com/openai/v1/chat/completions',
      { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      { model: 'llama3-70b-8192', max_tokens: 1024, stream: true, messages: [{ role: 'user', content: prompt }] },
      onChunk,
    );
  }
  if (provider === 'gemini') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1024 } }),
      },
    );
    if (!res.ok) {
      const e = await res.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(e?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json() as { candidates?: [{ content?: { parts?: [{ text?: string }] } }] };
    const t = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    onChunk(t);
    return t;
  }
  throw new Error('Unknown provider');
}

export function buildPrompt(sessions: Session[], bodyweight: string): string {
  const exMap: Record<string, { bodyPart: string; history: { date: string; weight: number; reps: number; isPR: boolean }[] }> = {};
  sessions.forEach(s => (s.sets || []).forEach(st => {
    if (!exMap[st.exercise]) exMap[st.exercise] = { bodyPart: st.bodyPart, history: [] };
    exMap[st.exercise].history.push({ date: s.date, weight: st.weight, reps: st.reps, isPR: st.isPR });
  }));
  const mFreq: Record<string, number> = {};
  sessions.forEach(s => { new Set((s.sets || []).map(st => st.bodyPart)).forEach(p => { mFreq[p] = (mFreq[p] || 0) + 1; }); });
  const lastT: Record<string, string> = {};
  sessions.slice().reverse().forEach(s => (s.sets || []).forEach(st => { if (!lastT[st.bodyPart]) lastT[st.bodyPart] = s.date; }));
  const today = new Date();
  const days = Object.fromEntries(Object.entries(lastT).map(([k, v]) => [k, Math.round((today.getTime() - new Date(v).getTime()) / 86400000)]));
  const vTrend = sessions.slice(-10).map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    vol: (s.sets || []).reduce((a, st) => a + st.weight * st.reps, 0),
    sets: s.sets?.length || 0,
  }));
  const topEx = Object.entries(exMap)
    .sort((a, b) => b[1].history.length - a[1].history.length)
    .slice(0, 12)
    .map(([name, d]) => {
      const w = d.history.map(h => h.weight);
      const pr = Math.max(...w);
      const rec = d.history.slice(-4).map(h => `${h.weight}kg×${h.reps}`).join(', ');
      const trend = w[w.length - 1] > w[0] ? `+${w[w.length - 1] - w[0]}kg` : w[w.length - 1] < w[0] ? `${w[w.length - 1] - w[0]}kg` : 'flat';
      return `  • ${name} (${d.bodyPart}): PR ${pr}kg | Recent: ${rec} | Trend: ${trend}`;
    }).join('\n');

  return `You are an expert personal trainer. Be specific and data-driven.\n\n${bodyweight ? `Bodyweight: ${bodyweight}kg\n` : ''}Sessions: ${sessions.length} | ${new Date(sessions[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${new Date(sessions[sessions.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n\nMUSCLE FREQUENCY:\n${Object.entries(mFreq).sort((a, b) => b[1] - a[1]).map(([m, c]) => `  • ${m}: ${c}x (last: ${days[m] ?? '?'}d ago)`).join('\n')}\n\nVOLUME TREND (last 10):\n${vTrend.map(v => `  • ${v.date}: ${v.vol.toLocaleString()}kg | ${v.sets} sets`).join('\n')}\n\nTOP EXERCISES:\n${topEx}\n\nProvide:\n1. PROGRESS SUMMARY\n2. PLATEAUS & STALLS (specific fixes)\n3. MUSCLE BALANCE\n4. RECOVERY & FREQUENCY\n5. TOP 3 ACTIONS RIGHT NOW\n\nUnder 500 words. Reference actual data. No generic advice.`;
}
