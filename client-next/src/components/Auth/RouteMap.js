'use client';
// The shipping route from Egypt to the customer's country (signup story panel).
// A drawing, not a real map: the ship sails along the line whenever the country changes.
import { useTranslation } from 'react-i18next';
import { flagUrl } from './auth-util';

const PATH = 'M300 128 Q196 -8 92 52';

export default function RouteMap({ country }) {
  const { t } = useTranslation();
  return (
    <div className="au-route">
      <svg viewBox="0 0 400 160" aria-hidden="true">
        <defs>
          <pattern id="au-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="rgba(232,214,186,.16)" />
          </pattern>
        </defs>
        <rect width="400" height="160" fill="url(#au-dots)" />
        <path d={PATH} className="au-route-line" />
        <circle cx="300" cy="128" r="6" fill="#cdb48b" />
        <circle cx="300" cy="128" r="13" fill="none" stroke="rgba(205,180,139,.4)" />
        <circle
          cx="92"
          cy="52"
          r="6"
          className={country ? 'au-route-dest is-set' : 'au-route-dest'}
        />
        {/* key: a new country restarts the trip */}
        <g key={country?.code || 'none'} className={country ? 'au-ship is-sailing' : 'au-ship'}>
          <path d="M-9 -2 h18 l-4 6 h-10 z M-1 -9 v7 M-1 -9 l6 5 h-6" />
        </g>
      </svg>
      <div className="au-route-labels">
        <span>
          {t('auth.routeTo')}{' '}
          {country ? (
            <b>
              <img src={flagUrl(country.code)} alt="" width="18" height="13" /> {country.name}
            </b>
          ) : (
            <b className="au-muted">{t('auth.routeYourCountry')}</b>
          )}
        </span>
        <span>
          {t('auth.routeFrom')} <b>{t('auth.routeEgypt')}</b>
        </span>
      </div>
    </div>
  );
}
