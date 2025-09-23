import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

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
  description: "Find restaurants in Japan and check available payment methods. Share your payment experiences anonymously. Discover which restaurants accept Suica, PayPay, credit cards, and more payment options.",
  keywords: "Japan, restaurants, payment methods, Google Maps, reviews, Suica, PayPay, LINE Pay, credit card, cash, Osaka, Kyoto, dining, food, payment options, restaurant reviews, anonymous reviews",
  authors: [{ name: "PayMap Japan Team" }],
  creator: "PayMap Japan",
  publisher: "PayMap Japan",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "PayMap Japan - Payment Method Review Service",
    description: "Find restaurants in Japan and check available payment methods. Share your payment experiences anonymously.",
    type: "website",
    locale: "en_US",
    siteName: "PayMap Japan",
    images: [
      {
        url: "/og-image-simple.jpg",
        width: 1200,
        height: 630,
        alt: "PayMap Japan - Payment Method Review Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayMap Japan - Payment Method Review Service",
    description: "Find restaurants in Japan and check available payment methods. Share your payment experiences anonymously.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://paymap-japan.vercel.app",
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console에서 받은 코드
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8843011911940029"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
