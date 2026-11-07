import { PAGE_HEROES, heroPhoneSrc, heroSrc } from '../util/hero-images';

// Server component: tells the browser to fetch the page's top photo straight away,
// the desktop file on wide screens and the phone file up to 768px.
// Use either page="<key of PAGE_HEROES>" or src="/Assets/Media/Hero/<name>.webp".
export default function HeroPreload({ page, src }) {
  const entry = page ? PAGE_HEROES[page] : null;
  const desktop = entry ? heroSrc(entry.desktop) : src;
  if (!desktop) return null;
  const phone = heroPhoneSrc(entry?.phone ? heroSrc(entry.phone) : desktop);
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={desktop}
        media="(min-width: 769px)"
        fetchPriority="high"
      />
      <link rel="preload" as="image" href={phone} media="(max-width: 768px)" fetchPriority="high" />
    </>
  );
}
