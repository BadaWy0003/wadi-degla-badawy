'use client';

import NextLink from 'next/link';
import { useLang } from '../context/LangContext';

/**
 * Drop-in replacement for react-router-dom's <Link>.
 * Automatically prepends /{lang} to all internal hrefs.
 * Usage: <LangLink href="/products">...</LangLink>
 * Renders: <a href="/en/products">...</a>
 */
export default function LangLink({ href, children, prefetch = false, ...props }) {
  const lang = useLang();
  // Don't prefix external links or already-prefixed links
  const isExternal = href?.startsWith('http') || href?.startsWith('mailto');
  const finalHref = isExternal ? href : `/${lang}${href}`;
  // prefetch is off by default: every page's data carries that language's UI texts
  // (~22 KB gzipped), so pre-loading each visible link cost 160-270 KB per page view.
  // Pages now load on click instead.
  return (
    <NextLink href={finalHref} prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  );
}
