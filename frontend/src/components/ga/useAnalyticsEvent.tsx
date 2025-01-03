'use client';

import { useCallback } from 'react';

interface EventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any; // 允许添加其他自定义参数
}

export function useAnalyticsEvent() {
  const trackEvent = useCallback((params: EventParams) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', params.action, {
        event_category: params.category,
        event_label: params.label,
        value: params.value,
        ...params, // 允许传递其他自定义参数
        send_to: process.env.NEXT_PUBLIC_GA_ID
      });
    }
  }, []);

  return trackEvent;
}
