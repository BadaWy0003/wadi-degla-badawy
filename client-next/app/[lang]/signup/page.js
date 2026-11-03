import dynamic from 'next/dynamic';
import { t } from '../../../src/util/meta';
const Signup = dynamic(() => import('../../../src/components/LoginSignup/Signup'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'signup.title', 'Signup | Wadi Degla'),
    description: t(lang, 'home.metaDescription', ''),
    // Private pages: kept out of Google (robots.txt lets Google read this "noindex").
    robots: { index: false, follow: true },
  };
}

export default function SignupPage({ params }) {
  return <Signup />;
}
