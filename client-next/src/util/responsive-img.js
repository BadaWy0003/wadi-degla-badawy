// Site photos in /Assets/Media/Quarries and /Assets/Media/Projects each have an 800 px
// "-sm.webp" copy (made by tools/make-small-images.js). Cards and sliders pass these props to
// <img> so the browser downloads the small copy unless the photo is shown large.
// Other photos (e.g. uploads in Firebase Storage) are returned unchanged.
const HAS_SMALL = /^\/Assets\/Media\/(Quarries|Projects)\/.+(?<!-sm)\.webp$/;

export function cardImageProps(src, sizes = '(max-width: 768px) 50vw, 400px') {
  if (!src || !HAS_SMALL.test(src)) return { src };
  return {
    src,
    srcSet: `${src.replace(/\.webp$/, '-sm.webp')} 800w, ${src} 1600w`,
    sizes,
  };
}

// Stone photos from the admin panel have a 640 px copy (`thumb`) and, since 2026-11-18, a
// 320 px one (`mini`). Cards pass both so the browser takes the smaller one when it is enough;
// tiny swatches just use the smallest.
export function stoneImgProps(f, sizes) {
  if (!f) return {};
  const src = f.thumb || f.link;
  if (!f.mini || !f.thumb) return { src };
  return { src, srcSet: `${f.mini} 320w, ${f.thumb} 640w`, sizes };
}

export const smallestStonePhoto = (f) => f?.mini || f?.thumb || f?.link;
