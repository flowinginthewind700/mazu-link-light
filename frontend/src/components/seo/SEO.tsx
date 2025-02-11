// components/SEO.tsx
import { Metadata } from 'next';

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
    type?: string; // 推荐补充的可选属性
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
    alternates: {
      canonical,
    },
    openGraph: {
      title: og.title,
      description: og.description,
      url: og.url,
      images: [
        {
          url: og.image,
          width: 1200,    // 推荐添加尺寸信息
          height: 630,    // 推荐添加尺寸信息
          alt: og.title,
        },
      ],
      type: og.type || 'website', // 添加默认值
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title,
      description: og.description,
      images: [og.image],
    },
    verification: {
      yandex: yandexVerificationCode,
      // 可同时添加其他搜索引擎验证
      // google: 'google-code-here',
    }
  };
};
