// components/SEO.tsx
import { Metadata } from 'next';
import type { OpenGraphType } from 'next/dist/lib/metadata/types/opengraph-types';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  og: {
    title: string;
    url: string;
    description: string;
    image: string;
    type?: OpenGraphType; // 使用严格类型定义
  };
}

export const generateMetadata = ({
  title,
  description,
  canonical,
  keywords,
  og
}: SEOProps): Metadata => {
  const yandexVerificationCode = process.env.YANDEX_VERIFICATION_CODE || '';

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: og.title,
      description: og.description,
      url: og.url,
      images: [{
        url: og.image,
        width: 1200,
        height: 630,
        alt: og.title,
      }],
      type: og.type || 'website', // 确保值在允许范围内
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title,
      description: og.description,
      images: [og.image],
    },
    verification: {
      yandex: yandexVerificationCode
    }
  };
};
