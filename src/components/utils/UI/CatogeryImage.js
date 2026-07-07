import React from 'react';

const CatogeryImage = ({ type, className = 'w-6 h-6' }) => {
  const CatogeryImages = {
    'monitor': "https://i.pinimg.com/1200x/ed/d9/7e/edd97e9ae42341e9d56869e70563a70c.jpg",
    'tablets': "https://i.pinimg.com/1200x/a6/7a/7f/a67a7f097686372eb34c4c09152c638f.jpg",
    'laptop': "https://i.pinimg.com/736x/d1/ca/1a/d1ca1a21dd210edc863e9a562b1a5ed6.jpg",
    'macbook': "https://i.pinimg.com/1200x/ba/fe/23/bafe23ae31ee08316ef4f5964f40a05d.jpg",
    'desktop': "https://i.pinimg.com/736x/26/31/16/263116ff7f3d5af1e08a47f4a8231a73.jpg",
    'imac': "https://i.pinimg.com/736x/31/f7/f9/31f7f9b6dbbf109ad6cebb42969bb644.jpg",
    'servers': "https://i.pinimg.com/736x/14/ed/46/14ed46d2f1e02c08042f6361e6ea7c33.jpg",
    'mobiles': "https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg",
    'iphone': "https://i.pinimg.com/1200x/18/84/24/1884248df0286062436ea23d29ef5183.jpg",
    'smart phone': "https://i.pinimg.com/736x/24/22/32/24223258deb2711a6cfb6ffe2ba3b5e9.jpg",
    'tiny desktop': "/mini.svg",
  };

  // Safe fallback just in case the backend returns an unknown category
  const imageUrl = CatogeryImages[type] || "https://placehold.co/400x400/f3f4f6/a1a1aa?text=Category";

  return (
    <img 
      src={imageUrl} 
      className={className} 
      alt={`${type || 'Category'}`}
      loading="lazy"
    />
  );
};

export default CatogeryImage;