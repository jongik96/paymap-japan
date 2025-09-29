import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Japan Food Web - 일본 음식점 결제수단 정보 서비스',
    short_name: 'Japan Food Web',
    description: '일본 여행 중 음식점에서 사용 가능한 결제수단을 미리 확인하세요. 수이카, 페이페이, 신용카드, 현금 등 다양한 결제방법 정보를 제공합니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/map.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/map.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['food', 'travel', 'lifestyle'],
    lang: 'ko',
    dir: 'ltr',
    orientation: 'portrait-primary',
  }
}
