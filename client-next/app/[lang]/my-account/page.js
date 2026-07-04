import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const MyAccount = dynamic(() => import('../../../src/components/MyAccount/MyAccount'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'myAccount.pageTitle', 'MyAccount | Wadi Degla'),
    description: t(lang, 'myAccount.metaDescription', ''),
    alternates: buildAlternates('/my-account', lang),
  };
}

export default function MyAccountPage({ params }) {
  return <MyAccount />;
}
