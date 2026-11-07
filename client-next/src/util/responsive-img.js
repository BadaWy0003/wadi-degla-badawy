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
