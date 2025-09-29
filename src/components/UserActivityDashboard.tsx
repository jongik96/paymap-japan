'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Eye,
  Search,
  Heart,
  Calendar,
  BarChart3
} from 'lucide-react';
// import { useLanguage } from '@/contexts/LanguageContext'; // 사용하지 않는 import

interface ActivityMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface TimeSeriesData {
  time: string;
  users: number;
  reviews: number;
  searches: number;
}

interface UserActivityDashboardProps {
  data?: {
    metrics: ActivityMetric[];
    timeSeries: TimeSeriesData[];
    recentActivities?: Array<{
      time: string;
      user: string;
      action: string;
      target: string;
    }>;
  };
  isLoading?: boolean;
}

export default function UserActivityDashboard({ 
  // data, // 사용하지 않는 prop
  isLoading = false 
}: UserActivityDashboardProps) {
  // const { t } = useLanguage(); // 사용하지 않는 변수
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [actualData, setActualData] = useState<{ 
    metrics: ActivityMetric[]; 
    timeSeries: TimeSeriesData[]; 
    recentActivities?: Array<{
      time: string;
      user: string;
      action: string;
      target: string;
    }>;
  }>({ metrics: [], timeSeries: [] });

  // 실제 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics?type=user-activity');
        if (response.ok) {
          const result = await response.json();
          if (result.metrics && result.timeSeries) {
            setActualData(result);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user activity data:', error);
      }
    };

    fetchData();
  }, []);

  const displayData = actualData.metrics.length > 0 ? actualData : { 
    metrics: [], 
    timeSeries: [], 
    recentActivities: [] 
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...displayData.timeSeries.map(d => Math.max(d.users, d.reviews * 5, d.searches)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            사용자 활동 대시보드
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as '24h' | '7d' | '30d')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayData.metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
                           <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
               {metric.icon === 'Users' && <Users className="h-5 w-5" />}
               {metric.icon === 'MessageCircle' && <MessageCircle className="h-5 w-5" />}
               {metric.icon === 'Search' && <Search className="h-5 w-5" />}
               {metric.icon === 'Heart' && <Heart className="h-5 w-5" />}
               {metric.icon === 'Eye' && <Eye className="h-5 w-5" />}
               {metric.icon === 'Clock' && <Clock className="h-5 w-5" />}
             </div>
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            시간별 활동
          </h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">사용자</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">리뷰</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">검색</span>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {displayData.timeSeries.map((item, index) => (
            <div key={item.time} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {item.time}
                </span>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="text-blue-600 dark:text-blue-400">
                    {item.users}명
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {item.reviews}개
                  </span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {item.searches}회
                  </span>
                </div>
              </div>
              
              <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Users Bar */}
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 opacity-60 rounded-lg transition-all duration-500"
                  style={{ 
                    width: `${(item.users / maxValue) * 100}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                {/* Reviews Bar */}
                <div
                  className="absolute left-0 top-1 h-6 bg-green-500 opacity-80 rounded-lg transition-all duration-500"
                  style={{ 
                    width: `${(item.reviews * 5 / maxValue) * 100}%`,
                    animationDelay: `${index * 100 + 50}ms`
                  }}
                />
                {/* Searches Bar */}
                <div
                  className="absolute left-0 top-2 h-4 bg-orange-500 opacity-90 rounded-lg transition-all duration-500"
                  style={{ 
                    width: `${(item.searches / maxValue) * 100}%`,
                    animationDelay: `${index * 100 + 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          최근 활동
        </h4>
        
        <div className="space-y-3">
                     {displayData.recentActivities ? displayData.recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-600 dark:text-gray-400"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>최근 활동이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>마지막 업데이트: 방금 전</span>
        </div>
      </div>
    </div>
  );
}
