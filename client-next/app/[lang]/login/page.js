import dynamic from 'next/dynamic';
import { t } from '../../../src/util/meta';
const Login = dynamic(() => import('../../../src/components/LoginSignup/Login'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'login.title', 'Login | Wadi Degla'),
    description: t(lang, 'home.metaDescription', ''),
    // Private pages: kept out of Google (robots.txt lets Google read this "noindex").
    robots: { index: false, follow: true },
  };
}

export default function LoginPage({ params }) {
  return <Login />;
}
