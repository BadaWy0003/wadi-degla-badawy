'use client';
// The visitor's quote list (stones to ask a price for), kept in this browser only
// (localStorage, no account needed). Changes are announced with the "wd:quote-changed" event,
// so the header icon, the stone page button and the quote page stay in step.
// Every read and write is wrapped: private windows and blocked storage just give an empty list.
import { useEffect, useState } from 'react';

const KEY = 'wd-quote-list';
export const QUOTE_MAX = 20;
const EVENT = 'wd:quote-changed';

const clean = (s, max) => (typeof s === 'string' ? s.trim().slice(0, max) : '');
const valid = (i) => i && typeof i === 'object' && clean(i.slug, 120) && clean(i.name, 100);

export function readQuote() {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter(valid).slice(0, QUOTE_MAX) : [];
  } catch {
    return [];
  }
}

export function writeQuote(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, QUOTE_MAX)));
  } catch {
    // storage blocked: the list only lives until the page is closed
  }
  window.dispatchEvent(new Event(EVENT));
}

// Adds a stone (one line per stone + finish). Returns false when the list is full.
export function addToQuote(item) {
  const list = readQuote();
  if (list.some((i) => i.slug === item.slug && i.finish === item.finish)) return true;
  if (list.length >= QUOTE_MAX) return false;
  writeQuote([
    ...list,
    {
      slug: clean(item.slug, 120),
      name: clean(item.name, 100),
      finish: clean(item.finish, 80),
      finishes: (item.finishes || []).map((f) => clean(f, 80)).filter(Boolean).slice(0, 20),
      photo: clean(item.photo, 500),
      quantity: '',
    },
  ]);
  return true;
}

// The list, read after the page has loaded (the HTML built for Google has an empty list).
export function useQuoteList() {
  const [list, setList] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => setList(readQuote());
    load();
    setReady(true);
    const onStorage = (e) => e.key === KEY && load();
    window.addEventListener(EVENT, load);
    window.addEventListener('storage', onStorage); // other tabs
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return [list, ready];
}
