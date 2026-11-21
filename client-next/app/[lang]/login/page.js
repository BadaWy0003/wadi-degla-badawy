import { t, buildSocial } from '../../../src/util/meta';
import { Login } from '../../../src/components/Auth/ClientOnlyPages';

export async function generateMetadata(props) {
  const params = await props.params;
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

export default function LoginPage() {
  return <Login />;
}
