import Script from 'next/script';
import { getStructuredData, type Language } from '@/lib/seo';

interface StructuredDataProps {
  type?: 'website' | 'restaurant' | 'service';
  language?: Language;
  restaurantData?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating?: number;
    reviewCount?: number;
  };
}

export default function StructuredData({ type = 'website', language = 'ko', restaurantData }: StructuredDataProps) {
  const { websiteSchema, serviceSchema } = getStructuredData(language);

  const getRestaurantSchema = () => {
    if (!restaurantData) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": restaurantData.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": restaurantData.address,
        "addressCountry": "JP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": restaurantData.lat,
        "longitude": restaurantData.lng
      },
      "aggregateRating": restaurantData.rating ? {
        "@type": "AggregateRating",
        "ratingValue": restaurantData.rating,
        "reviewCount": restaurantData.reviewCount || 0
      } : undefined,
      "servesCuisine": "Japanese",
      "paymentAccepted": ["Cash", "Credit Card", "Suica", "PayPay", "LINE Pay"]
    };
  };

  const getSchema = () => {
    switch (type) {
      case 'restaurant':
        return getRestaurantSchema();
      case 'service':
        return serviceSchema;
      default:
        return websiteSchema;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
