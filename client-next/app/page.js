'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    // Determine preferred language from localStorage or browser, fall back to 'en'
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null;
    const supported = ['en','ar','fr','es','de','it','ro','ko','sq','ru','ja','zh'];
    const lang = (saved && supported.includes(saved)) ? saved : 'en';
    router.replace(`/${lang}`);
  }, [router]);

  // Invisible while redirecting
  return null;
}
