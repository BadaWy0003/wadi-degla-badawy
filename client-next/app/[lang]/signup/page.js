import { t, buildSocial } from '../../../src/util/meta';
import { Signup } from '../../../src/components/Auth/ClientOnlyPages';

export async function generateMetadata(props) {
  const params = await props.params;
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

export default function SignupPage() {
  return <Signup />;
}
