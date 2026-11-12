// Shared by the login, signup and account pages (src/components/Auth, MyAccount).
import countryList from 'react-select-country-list';
import { getApiClient } from '../../util/api-lazy';
import { PRODUCT_TYPE_KEYS, normalizeProducts } from '../../util/product-types';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

// The server's password rules (joi-password-complexity in customer.validation.schema.js):
// 8-16 characters with a lower case letter, an upper case letter, a number and a symbol.
export const PASSWORD_RULES = [
  ['ruleLength', (p) => p.length >= 8 && p.length <= 16],
  ['ruleUpper', (p) => /[A-Z]/.test(p)],
  ['ruleLower', (p) => /[a-z]/.test(p)],
  ['ruleNumber', (p) => /\d/.test(p)],
  ['ruleSymbol', (p) => /[^A-Za-z0-9]/.test(p)],
];
export const passwordOk = (p) => PASSWORD_RULES.every(([, ok]) => ok(p));

// Phone numbers as the server wants them: digits only, with the country code, 10-15 long.
export const phoneOk = (v) => /^[0-9]{10,15}$/.test(String(v));

// Countries in the page's language (Intl), sorted; the server keeps the English name + code.
let countries;
export function getCountries(lang) {
  const english = (countries ||= countryList().getData());
  let names;
  try {
    names = new Intl.DisplayNames([lang], { type: 'region' });
  } catch {
    names = null;
  }
  return english
    .map(({ value, label }) => ({ code: value, english: label, name: names?.of(value) || label }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
}

export const flagUrl = (code) => (code ? `https://flagcdn.com/${code.toLowerCase()}.svg` : '');

// Stones for the pickers: one request, shared by the page.
let stonesPromise;
export function loadStones() {
  stonesPromise ||= getApiClient()
    .then((api) => api.get('/api/storage/all'))
    .then(({ data }) =>
      normalizeProducts(data?.data || [])
        .filter((p) => PRODUCT_TYPE_KEYS[p.type])
        .map((p) => {
          const f = p.finishes?.find((x) => x.finish === 'Polished') || p.finishes?.[0];
          return { id: p.id, name: String(p.name).trim(), type: p.type, img: f?.thumb || f?.link };
        })
        .filter((s) => s.id && s.img)
        .sort((a, b) => a.name.localeCompare(b.name)),
    )
    .catch((err) => {
      stonesPromise = null; // try again next time
      throw err;
    });
  return stonesPromise;
}
