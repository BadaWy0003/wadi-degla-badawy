'use client';
import React, { useRef } from 'react';
import './Section.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import '../Projects/ProjectDetails.css';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';
import usePhotoZoom from '../usePhotoZoom';

const loadSlider = () => import('./SectionSlider');

// A text block with a photo slider. The slider code loads when it comes near the screen (until
// then: the same markup without Swiper, so the same size); the zoom viewer loads on the first
// click.
export default function Section({ title, text, images, imagePosition = 'left', alt }) {
  // Photo description for Google/screen readers: the section title unless given.
  const altBase = alt || (typeof title === 'string' ? title : '');
  const ref = useRef(null);
  const Slider = useLazyComponent(useNearScreen(ref), loadSlider);
  const [openPhoto, zoom] = usePhotoZoom();

  return (
    <>
      <div className="section-container">
        <div className={`section-content ${imagePosition === 'right' ? 'reverse' : ''}`}>
          <div className="image-container">
            {Slider ? (
              <Slider images={images} altBase={altBase} onOpen={openPhoto} />
            ) : (
              <div className="swiper" ref={ref}>
                <div className="swiper-wrapper">
                  {images.map((image, idx) => (
                    <div className="swiper-slide" key={idx} onClick={() => openPhoto(idx)}>
                      <img loading="lazy" src={image} alt={`${altBase} ${idx + 1}`.trim()} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="text-container">
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
        </div>
      </div>

      {zoom(images.map((src) => ({ src })))}
    </>
  );
}
