// Groq (free tier, no card on the account, so it can never charge: over a limit it answers 429).
// OpenAI-style chat API, called with plain fetch (no extra package). Used by chat.service.js.
// Key: Fly secret GROQ_API_KEY (never sent to the browser, never logged).
// Each Groq model has its own free daily allowance, so when one model is rate-limited (429) or
// not offered any more (404 / model error), the next one in MODELS is tried. GROQ_MODELS (comma
// list) overrides the list; GROQ_API_URL points tests at a fake server.

const API = (process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
const MODELS = (
  process.env.GROQ_MODELS ||
  'llama-3.3-70b-versatile,meta-llama/llama-4-scout-17b-16e-instruct,openai/gpt-oss-120b,llama-3.1-8b-instant'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const configured = () => Boolean(process.env.GROQ_API_KEY);

// Models that answered 429 are skipped until the time Groq gave (or 60 s).
const coolDown = new Map(); // model -> until (ms)
// Latest limits Groq reported per model (headers), for /api/chat/status.
const limits = new Map();

const retryMs = (res) => {
  const s = Number(res.headers.get('retry-after'));
  return Number.isFinite(s) && s > 0 ? Math.min(s, 3600) * 1000 : 60 * 1000;
};

const remember = (model, res) => {
  const h = (n) => res.headers.get(n);
  limits.set(model, {
    requestsLeftToday: h('x-ratelimit-remaining-requests'),
    requestsPerDay: h('x-ratelimit-limit-requests'),
    tokensLeftThisMinute: h('x-ratelimit-remaining-tokens'),
    tokensPerMinute: h('x-ratelimit-limit-tokens'),
    at: new Date().toISOString(),
  });
};

class GroqUnavailable extends Error {}

// One answer. body: { messages, tools?, temperature?, max_tokens? }.
// Returns { message, model } (message = the OpenAI-style assistant message).
async function chat(body) {
  if (!configured()) throw new GroqUnavailable('not configured');
  const now = Date.now();
  let lastError = 'no model available';
  for (const model of MODELS) {
    if ((coolDown.get(model) || 0) > now) continue;
    let res;
    try {
      res = await fetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, ...body }),
        signal: AbortSignal.timeout(25000),
      });
    } catch (e) {
      lastError = `${model}: ${e.name === 'TimeoutError' ? 'timeout' : 'network error'}`;
      continue;
    }
    remember(model, res);
    if (res.status === 429) {
      coolDown.set(model, Date.now() + retryMs(res));
      lastError = `${model}: rate limited`;
      continue;
    }
    if (!res.ok) {
      // 404 / 400 "model decommissioned" etc.: try the next model; 401 = wrong key, stop.
      const text = (await res.text().catch(() => '')).slice(0, 200);
      lastError = `${model}: ${res.status} ${text.replace(/\s+/g, ' ')}`;
      if (res.status === 401) break;
      // a tool call the model wrote badly (Groq answers 400 "tool_use_failed"): next model
      continue;
    }
    const data = await res.json();
    const message = data?.choices?.[0]?.message;
    if (!message) {
      lastError = `${model}: empty answer`;
      continue;
    }
    return { message, model };
  }
  throw new GroqUnavailable(lastError);
}

const status = () => ({
  configured: configured(),
  models: MODELS.map((m) => ({ model: m, coolingDown: (coolDown.get(m) || 0) > Date.now(), limits: limits.get(m) || null })),
});

module.exports = { chat, status, configured, GroqUnavailable, MODELS };
