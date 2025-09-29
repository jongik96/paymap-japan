'use client';

import { Shield, Eye, Lock, Database, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';

export default function PrivacyPage() {
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
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.lastUpdated')}: 2025년 1월 23일
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.introduction.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('privacy.introduction.description')}
              </p>
            </section>

            {/* Information Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="h-6 w-6 text-blue-600 mr-2" />
                {t('privacy.collection.title')}
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('privacy.collection.personalInfo.title')}
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• {t('privacy.collection.personalInfo.item1')}</li>
                  <li>• {t('privacy.collection.personalInfo.item2')}</li>
                  <li>• {t('privacy.collection.personalInfo.item3')}</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                  {t('privacy.collection.usageInfo.title')}
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• {t('privacy.collection.usageInfo.item1')}</li>
                  <li>• {t('privacy.collection.usageInfo.item2')}</li>
                  <li>• {t('privacy.collection.usageInfo.item3')}</li>
                </ul>
              </div>
            </section>

            {/* Information Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="h-6 w-6 text-green-600 mr-2" />
                {t('privacy.usage.title')}
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• {t('privacy.usage.item1')}</li>
                  <li>• {t('privacy.usage.item2')}</li>
                  <li>• {t('privacy.usage.item3')}</li>
                  <li>• {t('privacy.usage.item4')}</li>
                  <li>• {t('privacy.usage.item5')}</li>
                </ul>
              </div>
            </section>

            {/* Information Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="h-6 w-6 text-red-600 mr-2" />
                {t('privacy.protection.title')}
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• {t('privacy.protection.item1')}</li>
                  <li>• {t('privacy.protection.item2')}</li>
                  <li>• {t('privacy.protection.item3')}</li>
                  <li>• {t('privacy.protection.item4')}</li>
                </ul>
              </div>
            </section>

            {/* Third Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.thirdParty.title')}
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('privacy.thirdParty.google.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('privacy.thirdParty.google.description')}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('privacy.thirdParty.vercel.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('privacy.thirdParty.vercel.description')}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('privacy.thirdParty.redis.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('privacy.thirdParty.redis.description')}
                </p>
              </div>
            </section>

            {/* User Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.rights.title')}
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li>• {t('privacy.rights.item1')}</li>
                  <li>• {t('privacy.rights.item2')}</li>
                  <li>• {t('privacy.rights.item3')}</li>
                  <li>• {t('privacy.rights.item4')}</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="h-6 w-6 text-blue-600 mr-2" />
                {t('privacy.contact.title')}
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('privacy.contact.email')}: pji3503@gmail.com
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('privacy.contact.description')}
                </p>
              </div>
            </section>

            {/* Policy Changes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.changes.title')}
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('privacy.changes.description')}
                </p>
              </div>
            </section>

            {/* Navigation */}
            <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/guide" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('privacy.navigation.guide')}
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('privacy.navigation.contact')}
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2025 Japan Food Web. 일본 음식점 결제수단 정보 서비스</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
