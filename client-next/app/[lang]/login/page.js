import dynamic from 'next/dynamic';
import { t, buildSocial } from '../../../src/util/meta';
const Login = dynamic(() => import('../../../src/components/LoginSignup/Login'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'login.title', 'Login | Wadi Degla');
  const description = t(lang, 'home.metaDescription', '');
  return {
    title,
    description,
    ...buildSocial({ title, description, path: '/login', lang }),
    // Private pages: kept out of Google (robots.txt lets Google read this "noindex").
    robots: { index: false, follow: true },
  };
}

export default function LoginPage({ params }) {
  return <Login />;
}
