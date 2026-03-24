import AppShell from '../../src/components/AppShell';
import { SUPPORTED_LANGS } from '../../src/util/supported-langs';

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children, params }) {
  return (
    <AppShell lang={params.lang}>
      {children}
    </AppShell>
  );
}
