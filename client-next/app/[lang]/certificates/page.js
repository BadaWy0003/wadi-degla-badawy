import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Certificates = dynamic(() => import('../../../src/components/Certificates/Certificates'), { ssr: false });

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
