// The non-text content the client edited in the admin panel ("Website" menu), by block
// (fairs, partners, certificates, patterns, company...), fetched before each build
// (scripts/fetch-site-content.js). Small and client-safe. An empty object means "not changed":
// use the website's own values.
import SITE_DATA from '@site-content/data.json';

export const siteData = (blockId) => SITE_DATA[blockId] || {};
