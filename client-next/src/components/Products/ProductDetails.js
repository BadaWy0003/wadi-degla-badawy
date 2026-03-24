'use client';
import React, { useState, useEffect } from "react";
import "./Products.css";
import block from "../../Public/Assets/Icons/product-icons/block.svg";
import exterior_cladding from "../../Public/Assets/Icons/product-icons/exterior-cladding.svg";
import landscaping from "../../Public/Assets/Icons/product-icons/landscaping.svg";
import slabs from "../../Public/Assets/Icons/product-icons/slabs.svg";
import staircase from "../../Public/Assets/Icons/product-icons/staircase.svg";
import wall_cladding from "../../Public/Assets/Icons/product-icons/wall-cladding.svg";
import windowsills from "../../Public/Assets/Icons/product-icons/windowsills.svg";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";
import SampleRequestForm from './SampleRequestForm';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { useParams } from 'next/navigation';


export default function ProductDetails() {
  const { t } = useTranslation();
  const { productName } = useParams();
  const router = useRouter();
  const lang = useLang();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFinish, setSelectedFinish] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProductFromAll = async () => {
      try {
        // Fetch all products
        const { data } = await apiClient.get(`/api/storage/all`);

        if (data.data) {
          // Find the specific product by name
          const foundProduct = data.data.find((p) => {
            const urlName = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return urlName === productName;
          });
          if (foundProduct) {
            setProduct(foundProduct);
            // Set default finish to "Polished" or the first finish if "Polished" doesn't exist
            const polishedFinish = foundProduct.finishes.find(
              (f) => f.finish === "Polished"
            );
            if (polishedFinish) {
              setSelectedFinish(polishedFinish);
            } else if (foundProduct.finishes.length > 0) {
              setSelectedFinish(foundProduct.finishes[0]);
            } else {
              throw new Error("No finishes available for this product");
            }
          } else {
            throw new Error("Product not found");
          }
        }
      } catch (error) {
        console.error("Error:", error);
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
  }, [productName, navigate]);

  const applicationIcons = [
    { src: block, name: "Block" },
    { src: exterior_cladding, name: "Exterior Cladding" },
    { src: landscaping, name: "Landscaping" },
    { src: slabs, name: "Slabs" },
    { src: staircase, name: "Staircase" },
    { src: wall_cladding, name: "Wall Cladding" },
    { src: windowsills, name: "Window Sills" },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <div className="error-message">{t('productDetails.notFound')}</div>;
  }

  return (
    <>
    {/* <Helmet>
        <title>{product.name} | Wadidegla</title>
        <meta name="description" content={`Discover ${product.name} in our premium collection of ${product.type}. High-quality natural stone available. View specifications and request samples from Wadi Degla, your trusted source for luxury stone materials.`} />
        <link rel="canonical" href={`https://www.wadidegla-eg.com/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} />
    </Helmet> */}

<Helmet>
  <script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": selectedFinish?.link,
    "description": `High-quality ${product.name} from our premium collection of ${product.type}.`,
    "brand": {
      "@type": "Brand",
      "name": "Wadidegla"
    },
    "category": product.type
  })}
</script>

  <title>{t('productDetails.pageTitle', { name: product.name })}</title>
  <meta name="description" content={t('productDetails.metaDescription', { name: product.name, type: product.type })} />
    <link rel="canonical" href={`https://www.wadidegla-eg.com/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} />
    
    {/* Add these new meta tags */}
    <meta property="og:title" content={`${product.name} | Wadidegla`} />
    <meta property="og:description" content={`Discover ${product.name} in our premium collection of ${product.type}. High-quality natural stone available from Wadi Degla.`} />
    <meta property="og:image" content={selectedFinish?.link} />
    <meta property="og:url" content={`https://www.wadidegla-eg.com/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} />
    <meta property="og:type" content="product" />
    <meta name="robots" content="index, follow" />
    <link rel="alternate" hrefLang="en" href={`https://www.wadidegla-eg.com/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} />
</Helmet>


    <div className="product-details-page">
      <div className="breadcrumb">
        <a href="/">{t('productDetails.breadcrumbHome')}</a>
        <p>{">"} {t('productDetails.breadcrumbExplore')}</p>
        <a href="/products">{">"} {t('productDetails.breadcrumbProducts')}</a>
        <p>
          {">"} {product.name}
        </p>
      </div>

      <div className="product-details-container">
        <div className="details-left">
          <img loading="lazy"
            src={selectedFinish?.link}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="details-right">
          <h1 className="details-title">{product.name}</h1>

          <div className="info-grid">
            <div className="info-label">{t('productDetails.category')}</div>
            <div className="info-value" style={{ color: "var(--blueColor)" }}>
              {product.type}
            </div>

            <div className="info-label">{t('productDetails.finish')}</div>
            <div className="info-value">
              <select
                className="modal-select"
                value={selectedFinish?.finish || ""}
                onChange={(e) => {
                  const newFinish = product.finishes.find(
                    (f) => f.finish === e.target.value
                  );
                  setSelectedFinish(newFinish);
                }}
              >
                {product.finishes
                  .filter(
                    (finish) =>
                      ![
                        "indoorMockup",
                        "mockup",
                        "outdoorMockup",
                        "mockupOutdoor",
                      ].includes(finish.finish)
                  )
                  .map((finish) => (
                    <option key={finish.finish} value={finish.finish}>
                      {finish.finish}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="applications-section">
            <h3>{t('productDetails.applications')}</h3>
            <div className="applications-grid">
              {applicationIcons.map((app, index) => (
                <div key={index} className="application-icon-wrapper">
                  <img loading="lazy"
                    src={app.src}
                    alt={app.name}
                    className="application-icon"
                  />
                  <div className="hover-name">{app.name}</div>
                  <div className="hover-name">{t(`productDetails.applications_${app.name.replace(/\s+/g, '').toLowerCase()}`)}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn1"
            onClick={() => setIsFormOpen(true)}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            {t('productDetails.requestSample')}
          </button>
          <SampleRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productName={product.name}
        productFinish={selectedFinish?.finish}
      />

        </div>
      </div>
      <ContactBubble />

    </div>
    </>
  );
}