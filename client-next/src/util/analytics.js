// Enquiry tracking in Google Analytics (GA4, loaded in RootHtml.js).
// Only the type of action, the page and the language are sent: never names, emails or numbers.
// In GA4 (Admin > Events) these events are marked as "key events".

function currentLang() {
  return document.documentElement.lang || 'en';
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    page_path: window.location.pathname,
    page_language: currentLang(),
    ...params,
  });
}

// Which links count as an enquiry action, by their address.
function linkEvent(href) {
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(href))
    return 'whatsapp_click';
  if (/^tel:/i.test(href)) return 'phone_click';
  if (/^mailto:/i.test(href)) return 'email_click';
  if (/^https?:\/\/(maps\.app\.goo\.gl|(www\.)?google\.[a-z.]+\/maps|goo\.gl\/maps)/i.test(href))
    return 'directions_click';
  return null;
}

// One listener for the whole site, so every WhatsApp / call / email / directions link
// is counted wherever it is (contact page, footer, ...), including links added later.
export function startEnquiryTracking() {
  const onClick = (e) => {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    const name = linkEvent(link.getAttribute('href') || '');
    if (!name) return;
    const area = link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : 'page';
    trackEvent(name, { link_area: area });
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
