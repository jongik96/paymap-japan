'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import PaymentMethodStats from '@/components/PaymentMethodStats';
import PopularRestaurants from '@/components/PopularRestaurants';
import UserActivityDashboard from '@/components/UserActivityDashboard';
import ContentFilterStats from '@/components/ContentFilterStats';

import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'restaurants' | 'activity' | 'content-filter'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [overviewStats, setOverviewStats] = useState([
    { label: '총 사용자', value: '0', change: '0%', color: 'blue' },
    { label: '총 리뷰', value: '0', change: '0%', color: 'green' },
    { label: '총 레스토랑', value: '0', change: '0%', color: 'orange' },
    { label: '월 활성 사용자', value: '0', change: '0%', color: 'purple' }
  ]);

  // 실제 데이터 가져오기
  const fetchOverviewStats = async () => {
    try {
      const response = await fetch('/api/analytics?type=overview');
      if (response.ok) {
        const data = await response.json();
        setOverviewStats([
          { label: '총 사용자', value: data.totalUsers?.toLocaleString() || '0', change: '+0%', color: 'blue' },
          { label: '총 리뷰', value: data.totalReviews?.toLocaleString() || '0', change: '+0%', color: 'green' },
          { label: '총 레스토랑', value: data.totalRestaurants?.toLocaleString() || '0', change: '+0%', color: 'orange' },
          { label: '월 활성 사용자', value: data.monthlyActiveUsers?.toLocaleString() || '0', change: '+0%', color: 'purple' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await fetchOverviewStats();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      // 실제 데이터 가져오기
      const response = await fetch('/api/analytics?type=overview');
      if (response.ok) {
        const data = await response.json();
        
        const exportData = {
          exportTime: new Date().toISOString(),
          totalUsers: data.totalUsers || 0,
          totalReviews: data.totalReviews || 0,
          totalRestaurants: data.totalRestaurants || 0,
          monthlyActiveUsers: data.monthlyActiveUsers || 0
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paymap-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: '개요', icon: BarChart3 },
    { id: 'payments', label: '결제 수단', icon: CreditCard },
    { id: 'restaurants', label: '레스토랑', icon: TrendingUp },
    { id: 'activity', label: '사용자 활동', icon: Users },
    { id: 'content-filter', label: '콘텐츠 필터', icon: Shield }
  ];



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    PayMap Admin
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    분석 및 관리 대시보드
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>새로고침</span>
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>데이터 내보내기</span>
              </button>
              
              <LanguageToggle />
              <ThemeToggle />
              
              <Link 
                href="/map" 
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                지도로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last Updated */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          마지막 업데이트: {lastUpdated.toLocaleString('ko-KR')}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                                         onClick={() => setActiveTab(tab.id as 'overview' | 'payments' | 'restaurants' | 'activity' | 'content-filter')}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                 {overviewStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overview Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PaymentMethodStats isLoading={isLoading} />
                <PopularRestaurants isLoading={isLoading} />
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <PaymentMethodStats isLoading={isLoading} />
          )}

          {activeTab === 'restaurants' && (
            <PopularRestaurants isLoading={isLoading} />
          )}

          {activeTab === 'activity' && (
            <UserActivityDashboard isLoading={isLoading} />
          )}
          
          {activeTab === 'content-filter' && (
            <ContentFilterStats isLoading={isLoading} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>PayMap Japan Admin Dashboard</p>
            <p className="mt-1">데이터는 실시간으로 업데이트됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
