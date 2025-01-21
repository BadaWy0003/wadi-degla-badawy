import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import block from "../../Public/Assets/Icons/product-icons/block.svg";
import exterior_cladding from "../../Public/Assets/Icons/product-icons/exterior-cladding.svg";
import landscaping from "../../Public/Assets/Icons/product-icons/landscaping.svg";
import slabs from "../../Public/Assets/Icons/product-icons/slabs.svg";
import staircase from "../../Public/Assets/Icons/product-icons/staircase.svg";
import wall_cladding from "../../Public/Assets/Icons/product-icons/wall-cladding.svg";
import windowsills from "../../Public/Assets/Icons/product-icons/windowsills.svg";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFinish, setSelectedFinish] = useState(null);

  useEffect(() => {
    const fetchProductFromAll = async () => {
      try {
        // Fetch all products
        const { data } = await apiClient.get(`/api/storage/all`);

        if (data.data) {
          // Find the specific product by ID
          const foundProduct = data.data.find((p) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            // Set default finish
            const polishedFinish =
              foundProduct.finishes.find((f) => f.finish === "Polished") ||
              foundProduct.finishes[0];
            setSelectedFinish(polishedFinish);
          } else {
            throw new Error("Product not found");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductFromAll();
    } else {
      navigate("/products");
    }
  }, [productId, navigate]);

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
    return <div className="loading-message">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <p>{">"} Explore</p>
        <a href="/products">{">"} Products</a>
        <p>
          {">"} {product.name}
        </p>
      </div>

      <div className="product-details-container">
        <div className="details-left">
          <img
            src={selectedFinish?.link}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="details-right">
          <h1 className="details-title">{product.name}</h1>

          <div className="info-grid">
            <div className="info-label">Category:</div>
            <div className="info-value" style={{ color: "var(--blueColor)" }}>
              {product.type}
            </div>

            <div className="info-label">Finish:</div>
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
            <h3>Applications</h3>
            <div className="applications-grid">
              {applicationIcons.map((app, index) => (
                <div key={index} className="application-icon-wrapper">
                  <img
                    src={app.src}
                    alt={app.name}
                    className="application-icon"
                  />
                  <div className="hover-name">{app.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn1"
            onClick={() => navigate("/contact")}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            Request a Sample
          </button>
        </div>
      </div>
    </div>
  );
}
