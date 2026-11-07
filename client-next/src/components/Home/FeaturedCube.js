'use client';
// The featured stones cube slider. Loaded by FeaturedProducts only when the section is near
// the screen (Swiper is ~31 KB gzipped).
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { finishLabel } from '../../util/finishes';

export default function FeaturedCube({ featuredProducts, setActiveProduct }) {
  const { t } = useTranslation();
  return (
    <Swiper
      effect={'cube'}
      grabCursor={true}
      loop={true}
      cubeEffect={{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }}
      pagination={{
        clickable: true,
        el: '.swiper-custom-pagination'
      }}
      navigation={{
        nextEl: '.swiper-custom-button-next',
        prevEl: '.swiper-custom-button-prev'
      }}
      modules={[EffectCube, Pagination, Navigation, Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      className="featured-cube-swiper"
      onSlideChange={(swiper) => {
        const realIndex = swiper.realIndex;
        setActiveProduct(featuredProducts[realIndex]);
      }}
      onInit={(swiper) => {
        setActiveProduct(featuredProducts[0]);
      }}
    >
      {featuredProducts.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="featured-cube-slide">
          {(() => {
            const honedFinish = item.finishes.find(finish => finish.finish === 'Honed');
            const polishedFinish = item.finishes.find(finish => finish.finish === 'Polished');
            const selectedFinish = honedFinish || polishedFinish; // Use "Honed" if available, otherwise "Polished"

            return selectedFinish ? (
              <img loading="lazy" 
                src={selectedFinish.thumb || selectedFinish.link} 
                alt={`${item.name} - ${finishLabel(t, selectedFinish.finish)}`} 
              />
            ) : null;
          })()}

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
