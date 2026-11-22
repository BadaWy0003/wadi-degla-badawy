'use client';
import React, { useRef } from 'react';
import './PartnersPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PARTNERS } from './PartnersData';
import { cardImageProps } from '../../util/responsive-img';
import { EXPORT_COUNTRIES_LABEL } from '../../util/company';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

// Partners & clients (redesigned 2026-11-12, design B "Partner stories"): header with numbers
// and a slowly moving strip of every logo, one "story" per partner we did projects for (logo,
// one line, its project cards linking to the project pages), the other logos under "Also
// trusted by", and a WhatsApp band.
// projects: { id: card } for the partners' projects, from the build (app/[lang]/partners/page.js);
// projectCount: all projects on the site.
// "31+": the export-country number from the admin panel (src/util/company.js)
const EXPORT_COUNTRIES = EXPORT_COUNTRIES_LABEL;

// stories: each partner's story in the page's language (by id), from the page (build time).
export default function Partners({ projects = {}, projectCount = 0, stories: storyTexts = {} }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  useReveal(pageRef, [], 'pa');

  const withWork = PARTNERS.map((p) => ({
    ...p,
    cards: p.projects.map((id) => projects[id]).filter(Boolean),
  }));
  const stories = withWork.filter((p) => p.cards.length);
  const others = withWork.filter((p) => !p.cards.length);

  const logo = (p, lazy = true) => (
    <img src={p.clear} alt={p.name} loading={lazy ? 'lazy' : 'eager'} />
  );

  return (
    <div className="pa" ref={pageRef}>
      <div className="pa-hero wd-cover" style={coverStyle('partners')}>
        <CoverPreload page="partners" />
        <div className="pa-wrap">
          <div className="pa-crumb">
            <LangLink href="/">{t('partners.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="pa-crumb-here">{t('partners.breadcrumbCurrent')}</span>
          </div>
          <p className="pa-eyebrow">{t('partners.eyebrow')}</p>
          <h1>{t('partners.pageHeading')}</h1>
          <p className="pa-lead">{t('partners.introText')}</p>
          <dl className="pa-stats">
            <div>
              <dt>{t('partners.statPartners')}</dt>
              <dd>{PARTNERS.length}</dd>
            </div>
            {projectCount > 0 && (
              <div>
                <dt>{t('partners.statProjects')}</dt>
                <dd>{projectCount}</dd>
              </div>
            )}
            <div>
              <dt>{t('partners.statCountries')}</dt>
              <dd>
                <bdi>{EXPORT_COUNTRIES}</bdi>
              </dd>
            </div>
          </dl>
        </div>

        {/* every logo, sliding slowly (the second copy makes the loop seamless) */}
        <div className="pa-ticker">
          <ul className="pa-ticker-row">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <li key={`${p.id}-${i}`} aria-hidden={i >= PARTNERS.length || undefined}>
                {logo(p, false)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pa-wrap">
        <section className="pa-section">
          <h2>{t('partners.storiesTitle')}</h2>
          {stories.map((p) => (
            <article className="pa-story pa-reveal" key={p.id}>
              <div className="pa-story-logo">{logo(p)}</div>
              <div>
                <p className="pa-eyebrow">
                  {p.cards.length === 1
                    ? t('partners.projectOne')
                    : t('partners.projectMany').replace('{{count}}', p.cards.length)}
                </p>
                <h3>{p.name}</h3>
                <p className="pa-text">{storyTexts[p.id] ?? t(`partners.stories.${p.id}`)}</p>
                <div className="pa-projects">
                  {p.cards.map((c) => (
                    <LangLink href={`/projects/${c.id}`} className="pa-project" key={c.id}>
                      <img loading="lazy" alt={c.name} {...cardImageProps(c.thumbnail)} />
                      <span>
                        <b dir="auto">{c.name}</b>
                        <small>{[c.city, c.country].filter(Boolean).join(' · ')}</small>
                      </span>
                    </LangLink>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="pa-section">
          <h2>{t('partners.alsoTitle')}</h2>
          <ul className="pa-also">
            {others.map((p) => (
              <li key={p.id} className="pa-reveal" title={p.name}>
                {logo(p)}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="pa-band">
        <div className="pa-wrap">
          <div>
            <h2>{t('partners.cta')}</h2>
            <p>{t('partners.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pa-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
