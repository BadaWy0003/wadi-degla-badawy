'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { useTranslation } from 'react-i18next';
import { finishLabel } from '../../util/finishes';

export default function Product({ item }) {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  // Find the "Honed" finish or fallback to "Polished"
  const honedFinish = item.finishes?.find((finish) => finish.finish === 'Honed');
  const polishedFinish = item.finishes?.find((finish) => finish.finish === 'Polished');
  const selectedFinish = honedFinish || polishedFinish; // Use "Honed" if available, otherwise "Polished"

  // If neither finish is available, return null or a placeholder
  if (!selectedFinish) {
    return null;
  }

  return (
    <div
      className="product-card-2"
      onClick={() => {
        sessionStorage.setItem('selectedCategory', item.type); // Save the current category
        // Convert product name to URL-friendly format
        const urlName = item.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        router.push(`/${lang}/products/${urlName}`);
        window.scrollTo({ top: 0 });
      }}
    >
      <div className="img-div-2">
        <img
          loading="lazy"
          src={selectedFinish.link}
          alt={`${item.name} - ${finishLabel(t, selectedFinish.finish)}`}
        />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}
