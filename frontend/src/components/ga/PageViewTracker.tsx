'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + searchParams.toString();
      window.gtag('event', 'page_view', {
        page_path: url,
        send_to: process.env.NEXT_PUBLIC_GA_ID
      });
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
