'use client';

import { useEffect } from 'react';

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
}

export default function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      // Google AdSense 코드 스니펫 방식
      if (typeof window !== 'undefined') {
        // @ts-expect-error - Google AdSense global variable
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client="ca-pub-8843011911940029"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
