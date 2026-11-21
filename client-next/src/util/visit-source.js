'use client';
// Where a visitor came from (2026-11-21), sent with every enquiry so the admin panel shows how
// each lead found the site: Google search, LinkedIn, an AI assistant, a campaign link...
// Read once when a visit starts: utm_* / gclid / fbclid in the address, else the referring
// website (never our own pages). The latest non-direct source is kept for 90 days
// (localStorage), so a buyer who found us on Google and comes back later by typing the address
// still counts as Google. Visitors in Europe who haven't accepted cookies: kept for this visit
// only (sessionStorage). Nothing is sent anywhere until the visitor sends a form.
import { readConsent, inEurope } from './consent';

const KEY = 'wd-source';
const KEEP_MS = 90 * 24 * 3600 * 1000;

// [pattern on the referring host, channel, name]: first match wins (Gemini before Google).
const RULES = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com)$/, 'ai', 'ChatGPT'],
  [/(^|\.)gemini\.google\.com$/, 'ai', 'Gemini'],
  [/(^|\.)perplexity\.ai$/, 'ai', 'Perplexity'],
  [/(^|\.)copilot\.microsoft\.com$/, 'ai', 'Copilot'],
  [/(^|\.)claude\.ai$/, 'ai', 'Claude'],
  [/(^|\.)(mail\.google\.com|outlook\.(live|office)\.com|mail\.yahoo\.com)$/, 'email', 'Email'],
  [/(^|\.)google\.[a-z.]+$/, 'search', 'Google'],
  [/(^|\.)bing\.com$/, 'search', 'Bing'],
  [/(^|\.)yahoo\.[a-z.]+$/, 'search', 'Yahoo'],
  [/(^|\.)duckduckgo\.com$/, 'search', 'DuckDuckGo'],
  [/(^|\.)yandex\.[a-z.]+$/, 'search', 'Yandex'],
  [/(^|\.)baidu\.com$/, 'search', 'Baidu'],
  [/(^|\.)ecosia\.org$/, 'search', 'Ecosia'],
  [/(^|\.)naver\.com$/, 'search', 'Naver'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'social', 'LinkedIn'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'social', 'Facebook'],
  [/(^|\.)instagram\.com$/, 'social', 'Instagram'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'social', 'X (Twitter)'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'social', 'YouTube'],
  [/(^|\.)tiktok\.com$/, 'social', 'TikTok'],
  [/(^|\.)pinterest\.[a-z.]+$/, 'social', 'Pinterest'],
  [/(^|\.)(wa\.me|whatsapp\.com)$/, 'social', 'WhatsApp'],
  [/(^|\.)t\.me$/, 'social', 'Telegram'],
];

const store = () => {
  try {
    return readConsent() === 'granted' || !inEurope() ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

function read() {
  for (const s of [window.localStorage, window.sessionStorage]) {
    try {
      const v = JSON.parse(s.getItem(KEY) || 'null');
      if (v && v.channel && Date.now() - (v.at || 0) < KEEP_MS) return v;
    } catch {
      // storage blocked
    }
  }
  return null;
}

function fromThisVisit() {
  const params = new URLSearchParams(window.location.search);
  const utm = (k) => (params.get(`utm_${k}`) || '').slice(0, 80);
  if (utm('source') || utm('campaign')) {
    return {
      channel: 'campaign',
      detail: [utm('source'), utm('medium')].filter(Boolean).join(' / '),
      campaign: utm('campaign'),
    };
  }
  if (params.get('gclid')) return { channel: 'ads', detail: 'Google Ads' };
  if (params.get('fbclid')) return { channel: 'social', detail: 'Facebook / Instagram' };
  let host = '';
  try {
    host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
  } catch {
    host = '';
  }
  if (!host || host === window.location.hostname || host.endsWith('wadidegla-eg.com')) return null;
  const rule = RULES.find(([re]) => re.test(host));
  return rule
    ? { channel: rule[1], detail: rule[2] }
    : { channel: 'website', detail: host.replace(/^www\./, '') };
}

// Called once per page load (AppShell). Only the first page of a visit has an outside
// referrer, so moving between our pages never changes the source.
export function captureSource() {
  try {
    const found = fromThisVisit();
    const s = store();
    if (!s) return;
    if (found) {
      s.setItem(
        KEY,
        JSON.stringify({ ...found, landing: window.location.pathname, at: Date.now() }),
      );
    } else if (!read()) {
      s.setItem(
        KEY,
        JSON.stringify({ channel: 'direct', landing: window.location.pathname, at: Date.now() }),
      );
    }
  } catch {
    // never break the page for this
  }
}

// For the forms: the source as a JSON string ('' when unknown).
export function sourceForForm() {
  const v = read();
  return v ? JSON.stringify(v) : '';
}
