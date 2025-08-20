import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PayMap Japan - Restaurant Payment Methods in Tokyo',
  description: 'Discover payment methods available at restaurants in Tokyo. Find out how to pay with cash, credit cards, Suica, PayPay, and more payment options. Interactive map with user reviews.',
  keywords: 'payment methods, restaurants, Tokyo, cash, credit card, Suica, PayPay, LINE Pay, payment options, restaurant map, Google Maps, dining, food, Japan',
  openGraph: {
    title: 'PayMap Japan - Restaurant Payment Methods in Tokyo',
    description: 'Discover payment methods available at restaurants in Tokyo. Interactive map with user reviews.',
    type: 'website',
    locale: 'en_US',
    siteName: 'PayMap Japan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayMap Japan - Restaurant Payment Methods in Tokyo',
    description: 'Discover payment methods available at restaurants in Tokyo. Interactive map with user reviews.',
  },
  alternates: {
    canonical: 'https://paymap-japan.vercel.app/map',
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
