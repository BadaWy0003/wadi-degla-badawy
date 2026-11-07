'use client';
import React, { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../Projects/ProjectDetails.css';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';
import usePhotoZoom from '../usePhotoZoom';

const loadSlider = () => import('./MachinerySlider');

// One machine with its photos. The slider code loads when it comes near the screen (until then:
// the same markup without Swiper, so the same size); the zoom viewer loads on the first click.
export default function MachinerySwiper({ images, title, description }) {
  const ref = useRef(null);
  const Slider = useLazyComponent(useNearScreen(ref), loadSlider);
  const [openPhoto, zoom] = usePhotoZoom();

  return (
    <div className="machinery-item">
      <h3>{title}</h3>
      {description && <p className="machinery-description">{description}</p>}
      {Slider ? (
        <Slider images={images} title={title} onOpen={openPhoto} />
      ) : (
        <div className="swiper machinery-slider" ref={ref}>
          <div className="swiper-wrapper">
            {images.map((image, i) => (
              <div className="swiper-slide" key={i} onClick={() => openPhoto(i)}>
                <img loading="lazy" src={image} alt={`${title} ${i + 1}`} className="swiper-lazy" />
                <div className="swiper-lazy-preloader"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {zoom(images.map((src) => ({ src })))}
    </div>
  );
}
