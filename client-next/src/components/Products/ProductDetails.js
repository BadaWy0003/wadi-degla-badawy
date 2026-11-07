'use client';
import React, { useState, useEffect } from 'react';
import './Products.css';
import LangLink from '../LangLink';
const block = '/Assets/Icons/product-icons/block.svg';
const exterior_cladding = '/Assets/Icons/product-icons/exterior-cladding.svg';
const landscaping = '/Assets/Icons/product-icons/landscaping.svg';
const slabs = '/Assets/Icons/product-icons/slabs.svg';
const staircase = '/Assets/Icons/product-icons/staircase.svg';
const wall_cladding = '/Assets/Icons/product-icons/wall-cladding.svg';
const windowsills = '/Assets/Icons/product-icons/windowsills.svg';
import apiClient from '../../util/client.js';
import ContactBubble from '../Contact/ContactBubble.js';
import SampleRequestForm from './SampleRequestForm';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { useParams } from 'next/navigation';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { CATEGORY_TOPIC } from '../../util/topic-pages';
import { finishLabel } from '../../util/finishes';
import { productSlug } from '../../util/product-slugs';
import Product from './Product';
import { cardImageProps } from '../../util/responsive-img';

// Default finish: "Polished" if available, else the first one.
const defaultFinish = (product) =>
  product?.finishes?.find((f) => f.finish === 'Polished') || product?.finishes?.[0] || null;

// initialProduct comes from the server at build time (so the page HTML has the product for
// Google); it is refreshed from the API below so admin-panel changes still show up.
// seo (built at build time by the page, see src/util/product-seo.js): the search-friendly
// heading ("Galala Marble"), a short description from the product's data, related stones
// and the projects that used this stone. Shown under the product, as plain text and links.
export default function ProductDetails({ initialProduct = null, seo = null }) {
  const { t } = useTranslation();
  const { productName } = useParams();
  const router = useRouter();
  const lang = useLang();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedFinish, setSelectedFinish] = useState(() => defaultFinish(initialProduct));
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProductFromAll = async () => {
      try {
        // Fetch all products
        const { data } = await apiClient.get(`/api/storage/all`);

        if (data.data) {
          // Find the product: by id when the page was built with it (so a product renamed
          // in the admin panel keeps working until the next deploy), else by its address.
          const foundProduct =
            (initialProduct?.id && data.data.find((p) => p.id === initialProduct.id)) ||
            data.data.find((p) => productSlug(p.name) === productName);
          if (foundProduct) {
            setProduct(foundProduct);
            if (initialProduct) {
              // Keep the finish already shown, if it still exists in the fresh data.
              setSelectedFinish(
                (current) =>
                  foundProduct.finishes.find((f) => f.finish === current?.finish) ||
                  defaultFinish(foundProduct),
              );
              return;
            }
            // Set default finish to "Polished" or the first finish if "Polished" doesn't exist
            const polishedFinish = foundProduct.finishes.find((f) => f.finish === 'Polished');
            if (polishedFinish) {
              setSelectedFinish(polishedFinish);
            } else if (foundProduct.finishes.length > 0) {
              setSelectedFinish(foundProduct.finishes[0]);
            } else {
              throw new Error('No finishes available for this product');
            }
          } else {
            throw new Error('Product not found');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        // If the API is unreachable but we already have the product from the build, keep showing it.
        if (initialProduct && error.message !== 'Product not found') return;
        router.push(`/${lang}/products`);
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchProductFromAll();
    } else {
      router.push(`/${lang}/products`);
    }
  }, [productName, router, lang, initialProduct]);

  const applicationIcons = [
    { src: block, name: 'Block' },
    { src: exterior_cladding, name: 'Exterior Cladding' },
    { src: landscaping, name: 'Landscaping' },
    { src: slabs, name: 'Slabs' },
    { src: staircase, name: 'Staircase' },
    { src: wall_cladding, name: 'Wall Cladding' },
    { src: windowsills, name: 'Window Sills' },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div className="error-message">{t('productDetails.notFound')}</div>;
  }

  return (
    <>
      {/* */}

      <div className="product-details-page">
        <div className="breadcrumb">
          <LangLink href="/">{t('productDetails.breadcrumbHome')}</LangLink>
          <p>
            {'>'} {t('productDetails.breadcrumbExplore')}
          </p>
          <LangLink href="/products">
            {'>'} {t('productDetails.breadcrumbProducts')}
          </LangLink>
          <p>
            {'>'} {product.name}
          </p>
        </div>

        <div className="product-details-container">
          <div className="details-left">
            {/* The page's main photo: loaded first, and width/height (most stone photos are 3:2)
                reserve its space so the page doesn't jump when it appears */}
            <img
              fetchPriority="high"
              width={1200}
              height={800}
              src={selectedFinish?.link}
              // phones download the small copy (640 px) when there is one
              {...(selectedFinish?.thumb
                ? {
                    srcSet: `${selectedFinish.thumb} 640w, ${selectedFinish.link} 1600w`,
                    sizes: '(max-width: 768px) 100vw, 45vw',
                  }
                : {})}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="details-right">
            <h1 className="details-title">{seo?.heading || product.name}</h1>
            {seo?.details?.otherNames?.length > 0 && (
              <p className="details-aka">
                {t('productDetails.alsoKnownAs')}: {seo.details.otherNames.join(', ')}
              </p>
            )}

            <div className="info-grid">
              <div className="info-label">{t('productDetails.category')}</div>
              <div className="info-value" style={{ color: 'var(--blueColor)' }}>
                {/* links to the category's own page (e.g. /egyptian-marble/) */}
                {CATEGORY_TOPIC[product.type] ? (
                  <LangLink
                    href={`/${CATEGORY_TOPIC[product.type]}/`}
                    className="category-topic-link"
                  >
                    {t(PRODUCT_TYPE_KEYS[product.type])}
                  </LangLink>
                ) : PRODUCT_TYPE_KEYS[product.type] ? (
                  t(PRODUCT_TYPE_KEYS[product.type])
                ) : (
                  product.type
                )}
              </div>

              <div className="info-label">{t('productDetails.finish')}</div>
              <div className="info-value">
                <select
                  className="modal-select"
                  value={selectedFinish?.finish || ''}
                  onChange={(e) => {
                    const newFinish = product.finishes.find((f) => f.finish === e.target.value);
                    setSelectedFinish(newFinish);
                  }}
                >
                  {product.finishes
                    .filter(
                      (finish) =>
                        !['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'].includes(
                          finish.finish,
                        ),
                    )
                    .map((finish) => (
                      <option key={finish.finish} value={finish.finish}>
                        {finishLabel(t, finish.finish)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="applications-section">
              <h3>{t('productDetails.applications')}</h3>
              <div className="applications-grid">
                {/* only the forms/uses that apply, once they were set in the admin panel */}
                {applicationIcons
                  .filter((app) => !seo?.details?.icons || seo.details.icons.includes(app.name))
                  .map((app, index) => (
                    <div key={index} className="application-icon-wrapper">
                      {/* one translated name (the English one used to be shown on top of it) */}
                      <img
                        loading="lazy"
                        src={app.src}
                        alt={t(
                          `productDetails.applications_${app.name.replace(/\s+/g, '').toLowerCase()}`,
                        )}
                        className="application-icon"
                      />
                      <div className="hover-name">
                        {t(
                          `productDetails.applications_${app.name.replace(/\s+/g, '').toLowerCase()}`,
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              className="btn1"
              onClick={() => setIsFormOpen(true)}
              style={{ width: '100%', marginTop: '2rem' }}
            >
              {t('productDetails.requestSample')}
            </button>
            <SampleRequestForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              productName={product.name}
              productFinish={selectedFinish?.finish}
              productFinishLabel={finishLabel(t, selectedFinish?.finish)}
            />
          </div>
        </div>

        {seo && (
          <div className="product-seo">
            <div className="product-seo-intro">
              {seo.intro.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>

            {(seo.details?.specs?.length > 0 || seo.details?.uses?.length > 0) && (
              <div className="product-seo-block product-specs">
                {seo.details.specs.length > 0 && (
                  <>
                    <h2>{t('productDetails.specsTitle')}</h2>
                    <dl className="product-specs-table">
                      {seo.details.specs.map((row) => (
                        <div key={row.label}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
                {seo.details.uses.length > 0 && (
                  <>
                    <h2>{t('productDetails.usesTitle')}</h2>
                    <ul className="product-uses">
                      {seo.details.uses.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {seo.projects.length > 0 && (
              <div className="product-seo-block">
                <h2>{t('productDetails.usedInProjects').replace('{{heading}}', seo.heading)}</h2>
                <ul className="product-seo-projects">
                  {seo.projects.map((p) => (
                    <li key={p.id}>
                      <LangLink href={`/projects/${p.id}/`}>
                        <img loading="lazy" {...cardImageProps(p.thumbnail)} alt={p.name} />
                        <span>
                          <strong>{p.name}</strong>
                          {[p.city, p.country].filter(Boolean).join(' - ')}
                        </span>
                      </LangLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {seo.related.length > 0 && (
              <div className="product-seo-block">
                <h2>{t('productDetails.related').replace('{{type}}', seo.typeLabel)}</h2>
                <div className="product-cards-2 product-seo-related">
                  {seo.related.map((item) => (
                    <Product key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <ContactBubble />
      </div>
    </>
  );
}
