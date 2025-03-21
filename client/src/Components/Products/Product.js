import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({ item }) {
  const navigate = useNavigate();
  // Find the "honed" finish or fallback to "polished"
  const honedFinish = item.finishes.find(finish => finish.finish === 'Honed');
  const polishedFinish = item.finishes.find(finish => finish.finish === 'Polished');
  const selectedFinish = honedFinish || polishedFinish; // Use "Honed" if available, otherwise "Polished"
  
  // If neither finish is available, return null or a placeholder
  if (!selectedFinish) {
    return null;
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
