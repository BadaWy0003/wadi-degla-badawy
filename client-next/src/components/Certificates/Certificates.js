'use client';
import React, { useRef } from 'react';
import './CertificatesPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';

// Certificates (redesigned 2026-11-12, design B "ISO spotlight"): header with numbers, ISO
// 9001:2015 as the main section (facts + the certificate, which tilts toward the mouse), the two
// Egyptian registrations (EOS, CBMI) as smaller cards, the accreditation logos, "What this means
// for your project" and a WhatsApp band. Any document opens full size in the zoom viewer.
//
// Only facts that never expire are shown (numbers, scope, issuer): the dates printed on the
// documents are not repeated here. Replace a document by giving it a new file name.
const DIR = '/Assets/Media/Certificates';
const LOGOS = '/Assets/Icons/logos-transparent';
const DOCS = {
  iso: {
    src: `${DIR}/iso-certificate.webp`,
    width: 763,
    height: 1080,
    alt: 'certificates.isoTitle',
  },
  eos: {
    src: `${DIR}/eos-certificate.webp`,
    width: 746,
    height: 1080,
    alt: 'certificates.eosTitle',
  },
  cbmi: {
    src: `${DIR}/cbmi-certificate.webp`,
    width: 1080,
    height: 802,
    alt: 'certificates.cbmiTitle',
  },
};
const ORDER = ['iso', 'eos', 'cbmi'];
const ISO_NUMBER = 'UAF181296569';
const ISO_ISSUER = 'SAGACI Certifications';
const EOS_NUMBER = '09865/01';
const CBMI_NUMBER = '08807';
const LOGO_LIST = [
  ['iso-logo', 'certificates.isoTitle'],
  ['iaf-logo', 'certificates.iafTitle'],
  ['uaf-logo', 'certificates.uafTitle'],
  ['eos-logo', 'certificates.eosTitle'],
  ['cbmi-logo', 'certificates.cbmiTitle'],
];
const REASONS = [1, 2, 3];

function Facts({ rows }) {
  return (
    <dl className="ce-facts">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Certificates() {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const tiltRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'ce');

  const slides = ORDER.map((k) => ({ src: DOCS[k].src, alt: t(DOCS[k].alt) }));
  const open = (k) => openPhoto(ORDER.indexOf(k));

  // the ISO certificate leans toward the mouse, like a sheet of paper held up
  const tilt = (e) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ce-ry', `${x * 14}deg`);
    el.style.setProperty('--ce-rx', `${-y * 10}deg`);
  };
  const untilt = () => {
    tiltRef.current?.style.removeProperty('--ce-ry');
    tiltRef.current?.style.removeProperty('--ce-rx');
  };

  const doc = (k, className) => (
    <button
      type="button"
      className={className}
      onClick={() => open(k)}
      aria-label={`${t('certificates.view')}: ${t(DOCS[k].alt)}`}
    >
      <img
        src={DOCS[k].src}
        width={DOCS[k].width}
        height={DOCS[k].height}
        alt={t(DOCS[k].alt)}
        loading={k === 'iso' ? 'eager' : 'lazy'}
      />
    </button>
  );

  return (
    <div className="ce" ref={pageRef}>
      <div className="ce-hero">
        <div className="ce-wrap">
          <div className="ce-crumb">
            <LangLink href="/">{t('certificates.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="ce-crumb-here">{t('certificates.breadcrumbCurrent')}</span>
          </div>
          <p className="ce-eyebrow">{t('certificates.eyebrow')}</p>
          <h1>{t('certificates.pageHeading')}</h1>
          <p className="ce-lead">{t('certificates.intro')}</p>
          <dl className="ce-stats">
            <div>
              <dt>{t('certificates.statIso')}</dt>
              <dd>
                <bdi>ISO 9001</bdi>
              </dd>
            </div>
            <div>
              <dt>{t('certificates.statCount')}</dt>
              <dd>{ORDER.length}</dd>
            </div>
            <div>
              <dt>{t('certificates.statSince')}</dt>
              <dd>1980</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="ce-wrap">
        <section className="ce-section ce-spot">
          <div className="ce-spot-text">
            <p className="ce-seal">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <circle cx="18" cy="18" r="16.5" />
                <path d="M11 18.5l4.6 4.6L25.5 13" />
              </svg>
              {t('certificates.isoBadge')}
            </p>
            <h2>
              <bdi>ISO 9001:2015</bdi>
            </h2>
            <p className="ce-text">{t('certificates.isoText')}</p>
            <Facts
              rows={[
                [t('certificates.factScope'), t('certificates.isoScope')],
                [t('certificates.factNumber'), <bdi key="n">{ISO_NUMBER}</bdi>],
                [t('certificates.factIssuer'), <bdi key="i">{ISO_ISSUER}</bdi>],
                [t('certificates.factAccredited'), t('certificates.isoAccredited')],
              ]}
            />
            <button type="button" className="ce-btn" onClick={() => open('iso')}>
              {t('certificates.view')}
            </button>
          </div>
          <div className="ce-stage" ref={tiltRef} onPointerMove={tilt} onPointerLeave={untilt}>
            {doc('iso', 'ce-paper')}
          </div>
        </section>

        <section className="ce-section">
          <h2>{t('certificates.egyptTitle')}</h2>
          <div className="ce-cards">
            {[
              ['eos', [[t('certificates.factRegistration'), <bdi key="e">{EOS_NUMBER}</bdi>]]],
              [
                'cbmi',
                [
                  [t('certificates.factActivity'), t('certificates.cbmiActivity')],
                  [t('certificates.factNumber'), <bdi key="c">{CBMI_NUMBER}</bdi>],
                ],
              ],
            ].map(([k, rows]) => (
              <article className="ce-card ce-reveal" key={k}>
                {doc(k, 'ce-thumb')}
                <div>
                  <span className="ce-tag">{t('certificates.tagEgypt')}</span>
                  <h3>{t(`certificates.${k}Heading`)}</h3>
                  <p className="ce-text">{t(`certificates.${k}Text`)}</p>
                  <Facts rows={rows} />
                  <button type="button" className="ce-link" onClick={() => open(k)}>
                    {t('certificates.view')}{' '}
                    <span className="ce-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ce-section">
          <ul className="ce-logos ce-reveal" aria-label={t('certificates.logosLabel')}>
            {LOGO_LIST.map(([file, alt]) => (
              <li key={file}>
                <img src={`${LOGOS}/${file}.webp`} alt={t(alt)} loading="lazy" />
              </li>
            ))}
          </ul>
        </section>

        <section className="ce-section">
          <h2>{t('certificates.whyTitle')}</h2>
          <ul className="ce-why">
            {REASONS.map((n) => (
              <li key={n} className="ce-reveal">
                <h3>{t(`certificates.why${n}Title`)}</h3>
                <p>{t(`certificates.why${n}Text`)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ce-band">
        <div className="ce-wrap">
          <div>
            <h2>{t('certificates.bandTitle')}</h2>
            <p>{t('certificates.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ce-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
