import dynamic from 'next/dynamic';
import { t, buildSocial } from '../../../src/util/meta';
const Login = dynamic(() => import('../../../src/components/Auth/Login'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'login.pageTitle', 'Login | Wadi Degla');
  const description = t(lang, 'login.metaDescription', '');
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
