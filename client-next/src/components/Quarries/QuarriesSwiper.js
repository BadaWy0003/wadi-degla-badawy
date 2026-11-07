'use client';
import React, { useRef, useState } from 'react';
import './Quarries.css';
import '../Projects/ProjectDetails.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { cardImageProps } from '../../util/responsive-img';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';

const loadQuarriesSlider = () => import('./QuarriesSlider');
const loadPhotoZoom = () => import('../PhotoZoom');

// A photo slider of the Quarries page. The slider code loads when it comes near the screen
// (until then: the same markup without Swiper, so the same size, and every photo with its alt
// text stays in the page for Google); the zoom viewer loads on the first click.
export default function QuarriesSwiper({ images, alt = '' }) {
  const ref = useRef(null);
  const QuarriesSlider = useLazyComponent(useNearScreen(ref), loadQuarriesSlider);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoomWanted, setZoomWanted] = useState(false);
  const PhotoZoom = useLazyComponent(zoomWanted, loadPhotoZoom);

  const openPhoto = (i) => {
    setIndex(i);
    setZoomWanted(true);
    setOpen(true);
  };

  return (
    <>
      {/* No wrapper element: the slider must stay a direct child of the card (flex layout). */}
      {QuarriesSlider ? (
        <QuarriesSlider images={images} alt={alt} onOpen={openPhoto} />
      ) : (
        <div className="swiper quarries-slider" ref={ref}>
          <div className="swiper-wrapper">
            {images.map((image, i) => (
              <div className="swiper-slide" key={i} onClick={() => openPhoto(i)}>
                <img
                  loading="lazy"
                  {...cardImageProps(image, '(max-width: 768px) 100vw, 800px')}
                  alt={`${alt} ${i + 1}`.trim()}
                  className="swiper-lazy"
                />
                <div className="swiper-lazy-preloader"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {PhotoZoom && (
        <PhotoZoom
          open={open}
          close={() => setOpen(false)}
          slides={images.map((src) => ({ src }))}
          index={index}
        />
      )}
    </>
  );
}
