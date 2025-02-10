// components/ads/GoogleAdSense.tsx
'use client';
import { useEffect } from 'react';

export const GoogleAdSense = () => {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adsenseClientId) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    } else {
      console.warn('AdSense client ID is not set in environment variables.');
    }
  }, [adsenseClientId]);

  return null;
};
