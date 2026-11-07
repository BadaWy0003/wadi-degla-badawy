import { t, buildAlternates } from '../../../src/components/../util/meta';
import Kerbstone from '../../../src/components/Kerbstone/Kerbstone';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'kerbstone.pageTitle', 'Kerbstone | Wadi Degla'),
    description: t(lang, 'kerbstone.metaDescription', ''),
    alternates: buildAlternates('/kerbstone', lang),
  };
}

export default function KerbstonePage({ params }) {
  return (
    <>
      <HeroPreload page="kerbstone" />
      <Kerbstone />
    </>
  );
}
