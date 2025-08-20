'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp, MapPin, MessageCircle, Crown, Award, Medal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PopularRestaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  paymentMethods: string[];
  location: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  totalVisits: number;
}

interface PopularRestaurantsProps {
  data?: PopularRestaurant[];
  isLoading?: boolean;
}



export default function PopularRestaurants({ 
  data, 
  isLoading = false 
}: PopularRestaurantsProps) {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'visits'>('rating');
  const [actualData, setActualData] = useState<PopularRestaurant[]>([]);

  // 실제 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics?type=popular-restaurants');
        if (response.ok) {
          const result = await response.json();
          if (result.restaurants && result.restaurants.length > 0) {
            setActualData(result.restaurants);
          }
        }
      } catch (error) {
        console.error('Failed to fetch popular restaurants:', error);
      }
    };

    fetchData();
  }, []);

  const displayData = actualData.length > 0 ? actualData : [];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
            {index + 1}
          </div>
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
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

  const sortedData = [...displayData].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'visits':
        return b.totalVisits - a.totalVisits;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
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
          <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            인기 레스토랑 순위
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'visits')}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">평점순</option>
            <option value="reviews">리뷰순</option>
            <option value="visits">방문순</option>
          </select>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="space-y-4">
        {sortedData.map((restaurant, index) => (
          <div
            key={restaurant.id}
            className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
              index < 3 
                ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Rank */}
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>

              {/* Restaurant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {restaurant.name}
                  </h4>
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {restaurant.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{restaurant.reviewCount} 리뷰</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">결제:</span>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.paymentMethods.slice(0, 3).map((method) => (
                      <span
                        key={method}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                      >
                        {method}
                      </span>
                    ))}
                    {restaurant.paymentMethods.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        +{restaurant.paymentMethods.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {restaurant.rating}
                  </span>
                </div>
                
                <div className={`text-xs flex items-center space-x-1 ${getTrendColor(restaurant.trend)}`}>
                  {getTrendIcon(restaurant.trend)}
                  <span>{Math.abs(restaurant.trendPercent)}%</span>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {restaurant.totalVisits.toLocaleString()} 방문
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>최근 30일 기준 순위</span>
          <span>마지막 업데이트: 방금 전</span>
        </div>
      </div>
    </div>
  );
}
