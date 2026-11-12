'use client';
import { useEffect } from 'react';

// Cards and photos below the screen fade up when scrolled to. The class that hides them is
// added only after the page loads, so the HTML (Google, no script) has everything visible;
// nothing moves for visitors who turned off animations on their device.
// deps: re-run when the shown list changes (filters, search). prefix: the page's class prefix
// (classes <prefix>-reveal, <prefix>-hidden, <prefix>-seen).
export default function useReveal(ref, deps = [], prefix = 'nw') {
  useEffect(() => {
    const page = ref.current;
    if (!page || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const items = [...page.querySelectorAll(`.${prefix}-reveal:not(.${prefix}-seen)`)];
    const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    items.filter((el) => !below.includes(el)).forEach((el) => el.classList.add(`${prefix}-seen`));
    below.forEach((el) => el.classList.add(`${prefix}-hidden`));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove(`${prefix}-hidden`);
            e.target.classList.add(`${prefix}-seen`);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -60px 0px' },
    );
    below.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
