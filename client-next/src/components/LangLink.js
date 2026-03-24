'use client';

import NextLink from 'next/link';
import { useLang } from '../context/LangContext';

/**
 * Drop-in replacement for react-router-dom's <Link>.
 * Automatically prepends /{lang} to all internal hrefs.
 * Usage: <LangLink href="/products">...</LangLink>
 * Renders: <a href="/en/products">...</a>
 */
export default function LangLink({ href, children, ...props }) {
  const lang = useLang();
  // Don't prefix external links or already-prefixed links
  const isExternal = href?.startsWith('http') || href?.startsWith('mailto');
  const finalHref = isExternal ? href : `/${lang}${href}`;
  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
