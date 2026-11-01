'use client';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// The globe uses amCharts (~300 KB of JavaScript). Load it only when the globe is
// about to scroll into view, instead of with every page that shows "Our markets".
const GlobeChart = dynamic(() => import('./GlobeChart'), { ssr: false });

export default function LazyGlobeChart(props) {
  const placeholderRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return undefined;
    const el = placeholderRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }, // start loading a little before it's on screen
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  if (visible) return <GlobeChart {...props} />;
  // Same id as the chart's own container, so it takes the same space (see Exports.css #chartdiv).
  return <div id="chartdiv" ref={placeholderRef} />;
}
