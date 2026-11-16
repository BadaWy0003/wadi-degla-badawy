'use client';
// The language picker (header, redesigned 2026-11-17). Each language is written in its own
// script ("English", "العربية"…) and is a real link to the same page in that language.
// variant="desktop": a "🌐 EN ▾" button with a small list under it.
// variant="sheet": the list inside the phone menu (shown by the menu itself).
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaCheck } from 'react-icons/fa';
import './LanguageSelector.css';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'ro', name: 'Română' },
  { code: 'sq', name: 'Shqip' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

export function useLanguageLinks() {
  const { i18n } = useTranslation();
  const pathname = usePathname() || '/';
  const current = (i18n.language || 'en').split('-')[0];
  const hrefFor = (code) => {
    const parts = pathname.split('/');
    if (parts.length > 1) parts[1] = code;
    return parts.join('/') || `/${code}/`;
  };
  const remember = (code) => {
    try {
      localStorage.setItem('language', code);
    } catch {
      /* private mode */
    }
  };
  return { current, hrefFor, remember };
}

export function LanguageList({ onPick }) {
  const { current, hrefFor, remember } = useLanguageLinks();
  return (
    <ul className="lang-list">
      {LANGUAGES.map((l) => (
        <li key={l.code}>
          <Link
            href={hrefFor(l.code)}
            prefetch={false}
            lang={l.code}
            hrefLang={l.code}
            className={l.code === current ? 'is-on' : undefined}
            aria-current={l.code === current ? 'true' : undefined}
            onClick={() => {
              remember(l.code);
              onPick?.();
            }}
          >
            <span>{l.name}</span>
            {l.code === current && <FaCheck aria-hidden="true" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { current } = useLanguageLinks();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className="lang-picker" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-expanded={open}
        aria-label={t('navigation.language')}
        onClick={() => setOpen((o) => !o)}
      >
        <FaGlobe aria-hidden="true" />
        <span>{current.toUpperCase()}</span>
        <i className="lang-chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="lang-pop">
          <LanguageList onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
