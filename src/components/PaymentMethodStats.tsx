'use client';

import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentMethodStat {
  method: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

interface PaymentMethodStatsProps {
  data?: PaymentMethodStat[];
  isLoading?: boolean;
}

// Sample data for demonstration
const sampleData: PaymentMethodStat[] = [
  { method: 'Credit Card', count: 1247, percentage: 32.5, trend: 'up', trendPercent: 12.3 },
  { method: 'Suica/IC Card', count: 1156, percentage: 30.1, trend: 'up', trendPercent: 8.7 },
  { method: 'PayPay', count: 789, percentage: 20.6, trend: 'up', trendPercent: 15.2 },
  { method: 'Cash', count: 432, percentage: 11.3, trend: 'down', trendPercent: -5.4 },
  { method: 'LINE Pay', count: 156, percentage: 4.1, trend: 'stable', trendPercent: 1.2 },
  { method: 'Rakuten Pay', count: 54, percentage: 1.4, trend: 'up', trendPercent: 3.8 }
];

export default function PaymentMethodStats({ 
  data = sampleData, 
  isLoading = false 
}: PaymentMethodStatsProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            결제 수단 통계
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'chart'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <PieChart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 리뷰 수</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {totalCount.toLocaleString()}
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={item.method}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.method}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count.toLocaleString()} 개 리뷰
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Percentage Bar */}
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                
                <div className="text-right min-w-[80px]">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.percentage}%
                  </div>
                  <div className={`text-xs flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                    {getTrendIcon(item.trend)}
                    <span>{Math.abs(item.trendPercent)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="space-y-6">
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.method} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.method}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      animationDelay: `${data.indexOf(item) * 100}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>최근 30일 기준</span>
          <span>마지막 업데이트: 방금 전</span>
        </div>
      </div>
    </div>
  );
}
