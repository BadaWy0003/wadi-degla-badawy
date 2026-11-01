import '../../src/index.css';
import '../../src/App.css';
import AppShell from '../../src/components/AppShell';
import RootHtml, { rootMetadata } from '../../src/components/RootHtml';
import { SUPPORTED_LANGS } from '../../src/util/supported-langs';

// Root layout for all /<lang>/ pages: renders <html lang dir> for that language.
export const metadata = rootMetadata;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children, params }) {
  return (
    <RootHtml lang={params.lang}>
      <AppShell lang={params.lang}>{children}</AppShell>
    </RootHtml>
  );
}
