import { t, buildAlternates } from '../../../src/util/meta';
import Certificates from '../../../src/components/Certificates/Certificates';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'certificates.pageTitle', 'Certificates | Wadi Degla'),
    description: t(lang, 'certificates.metaDescription', ''),
    alternates: buildAlternates('/certificates', lang),
  };
}

export default function CertificatesPage() {
  return <Certificates />;
}
