import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PayMap Japan - Restaurant Payment Methods in Japan',
  description: 'Discover payment methods available at restaurants in Japan. Find out how to pay with cash, credit cards, Suica, PayPay, and more payment options. Interactive map with user reviews.',
  keywords: 'payment methods, restaurants, Japan, cash, credit card, Suica, PayPay, LINE Pay, payment options, restaurant map, Google Maps, dining, food, Japan',
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
