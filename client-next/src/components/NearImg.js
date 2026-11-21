'use client';
import { useRef } from 'react';
import { useNearScreen } from '../util/near-screen';

// A transparent 1×1 picture: keeps the <img> box (its CSS size) until the real photo loads.
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// An <img> that only starts downloading when it is ~400px from the screen. `loading="lazy"`
// alone starts far too early on phones (Chrome begins 1,250–2,500px away), so photos lower on
// the page competed with the main photo for the connection (stone page, 2026-11-21).
// Google still sees them: its renderer uses a very tall screen, so they come "near" at once.
export default function NearImg({ src, srcSet, sizes, margin = '400px', ...props }) {
  const ref = useRef(null);
  const near = useNearScreen(ref, margin);
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      ref={ref}
      {...props}
      src={near ? src : BLANK}
      {...(near && srcSet ? { srcSet, sizes } : {})}
    />
  );
}
