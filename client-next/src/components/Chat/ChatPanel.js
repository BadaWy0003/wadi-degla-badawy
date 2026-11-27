'use client';
// Chat assistant window (2026-11-27, owner), opened by ChatLauncher.js and downloaded only then.
// Talks to the server's POST /api/chat (server/src/services/chat.service.js: free Groq AI, the
// website's own data, never prices). Answers can carry stone cards and, once the assistant has
// enough details, a summary of the quote / sample request with Confirm (POST /api/chat/lead →
// the admin panel's Enquiries, marked "via chat") or Change. The WhatsApp link is always under
// the input. The conversation is kept for the visit (sessionStorage), so the visitor can open
// stone pages and come back. Desktop: a 390 × 620 window bottom-right; phones: full screen.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { sourceForForm } from '../../util/visit-source';
import { trackEvent } from '../../util/analytics';
import './ChatPanel.css';

const API = `${process.env.NEXT_PUBLIC_BASE_API_URL || 'https://server-withered-wildflower-1595.fly.dev'}/api/chat`;
const STORE = 'wd-chat';
// what the assistant "said" when it showed a summary (it sends no text then)
const LEAD_NOTE = '(I showed the visitor a summary of the request with a Confirm button.)';
let nextId = 1;
const msg = (role, text, extra = {}) => ({ id: `${Date.now()}-${nextId++}`, role, text, ...extra });

const load = () => {
  try {
    const v = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    return Array.isArray(v?.messages) ? v.messages : [];
  } catch {
    return [];
  }
};
const save = (messages) => {
  try {
    sessionStorage.setItem(STORE, JSON.stringify({ messages: messages.slice(-60) }));
  } catch {
    // private mode: the chat lasts for this page only
  }
};

// The messages the model sees (not the window's own messages), last 30.
const history = (messages) =>
  messages
    .filter((m) => !m.local)
    .map((m) => ({ role: m.role, content: (m.text || (m.lead ? LEAD_NOTE : '')).slice(0, 1500) }))
    .filter((m) => m.content)
    .slice(-30);

// Text with "- " lines as a list and our own / WhatsApp addresses as links.
const LINK = /(https:\/\/(?:www\.)?wadidegla-eg\.com\/[^\s)]*|https:\/\/wa\.me\/[^\s)]*)/g;
function Linked({ text }) {
  return text.split(LINK).map((part, i) => {
    if (!LINK.test(part)) return part;
    LINK.lastIndex = 0;
    const own = part.match(/^https:\/\/(?:www\.)?wadidegla-eg\.com(\/.*)$/);
    const label = own ? own[1].replace(/^\/[a-z]{2}\//, '/').replace(/\/$/, '') || '/' : 'WhatsApp';
    return own ? (
      <Link key={i} href={own[1]} prefetch={false}>
        {label}
      </Link>
    ) : (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  });
}
function Rich({ text }) {
  const blocks = [];
  let list = null;
  text.split('\n').forEach((line, i) => {
    const item = line.match(/^\s*[-•*]\s+(.*)$/);
    if (item) {
      if (!list) {
        list = [];
        blocks.push(<ul key={`l${i}`}>{list}</ul>);
      }
      list.push(
        <li key={i}>
          <Linked text={item[1]} />
        </li>,
      );
    } else {
      list = null;
      if (line.trim()) {
        blocks.push(
          <p key={i}>
            <Linked text={line} />
          </p>,
        );
      }
    }
  });
  return blocks;
}

function StoneCards({ stones, t }) {
  return (
    <div className="wc-stones">
      {stones.map((s) => (
        <LangLink key={s.slug} href={`/products/${s.slug}`} className="wc-stone">
          {s.photo ? (
            <img src={s.photo} alt="" width="56" height="56" loading="lazy" />
          ) : (
            <span className="wc-stone-ph" />
          )}
          <span className="wc-stone-text">
            <b>{s.name}</b>
            <small>{PRODUCT_TYPE_KEYS[s.type] ? t(PRODUCT_TYPE_KEYS[s.type]) : s.type}</small>
          </span>
          <span className="wc-stone-go">{t('chat.viewStone')} →</span>
        </LangLink>
      ))}
    </div>
  );
}

function LeadCard({ m, t, onConfirm, onEdit }) {
  const l = m.lead;
  const rows = [
    ['fName', l.name],
    ['fCompany', l.company],
    ['fEmail', l.email],
    ['fWhatsapp', l.whatsapp],
    ['fDestination', l.destination],
    ['fAddress', l.address],
    ['fProject', l.projectType],
  ].filter(([, v]) => v);
  const state = m.leadState || 'open';
  return (
    <div className="wc-lead">
      <p className="wc-lead-title">
        {t(l.type === 'sample' ? 'chat.summarySample' : 'chat.summaryQuote')}
      </p>
      {state === 'open' && <p className="wc-lead-hint">{t('chat.checkPrompt')}</p>}
      {l.items.length > 0 && (
        <ul className="wc-lead-items">
          {l.items.map((i, n) => (
            <li key={n} dir="auto">
              <b>{i.stone}</b>
              {[i.finish, i.form, i.size, i.thickness, i.quantity]
                .filter(Boolean)
                .map((v) => ` · ${v}`)}
            </li>
          ))}
        </ul>
      )}
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{t(`chat.${k}`)}</dt>
            <dd dir="auto">{v}</dd>
          </div>
        ))}
      </dl>
      {(state === 'open' || state === 'failed' || state === 'sending') && (
        <div className="wc-lead-actions">
          <button
            type="button"
            className="wc-btn wc-btn-gold"
            onClick={onConfirm}
            disabled={state === 'sending'}
          >
            {state === 'sending' ? t('chat.sending') : t('chat.confirm')}
          </button>
          <button
            type="button"
            className="wc-btn wc-btn-line"
            onClick={onEdit}
            disabled={state === 'sending'}
          >
            {t('chat.edit')}
          </button>
        </div>
      )}
      {state === 'sent' && <p className="wc-lead-sent">✓ {t('chat.sent')}</p>}
    </div>
  );
}

export default function ChatPanel({ open, onClose, lang, stone, page }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // the visit's conversation
  useEffect(() => setMessages(load()), []);
  useEffect(() => save(messages), [messages]);

  // newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  // open: focus the input, Esc closes; phones: the page behind doesn't scroll
  useEffect(() => {
    if (!open) return undefined;
    const phone = window.matchMedia('(max-width: 768px)').matches;
    if (phone) document.documentElement.classList.add('wc-lock');
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('wc-lock');
    };
  }, [open, onClose]);

  const ask = async (text) => {
    const question = text.trim().slice(0, 1000);
    if (!question || busy) return;
    const next = [...messages, msg('user', question)];
    setMessages(next);
    setInput('');
    setBusy(true);
    trackEvent('chat_message');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history(next), lang, page, stone, website: '' }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages((list) => [
          ...list,
          msg('assistant', t(res.status === 429 ? 'chat.busy' : 'chat.unavailable'), {
            local: true,
            whatsapp: true,
          }),
        ]);
        return;
      }
      const d = body.data || {};
      setMessages((list) => [
        ...list,
        msg('assistant', d.reply || '', { stones: d.stones || [], lead: d.lead || null }),
      ]);
    } catch {
      setMessages((list) => [
        ...list,
        msg('assistant', t('chat.unavailable'), { local: true, whatsapp: true }),
      ]);
    } finally {
      setBusy(false);
    }
  };

  const setLeadState = (id, leadState) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, leadState } : m)));

  const confirm = async (m) => {
    setLeadState(m.id, 'sending');
    try {
      const res = await fetch(`${API}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: m.lead,
          transcript: history(messages).slice(-40),
          lang,
          page,
          source: sourceForForm(),
          website: '',
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setLeadState(m.id, 'sent');
      trackEvent('chat_lead_sent', { lead_type: m.lead.type });
    } catch {
      setLeadState(m.id, 'failed');
      setMessages((list) => [
        ...list,
        msg('assistant', t('chat.sendFailed'), { local: true, whatsapp: true }),
      ]);
    }
  };

  const edit = (m) => {
    setLeadState(m.id, 'edited');
    setMessages((list) => [...list, msg('assistant', t('chat.editAsk'), { local: true })]);
    inputRef.current?.focus();
  };

  const started = messages.some((m) => m.role === 'user');
  const quick = [
    stone && t('chat.qStone', { name: stone.replace(/\b\w/g, (c) => c.toUpperCase()) }),
    t('chat.qQuote'),
    t('chat.qChoose'),
    t('chat.qSamples'),
    t('chat.qShipping'),
  ].filter(Boolean);

  return (
    <section
      ref={panelRef}
      className={`wc${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label={t('chat.title')}
      hidden={!open}
    >
      <header className="wc-head">
        <span className="wc-avatar" aria-hidden="true">
          <img src="/favicon.svg" alt="" width="26" height="26" />
        </span>
        <span className="wc-head-text">
          <b>{t('chat.title')}</b>
          <small>{t('chat.subtitle')}</small>
        </span>
        {started && (
          <button
            type="button"
            className="wc-icon"
            onClick={() => setMessages([])}
            aria-label={t('chat.restart')}
            title={t('chat.restart')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="wc-icon"
          onClick={onClose}
          aria-label={t('chat.close')}
          title={t('chat.close')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z"
            />
          </svg>
        </button>
      </header>

      <div className="wc-list" ref={listRef} aria-live="polite">
        <div className="wc-msg wc-bot">
          <Rich text={t('chat.welcome')} />
        </div>
        {!started && (
          <div className="wc-quick">
            {quick.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="wc-row">
            {(m.text || m.role === 'user') && (
              <div className={`wc-msg ${m.role === 'user' ? 'wc-me' : 'wc-bot'}`} dir="auto">
                {m.role === 'user' ? m.text : <Rich text={m.text} />}
                {m.whatsapp && (
                  <a
                    className="wc-btn wc-btn-wa"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('chat.whatsapp')}
                  </a>
                )}
              </div>
            )}
            {m.stones?.length > 0 && <StoneCards stones={m.stones} t={t} />}
            {m.lead && <LeadCard m={m} t={t} onConfirm={() => confirm(m)} onEdit={() => edit(m)} />}
          </div>
        ))}
        {busy && (
          <div className="wc-msg wc-bot wc-typing" aria-label={t('chat.thinking')}>
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form
        className="wc-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          rows={1}
          maxLength={1000}
          dir="auto"
          placeholder={t('chat.placeholder')}
          aria-label={t('chat.placeholder')}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              ask(input);
            }
          }}
        />
        <button
          type="submit"
          className="wc-send"
          disabled={busy || !input.trim()}
          aria-label={t('chat.send')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z" />
          </svg>
        </button>
      </form>
      <div className="wc-foot">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="wc-wa-link">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"
            />
          </svg>
          {t('chat.whatsapp')}
        </a>
        <p className="wc-privacy">
          {t('chat.privacy')} <LangLink href="/privacy">{t('chat.privacyLink')}</LangLink>
        </p>
      </div>
    </section>
  );
}
