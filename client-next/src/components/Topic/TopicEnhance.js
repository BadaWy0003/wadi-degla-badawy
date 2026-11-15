'use client';
import { useEffect } from 'react';

// The moving parts of the topic pages (TopicPage.js is a server component):
// - "On this page" highlights the block on screen (on phones the chip row scrolls to it);
// - the steps timeline fills with gold as it is scrolled, and the numbers passed turn gold;
// - blocks below the screen fade up when scrolled to. The hiding class is added only after
//   the page loads, so the HTML (Google) has everything visible; nothing moves for visitors
//   who turned off animations.
export default function TopicEnhance() {
  useEffect(() => {
    const root = document.querySelector('.tp');
    if (!root) return undefined;
    const bar = root.querySelector('.tp-toc-links');
    const links = [...root.querySelectorAll('.tp-toc-links a')];
    const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
    const steps = root.querySelector('.tp-steps');
    const stepItems = steps ? [...steps.querySelectorAll('.tp-step')] : [];
    let current = -1;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let on = 0;
      targets.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - line <= 0) on = i;
      });
      // the last block may be too short to reach the line: pick it at the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        on = targets.length - 1;
      }
      if (on !== current) {
        current = on;
        links.forEach((a, i) => a.classList.toggle('is-on', i === on));
        const a = links[on];
        if (bar && a && bar.scrollWidth > bar.clientWidth) {
          const b = bar.getBoundingClientRect();
          const r = a.getBoundingClientRect();
          bar.scrollBy({ left: r.left - b.left - (b.width - r.width) / 2, behavior: 'smooth' });
        }
      }
      if (steps) {
        const r = steps.getBoundingClientRect();
        const mark = window.innerHeight * 0.6;
        const fill = Math.min(1, Math.max(0, (mark - r.top) / r.height));
        steps.style.setProperty('--tp-fill', fill.toFixed(3));
        stepItems.forEach((li) =>
          li.classList.toggle('is-done', li.getBoundingClientRect().top + 24 < mark),
        );
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    let io;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && 'IntersectionObserver' in window) {
      const below = [...root.querySelectorAll('.tp-reveal')].filter(
        (el) => el.getBoundingClientRect().top > window.innerHeight,
      );
      below.forEach((el) => el.classList.add('tp-hidden'));
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove('tp-hidden');
              io.unobserve(e.target);
            }
          }),
        { rootMargin: '0px 0px -60px 0px' },
      );
      below.forEach((el) => io.observe(el));
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      if (io) io.disconnect();
    };
  }, []);
  return null;
}
