import { useEffect } from 'react';

// Section background photos (CSS backgrounds load as soon as the page loads, even far below
// the screen). Elements with class "lazy-bg" show no background photo until they come within
// 600 px of the screen; then they get "bg-ready" (rule at the end of src/index.css).
export function useLazyBackgrounds() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.lazy-bg:not(.bg-ready)')];
    if (!els.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('bg-ready'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('bg-ready');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '600px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
