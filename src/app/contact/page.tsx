'use client';

import { Mail, MessageCircle, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import GoogleAdSense from '@/components/GoogleAdSense';
import { useState } from 'react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailClick = () => {
    const subject = encodeURIComponent(t('contact.email.subject'));
    const body = encodeURIComponent(t('contact.email.body'));
    const emailUrl = `mailto:pji3503@gmail.com?subject=${subject}&body=${body}`;
    window.open(emailUrl);
    setEmailSent(true);
  };

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
          <div className="text-center mb-12">
            <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('contact.info.email.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {t('contact.info.email.description')}
                    </p>
                    <a 
                      href="mailto:pji3503@gmail.com"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      pji3503@gmail.com
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('contact.info.response.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contact.info.response.description')}
                    </p>
                  </div>
                </div>

                {/* Service Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('contact.info.hours.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contact.info.hours.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('contact.form.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t('contact.form.email.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('contact.form.email.description')}
                  </p>
                  
                  {emailSent ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>{t('contact.form.email.sent')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleEmailClick}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>{t('contact.form.email.button')}</span>
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t('contact.form.template.title')}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p><strong>{t('contact.form.template.subject')}:</strong></p>
                    <p className="bg-white dark:bg-gray-800 p-3 rounded border">
                      {t('contact.email.subject')}
                    </p>
                    <p><strong>{t('contact.form.template.body')}:</strong></p>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border whitespace-pre-line">
                      {t('contact.email.body')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AdSense Banner */}
          <div className="flex justify-center mt-8 mb-8">
            <GoogleAdSense
              adSlot="1234567890" // 실제 광고 슬롯 ID로 교체 필요
              adFormat="horizontal"
              className="w-full max-w-728px"
              adStyle={{ display: 'block', height: '90px' }}
            />
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('contact.faq.title')}
            </h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.faq.q1.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('contact.faq.q1.answer')}
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.faq.q2.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('contact.faq.q2.answer')}
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.faq.q3.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('contact.faq.q3.answer')}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.faq.q4.question')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('contact.faq.q4.answer')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4">
              <Link 
                href="/guide" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('contact.navigation.guide')}
              </Link>
              <Link 
                href="/privacy" 
                className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('contact.navigation.privacy')}
              </Link>
            </div>
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
