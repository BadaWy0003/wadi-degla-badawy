'use client';
// Pick stones (signup step 3 and the account page): category chips, search, photo tiles.
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { loadStones } from './auth-util';

export default function StonePicker({ selected, onChange }) {
  const { t } = useTranslation();
  const [stones, setStones] = useState(null);
  const [failed, setFailed] = useState(false);
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadStones()
      .then(setStones)
      .catch(() => setFailed(true));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (stones || []).filter(
      (s) => (!type || s.type === type) && (!q || s.name.toLowerCase().includes(q)),
    );
  }, [stones, type, query]);

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  if (failed) return <p className="au-error">{t('auth.stonesError')}</p>;

  return (
    <div className="au-picker">
      <div className="au-picker-bar">
        <div className="au-chips" role="group">
          {['', ...Object.keys(PRODUCT_TYPE_KEYS)].map((key) => (
            <button
              key={key || 'all'}
              type="button"
              className={type === key ? 'is-on' : ''}
              aria-pressed={type === key}
              onClick={() => setType(key)}
            >
              {key ? t(PRODUCT_TYPE_KEYS[key]) : t('auth.all')}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="au-search"
          placeholder={t('auth.searchStones')}
          aria-label={t('auth.searchStones')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="au-muted au-count" aria-live="polite">
        {t('auth.selectedCount', { count: selected.length })}
      </p>
      <ul className="au-stones">
        {!stones &&
          Array.from({ length: 8 }, (_, i) => <li key={i} className="au-stone is-loading" />)}
        {shown.map((s) => {
          const on = selected.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                className={on ? 'au-stone is-on' : 'au-stone'}
                aria-pressed={on}
                onClick={() => toggle(s.id)}
              >
                <img src={s.img} alt="" loading="lazy" width="160" height="160" />
                <span>{s.name}</span>
                {on && (
                  <i className="au-stone-check" aria-hidden="true">
                    <FaCheck />
                  </i>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
