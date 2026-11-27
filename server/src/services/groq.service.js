// Groq (free tier, no card on the account, so it can never charge: over a limit it answers 429).
// OpenAI-style chat API, called with plain fetch (no extra package). Used by chat.service.js.
// Key: Fly secret GROQ_API_KEY (never sent to the browser, never logged).
// Groq retires and adds models often, so the models used are PREFERRED (best first) filtered by
// Groq's live model list (GET /models, refreshed hourly). Each model has its own free
// allowance (requests per day, tokens per minute): when one answers 429 it rests for the time
// Groq gives, and the next model is tried; a model that errors (retired, bad tool call) is tried
// again after 10 minutes. GROQ_MODELS (comma list) replaces PREFERRED; GROQ_API_URL points
// tests at a fake server. /api/chat/status shows each model's limits and last error.

const API = (process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
const PREFERRED = (
  process.env.GROQ_MODELS ||
  [
    'openai/gpt-oss-120b',
    'llama-3.3-70b-versatile',
    'moonshotai/kimi-k2-instruct-0905',
    'moonshotai/kimi-k2-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'qwen/qwen3-32b',
    'openai/gpt-oss-20b',
    'llama-3.1-8b-instant',
  ].join(',')
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const configured = () => Boolean(process.env.GROQ_API_KEY);
const headers = () => ({ Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' });

const coolDown = new Map(); // model -> until (ms)
const info = new Map(); // model -> { limits, lastError, at }
const note = (model, patch) => info.set(model, { ...(info.get(model) || {}), ...patch, at: new Date().toISOString() });

// Groq's live model list, refreshed hourly; on failure every PREFERRED model is tried.
let live = { at: 0, ids: null };
async function models() {
  if (live.ids && Date.now() - live.at < 60 * 60 * 1000) return PREFERRED.filter((m) => live.ids.includes(m));
  try {
    const res = await fetch(`${API}/models`, { headers: headers(), signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const ids = (data?.data || []).filter((m) => m?.active !== false).map((m) => m.id);
      if (ids.length) live = { at: Date.now(), ids };
    }
  } catch (e) {
    // keep the last list
  }
  return live.ids ? PREFERRED.filter((m) => live.ids.includes(m)) : PREFERRED;
}

const retryMs = (res) => {
  const s = Number(res.headers.get('retry-after'));
  return Number.isFinite(s) && s > 0 ? Math.min(s, 3600) * 1000 : 60 * 1000;
};

const limitsOf = (res) => {
  const h = (n) => res.headers.get(n);
  return {
    requestsLeftToday: h('x-ratelimit-remaining-requests'),
    requestsPerDay: h('x-ratelimit-limit-requests'),
    tokensLeftThisMinute: h('x-ratelimit-remaining-tokens'),
    tokensPerMinute: h('x-ratelimit-limit-tokens'),
  };
};

class GroqUnavailable extends Error {}

// Model-specific settings: the gpt-oss models think before answering, and that thinking counts
// against the tokens-per-minute allowance, so they are asked to think briefly.
const extra = (model) => (model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {});

// One answer. body: { messages, tools?, temperature?, max_tokens? }.
// Returns { message, model } (message = the OpenAI-style assistant message).
async function chat(body) {
  if (!configured()) throw new GroqUnavailable('not configured');
  const list = await models();
  let lastError = 'no model available';
  // the models are tried one after the other, on purpose (the first that answers wins)
  /* eslint-disable no-await-in-loop, no-continue, no-restricted-syntax */
  for (const model of list) {
    if ((coolDown.get(model) || 0) > Date.now()) continue;
    let res;
    try {
      res = await fetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ model, ...body, ...extra(model) }),
        signal: AbortSignal.timeout(25000),
      });
    } catch (e) {
      lastError = `${model}: ${e.name === 'TimeoutError' ? 'timeout' : 'network error'}`;
      note(model, { lastError });
      continue;
    }
    note(model, { limits: limitsOf(res) });
    if (res.status === 429) {
      coolDown.set(model, Date.now() + retryMs(res));
      lastError = `${model}: rate limited`;
      note(model, { lastError: 'rate limited (resting)' });
      continue;
    }
    if (!res.ok) {
      const text = (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 240);
      lastError = `${model}: ${res.status} ${text}`;
      note(model, { lastError: `${res.status} ${text}` });
      if (res.status === 401) break; // wrong key: no model will work
      // retired model, unsupported option, a tool call the model wrote badly…: rest 10 minutes
      // (a bad tool call is usually a one-off, so 400 rests only 1 minute)
      coolDown.set(model, Date.now() + (res.status === 400 ? 60 : 600) * 1000);
      continue;
    }
    const data = await res.json();
    const message = data?.choices?.[0]?.message;
    if (!message) {
      lastError = `${model}: empty answer`;
      continue;
    }
    note(model, { lastError: null, usedTokens: data?.usage?.total_tokens ?? null });
    return { message, model };
  }
  /* eslint-enable no-await-in-loop, no-continue, no-restricted-syntax */
  throw new GroqUnavailable(lastError);
}

const status = async () => {
  const list = configured() ? await models() : PREFERRED;
  return {
    configured: configured(),
    groqModels: live.ids ? live.ids.length : null,
    models: list.map((m) => ({ model: m, resting: (coolDown.get(m) || 0) > Date.now(), ...(info.get(m) || {}) })),
  };
};

module.exports = { chat, status, configured, GroqUnavailable, PREFERRED };
