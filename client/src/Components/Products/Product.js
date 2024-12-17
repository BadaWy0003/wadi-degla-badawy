import React, { useState } from 'react';

export default function Product({ item, openModal }) {
  const [isHovered, setIsHovered] = useState(false);
  const polishedFinish = item.finish.find(finish => finish.finishName === 'Polished');

  return (
    <div
      className="product-card-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openModal(item)} // Trigger modal
    >
      <div className='img-div-2'>
        <img src={polishedFinish.imageUrl} alt={item.name} />
      </div>
      <h3>{item.name}</h3>
        </div>
     
    
  );
}
