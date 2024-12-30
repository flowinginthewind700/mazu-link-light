import { useState, useEffect } from 'react';

export default function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;

    const checkMobile = () => {
      const mobile = Boolean(userAgent.match(mobileRegex));
      const mobileWidth = window.innerWidth < 768; // 你可以根据需要调整这个值
      setIsMobile(mobile || mobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile };
}
