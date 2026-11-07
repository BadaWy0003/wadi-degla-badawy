import { useEffect, useState } from 'react';

// true once the element comes within `margin` of the screen (and stays true). Used to start
// sliders and their code only when the visitor scrolls near them. An element hidden with
// display:none never comes near, so e.g. a phone-only slider never loads on desktop.
export function useNearScreen(ref, margin = '600px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !ref.current) return undefined;
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
}

// Loads a component's code once `ready` is true and returns it (null until it has arrived),
// so the caller can keep showing its own placeholder meanwhile. `load` must be a stable
// function like () => import('./Slider').
export function useLazyComponent(ready, load) {
  const [Comp, setComp] = useState(null);
  useEffect(() => {
    if (!ready || Comp) return undefined;
    let alive = true;
    load()
      .then((m) => {
        if (alive) setComp(() => m.default);
      })
      .catch((error) => console.error('Could not load a slider:', error));
    return () => {
      alive = false;
    };
  }, [ready, load, Comp]);
  return Comp;
}
