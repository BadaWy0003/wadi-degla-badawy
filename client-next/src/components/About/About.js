'use client';
import React from 'react';
import './AboutPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import StatCounter from './StatCounter';
import { WHATSAPP_URL } from '../Contact/contactData';
import { COMPANY, YEARS } from '../../util/company';
import { cssUrl, sitePhoto } from '../../util/site-content';

// the header photo can be replaced in the admin panel (Website → Why choose us)
const HERO = sitePhoto('about', 'heroPhoto', null);

// "Our expertise" photo: the client's (Website → Why choose us → Our expertise), else ours
// (the original is also named in app/[lang]/content-defaults.json/route.js)
const EXPERTISE_PHOTO = sitePhoto('about', 'expertisePhoto', '/Assets/Media/about-expertise.webp');

// Why Choose Us (redesigned 2026-11-12, design B "Photo header + numbered list"): photo header
// with the H1, a row of numbers over its bottom edge, vision & mission, six numbered reasons,
// "Our expertise" (photo + what we supply stone for) and a WhatsApp band.
// The numbers come from the admin panel (src/util/company.js); the years count themselves.
const NUMBERS = [
  { end: YEARS, suffix: '', label: 'statYears' },
  { end: COMPANY.workers, suffix: '+', label: 'statWorkers' },
  { end: COMPANY.dailyCapacity, suffix: ' m²', label: 'statPerDay' },
  { end: COMPANY.projects, suffix: '+', label: 'statProjects' },
  { end: COMPANY.quarries, suffix: '', label: 'statQuarries' },
  { end: COMPANY.exportCountries, suffix: '+', label: 'statCountries' },
];
// [title key, text key]
const REASONS = [
  ['about.reasonTechnology', 'about.counters.technologyText'],
  ['about.reasonCraftsmanship', 'about.counters.craftsmanshipText'],
  ['about.reasonSupplyChain', 'about.counters.supplyChainText'],
  ['about.globalReachTitle', 'about.globalReachText'],
  ['about.partnershipsTitle', 'about.partnershipsText'],
  ['about.solutionsTitle', 'about.solutionsText'],
];

// "Global Reach:" -> "Global Reach"
const noColon = (text) => String(text).replace(/\s*[:：]\s*$/, '');
const oneLine = (text) =>
  String(text)
    .replace(/\s*\n\s*/g, ' ')
    .trim();
// the "- " lines of a text
const listItems = (text) =>
  String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="ab">
      <div
        className="ab-hero"
        role="img"
        aria-label={t('about.heroImageAlt')}
        style={HERO ? { '--ab-hero-img': cssUrl(HERO) } : undefined}
      >
        <div className="ab-wrap">
          <div className="ab-crumb">
            <LangLink href="/">{t('about.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="ab-crumb-here">{t('about.breadcrumbCurrent')}</span>
          </div>
          <p className="ab-eyebrow">{t('about.introTitle')}</p>
          <h1>{t('about.whyTitle')}</h1>
          <p className="ab-lead">{oneLine(t('about.introText1'))}</p>
        </div>
      </div>

      <div className="ab-wrap">
        <dl className="ab-numbers">
          {NUMBERS.map(({ end, suffix, label }) => (
            <div key={label}>
              <dt>{t(`about.${label}`)}</dt>
              <dd>
                <bdi>
                  <StatCounter end={end} suffix={suffix} className="ab-number" />
                </bdi>
              </dd>
            </div>
          ))}
        </dl>

        <div className="ab-vm">
          <div>
            <h2 className="ab-vm-title">{t('about.visionTitle')}</h2>
            <p>{t('about.visionText')}</p>
          </div>
          <div>
            <h2 className="ab-vm-title">{t('about.missionTitle')}</h2>
            <p>{t('about.missionText')}</p>
          </div>
        </div>

        <section className="ab-section">
          <h2>{t('about.counters.sectionTitle2')}</h2>
          <p className="ab-section-lead">{oneLine(t('about.introText2'))}</p>
          <ol className="ab-reasons">
            {REASONS.map(([title, text], i) => (
              <li key={title}>
                <span className="ab-reason-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{noColon(t(title))}</h3>
                  <p>{oneLine(t(text))}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ab-section ab-expertise">
          <img loading="lazy" src={EXPERTISE_PHOTO} alt={t('about.expertiseImageAlt')} />
          <div>
            <p className="ab-eyebrow">{t('about.expertiseSubtitle')}</p>
            <h2>{t('about.expertiseTitle')}</h2>
            <p className="ab-text">{oneLine(t('about.expertiseIntro'))}</p>
            <p className="ab-text">{oneLine(t('about.resourcesText'))}</p>
            <p className="ab-label">{t('about.supplyFor')}</p>
            <ul className="ab-chips">
              {listItems(t('about.graniteText')).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <LangLink href="/projects/" className="ab-link">
              {t('about.seeProjects')}{' '}
              <span className="ab-arrow" aria-hidden="true">
                →
              </span>
            </LangLink>
          </div>
        </section>
      </div>

      <div className="ab-band">
        <div className="ab-wrap">
          <div>
            <h2>{t('about.bandTitle')}</h2>
            <p>{t('about.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ab-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
