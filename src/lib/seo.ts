export type Language = 'ko' | 'ja' | 'en' | 'zh';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  locale: string;
  alternateUrls: Record<Language, string>;
}

export const getSEOData = (language: Language): SEOData => {
  const baseUrl = 'https://japan-food-web.com';
  
  const seoData: Record<Language, SEOData> = {
    ko: {
      title: 'Japan Food Web - 일본 음식점 결제수단 정보 서비스',
      description: '일본 여행 중 음식점에서 사용 가능한 결제수단을 미리 확인하세요. 수이카, 페이페이, 신용카드, 현금 등 다양한 결제방법 정보를 제공합니다. 도쿄, 오사카, 교토 등 일본 전국의 음식점 정보를 확인하고 리뷰를 남겨보세요.',
      keywords: '일본 음식점, 일본 결제수단, 일본 여행, 일본 맛집, 수이카, 페이페이, 일본 신용카드, 일본 현금, 일본 음식, 도쿄 맛집, 오사카 맛집, 교토 맛집, 일본 레스토랑, 일본 식당, 일본 카페, 일본 여행 정보, 일본 결제 방법, 일본 음식점 리뷰, 일본 맛집 추천',
      locale: 'ko_KR',
      alternateUrls: {
        ko: `${baseUrl}`,
        ja: `${baseUrl}?lang=ja`,
        en: `${baseUrl}?lang=en`,
        zh: `${baseUrl}?lang=zh`
      }
    },
    ja: {
      title: 'Japan Food Web - 日本レストラン決済方法情報サービス',
      description: '日本旅行中にレストランで利用可能な決済方法を事前に確認しましょう。Suica、PayPay、クレジットカード、現金など様々な決済方法の情報を提供します。東京、大阪、京都など日本全国のレストラン情報を確認し、レビューを投稿してください。',
      keywords: '日本レストラン, 日本決済方法, 日本旅行, 日本グルメ, Suica, PayPay, 日本クレジットカード, 日本現金, 日本料理, 東京グルメ, 大阪グルメ, 京都グルメ, 日本レストラン, 日本食堂, 日本カフェ, 日本旅行情報, 日本決済方法, 日本レストランレビュー, 日本グルメおすすめ',
      locale: 'ja_JP',
      alternateUrls: {
        ko: `${baseUrl}?lang=ko`,
        ja: `${baseUrl}`,
        en: `${baseUrl}?lang=en`,
        zh: `${baseUrl}?lang=zh`
      }
    },
    en: {
      title: 'Japan Food Web - Japanese Restaurant Payment Methods Guide',
      description: 'Check available payment methods at Japanese restaurants before your trip. Find information about Suica, PayPay, credit cards, cash, and other payment options. Discover restaurant information across Japan including Tokyo, Osaka, Kyoto, and share your reviews.',
      keywords: 'Japanese restaurants, Japan payment methods, Japan travel, Japanese food, Suica, PayPay, Japan credit card, Japan cash, Japanese cuisine, Tokyo restaurants, Osaka restaurants, Kyoto restaurants, Japan dining, Japan cafes, Japan travel guide, Japan payment options, Japanese restaurant reviews, Japan food recommendations',
      locale: 'en_US',
      alternateUrls: {
        ko: `${baseUrl}?lang=ko`,
        ja: `${baseUrl}?lang=ja`,
        en: `${baseUrl}`,
        zh: `${baseUrl}?lang=zh`
      }
    },
    zh: {
      title: 'Japan Food Web - 日本餐厅支付方式信息服务',
      description: '在您的日本旅行中，提前了解餐厅可用的支付方式。我们提供Suica、PayPay、信用卡、现金等各种支付方式的信息。查看东京、大阪、京都等日本全国餐厅信息，并分享您的评论。',
      keywords: '日本餐厅, 日本支付方式, 日本旅游, 日本美食, Suica, PayPay, 日本信用卡, 日本现金, 日本料理, 东京美食, 大阪美食, 京都美食, 日本餐厅, 日本食堂, 日本咖啡厅, 日本旅游信息, 日本支付方法, 日本餐厅评论, 日本美食推荐',
      locale: 'zh_CN',
      alternateUrls: {
        ko: `${baseUrl}?lang=ko`,
        ja: `${baseUrl}?lang=ja`,
        en: `${baseUrl}?lang=en`,
        zh: `${baseUrl}`
      }
    }
  };

  return seoData[language];
};

export const getStructuredData = (language: Language) => {
  const seoData = getSEOData(language);
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seoData.title,
    "url": "https://japan-food-web.com",
    "description": seoData.description,
    "inLanguage": seoData.locale,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://japan-food-web.com/map?search={search_term_string}&lang=${language}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Japan Food Web",
      "url": "https://japan-food-web.com"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": seoData.title,
    "description": seoData.description,
    "provider": {
      "@type": "Organization",
      "name": "Japan Food Web",
      "url": "https://japan-food-web.com"
    },
    "serviceType": "Restaurant Information Service",
    "areaServed": {
      "@type": "Country",
      "name": "Japan"
    },
    "availableLanguage": ["Korean", "Japanese", "English", "Chinese"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  };

  return { websiteSchema, serviceSchema };
};
