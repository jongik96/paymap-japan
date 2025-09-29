'use client';

import { MapPin, CreditCard, Star, MessageCircle, Search, Filter, Heart, History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';

export default function GuidePage() {
  const { t } = useLanguage();

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Japan Food Web</h1>
              </Link>
              <div className="flex items-center space-x-4">
                <LanguageToggle />
                <ThemeToggle />
                <Link 
                  href="/" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {t('header.backToHome')}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t('guide.title')}
            </h1>

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('guide.introduction.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {t('guide.introduction.description')}
              </p>
            </section>

            {/* How to Use */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('guide.howToUse.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('guide.step1.title')}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t('guide.step1.description')}</p>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <Search className="h-4 w-4 mr-2" />
                    {t('guide.step1.example')}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('guide.step2.title')}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t('guide.step2.description')}</p>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('guide.step2.example')}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('guide.step3.title')}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t('guide.step3.description')}</p>
                  <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                    <Star className="h-4 w-4 mr-2" />
                    {t('guide.step3.example')}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('guide.step4.title')}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t('guide.step4.description')}</p>
                  <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('guide.step4.example')}
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('guide.features.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('guide.features.favorites.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('guide.features.favorites.description')}</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <History className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('guide.features.history.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('guide.features.history.description')}</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CreditCard className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('guide.features.payment.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('guide.features.payment.description')}</p>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('guide.tips.title')}
              </h2>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-3">💡</span>
                    <span className="text-gray-700 dark:text-gray-300">{t('guide.tips.tip1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-3">💡</span>
                    <span className="text-gray-700 dark:text-gray-300">{t('guide.tips.tip2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-3">💡</span>
                    <span className="text-gray-700 dark:text-gray-300">{t('guide.tips.tip3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-3">💡</span>
                    <span className="text-gray-700 dark:text-gray-300">{t('guide.tips.tip4')}</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('guide.contact.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('guide.contact.description')}
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/contact" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('guide.contact.button')}
                </Link>
                <Link 
                  href="/map" 
                  className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('guide.contact.start')}
                </Link>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
