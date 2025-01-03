'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect } from 'react';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />;
}
