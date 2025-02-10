// components/ads/GoogleAdSense.tsx
'use client';
import Script from 'next/script';

export const GoogleAdSense = () => {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!adsenseClientId) {
    console.warn('AdSense client ID is not set in environment variables.');
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
};
