import dynamic from 'next/dynamic';
import { t, buildSocial } from '../../../src/components/../util/meta';
const MyAccount = dynamic(() => import('../../../src/components/MyAccount/MyAccount'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'myAccount.pageTitle', 'MyAccount | Wadi Degla');
  const description = t(lang, 'myAccount.metaDescription', '');
  return {
    title,
    description,
    ...buildSocial({ title, description, path: '/my-account', lang }),
    // Private pages: kept out of Google (robots.txt lets Google read this "noindex").
    robots: { index: false, follow: true },
  };
}

export default function MyAccountPage({ params }) {
  return <MyAccount />;
}
