import { CERTIFICATES } from './certificateDocs';



const iso_certificate = CERTIFICATES.isoDoc.src;
const iso_logo = '/Assets/Media/Certificates/iso-logo.webp';

const uaf_logo = '/Assets/Media/Certificates/uaf-logo.webp';

const iaf_logo = '/Assets/Media/Certificates/iaf-logo.webp';

const eos_certificate = CERTIFICATES.eosDoc.src;
const eos_logo = '/Assets/Media/Certificates/eos-logo.svg';

const cbmi_certificate = CERTIFICATES.cbmiDoc.src;
const cbmi_logo = '/Assets/Media/Certificates/cbmi-logo.webp';

      // thumbWidth/thumbHeight: the logo's real size, so the page keeps its space before it loads.
      export const certificatesData = [
        {
            name: "certificates.iafTitle",
            thumbnail: iaf_logo, thumbWidth: 390, thumbHeight: 246,
            image: iso_certificate,
        },
        {
          name: "certificates.uafTitle",
          thumbnail: uaf_logo, thumbWidth: 515, thumbHeight: 242,
          image: iso_certificate,
        },
        {
          name: "certificates.isoTitle",
          thumbnail: iso_logo, thumbWidth: 554, thumbHeight: 554,
          image: iso_certificate,
        },
        {
          name: "certificates.eosTitle",
          thumbnail: eos_logo, thumbWidth: 224, thumbHeight: 237,
          image: eos_certificate,
        },
        {
          name: "certificates.cbmiTitle",
          thumbnail: cbmi_logo, thumbWidth: 360, thumbHeight: 139,
          image: cbmi_certificate,
        },
      ];

