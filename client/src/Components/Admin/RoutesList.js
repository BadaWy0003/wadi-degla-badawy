import React, { useState, useEffect } from "react";
import apiClient from "../../util/client.js";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';

export default function RoutesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Egyptian Marble",
    "Imported Marble",
    "Egyptian Granite",
    "Imported Granite"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/api/storage/all`);
      if (data.data) {
        // Filter only products from the main categories
        const filteredProducts = data.data.filter(product => 
          categories.includes(product.type)
        );
        setData(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

const productRoutes = data.map(product => 
    `"/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}",`
  );
  
  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Routes List</h1>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '5px',
        margin: '20px 0'
      }}>
        <p>Copy these routes into package.json reactSnap.routes array:</p>
        <pre style={{ 
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '4px'
        }}>
          {productRoutes.join('\n')}
        </pre>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Total products found: {productRoutes.length}</p>
        <p>Categories included: {categories.join(', ')}</p>
      </div>
    </div>
  );
}