"use client"

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalyticsEvent } from './useAnalyticsEvent';

export default function PageViewTracker() {
  const pathname = usePathname();
  const trackEvent = useAnalyticsEvent();

  useEffect(() => {
    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: pathname
    });
  }, [pathname, trackEvent]);

  return null;
}
