import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Certificates from '../../../src/components/Certificates/Certificates';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'certificates.pageTitle', 'Certificates | Wadi Degla');
  const description = t(lang, 'certificates.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/certificates', lang),
    ...buildSocial({ title, description, path: '/certificates', lang }),
  };
}

export default function CertificatesPage() {
  return <Certificates />;
}
