// The certificate documents and numbers: the website's own, with the client's changes from the
// admin panel ("Website" → "Certificates") on top (renewed copies are uploaded there).
// Used by the Certificates page and the home page's certificate logos (CertificatesData.js).
import { siteData } from '../../util/site-content';

const DIR = '/Assets/Media/Certificates';

export const CERTIFICATES_DEFAULTS = {
  isoDoc: { src: `${DIR}/iso-certificate.webp`, width: 763, height: 1080 },
  eosDoc: { src: `${DIR}/eos-certificate.webp`, width: 746, height: 1080 },
  cbmiDoc: { src: `${DIR}/cbmi-certificate.webp`, width: 1080, height: 802 },
  isoNumber: 'UAF181296569',
  isoIssuer: 'SAGACI Certifications',
  eosNumber: '09865/01',
  cbmiNumber: '08807',
};

export const CERTIFICATES = { ...CERTIFICATES_DEFAULTS, ...siteData('certificates') };
