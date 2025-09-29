import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import { generateMetadata as generateMultilingualMetadata, generateHreflangTags } from "@/components/MultilingualSEO";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 기본 메타데이터 (한국어)
export const metadata: Metadata = generateMultilingualMetadata('ko');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/map.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/map.png" type="image/png" sizes="16x16" />
        <link rel="shortcut icon" href="/map.png" type="image/png" />
        <link rel="apple-touch-icon" href="/map.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/map.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/map.png" sizes="144x144" />
        <link rel="apple-touch-icon" href="/map.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/map.png" sizes="114x114" />
        <link rel="apple-touch-icon" href="/map.png" sizes="76x76" />
        <link rel="apple-touch-icon" href="/map.png" sizes="72x72" />
        <link rel="apple-touch-icon" href="/map.png" sizes="60x60" />
        <link rel="apple-touch-icon" href="/map.png" sizes="57x57" />
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8843011911940029"
          crossOrigin="anonymous"
        ></script>
        {/* Hreflang tags for multilingual SEO */}
        {generateHreflangTags('ko')}
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
