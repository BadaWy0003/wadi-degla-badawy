// The non-text content the client edited in the admin panel ("Website" menu), by block
// (fairs, partners, certificates, patterns, company...), fetched before each build
// (scripts/fetch-site-content.js). Small and client-safe. An empty object means "not changed":
// use the website's own values.
import SITE_DATA from '@site-content/data.json';

export const siteData = (blockId) => SITE_DATA[blockId] || {};

// A photo the client replaced in the admin panel ({ src, width, height } field), or the
// website's own photo.
export const sitePhoto = (blockId, name, fallback) => siteData(blockId)[name]?.src || fallback;

// CSS "url(...)" for a photo used as a background (quotes and backslashes removed).
export const cssUrl = (src) => `url("${String(src).replace(/["\\]/g, '')}")`;
