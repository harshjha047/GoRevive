import React from 'react';

const BrandImage = ({ type, className = 'w-10 h-10' }) => {
  // Normalize the brand name to lowercase for easier matching
  const normalizedType = (type || '').toLowerCase();

  // You can replace these placeholder logo URLs with your actual brand logo links
  const BrandImages = {
    'apple': "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    'dell': "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    'hp': "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
    'lenovo': "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
    'samsung': "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    'asus': "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    'acer': "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg",
    'microsoft': "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  };

  // Safe fallback if the backend returns a brand you haven't mapped yet
  const imageUrl = BrandImages[normalizedType] || `https://placehold.co/400x400/f3f4f6/a1a1aa?text=${type || 'Brand'}`;

  return (
    <img 
      src={imageUrl} 
      className={className} 
      alt={`${type || 'Brand'} logo`}
      loading="lazy"
    />
  );
};

export default BrandImage;