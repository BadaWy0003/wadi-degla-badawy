import HeroPreload from '../HeroPreload';
import { pageCover } from '../../util/page-covers';

// Preloads a page's header photo (desktop file on wide screens, phone copy up to 768px).
// React puts these <link> tags in the page's <head>, wherever they are rendered.
export default function CoverPreload({ page }) {
  const { src, phone } = pageCover(page);
  return <HeroPreload src={src} phone={phone} />;
}
