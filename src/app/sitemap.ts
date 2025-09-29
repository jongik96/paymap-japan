import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://japan-food-web.com';
  const languages = ['ko', 'ja', 'en', 'zh'];
  
  const pages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/map', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/admin', priority: 0.3, changeFrequency: 'weekly' as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // 각 언어별 페이지 생성
  pages.forEach(page => {
    languages.forEach(lang => {
      const url = lang === 'ko' 
        ? `${baseUrl}${page.path}` 
        : `${baseUrl}${page.path}?lang=${lang}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ko: lang === 'ko' ? `${baseUrl}${page.path}` : `${baseUrl}${page.path}?lang=ko`,
            ja: lang === 'ja' ? `${baseUrl}${page.path}` : `${baseUrl}${page.path}?lang=ja`,
            en: lang === 'en' ? `${baseUrl}${page.path}` : `${baseUrl}${page.path}?lang=en`,
            zh: lang === 'zh' ? `${baseUrl}${page.path}` : `${baseUrl}${page.path}?lang=zh`,
          }
        }
      });
    });
  });

  return sitemap;
}
