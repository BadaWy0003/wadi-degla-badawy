'use client';
// Chat assistant button (2026-11-27, owner): bottom-right on every page, in place of the old
// contact bubble. Tiny on purpose: the chat window (ChatPanel.js) and its styles are only
// downloaded the first time the button is pointed at or tapped, so pages load as fast as
// before. Nothing of it is in the built HTML (Google sees no change). A small greeting appears
// once per visit after 15 s on computers. The window stays open while the visitor moves between
// pages (this component lives in AppShell), and the conversation is kept for the visit.
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { trackEvent } from '../../util/analytics';
import './ChatLauncher.css';

const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });
const GREETED = 'wd-chat-greeted';
export const OPEN_CHAT_EVENT = 'wd:open-chat';

export default function ChatLauncher() {
  const { t } = useTranslation();
  const lang = useLang();
  const pathname = usePathname() || '';
  const [ready, setReady] = useState(false); // panel code requested
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(false);

  const load = useCallback(() => setReady(true), []);
  const show = useCallback(() => {
    setReady(true);
    setOpen(true);
    setGreet(false);
    try {
      sessionStorage.setItem(GREETED, '1');
    } catch {
      // private mode
    }
    trackEvent('chat_open');
  }, []);

  // other parts of the site can open the chat (window.dispatchEvent(new Event('wd:open-chat')))
  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, show);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, show);
  }, [show]);

  // one greeting per visit, computers only, never while the chat is open
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(GREETED) === '1';
    } catch {
      seen = true;
    }
    if (seen || !window.matchMedia('(min-width: 900px)').matches) return undefined;
    const timer = setTimeout(() => {
      setGreet(true);
      try {
        sessionStorage.setItem(GREETED, '1');
      } catch {
        // private mode
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // the stone the visitor is looking at (/<lang>/products/<slug>/), for "Quote for <stone>"
  const m = pathname.match(/^\/[a-z]{2}\/products\/([a-z0-9-]+)\/?$/);
  const stone = m ? m[1].replace(/-/g, ' ') : '';

  return (
    <>
      {!open && (
        <div className="wc-launch-wrap">
          {greet && (
            <button type="button" className="wc-greet" onClick={show}>
              {t('chat.greeting')}
              <span
                className="wc-greet-x"
                role="button"
                tabIndex={0}
                aria-label={t('chat.close')}
                onClick={(e) => {
                  e.stopPropagation();
                  setGreet(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    setGreet(false);
                  }
                }}
              >
                ×
              </span>
            </button>
          )}
          <button
            type="button"
            className="wc-launch"
            onClick={show}
            onPointerEnter={load}
            onFocus={load}
            aria-label={t('chat.open')}
            title={t('chat.tip')}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3C6.48 3 2 6.94 2 11.8c0 2.37 1.07 4.52 2.82 6.1-.13 1.27-.6 2.67-1.6 3.9 1.95-.18 3.62-.86 4.86-1.67 1.22.38 2.53.58 3.92.58 5.52 0 10-3.94 10-8.8S17.52 3 12 3Zm-4.5 10.2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm4.5 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm4.5 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z"
              />
            </svg>
          </button>
        </div>
      )}
      {ready && (
        <ChatPanel
          open={open}
          onClose={() => setOpen(false)}
          lang={lang}
          stone={stone}
          page={pathname}
        />
      )}
    </>
  );
}
