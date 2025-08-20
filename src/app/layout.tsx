import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayMap Japan - Payment Method Review Service",
  description: "Find restaurants in Japan and check available payment methods. Share your payment experiences anonymously.",
  keywords: "Japan, restaurants, payment methods, Google Maps, reviews, Suica, PayPay, credit card",
  authors: [{ name: "PayMap Japan Team" }],
  openGraph: {
    title: "PayMap Japan",
    description: "Payment Method Review Service for Japanese Restaurants",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
