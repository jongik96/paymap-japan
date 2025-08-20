'use client';

import { MapPin, CreditCard, Star, MessageCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PayMap Japan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">{t('paymentMethodReviewService')}</p>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 break-words leading-tight">
            {t('discoverPaymentMethods')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 break-words leading-relaxed">
            {t('heroDescription')}
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/map" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{t('viewMap')}</span>
            </a>
            <a href="/map" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{t('writeReview')}</span>
            </a>
          </div>
          

        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">{t('mapBasedSearch')}</h3>
            <p className="text-gray-600 break-words leading-relaxed">{t('mapBasedSearchDesc')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">{t('paymentMethodInfo')}</h3>
            <p className="text-gray-600 break-words leading-relaxed">{t('paymentMethodInfoDesc')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">{t('realTimeReviews')}</h3>
            <p className="text-gray-600 break-words leading-relaxed">{t('realTimeReviewsDesc')}</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('howToUse')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">{t('findRestaurants')}</h4>
              <p className="text-sm text-gray-600 break-words leading-relaxed">{t('findRestaurantsDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">{t('clickMarker')}</h4>
              <p className="text-sm text-gray-600 break-words leading-relaxed">{t('clickMarkerDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">{t('checkPayment')}</h4>
              <p className="text-sm text-gray-600 break-words leading-relaxed">{t('checkPaymentDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">4</div>
              <h4 className="font-semibold text-gray-900 mb-2 break-words">{t('writeReview')}</h4>
              <p className="text-sm text-gray-600 break-words leading-relaxed">{t('writeReviewDesc')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 PayMap Japan. Community for Payment Method in Japan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
