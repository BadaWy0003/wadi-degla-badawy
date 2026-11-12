'use client';
// Password input with Show/Hide and (on signup) the live list of the server's rules.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PASSWORD_RULES } from './auth-util';

export default function PasswordField({ id, value, onChange, error, showRules, autoComplete }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <div className="au-field">
      <label htmlFor={id}>{t('auth.password')}</label>
      <div className="au-pw">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          maxLength={16}
          aria-invalid={!!error}
          aria-describedby={showRules ? `${id}-rules` : undefined}
        />
        <button type="button" className="au-pw-toggle" onClick={() => setVisible((v) => !v)}>
          {visible ? t('auth.hide') : t('auth.show')}
        </button>
      </div>
      {showRules && (
        <ul className="au-rules" id={`${id}-rules`}>
          {PASSWORD_RULES.map(([key, ok]) => (
            <li key={key} className={ok(value) ? 'is-ok' : ''}>
              {t(`auth.${key}`)}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="au-error">{error}</p>}
    </div>
  );
}
