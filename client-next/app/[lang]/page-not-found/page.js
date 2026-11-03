import NotFound404 from '../../../src/components/404/NotFound404';

// Error page: kept out of Google.
export const metadata = { robots: { index: false, follow: true } };

export default function NotFoundPage() {
  return <NotFound404 />;
}
