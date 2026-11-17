'use client';
import React, { useState, useEffect } from 'react';
import './Products.css';
import './ProductDetailsPage.css';
import { WHATSAPP_URL } from '../Contact/contactData';
import { FaWhatsapp } from 'react-icons/fa';
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
import { normalizeProducts } from '../../util/product-types';
import { EXPORT_COUNTRIES_LABEL } from '../../util/company';

// Photos of the stone in a room; shown as "in a space" photos, not as finishes.
const ROOM_FINISHES = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];
// The short facts shown next to the photo (translation keys of their labels).
const QUICK_SPECS = ['specOrigin', 'specForms', 'specThickness', 'specSizes'];
// Export countries, also in the home page's trust strip (Home.js): keep both the same.
// "31+": the export-country number from the admin panel (src/util/company.js)
const EXPORT_COUNTRIES = EXPORT_COUNTRIES_LABEL;

// Default finish: "Polished" if available, else the first one (never a room photo).
const defaultFinish = (product) =>
  product?.finishes?.find((f) => f.finish === 'Polished') ||
  product?.finishes?.find((f) => !ROOM_FINISHES.includes(f.finish)) ||
  product?.finishes?.[0] ||
  null;

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
  // a room photo (interior/exterior) shown in the big frame instead of the finish photo
  const [roomPhoto, setRoomPhoto] = useState(null);

  useEffect(() => {
    const fetchProductFromAll = async () => {
      try {
        // Fetch all products
        const { data } = await apiClient.get(`/api/storage/all`);

        if (data.data) {
          data.data = normalizeProducts(data.data);
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
            const finish = defaultFinish(foundProduct);
            if (!finish) throw new Error('No finishes available for this product');
            setSelectedFinish(finish);
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

  const k = (key, vars = {}) =>
    Object.entries(vars).reduce(
      (text, [name, value]) => text.replaceAll(`{{${name}}}`, value),
      t(`productDetails.${key}`),
    );
  const heading = seo?.heading || product.name;
  const finishes = product.finishes.filter((f) => !ROOM_FINISHES.includes(f.finish));
  const rooms = [
    ['indoorMockup', 'mockup'],
    ['outdoorMockup', 'mockupOutdoor'],
  ]
    .map((names, i) => {
      const photo = product.finishes.find((f) => names.includes(f.finish));
      return photo && { ...photo, label: k(i === 0 ? 'interior' : 'exterior') };
    })
    .filter(Boolean);
  const shown = roomPhoto || selectedFinish;
  const typeLabel = PRODUCT_TYPE_KEYS[product.type] ? t(PRODUCT_TYPE_KEYS[product.type]) : product.type;
  const specs = seo?.details?.specs || [];
  // the four short facts next to the photo (origin, available as, thickness, sizes)
  const quick = specs.filter((row) => QUICK_SPECS.some((key) => row.label === t(`productDetails.${key}`)));
  // uses set in the admin panel, else the general application names
  const uses = seo?.details?.uses?.length
    ? seo.details.uses
    : applicationIcons
        .filter((app) => !seo?.details?.icons || seo.details.icons.includes(app.name))
        .map((app) => t(`productDetails.applications_${app.name.replace(/\s+/g, '').toLowerCase()}`));
  const openSample = () => setIsFormOpen(true);
  const whatsapp = (label, className) => (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={className}>
      <FaWhatsapp aria-hidden="true" /> {label}
    </a>
  );

  return (
    <div className="spd">
      <div className="spd-wrap">
        <div className="spd-crumb">
          <LangLink href="/">{t('productDetails.breadcrumbHome')}</LangLink>
          <span aria-hidden="true">›</span>
          <LangLink href="/products">{t('productDetails.breadcrumbProducts')}</LangLink>
          {CATEGORY_TOPIC[product.type] && (
            <>
              <span aria-hidden="true">›</span>
              <LangLink href={`/${CATEGORY_TOPIC[product.type]}/`}>{typeLabel}</LangLink>
            </>
          )}
          <span aria-hidden="true">›</span>
          <span className="spd-crumb-here">{product.name}</span>
        </div>

        <div className="spd-top">
          <div className="spd-media">
            <div className="spd-main">
              {/* The page's main photo: loaded first, and width/height (most stone photos are 3:2)
                  reserve its space so the page doesn't jump when it appears */}
              <img
                fetchPriority="high"
                width={1200}
                height={800}
                src={shown?.link}
                // phones download the small copy (640 px) when there is one
                {...(shown?.thumb
                  ? {
                      srcSet: `${shown.thumb} 640w, ${shown.link} 1600w`,
                      sizes: '(max-width: 768px) 100vw, 55vw',
                    }
                  : {})}
                alt={
                  roomPhoto
                    ? `${heading} - ${roomPhoto.label}`
                    : `${heading} - ${finishLabel(t, selectedFinish?.finish)}`
                }
              />
            </div>
            {rooms.length > 0 && (
              <div className="spd-thumbs">
                <button
                  type="button"
                  className={!roomPhoto ? 'is-on' : ''}
                  onClick={() => setRoomPhoto(null)}
                  aria-label={finishLabel(t, selectedFinish?.finish)}
                >
                  <img loading="lazy" fetchPriority="low" src={selectedFinish?.thumb || selectedFinish?.link} alt="" />
                </button>
                {rooms.map((room) => (
                  <button
                    type="button"
                    key={room.finish}
                    className={roomPhoto?.finish === room.finish ? 'is-on' : ''}
                    onClick={() => setRoomPhoto(room)}
                    aria-label={room.label}
                  >
                    <img loading="lazy" fetchPriority="low" src={room.thumb || room.link} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="spd-panel">
            <p className="spd-eyebrow">{typeLabel}</p>
            <h1 className="spd-title">{heading}</h1>
            {seo?.details?.otherNames?.length > 0 && (
              <p className="spd-aka">
                {t('productDetails.alsoKnownAs')}: {seo.details.otherNames.join(', ')}
              </p>
            )}

            {finishes.length > 0 && (
              <>
                <p className="spd-label">
                  {t('productDetails.finish')} <b>{finishLabel(t, selectedFinish?.finish)}</b>
                  {finishes.length > 1 && <> · {k('finishesCount', { count: finishes.length })}</>}
                </p>
                <div className="spd-finishes">
                  {finishes.map((f) => (
                    <button
                      type="button"
                      key={f.finish}
                      className={`spd-finish${!roomPhoto && selectedFinish?.finish === f.finish ? ' is-on' : ''}`}
                      onClick={() => {
                        setSelectedFinish(f);
                        setRoomPhoto(null);
                      }}
                      aria-pressed={selectedFinish?.finish === f.finish}
                    >
                      <img loading="lazy" fetchPriority="low" src={f.thumb || f.link} alt="" />
                      <span>{finishLabel(t, f.finish)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {quick.length > 0 && (
              <dl className="spd-quick">
                {quick.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {whatsapp(k('ctaPrice'), 'spd-btn spd-btn-gold')}
            <button type="button" className="spd-btn spd-btn-line" onClick={openSample}>
              {k('ctaSample')}
            </button>
            <ul className="spd-trust">
              <li>{k('trustSamples')}</li>
              <li>{k('trustSince')}</li>
              <li>{k('trustCountries', { count: EXPORT_COUNTRIES })}</li>
            </ul>
          </div>
        </div>

        <div className="spd-about">
          <section>
            <h2>{k('aboutTitle', { name: heading })}</h2>
            {(seo?.intro || []).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </section>
          {uses.length > 0 && (
            <section>
              <h2>{t('productDetails.usesTitle')}</h2>
              <ul className="spd-chips">
                {uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {specs.length > 0 && (
          <section className="spd-section">
            <h2>{t('productDetails.specsTitle')}</h2>
            <dl className="spd-specs">
              {specs.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {rooms.length > 0 && (
          <section className="spd-section">
            <h2>{k('inSpaceTitle', { name: heading })}</h2>
            <div className="spd-rooms">
              {rooms.map((room) => (
                <figure key={room.finish}>
                  <img
                    loading="lazy"
                    src={room.link}
                    {...(room.thumb
                      ? { srcSet: `${room.thumb} 640w, ${room.link} 1600w`, sizes: '(max-width: 768px) 100vw, 50vw' }
                      : {})}
                    alt={`${heading} - ${room.label}`}
                  />
                  <figcaption>{room.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {seo?.projects?.length > 0 && (
          <section className="spd-section">
            <h2>{t('productDetails.usedInProjects').replace('{{heading}}', heading)}</h2>
            <ul className="spd-projects">
              {seo.projects.map((p) => (
                <li key={p.id}>
                  <LangLink href={`/projects/${p.id}/`}>
                    <img loading="lazy" {...cardImageProps(p.thumbnail)} alt={p.name} />
                    <span>
                      <strong>{p.name}</strong>
                      {[p.city, p.country].filter(Boolean).join(' · ')}
                    </span>
                  </LangLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {seo?.related?.length > 0 && (
          <section className="spd-section">
            <h2>{t('productDetails.related').replace('{{type}}', seo.typeLabel)}</h2>
            <div className="spd-related">
              {seo.related.map((item) => (
                <Product key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="spd-band">
        <div className="spd-wrap">
          <div>
            <h2>{k('bandTitle', { name: heading })}</h2>
            <p>{k('bandText')}</p>
          </div>
          {whatsapp(k('bandCta'), 'spd-btn spd-btn-gold')}
        </div>
      </div>

      {/* phones: price / sample buttons stay at the bottom of the screen */}
      <div className="spd-sticky">
        {whatsapp(k('ctaPriceShort'), 'spd-btn spd-btn-gold')}
        <button type="button" className="spd-btn spd-btn-line" onClick={openSample}>
          {k('ctaSampleShort')}
        </button>
      </div>

      <SampleRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productName={product.name}
        productFinish={selectedFinish?.finish}
        productFinishLabel={finishLabel(t, selectedFinish?.finish)}
      />
      <ContactBubble />
    </div>
  );
}
