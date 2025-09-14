import React, { useState, useEffect } from "react";
import apiClient from "../../util/client.js";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';

export default function RoutesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/api/storage/all`);
      if (data.data) {
        setData(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const productRoutes = data.map(product => 
    `/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
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
        <pre style={{ 
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {productRoutes.map(route => `"${route}",\n`).join('')}
        </pre>
      </div>
    </div>
  );
}