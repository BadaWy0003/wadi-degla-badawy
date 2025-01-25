import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({ item }) {
  const navigate = useNavigate();
  // Find the "Polished" finish
  const polishedFinish = item.finishes.find(finish => finish.finish === 'Polished');

  // If "Polished" finish is not found, do not render the product or handle it accordingly
  if (!polishedFinish) {
    return null; // or you can return a placeholder or a message
  }

  return (
    <div
      className="product-card-2"
      onClick={() => {
        navigate(`/products/${item.id}`);
        window.scrollTo({top: 0});
      }}
    >
      <div className='img-div-2'>
        <img src={polishedFinish.link} alt={item.name} />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}
