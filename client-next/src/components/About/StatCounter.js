'use client';
// A number like "3,000 +" that is in the page's HTML as its real value (Google and visitors
// without JavaScript read "3,000 +", never "0 +" like react-countup rendered at build time).
// In the browser it still counts from `from` (default 0) when it scrolls into view, like
// before: right after the page starts, a counter that is off screen is set to `from` (nobody
// sees that), then animates to its value (after `delay` seconds) the first time it comes into
// view. A counter already on screen keeps its value. Also used for the History year
// (2025 → 1980: from={2025}, suffix="", separator={false}).
import React, { useEffect, useRef, useState } from 'react';

// Same easing as react-countup's default (fast start, slow end).
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

export default function StatCounter({
  end,
  from = 0,
  duration = 3,
  delay = 0,
  suffix = ' +',
  separator = true,
  className = 'counter-text',
  style,
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(end);
  const n = Math.round(value);
  const text = `${separator ? n.toLocaleString('en-US') : n}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const r = el.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    if (onScreen) return undefined;

    setValue(from);
    let frame;
    let timer;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      timer = setTimeout(() => {
        const start = performance.now();
        const step = (now) => {
          const t = (now - start) / (duration * 1000);
          setValue(from + (end - from) * easeOutExpo(t));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      }, delay * 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [end, from, duration, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}
