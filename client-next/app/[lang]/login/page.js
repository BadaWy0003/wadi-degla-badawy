import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Login = dynamic(() => import('../../../src/components/LoginSignup/Login'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'login.title', 'Login | Wadi Degla'),
    description: t(lang, 'home.metaDescription', ''),
    alternates: buildAlternates('/login', lang),
  };
}

export default function LoginPage({ params }) {
  return <Login />;
}
