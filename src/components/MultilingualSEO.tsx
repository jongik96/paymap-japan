import { Metadata } from 'next';
import { getSEOData, getStructuredData, type Language } from '@/lib/seo';

// interface MultilingualSEOProps {
//   language: Language;
//   type?: 'website' | 'service' | 'restaurant';
//   restaurantData?: {
//     name: string;
//     address: string;
//     lat: number;
//     lng: number;
//     rating?: number;
//     reviewCount?: number;
//   };
// }

export function generateMetadata(language: Language): Metadata {
  const seoData = getSEOData(language);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    authors: [{ name: "Japan Food Web Team" }],
    creator: "Japan Food Web",
    publisher: "Japan Food Web",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: "website",
      locale: seoData.locale,
      siteName: "Japan Food Web",
      images: [
        {
          url: "/food-web.png",
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.title,
      description: seoData.description,
      images: ["/food-web.png"],
    },
    alternates: {
      canonical: seoData.alternateUrls[language],
      languages: seoData.alternateUrls,
    },
    verification: {
      google: "your-google-verification-code",
    },
    category: "food",
    classification: "Restaurant Information Service",
  };
}

export function generateHreflangTags(language: Language) {
  const seoData = getSEOData(language);
  
  return (
    <>
      {Object.entries(seoData.alternateUrls).map(([lang, url]) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={seoData.alternateUrls.en} />
    </>
  );
}

export function generateStructuredDataScript(language: Language, type: 'website' | 'service' = 'website') {
  const { websiteSchema, serviceSchema } = getStructuredData(language);
  const schema = type === 'website' ? websiteSchema : serviceSchema;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
