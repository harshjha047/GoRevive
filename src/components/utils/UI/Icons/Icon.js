import React from 'react';

export const Icon = ({ type, className = 'w-6 h-6' }) => {
  const icons = {
    'networking': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" />    <path d="M2 12h8.5" />    <path d="M20 6V4a2 2 0 1 0-4 0v2" />    <rect width="8" height="5" x="14" y="6" rx="1" />  </g>),
    'monitor': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <rect width="20" height="14" x="2" y="3" rx="2" />    <line x1="8" x2="16" y1="21" y2="21" />    <line x1="12" x2="12" y1="17" y2="21" />  </g>),
    'tablets': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <rect width="10" height="14" x="3" y="8" rx="2" />    <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />    <path d="M8 18h.01" />  </g>),
    'storage': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <ellipse cx="12" cy="5" rx="9" ry="3" />    <path d="M3 5V19A9 3 0 0 0 21 19V5" />    <path d="M3 12A9 3 0 0 0 21 12" />  </g>),
    'components': (  <path    strokeLinecap="round"    strokeLinejoin="round"    strokeWidth={2}    d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"  />), 
    'keyboards': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <rect width="20" height="16" x="2" y="4" rx="2" />    <path d="M10 8h.01" />    <path d="M12 12h.01" />    <path d="M14 8h.01" />    <path d="M16 12h.01" />    <path d="M18 8h.01" />    <path d="M6 8h.01" />    <path d="M7 16h10" />    <path d="M8 12h.01" />  </g>),
    'accessories': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <path d="M2 20h20" />    <path d="m9 10 2 2 4-4" />    <rect x="3" y="4" width="18" height="12" rx="2" />  </g>),
    'workstations': (<g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>  <rect x="2" y="3" width="20" height="14" rx="2" />  <path d="M11 13a3 3 0 1 1 2.83-4H14a2 2 0 0 1 0 4z" />  <path d="M12 17v4M8 21h8" /></g>),
    'chevron-down': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />,
    'chevron-right': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />,
    'check': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    'star': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />,
    'menu': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />,
    'close': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    'user': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    'arrow-right': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />,
    'cpu': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />,
    'search': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    'wrench': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.888a2.5 2.5 0 10-3.535 3.536l6.364 6.364a2.5 2.5 0 003.535-3.536L8.228 9.888zM12 15a3 3 0 100-6 3 3 0 000 6z" />,
    'archive': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
    'calculator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v11a2 2 0 01-2 2z" />,
    'star-solid': <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />,
    'laptop': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17v-8a2 2 0 012-2h10a2 2 0 012 2v8M3 17h18" />,
    'macbook': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17v-8a2 2 0 012-2h10a2 2 0 012 2v8M3 17h18" />,
    'desktop': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h10M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />,
    'imac': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h10M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />,
    'servers': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />,
    'mobiles': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    'iphone': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    'clients': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    'team': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    'branches': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    'assets': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
    'facebook': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
    'instagram': <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>,
    'linkedin': <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></>,
    'phone': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>,
    'mail': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>,
    'tag': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7c0-1.1.9-2 2-2h2z"></path>,
    'certificate': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    'shopping-cart': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    'trash': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    'shield': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    'settings': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <circle cx="12" cy="12" r="3" />    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />  </g>),
    'globe': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <circle cx="12" cy="12" r="10" />    <path d="M2 12h20" />    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />  </g>),
    'award': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <circle cx="12" cy="8" r="7" />    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />  </g>),
    'leaf': (  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>    <path d="M11 20A7 7 0 014 13v-5a2 2 0 012-2h5a7 7 0 017 7v5a2 2 0 01-2 2h-5a7 7 0 01-7-7z" />    <path d="M11 20v-6" />  </g>)
  };

  const selectedIcon = icons[type];

  // Fallback in case a missing type is passed
  if (!selectedIcon) {
    console.warn(`Icon type "${type}" not found.`);
    return null; 
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill={type === 'star-solid' ? "currentColor" : "none"} 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={type === 'star-solid' ? 0 : 1.5}
    >
      {type === 'star-solid' ? (
        <path fill="currentColor" d={selectedIcon.props.d} />
      ) : (
        selectedIcon
      )}
    </svg>
  );
};