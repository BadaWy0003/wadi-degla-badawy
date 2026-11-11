import dynamic from 'next/dynamic';
import { t, buildSocial } from '../../../src/util/meta';
const Signup = dynamic(() => import('../../../src/components/Auth/Signup'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'signup.pageTitle', 'Signup | Wadi Degla');
  const description = t(lang, 'signup.metaDescription', '');
  return {
    title,
    description,
    ...buildSocial({ title, description, path: '/signup', lang }),
    // Private pages: kept out of Google (robots.txt lets Google read this "noindex").
    robots: { index: false, follow: true },
  };
}

export default function SignupPage({ params }) {
  return <Signup />;
}
