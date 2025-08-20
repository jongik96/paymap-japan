'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Eye,
  Search,
  Heart,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  };
  isLoading?: boolean;
}

// Sample data for demonstration
const sampleMetrics: ActivityMetric[] = [
  {
    label: '총 사용자',
    value: 24567,
    change: 12.3,
    trend: 'up',
    icon: <Users className="h-5 w-5" />,
    color: 'blue'
  },
  {
    label: '새 리뷰',
    value: 1247,
    change: 8.7,
    trend: 'up',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'green'
  },
  {
    label: '검색 수',
    value: 5432,
    change: -2.1,
    trend: 'down',
    icon: <Search className="h-5 w-5" />,
    color: 'orange'
  },
  {
    label: '즐겨찾기',
    value: 891,
    change: 15.6,
    trend: 'up',
    icon: <Heart className="h-5 w-5" />,
    color: 'red'
  },
  {
    label: '페이지 조회',
    value: 18934,
    change: 5.2,
    trend: 'up',
    icon: <Eye className="h-5 w-5" />,
    color: 'purple'
  },
  {
    label: '평균 세션',
    value: 342,
    change: 3.8,
    trend: 'up',
    icon: <Clock className="h-5 w-5" />,
    color: 'indigo'
  }
];

const sampleTimeSeries: TimeSeriesData[] = [
  { time: '00:00', users: 120, reviews: 15, searches: 85 },
  { time: '04:00', users: 89, reviews: 8, searches: 45 },
  { time: '08:00', users: 245, reviews: 32, searches: 167 },
  { time: '12:00', users: 456, reviews: 67, searches: 289 },
  { time: '16:00', users: 389, reviews: 54, searches: 234 },
  { time: '20:00', users: 567, reviews: 89, searches: 345 },
];

export default function UserActivityDashboard({ 
  data = { metrics: sampleMetrics, timeSeries: sampleTimeSeries }, 
  isLoading = false 
}: UserActivityDashboardProps) {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

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

  const maxValue = Math.max(...data.timeSeries.map(d => Math.max(d.users, d.reviews * 5, d.searches)));

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
        {data.metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                {metric.icon}
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
          {data.timeSeries.map((item, index) => (
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
          {[
            { time: '2분 전', user: '익명사용자_1234', action: '새 리뷰 작성', target: 'Sushi Zanmai Ginza' },
            { time: '5분 전', user: '익명사용자_5678', action: '즐겨찾기 추가', target: 'Ichiran Ramen Shibuya' },
            { time: '8분 전', user: '익명사용자_9012', action: '레스토랑 검색', target: '도쿄 라멘' },
            { time: '12분 전', user: '익명사용자_3456', action: '리뷰에 도움됨 표시', target: 'Tempura Tsunahachi' },
            { time: '15분 전', user: '익명사용자_7890', action: '새 리뷰 작성', target: 'Kaikaya by the Sea' }
          ].map((activity, index) => (
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
          ))}
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
