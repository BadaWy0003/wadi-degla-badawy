'use client';
import React from 'react';
import LangLink from '../LangLink';
import { productSlug } from '../../util/product-slugs';
import { useTranslation } from 'react-i18next';
import { finishLabel } from '../../util/finishes';
import { stoneImgProps } from '../../util/responsive-img';

export default function Product({ item }) {
  const { t } = useTranslation();
  // Find the "Honed" finish or fallback to "Polished"
  const honedFinish = item.finishes?.find((finish) => finish.finish === 'Honed');
  const polishedFinish = item.finishes?.find((finish) => finish.finish === 'Polished');
  const selectedFinish = honedFinish || polishedFinish; // Use "Honed" if available, otherwise "Polished"

  // If neither finish is available, return null or a placeholder
  if (!selectedFinish) {
    return null;
  }

  // A real link (not a click handler), so Google can follow it to the product page.
  return (
    <LangLink
      href={`/products/${productSlug(item.name)}`}
      className="product-card-2"
      onClick={() => sessionStorage.setItem('selectedCategory', item.type)} // remembered for "back"
    >
      <div className="img-div-2">
        <img
          loading="lazy"
          {...stoneImgProps(selectedFinish, '(max-width: 768px) 40vw, 280px')}
          alt={`${item.name} - ${finishLabel(t, selectedFinish.finish)}`}
        />
      </div>
      <h3>{item.name}</h3>
    </LangLink>
  );
}
