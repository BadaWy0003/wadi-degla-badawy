'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import './VisualizerPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { getApiClient } from '../../util/api-lazy';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PRODUCT_TYPE_KEYS, PRODUCT_CATEGORIES, normalizeProducts } from '../../util/product-types';
import { CATEGORY_TOPIC } from '../../util/topic-pages';
import { finishLabel } from '../../util/finishes';
import { visualizerStones, roomsOf, roomFor, hasRoom, firstStone } from './visualizer-data';

// Visualizer (redesigned 2026-11-13, design A "Studio"): one big room photo with every stone
// next to it (on phones: the room, a row of stones under it, then the buttons), so the stone
// and the result are on screen together. Picking a stone sweeps it across the room with a soft
// light line; switching floor <-> wall (two halves of one photo) slides across the room; a
// small blurred copy shows at once while the full photo loads. Compare pins the current stone
// and shows another one in the same room, split by a handle to drag. The address keeps the
// stone and room (?stone=galala&room=wall&vs=sunny-dark), so Share opens the same view.
// initialStones comes from the build (the stone names are in the HTML for Google); the list is
// refreshed from the API in the browser, so admin-panel changes show up without a redeploy.

const SampleRequestForm = dynamic(() => import('../Products/SampleRequestForm'), { ssr: false });

const DESCRIPTION_KEYS = {
  'Egyptian Marble': 'products.egyptianMarbleDescription',
  'Egyptian Limestone': 'products.egyptianLimestoneDescription',
  'Egyptian Granite': 'products.egyptianGraniteDescription',
  'Imported Marble': 'products.importedMarbleDescription',
  'Imported Granite': 'products.importedGraniteDescription',
};
const ROOM_KEYS = {
  floor: 'visualizer.roomFloor',
  panel: 'visualizer.roomPanel',
  wall: 'visualizer.roomWall',
  kitchen: 'visualizer.roomKitchen',
  tower: 'visualizer.roomTower',
  facade: 'visualizer.roomFacade',
};

// a thin arrow pointing left (the "next" button turns it round in CSS; both turn in Arabic)
const Chevron = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// Pictures written with data-src get their src when they come near the screen (or near the
// visible part of a scrolling list: root). Returns a cleanup function.
function loadNear(container, root) {
  if (!container) return undefined;
  const imgs = [...container.querySelectorAll('img[data-src]')].filter(
    (i) => !i.getAttribute('src'),
  );
  const load = (img) => img.setAttribute('src', img.dataset.src);
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(load);
    return undefined;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          load(e.target);
          io.unobserve(e.target);
        }
      }),
    { root, rootMargin: '300px' },
  );
  imgs.forEach((i) => io.observe(i));
  return () => io.disconnect();
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One room photo on the stage. A new stone sweeps in ('wipe'), a change to the other photo of
// the same stone fades in ('fade'); a change between the two halves of the same photo keeps
// this element, so the CSS transition slides across.
function Shot({ stone, room, anim, alt, loaded, onLoaded, onDone, priority }) {
  const photo = stone[room.photo];
  const ready = loaded[photo.src];
  // the small blurred copy is removed once the full photo has faded in over it (a blurred
  // layer costs a lot of memory on phones, more so while comparing two stones)
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setSettled(true), 700); // after the 0.45 s fade
    return () => clearTimeout(timer);
  }, [ready]);
  const markIfLoaded = (img) => {
    if (img && img.complete && img.naturalWidth && !ready) onLoaded(photo.src);
  };
  return (
    <div
      className={`vz-shot${anim ? ` is-${anim}` : ''}`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && onDone) onDone();
      }}
    >
      <div
        className="vz-amb"
        style={{ backgroundImage: `url("${photo.low || photo.src}")` }}
        aria-hidden="true"
      />
      <div className="vz-frame">
        <div className={`vz-view is-${room.part}`}>
          {photo.low && !(ready && settled) && (
            <img className="vz-low" src={photo.low} alt="" aria-hidden="true" />
          )}
          <img
            className={`vz-full${ready ? ' is-ready' : ''}`}
            src={photo.src}
            alt={alt}
            width={1920}
            height={810}
            ref={markIfLoaded}
            onLoad={() => onLoaded(photo.src)}
            fetchPriority={priority ? 'high' : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default function Visualizer({ initialStones = [] }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const stageRef = useRef(null);
  const pickerRef = useRef(null);
  const catsRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'vz');

  const [stones, setStones] = useState(initialStones);
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [currentId, setCurrentId] = useState(() => firstStone(initialStones)?.id || null);
  const [wanted, setWanted] = useState('floor'); // the room the visitor chose last
  const [vsId, setVsId] = useState(null); // compare: the stone pinned on the left
  const [split, setSplit] = useState(50); // compare handle, % from the left
  const [nudge, setNudge] = useState(false); // the handle moves a little once, as a hint
  // what the stage shows: it follows the chosen stone and room once the new photo is ready
  const [view, setView] = useState(() => ({
    id: firstStone(initialStones)?.id || null,
    room: 'floor',
  }));
  const [pending, setPending] = useState(false); // waiting for a new photo
  const [prev, setPrev] = useState(null); // the photo under the one coming in
  const [anim, setAnim] = useState(null);
  const [loaded, setLoaded] = useState({});
  const [copied, setCopied] = useState(false);
  const [sampleFor, setSampleFor] = useState(null); // the stone of the open sample form
  const [failed, setFailed] = useState(false);
  const [js, setJs] = useState(false); // after hydration: photos fade in when loaded
  const touched = useRef(false); // the address only changes after the visitor did something
  const lastId = useRef(null);
  const warmed = useRef(new Set());
  const drag = useRef(null);
  const splitRef = useRef(50); // the compare handle while it is dragged (see moveSplit)
  const splitFrame = useRef(0);

  const byId = useMemo(() => new Map(stones.map((s) => [s.id, s])), [stones]);
  const stone = byId.get(currentId) || firstStone(stones);
  const vs = vsId && vsId !== stone?.id ? byId.get(vsId) || null : null;
  const room = stone ? roomFor(stone, wanted) : null;
  const rooms = roomsOf(stone).filter((r) => !vs || hasRoom(vs, r.id));
  const shown = byId.get(view.id) || stone;
  const shownRoom = shown ? roomFor(shown, view.room) : null;
  const roomLabel = (r) => t(ROOM_KEYS[r.id]);

  const counts = useMemo(() => {
    const c = { all: stones.length };
    PRODUCT_CATEGORIES.forEach((k) => (c[k] = stones.filter((s) => s.type === k).length));
    return c;
  }, [stones]);
  const q = query.trim().toLowerCase();
  const visible = stones.filter((s) =>
    q ? s.name.toLowerCase().includes(q) : cat === 'all' || s.type === cat,
  );
  const grouped = !q && cat === 'all';
  const canPick = (s) => !vs || (s.id !== vs.id && hasRoom(s, room.id));

  // ---- data: refresh from the API, read the address ----
  useEffect(() => {
    setJs(true);
    let alive = true;
    getApiClient()
      .then((api) => api.get('/api/storage/all', { quiet: true }))
      .then(({ data }) => {
        const next = visualizerStones(normalizeProducts(data?.data || []));
        if (alive && next.length) {
          setStones((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next));
        }
      })
      .catch(() => {
        if (alive && !initialStones.length) setFailed(true);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const find = (slug) => slug && initialStones.find((s) => s.slug === slug);
    const s = find(p.get('stone'));
    const v = find(p.get('vs'));
    const r = p.get('room') && ROOM_KEYS[p.get('room')] ? p.get('room') : null;
    if (s) setCurrentId(s.id);
    if (r) setWanted(r);
    if (s && v && v.id !== s.id) setVsId(v.id);
    const target = s || firstStone(initialStones);
    if (target && (s || r)) setView({ id: target.id, room: roomFor(target, r || 'floor').id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!touched.current || !stone || !room) return;
    const p = new URLSearchParams(window.location.search);
    p.set('stone', stone.slug);
    p.set('room', room.id);
    if (vs) p.set('vs', vs.slug);
    else p.delete('vs');
    window.history.replaceState(window.history.state, '', `${window.location.pathname}?${p}`);
  }, [stone, room, vs]);

  // The stage changes once the new photo has loaded (at most 0.9 s, then its small blurred
  // copy shows until it arrives), so the sweep shows the sharp photo: a new stone sweeps in, the
  // other photo of the same stone (or the right side while comparing) fades in, and the other
  // half of the same photo slides across.
  useEffect(() => {
    if (!stone || !room || (view.id === stone.id && view.room === room.id)) return undefined;
    const fromStone = byId.get(view.id);
    const from = fromStone ? { stone: fromStone, room: roomFor(fromStone, view.room) } : null;
    const samePhoto = from && from.stone.id === stone.id && from.room.photo === room.photo;
    const commit = () => {
      if (from && !samePhoto && !reducedMotion()) {
        setPrev(from);
        setAnim(from.stone.id === stone.id || vs ? 'fade' : 'wipe');
      } else {
        setPrev(null);
        setAnim(null);
      }
      setView({ id: stone.id, room: room.id });
      setPending(false);
    };
    const src = stone[room.photo].src;
    if (samePhoto || loaded[src]) {
      commit();
      return undefined;
    }
    let done = false;
    let timer = null;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      commit();
    };
    setPending(true);
    const img = new Image();
    img.onload = () => {
      markLoaded(src);
      finish();
    };
    img.onerror = finish;
    img.src = src;
    timer = setTimeout(finish, 900);
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, [stone?.id, room?.id, vs?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // keep the chosen stone in view in the list (the list scrolls, the page doesn't)
  useEffect(() => {
    const box = pickerRef.current;
    const el = stone && box?.querySelector(`[data-id="${stone.id}"]`);
    if (!box || !el) return;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (box.scrollWidth > box.clientWidth + 2) {
      if (r.left < b.left || r.right > b.right) {
        box.scrollBy({ left: r.left - b.left - (b.width - r.width) / 2, behavior: 'smooth' });
      }
    } else if (r.top < b.top || r.bottom > b.bottom) {
      box.scrollBy({ top: r.top - b.top - (b.height - r.height) / 2, behavior: 'smooth' });
    }
  }, [stone?.id, cat, q]); // eslint-disable-line react-hooks/exhaustive-deps

  // stone pictures further down the list (or along the row on phones) load when it's scrolled
  // near them: the list holds every stone, and their photos are 640 px copies
  useEffect(() => loadNear(pickerRef.current, pickerRef.current), [cat, q, stones]);
  useEffect(() => loadNear(catsRef.current, null), [stones]);

  useEffect(() => {
    if (!nudge) return undefined;
    const id = setTimeout(() => setNudge(false), 1400);
    return () => clearTimeout(id);
  }, [nudge]);

  // ---- actions ----
  const markLoaded = (src) => setLoaded((l) => (l[src] ? l : { ...l, [src]: true }));

  // start loading a stone's room photo before the click (pointer over it, or focus)
  const warm = (s) => {
    const src = s?.[roomFor(s, wanted).photo]?.src;
    if (!src || warmed.current.has(src) || loaded[src]) return;
    warmed.current.add(src);
    const img = new Image();
    img.src = src;
  };

  const choose = (next) => {
    if (!next || !stone || next.id === stone.id || !canPick(next)) return;
    touched.current = true;
    lastId.current = stone.id;
    setCurrentId(next.id);
  };

  const pickRoom = (id) => {
    const next = roomsOf(stone).find((r) => r.id === id);
    if (!next || next.id === room.id) return;
    touched.current = true;
    setWanted(id);
  };

  const step = (dir) => {
    const list = (visible.length ? visible : stones).filter(canPick);
    if (!list.length) return;
    const i = list.findIndex((s) => s.id === stone.id);
    choose(list[(i + dir + list.length) % list.length]);
  };

  const toggleCompare = () => {
    touched.current = true;
    if (vs) {
      setVsId(null);
      return;
    }
    // pin this stone; next to it: the stone seen before, else the next one in the list
    const list = visible.length ? visible : stones;
    const i = list.findIndex((s) => s.id === stone.id);
    const other = [byId.get(lastId.current), ...list.slice(i + 1), ...list.slice(0, i), ...stones]
      .filter(Boolean)
      .find((s) => s.id !== stone.id && hasRoom(s, room.id));
    if (!other) return;
    setVsId(stone.id);
    setCurrentId(other.id);
    setSplit(50);
    splitRef.current = 50;
    setNudge(!reducedMotion());
  };

  const share = async () => {
    touched.current = true;
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      // the visitor closed the share sheet, or the browser refused the clipboard
    }
  };

  const fullScreen = () => {
    const i = room.photo === 'outside' && stone.inside ? 1 : 0;
    openPhoto(i);
  };
  const zoomSlides = stone
    ? [stone.inside, stone.outside].filter(Boolean).map((p, i) => ({
        src: p.src,
        alt: `${stone.name} – ${i === 0 ? t('visualizer.indoor') : t('visualizer.outdoor')}`,
      }))
    : [];

  // compare handle and swipes on the stage
  const onPointerDown = (e) => {
    if (e.target.closest('button, a')) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    if (vs) {
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add('is-dragging');
      setNudge(false);
      moveSplit(e.clientX);
    }
  };
  // While dragging, the handle moves by setting the CSS value on the stage directly (once per
  // frame), not through React state: re-rendering the whole page on every finger move, with the
  // big photos repainted each time, made iPhone Safari run out of memory and reload the page.
  // The state is updated when the finger is lifted.
  const moveSplit = (x) => {
    const stage = stageRef.current;
    const r = stage.getBoundingClientRect();
    splitRef.current = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    if (splitFrame.current) return;
    splitFrame.current = requestAnimationFrame(() => {
      splitFrame.current = 0;
      stage.style.setProperty('--vz-split', `${splitRef.current}%`);
    });
  };
  const endSplitDrag = () => {
    if (!stageRef.current?.classList.contains('is-dragging')) return;
    stageRef.current.classList.remove('is-dragging');
    setSplit(splitRef.current);
  };
  const onPointerMove = (e) => {
    if (vs && drag.current) moveSplit(e.clientX);
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    endSplitDrag();
    if (!d || vs) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    // a sideways swipe moves to the next or previous stone (the other way round in Arabic)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const rtl = getComputedStyle(pageRef.current).direction === 'rtl';
      step(dx < 0 !== rtl ? 1 : -1);
    }
  };

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.target.closest('input, textarea, [role="slider"]')) return;
    e.preventDefault();
    const rtl = getComputedStyle(pageRef.current).direction === 'rtl';
    step((e.key === 'ArrowRight') !== rtl ? 1 : -1);
  };
  const onSliderKey = (e) => {
    const k = { ArrowLeft: -5, ArrowRight: 5, Home: -100, End: 100 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    setSplit((s) => {
      splitRef.current = Math.min(100, Math.max(0, s + k));
      return splitRef.current;
    });
  };

  const showCategory = (type) => {
    setQuery('');
    setCat(type);
    stageRef.current?.closest('.vz-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const position = stone ? visible.findIndex((s) => s.id === stone.id) : -1;
  const alt = (s, r) => `${s.name} – ${roomLabel(r)}`;
  const shotProps = { loaded, onLoaded: markLoaded };

  // ---- render ----
  const order = new Map(visible.map((s, i) => [s.id, i]));
  const swatch = (s) => {
    const on = s.id === stone?.id;
    // the first ones load at once, the others when the list is scrolled near them
    const pinned = vs && s.id === vs.id;
    const off = !on && !pinned && !canPick(s);
    return (
      <li key={s.id}>
        <button
          type="button"
          data-id={s.id}
          className={`vz-sw${on ? ' is-on' : ''}${pinned ? ' is-pinned' : ''}${off ? ' is-off' : ''}`}
          aria-pressed={on}
          disabled={off}
          onClick={() => choose(s)}
          onPointerEnter={() => warm(s)}
          onFocus={() => warm(s)}
          title={s.name}
        >
          <span className="vz-sw-ph">
            {s.swatch && (
              <img
                {...(order.get(s.id) < 8 ? { src: s.swatch } : { 'data-src': s.swatch })}
                alt=""
                width={96}
                height={96}
                // lazy + low: the first 8 still load at once when on screen, but no longer
                // compete with the big room photo (they were preloaded before it)
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            )}
          </span>
          <span className="vz-sw-name">
            <bdi>{s.name}</bdi>
          </span>
        </button>
      </li>
    );
  };

  const swatchList = () => {
    if (!visible.length) {
      return (
        <div className="vz-empty">
          <p>{t('visualizer.noMatch', { query: query.trim() })}</p>
          <button type="button" className="vz-link" onClick={() => setQuery('')}>
            {t('visualizer.clearSearch')}
          </button>
        </div>
      );
    }
    if (!grouped) return <ul className="vz-list">{visible.map(swatch)}</ul>;
    return PRODUCT_CATEGORIES.filter((k) => counts[k]).map((k) => (
      <div className="vz-group" key={k}>
        <p className="vz-group-title">{t(PRODUCT_TYPE_KEYS[k])}</p>
        <ul className="vz-list">{visible.filter((s) => s.type === k).map(swatch)}</ul>
      </div>
    ));
  };

  // "Get a price" (WhatsApp) and "Free sample" (the sample form, for the stone's own finish)
  const actions = (s) =>
    s && (
      <>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="vz-btn">
          <FaWhatsapp aria-hidden="true" /> {t('productDetails.ctaPriceShort')}
        </a>
        {s.finish && (
          <button type="button" className="vz-btn vz-btn-line" onClick={() => setSampleFor(s)}>
            {t('productDetails.ctaSampleShort')}
          </button>
        )}
      </>
    );

  return (
    <div className={`vz${js ? ' vz-js' : ''}`} ref={pageRef}>
      <div className="vz-studio" onKeyDown={onKeyDown}>
        <div className="vz-head">
          <div className="vz-crumb">
            <LangLink href="/">{t('products.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="vz-crumb-here">{t('visualizer.breadcrumbCurrent')}</span>
          </div>
          <p className="vz-eyebrow">
            {t('visualizer.eyebrow')}
            {stones.length > 0 && (
              <>
                {' · '}
                {t('visualizer.stonesCount', { count: stones.length })}
              </>
            )}
          </p>
          <h1>{t('visualizer.heroTitle')}</h1>
          <p className="vz-intro">{t('visualizer.intro')}</p>
        </div>

        <div
          className={`vz-stage${vs ? ' is-compare' : ''}${nudge ? ' is-nudge' : ''}${
            touched.current ? ' is-live' : ''
          }`}
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            drag.current = null;
            endSplitDrag();
          }}
          style={{ '--vz-split': `${split}%` }}
        >
          {failed && <p className="vz-failed">{t('visualizer.loadError')}</p>}
          {shown && shownRoom && !vs && (
            <>
              {prev && (
                <Shot
                  key={`p-${prev.stone.id}-${prev.room.photo}`}
                  stone={prev.stone}
                  room={prev.room}
                  alt=""
                  {...shotProps}
                />
              )}
              <Shot
                key={`${shown.id}-${shownRoom.photo}`}
                stone={shown}
                room={shownRoom}
                anim={prev ? anim : null}
                alt={alt(shown, shownRoom)}
                priority={!touched.current}
                onDone={() => {
                  setPrev(null);
                  setAnim(null);
                }}
                {...shotProps}
              />
              {prev && anim === 'wipe' && (
                <span key={`g-${shown.id}`} className="vz-glint" aria-hidden="true" />
              )}
            </>
          )}
          {shown && shownRoom && vs && (
            <>
              <Shot
                key={`a-${vs.id}-${shownRoom.photo}`}
                stone={vs}
                room={roomFor(vs, shownRoom.id)}
                alt={alt(vs, shownRoom)}
                {...shotProps}
              />
              <div className="vz-side-b">
                {prev && (
                  <Shot
                    key={`p-${prev.stone.id}-${prev.room.photo}`}
                    stone={prev.stone}
                    room={prev.room}
                    alt=""
                    {...shotProps}
                  />
                )}
                <Shot
                  key={`${shown.id}-${shownRoom.photo}`}
                  stone={shown}
                  room={shownRoom}
                  anim={prev ? anim : null}
                  alt={alt(shown, shownRoom)}
                  onDone={() => {
                    setPrev(null);
                    setAnim(null);
                  }}
                  {...shotProps}
                />
              </div>
              <div
                className="vz-handle"
                role="slider"
                tabIndex={0}
                aria-label={t('visualizer.compareHint')}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(split)}
                onKeyDown={onSliderKey}
              >
                <span aria-hidden="true">⇆</span>
              </div>
              <p className="vz-tag is-a">
                <bdi>{vs.name}</bdi>
              </p>
              <p className="vz-tag is-b">
                <bdi>{shown.name}</bdi>
              </p>
            </>
          )}

          {stone && room && (
            <>
              <div className="vz-rooms" role="group" aria-label={t('visualizer.rooms')}>
                {rooms.map((r, i) => (
                  <React.Fragment key={r.id}>
                    {i > 0 && r.photo !== rooms[i - 1].photo && (
                      <span className="vz-rooms-gap" aria-hidden="true" />
                    )}
                    <button
                      type="button"
                      className={r.id === room.id ? 'is-on' : ''}
                      aria-pressed={r.id === room.id}
                      onClick={() => pickRoom(r.id)}
                    >
                      {roomLabel(r)}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div className="vz-tools">
                <button
                  type="button"
                  className={vs ? 'is-on' : ''}
                  aria-pressed={!!vs}
                  onClick={toggleCompare}
                  title={t('visualizer.compare')}
                >
                  <span aria-hidden="true">⇆</span>
                  <em>{t('visualizer.compare')}</em>
                </button>
                <button type="button" onClick={fullScreen} title={t('visualizer.fullScreen')}>
                  <span aria-hidden="true">⤢</span>
                  <em>{t('visualizer.fullScreen')}</em>
                </button>
                <button
                  type="button"
                  onClick={share}
                  title={t('visualizer.share')}
                  className={`vz-share${copied ? ' is-copied' : ''}`}
                >
                  <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
                  <em aria-live="polite">
                    {copied ? t('visualizer.linkCopied') : t('visualizer.share')}
                  </em>
                </button>
              </div>
            </>
          )}

          {shown && shownRoom && !vs && (
            <div className="vz-card">
              <div className="vz-label" aria-live="polite">
                <small>{t(PRODUCT_TYPE_KEYS[shown.type])}</small>
                <div className="vz-label-row">
                  <strong>
                    <bdi>{shown.name}</bdi>
                  </strong>
                  <LangLink href={`/products/${shown.slug}`} className="vz-label-link">
                    {t('visualizer.viewStone')}{' '}
                    <span className="vz-arrow" aria-hidden="true">
                      →
                    </span>
                  </LangLink>
                </div>
                <div className="vz-label-actions">{actions(shown)}</div>
              </div>
              {position >= 0 && (
                <div className="vz-step">
                  <button type="button" onClick={() => step(-1)} aria-label={t('visualizer.prev')}>
                    <Chevron />
                  </button>
                  <span>
                    <bdi>
                      {position + 1} / {visible.length}
                    </bdi>
                  </span>
                  <button
                    type="button"
                    className="is-next"
                    onClick={() => step(1)}
                    aria-label={t('visualizer.next')}
                  >
                    <Chevron />
                  </button>
                </div>
              )}
            </div>
          )}
          {pending && <span className="vz-loading" aria-hidden="true" />}
        </div>

        <div className="vz-panel">
          <div className="vz-chips" role="group" aria-label={t('visualizer.categories')}>
            {['all', ...PRODUCT_CATEGORIES.filter((k) => counts[k])].map((k) => (
              <button
                type="button"
                key={k}
                className={!q && cat === k ? 'is-on' : ''}
                aria-pressed={!q && cat === k}
                onClick={() => {
                  setQuery('');
                  setCat(k);
                }}
              >
                {k === 'all' ? t('visualizer.all') : t(PRODUCT_TYPE_KEYS[k])} <i>{counts[k]}</i>
              </button>
            ))}
          </div>
          <div className="vz-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('visualizer.search', { total: stones.length })}
              aria-label={t('visualizer.search', { total: stones.length })}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('visualizer.clearSearch')}
              >
                ×
              </button>
            )}
          </div>
          <div className="vz-picker" ref={pickerRef}>
            {swatchList()}
          </div>
        </div>

        {stone && (
          <div className="vz-mobile-actions">
            {actions(stone)}
            <LangLink href={`/products/${stone.slug}`} className="vz-more">
              {t('visualizer.viewStoneNamed', { name: stone.name })}{' '}
              <span className="vz-arrow" aria-hidden="true">
                →
              </span>
            </LangLink>
          </div>
        )}
      </div>

      <div className="vz-wrap">
        <section className="vz-section">
          <h2>{t('visualizer.categoriesTitle')}</h2>
          <ul className="vz-cats" ref={catsRef}>
            {PRODUCT_CATEGORIES.filter((k) => counts[k]).map((k) => (
              <li key={k} className="vz-cat vz-reveal">
                <span className="vz-cat-swatches" aria-hidden="true">
                  {stones
                    .filter((s) => s.type === k && s.swatch)
                    .slice(0, 3)
                    .map((s) => (
                      <img key={s.id} data-src={s.swatch} alt="" width={56} height={56} />
                    ))}
                </span>
                <h3>{t(PRODUCT_TYPE_KEYS[k])}</h3>
                <p className="vz-cat-count">{t('visualizer.stonesCount', { count: counts[k] })}</p>
                <p className="vz-cat-text">{t(DESCRIPTION_KEYS[k])}</p>
                <div className="vz-cat-links">
                  <button type="button" className="vz-link" onClick={() => showCategory(k)}>
                    {t('visualizer.tryThem')}
                  </button>
                  {CATEGORY_TOPIC[k] && (
                    <LangLink href={`/${CATEGORY_TOPIC[k]}/`} className="vz-link vz-link-muted">
                      {t('products.aboutCategory', { category: t(PRODUCT_TYPE_KEYS[k]) })}{' '}
                      <span className="vz-arrow" aria-hidden="true">
                        →
                      </span>
                    </LangLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="vz-band">
        <div className="vz-wrap">
          <div>
            <h2>{t('visualizer.bandTitle')}</h2>
            <p>{t('visualizer.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="vz-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(zoomSlides)}
      {sampleFor && (
        <SampleRequestForm
          isOpen
          onClose={() => setSampleFor(null)}
          productName={sampleFor.name}
          productFinish={sampleFor.finish}
          productFinishLabel={finishLabel(t, sampleFor.finish)}
        />
      )}
    </div>
  );
}
