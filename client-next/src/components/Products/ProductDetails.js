'use client';
import React, { useState, useEffect } from "react";
import "./Products.css";
import LangLink from '../LangLink';
const block = '/Assets/Icons/product-icons/block.svg';
const exterior_cladding = '/Assets/Icons/product-icons/exterior-cladding.svg';
const landscaping = '/Assets/Icons/product-icons/landscaping.svg';
const slabs = '/Assets/Icons/product-icons/slabs.svg';
const staircase = '/Assets/Icons/product-icons/staircase.svg';
const wall_cladding = '/Assets/Icons/product-icons/wall-cladding.svg';
const windowsills = '/Assets/Icons/product-icons/windowsills.svg';
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
  }, [productName, router, lang]);

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
    {/* */}


    <div className="product-details-page">
      <div className="breadcrumb">
        <LangLink href="/">{t('productDetails.breadcrumbHome')}</LangLink>
        <p>{">"} {t('productDetails.breadcrumbExplore')}</p>
        <LangLink href="/products">{">"}  {t('productDetails.breadcrumbProducts')}</LangLink>
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