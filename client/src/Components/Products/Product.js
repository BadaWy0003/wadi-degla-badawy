import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({ item }) {
  const navigate = useNavigate();
  const polishedFinish = item.finish.find(finish => finish.finishName === 'Polished');

  return (
    <div
      className="product-card-2"
      onClick={() => {navigate(`/products/${item.id}`);window.scrollTo({top: 0});}}
    >
      <div className='img-div-2'>
        <img src={polishedFinish.imageUrl} alt={item.name} />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}
