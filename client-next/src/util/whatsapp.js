// WhatsApp buttons with a ready-made message (client audit, 2026-11-28).
// The company's WhatsApp link (COMPANY.whatsappUrl) is a business "message" link that can't
// carry a text, so it stays in the HTML (it works without JavaScript), and when a visitor taps a
// WhatsApp button this listener swaps in a wa.me link with the WhatsApp number and a message:
// - a button inside an element with data-wa="<what>" (the stone + finish on stone pages, a
//   Stone Creations piece, a kerb profile, a named paver) → whatsapp.msgQuote ("…a price for <what>")
// - any other WhatsApp button → whatsapp.msgPage with the page's H1
// followed by the page's address, so sales see which page the buyer was on.
// The number is COMPANY.whatsappNumber (admin panel: Website → Company facts & contact).
import { COMPANY } from './company';

const BUSINESS_LINK = /^https?:\/\/wa\.me\/message\//i;

export function whatsappMessageLink(text) {
  const digits = String(COMPANY.whatsappNumber || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function startWhatsAppMessages(t) {
  const onClick = (e) => {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!link.dataset.waLink && !BUSINESS_LINK.test(href) && href !== COMPANY.whatsappUrl) return;
    const what = link.closest('[data-wa]')?.getAttribute('data-wa');
    const h1 = document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim();
    const message = what
      ? t('whatsapp.msgQuote', { what })
      : t('whatsapp.msgPage', { page: h1 || document.title });
    const url = location.origin + location.pathname;
    const next = whatsappMessageLink(`${message}\n${url}`);
    if (!next) return;
    link.dataset.waLink = '1'; // still ours after the href changes
    link.setAttribute('href', next);
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
