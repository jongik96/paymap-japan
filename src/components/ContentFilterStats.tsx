'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, CheckCircle } from 'lucide-react';

interface ContentFilterStatsProps {
  isLoading?: boolean;
}

interface FilterStats {
  totalReviews: number;
  filteredReviews: number;
  violations: {
    inappropriateLanguage: number;
    advertising: number;
    sensitiveTopic: number;
    spam: number;
    tooShort: number;
    tooLong: number;
  };
  successRate: number;
}

export default function ContentFilterStats({ isLoading }: ContentFilterStatsProps) {
  const [stats, setStats] = useState<FilterStats>({
    totalReviews: 0,
    filteredReviews: 0,
    violations: {
      inappropriateLanguage: 0,
      advertising: 0,
      sensitiveTopic: 0,
      spam: 0,
      tooShort: 0,
      tooLong: 0,
    },
    successRate: 100,
  });

  useEffect(() => {
    // 실제 API에서 데이터를 가져오는 로직
    // 현재는 샘플 데이터 사용
    const fetchStats = async () => {
      try {
        // TODO: 실제 API 엔드포인트 구현
        // const response = await fetch('/api/analytics?type=content-filter');
        // const data = await response.json();
        // setStats(data);
        
        // 샘플 데이터
        setStats({
          totalReviews: 1250,
          filteredReviews: 47,
          violations: {
            inappropriateLanguage: 12,
            advertising: 18,
            sensitiveTopic: 8,
            spam: 6,
            tooShort: 2,
            tooLong: 1,
          },
          successRate: 96.2,
        });
      } catch (error) {
        console.error('Failed to fetch content filter stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const violationItems = [
    {
      label: '부적절한 언어',
      count: stats.violations.inappropriateLanguage,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: '광고성 콘텐츠',
      count: stats.violations.advertising,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: '민감한 주제',
      count: stats.violations.sensitiveTopic,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: '스팸성 콘텐츠',
      count: stats.violations.spam,
      icon: AlertTriangle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: '너무 짧음',
      count: stats.violations.tooShort,
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: '너무 김',
      count: stats.violations.tooLong,
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">콘텐츠 필터링 통계</h3>
      </div>

      {/* 주요 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalReviews.toLocaleString()}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">총 리뷰</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.filteredReviews.toLocaleString()}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">차단된 리뷰</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.successRate}%
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">성공률</div>
        </div>
      </div>

      {/* 위반 유형별 통계 */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">위반 유형별 통계</h4>
        <div className="space-y-3">
          {violationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 성공률 표시 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">전체 성공률</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.successRate}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.successRate}%` }}
          ></div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {stats.totalReviews - stats.filteredReviews}개의 리뷰가 성공적으로 게시됨
          </span>
        </div>
      </div>
    </div>
  );
}
