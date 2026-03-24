'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ condition, redirectTo, children }) {
  const router = useRouter();
  const lang = typeof window !== 'undefined'
    ? (localStorage.getItem('language') || 'en')
    : 'en';

  useEffect(() => {
    if (!condition) {
      router.replace(`/${lang}${redirectTo}`);
    }
  }, [condition, redirectTo, router, lang]);

  if (!condition) return null;
  return children;
}
