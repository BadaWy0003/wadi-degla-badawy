import RootHtml, { rootMetadata } from '../../src/components/RootHtml';

// Root layout for "/" only (it redirects to /<lang>/; nginx normally redirects first).
export const metadata = rootMetadata;

export default function RootRedirectLayout({ children }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
