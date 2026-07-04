import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Signup = dynamic(() => import('../../../src/components/LoginSignup/Signup'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'signup.title', 'Signup | Wadi Degla'),
    description: t(lang, 'home.metaDescription', ''),
    alternates: buildAlternates('/signup', lang),
  };
}

export default function SignupPage({ params }) {
  return <Signup />;
}
