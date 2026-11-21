import { t, buildSocial } from '../../../src/components/../util/meta';
import { MyAccount } from '../../../src/components/Auth/ClientOnlyPages';

export async function generateMetadata(props) {
  const params = await props.params;
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

export default function MyAccountPage() {
  return <MyAccount />;
}
