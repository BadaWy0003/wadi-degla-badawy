'use client';
import React, { useEffect, useRef, useState } from 'react';
import './GalleryPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import usePhotoZoom from '../usePhotoZoom';
import apiClient from '../../util/client';
import LangLink from '../LangLink';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { COMPANY, FACTS } from '../../util/company';

// Gallery (redesigned 2026-11-12, design B "Grouped by area"): header with numbers, a bar of
// group buttons (they jump to their section; the one on screen is highlighted), one section per
// group (big first photo + the rest; any photo opens all gallery photos in the zoom viewer, at
// that photo) with a link to the page that explains it, and a WhatsApp band.
//
// Gallery photos are uploaded in the admin panel without a category, so the groups are set here
// by the photo's name (the number typed in the admin panel). A new photo whose name is in no
// group is shown in "More photos" at the end until its name is added to a group below.
const GROUPS = [
  {
    id: 'factory',
    link: '/machinery',
    names: ['25', '6', '18', '7', '2', '8', '1', '11', '19', '15', '32'],
  },
  { id: 'yard', link: '/quarries', names: ['28', '3', '4', '27', '22', '26'] },
  { id: 'packing', link: '/packing', names: ['24', '29', '30', '31', '21'] },
];
const FACTORIES = COMPANY.factories;
const OUTPUT = `${FACTS.dailyCapacity} m²`; // per day, from the admin panel (src/util/company.js)

const photoOf = (item) => {
  const f = item.finishes?.[0];
  return f?.link ? { name: String(item.name || '').trim(), src: f.link, thumb: f.thumb } : null;
};

// How many grid columns each photo takes so the last row is always full. The first photo is big
// (2 x 2). Desktop: 4 columns, 4 small photos beside the big one; a group of 2-4 photos is one
// row instead (class ga-grid-few). Phones: 2 columns, the first photo across both.
function spans(count) {
  const d = Array(count).fill(1);
  const m = Array(count).fill(1);
  m[0] = 2;
  // 6, 10, 14... photos would leave one photo alone on the last row: no big photo then, and
  // the last two photos share the last row
  const flat = count > 5 && (count - 5) % 4 === 1;
  if (flat) {
    d[count - 1] = d[count - 2] = 2;
  } else {
    d[0] = 2;
    const restD = count - 5;
    if (restD > 0) {
      const r = restD % 4;
      if (r === 2) d[count - 1] = d[count - 2] = 2;
      if (r === 3) d[count - 1] = 2;
    }
  }
  if (count > 1 && (count - 1) % 2 === 1) m[count - 1] = 2;
  return { flat, sizes: d.map((sd, i) => ({ '--sd': sd, '--sm': m[i] })) };
}

export default function Gallery({ initialItems = [] }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const [active, setActive] = useState(GROUPS[0].id);
  const [openPhoto, zoom] = usePhotoZoom();

  // refresh from the admin panel's live list (the build's list stays if this fails)
  useEffect(() => {
    apiClient
      .get('/api/storage/type/Gallery', { quiet: true })
      .then(({ data }) => Array.isArray(data?.data) && setItems(data.data))
      .catch(() => {});
  }, []);

  const photos = items.map(photoOf).filter(Boolean);
  const byName = new Map(photos.map((p) => [p.name, p]));
  const grouped = new Set(GROUPS.flatMap((g) => g.names));
  const sections = [
    ...GROUPS.map((g) => ({ ...g, photos: g.names.map((n) => byName.get(n)).filter(Boolean) })),
    { id: 'more', photos: photos.filter((p) => !grouped.has(p.name)) },
  ].filter((s) => s.photos.length);

  // one list for the zoom viewer, in page order
  const all = sections.flatMap((s) => s.photos);
  const slides = all.map((p, i) => ({ src: p.src, alt: altOf(t, p, i) }));
  const indexOf = (photo) => all.indexOf(photo);

  useReveal(pageRef, [all.length], 'ga');

  // the bar's button of the section on screen is highlighted
  const ids = sections.map((s) => s.id).join(',');
  useEffect(() => {
    const list = ids.split(',');
    const onScroll = () => {
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(`ga-${id}`);
        if (el && el.getBoundingClientRect().top < 220) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);

  const jump = (id) => {
    const el = document.getElementById(`ga-${id}`);
    if (!el) return;
    setActive(id);
    const bar = document.querySelector('.ga-bar');
    const top = el.getBoundingClientRect().top + window.scrollY - (bar?.offsetHeight || 0) - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="ga" ref={pageRef}>
      <div className="ga-hero">
        <div className="ga-wrap">
          <div className="ga-crumb">
            <LangLink href="/">{t('gallery.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="ga-crumb-here">{t('gallery.breadcrumbCurrent')}</span>
          </div>
          <p className="ga-eyebrow">{t('gallery.eyebrow')}</p>
          <h1>{t('gallery.heroTitle')}</h1>
          <p className="ga-lead">{t('gallery.heroSubtitle')}</p>
          <dl className="ga-stats">
            <div>
              <dt>{t('gallery.statPhotos')}</dt>
              <dd>{all.length}</dd>
            </div>
            <div>
              <dt>{t('gallery.statFactories')}</dt>
              <dd>{FACTORIES}</dd>
            </div>
            <div>
              <dt>{t('gallery.statOutput')}</dt>
              <dd>
                <bdi>{OUTPUT}</bdi>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {sections.length > 1 && (
        <div className="ga-bar">
          <div className="ga-wrap">
            <div className="ga-chips">
              {sections.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`ga-chip${active === s.id ? ' is-on' : ''}`}
                  onClick={() => jump(s.id)}
                >
                  {t(`gallery.${s.id}Title`)} <i>{s.photos.length}</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="ga-wrap">
        {sections.map((s) => {
          const { flat, sizes } = spans(s.photos.length);
          return (
            <section className="ga-section" id={`ga-${s.id}`} key={s.id}>
              <div className="ga-head">
                <div>
                  <p className="ga-eyebrow">
                    {s.photos.length === 1
                      ? t('projects.photosOne')
                      : t('projects.photosMany').replace('{{count}}', s.photos.length)}
                  </p>
                  <h2>{t(`gallery.${s.id}Title`)}</h2>
                  {s.id !== 'more' && <p className="ga-text">{t(`gallery.${s.id}Text`)}</p>}
                </div>
                {s.link && (
                  <LangLink href={s.link} className="ga-more">
                    {t(`gallery.${s.id}Link`)}{' '}
                    <span className="ga-arrow" aria-hidden="true">
                      →
                    </span>
                  </LangLink>
                )}
              </div>
              <div
                className={`ga-grid${s.photos.length < 5 ? ' ga-grid-few' : ''}${flat ? ' ga-grid-flat' : ''}`}
              >
                {s.photos.map((p, i) => {
                  const n = indexOf(p);
                  return (
                    <button
                      type="button"
                      key={p.src}
                      className="ga-photo ga-reveal"
                      style={sizes[i]}
                      onClick={() => openPhoto(n)}
                      aria-label={altOf(t, p, n)}
                    >
                      <img
                        loading="lazy"
                        src={i === 0 ? p.src : p.thumb || p.src}
                        alt={altOf(t, p, n)}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="ga-band">
        <div className="ga-wrap">
          <div>
            <h2>{t('gallery.bandTitle')}</h2>
            <p>{t('gallery.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ga-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}

function altOf(t, photo, index) {
  const group = GROUPS.find((g) => g.names.includes(photo.name));
  return `${t(`gallery.${group ? group.id : 'more'}Title`)} – ${t('gallery.imageAlt', {
    number: index + 1,
  })}`;
}
