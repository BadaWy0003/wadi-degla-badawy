const fs = require('fs');
const path = require('path');

// "@site-content/texts.json" and "@site-content/data.json": the content edited in the admin
// panel, fetched before each build by scripts/fetch-site-content.js. Without that folder
// (e.g. a plain "next dev") the empty defaults are used: the website's own texts.
const GENERATED = path.join(__dirname, 'content', '.generated', 'site-content');
const SITE_CONTENT = fs.existsSync(path.join(GENERATED, 'texts.json'))
  ? GENERATED
  : path.join(__dirname, 'content', 'site-content-default');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
  // Disable the x-powered-by header
  poweredByHeader: false,
  // The build year, the same in the HTML and in the browser (years in business, footer ©).
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  webpack: (config) => {
    config.resolve.alias['@site-content'] = SITE_CONTENT;
    return config;
  },
};

module.exports = nextConfig;
// deploy trigger
