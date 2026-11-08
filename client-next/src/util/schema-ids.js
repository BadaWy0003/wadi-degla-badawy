// Stable ids of the site-wide JSON-LD nodes (src/components/RootHtml.js). Other pages point to
// them with { '@id': ... } instead of repeating the company's details, so Google links every
// page to the same organization (and not to the unrelated Wadi Degla companies).
export const SITE_URL = 'https://www.wadidegla-eg.com';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
