import '../../src/index.css';
import '../../src/App.css';
// Phone-only size/spacing overrides; keep this import last (see the file's header).
import '../../src/mobile.css';
import AppShell from '../../src/components/AppShell';
import RootHtml, { rootMetadata } from '../../src/components/RootHtml';
import { SUPPORTED_LANGS } from '../../src/util/supported-langs';
import { getMessages } from '../../src/util/meta';

// Root layout for all /<lang>/ pages: renders <html lang dir> for that language.
export const metadata = rootMetadata;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children, params }) {
  return (
    <RootHtml lang={params.lang}>
      <AppShell lang={params.lang} messages={getMessages(params.lang)}>
        {children}
      </AppShell>
    </RootHtml>
  );
}
