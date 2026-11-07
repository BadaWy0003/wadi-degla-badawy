'use client';
// Shared outer part of the Inspiration sliders: the slider code loads when it comes near the
// screen (until then: the same markup without Swiper, at the same fixed height); the zoom
// viewer loads on the first click.
import React, { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Inspiration.css';
import '../Projects/ProjectDetails.css';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';
import usePhotoZoom from '../usePhotoZoom';

const loadSlider = () => import('./InspoSlider');

export default function LazyInspoSlider({ kind, images, alt = '' }) {
  const ref = useRef(null);
  const Slider = useLazyComponent(useNearScreen(ref), loadSlider);
  const [openPhoto, zoom] = usePhotoZoom();
  const coverflow = kind === 'coverflow';

  return (
    <div className="inspo-swiper-container">
      {/* Hint Text for Small Screens */}
      <p className="inspo-hint">Tap on the image to view it in full size and swipe to navigate</p>

      {Slider ? (
        <Slider kind={kind} images={images} alt={alt} onOpen={openPhoto} />
      ) : (
        <div className={`swiper ${coverflow ? 'inspo-swiper' : 'ancient-swiper'}`} ref={ref}>
          <div className="swiper-wrapper">
            {images.map((image, index) => (
              <div
                className="swiper-slide"
                key={index}
                onClick={() => openPhoto(index)}
                style={coverflow ? undefined : { height: '100%' }}
              >
                <div className="swiper-slide-container">
                  <img
                    loading="lazy"
                    src={image}
                    alt={`${alt} ${index + 1}`.trim()}
                    className={coverflow ? undefined : 'swiper-lazy'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {zoom(images.map((src) => ({ src })))}
    </div>
  );
}
