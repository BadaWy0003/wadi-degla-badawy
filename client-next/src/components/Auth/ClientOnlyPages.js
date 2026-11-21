'use client';
// The private pages (login, signup, my account) only render in the browser: they read the
// login token from localStorage. Next.js 15 allows `ssr: false` only in a client file, so
// the page wrappers in app/[lang]/ import them from here.
import dynamic from 'next/dynamic';

export const Login = dynamic(() => import('./Login'), { ssr: false });
export const Signup = dynamic(() => import('./Signup'), { ssr: false });
export const MyAccount = dynamic(() => import('../MyAccount/MyAccount'), { ssr: false });
