'use client';
// A number like "3,000 +" that is in the page's HTML as its real value (Google and visitors
// without JavaScript read "3,000 +", never "0 +" like react-countup rendered at build time).
// In the browser it still counts up from 0 when it scrolls into view, like before: right after
// the page starts, a counter that is off screen is set to 0 (nobody sees that), then animates
// to its value the first time it comes into view. A counter already on screen keeps its value.
import React, { useEffect, useRef, useState } from 'react';

const format = (n) => `${Math.round(n).toLocaleString('en-US')} +`;
// Same easing as react-countup's default (fast start, slow end).
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

export default function StatCounter({ end, duration = 3, className = 'counter-text' }) {
  const ref = useRef(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const r = el.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    if (onScreen) return undefined;

    setValue(0);
    let frame;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const step = (now) => {
        const t = (now - start) / (duration * 1000);
        setValue(end * easeOutExpo(t));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
