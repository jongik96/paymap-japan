import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface PaymentMethodStat {
  method: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

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

interface ActivityMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'payment-methods':
        return await getPaymentMethodStats();
      case 'popular-restaurants':
        return await getPopularRestaurants();
      case 'user-activity':
        return await getUserActivity();
      case 'overview':
        return await getOverviewStats();
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

async function getPaymentMethodStats(): Promise<NextResponse> {
  try {
    // Get all restaurant data to analyze payment methods
    const restaurantKeys = await redis.keys('restaurant:*');
    const paymentMethodCounts: Record<string, number> = {};
    
    for (const key of restaurantKeys) {
      const restaurant = await redis.hgetall(key);
      if (restaurant && restaurant.paymentMethods) {
        const methods = JSON.parse(restaurant.paymentMethods as string);
        methods.forEach((method: string) => {
          paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
        });
      }
    }

    // Calculate percentages and create stats
    const totalCount = Object.values(paymentMethodCounts).reduce((sum, count) => sum + count, 0);
    const stats: PaymentMethodStat[] = Object.entries(paymentMethodCounts)
      .map(([method, count]) => ({
        method,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
        trend: 'stable' as const,
        trendPercent: Math.random() * 20 - 10 // Random trend for demo
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching payment method stats:', error);
    return NextResponse.json({ error: 'Failed to fetch payment method stats' }, { status: 500 });
  }
}

async function getPopularRestaurants(): Promise<NextResponse> {
  try {
    const restaurantKeys = await redis.keys('restaurant:*');
    const restaurants: PopularRestaurant[] = [];

    for (const key of restaurantKeys) {
      const restaurant = await redis.hgetall(key);
      if (restaurant) {
        // Get review count for this restaurant
        const reviewsKey = `reviews:${restaurant.id}`;
        const reviews = await redis.hgetall(reviewsKey);
        const reviewCount = reviews ? Object.keys(reviews).length : 0;

        restaurants.push({
          id: restaurant.id as string,
          name: restaurant.name as string,
          rating: parseFloat(restaurant.rating as string) || 0,
          reviewCount,
          paymentMethods: restaurant.paymentMethods ? JSON.parse(restaurant.paymentMethods as string) : [],
          location: restaurant.location as string || 'Unknown',
          category: restaurant.category as string || 'Restaurant',
          trend: 'stable' as const,
          trendPercent: Math.random() * 20 - 10, // Random trend for demo
          totalVisits: Math.floor(Math.random() * 10000) + 1000 // Random visits for demo
        });
      }
    }

    // Sort by rating and review count
    const sortedRestaurants = restaurants
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 10); // Top 10

    return NextResponse.json({ restaurants: sortedRestaurants });
  } catch (error) {
    console.error('Error fetching popular restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch popular restaurants' }, { status: 500 });
  }
}

async function getUserActivity(): Promise<NextResponse> {
  try {
    // Get total counts from Redis
    const restaurantKeys = await redis.keys('restaurant:*');
    const reviewKeys = await redis.keys('reviews:*');
    
    let totalReviews = 0;
    for (const key of reviewKeys) {
      const reviews = await redis.hgetall(key);
      if (reviews) {
        totalReviews += Object.keys(reviews).length;
      }
    }

    const metrics: ActivityMetric[] = [
      {
        label: '총 사용자',
        value: Math.floor(Math.random() * 25000) + 20000, // Random for demo
        change: Math.random() * 20 - 5,
        trend: 'up'
      },
      {
        label: '새 리뷰',
        value: totalReviews,
        change: Math.random() * 15,
        trend: 'up'
      },
      {
        label: '검색 수',
        value: Math.floor(Math.random() * 5000) + 3000, // Random for demo
        change: Math.random() * 10 - 5,
        trend: 'stable'
      },
      {
        label: '즐겨찾기',
        value: Math.floor(Math.random() * 1000) + 500, // Random for demo
        change: Math.random() * 25,
        trend: 'up'
      },
      {
        label: '페이지 조회',
        value: Math.floor(Math.random() * 20000) + 15000, // Random for demo
        change: Math.random() * 12,
        trend: 'up'
      },
      {
        label: '평균 세션',
        value: Math.floor(Math.random() * 500) + 200, // Random for demo
        change: Math.random() * 8,
        trend: 'stable'
      }
    ];

    // Generate time series data (last 24 hours)
    const timeSeries = [];
    for (let i = 0; i < 24; i += 4) {
      const hour = i.toString().padStart(2, '0') + ':00';
      timeSeries.push({
        time: hour,
        users: Math.floor(Math.random() * 400) + 100,
        reviews: Math.floor(Math.random() * 50) + 10,
        searches: Math.floor(Math.random() * 300) + 100
      });
    }

    return NextResponse.json({ 
      metrics: metrics.map(m => ({ ...m, icon: '', color: 'blue' })),
      timeSeries 
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json({ error: 'Failed to fetch user activity' }, { status: 500 });
  }
}

async function getOverviewStats(): Promise<NextResponse> {
  try {
    const restaurantKeys = await redis.keys('restaurant:*');
    const reviewKeys = await redis.keys('reviews:*');
    
    let totalReviews = 0;
    for (const key of reviewKeys) {
      const reviews = await redis.hgetall(key);
      if (reviews) {
        totalReviews += Object.keys(reviews).length;
      }
    }

    const stats = {
      totalUsers: Math.floor(Math.random() * 25000) + 20000, // Random for demo
      totalReviews,
      totalRestaurants: restaurantKeys.length,
      monthlyActiveUsers: Math.floor(Math.random() * 10000) + 8000 // Random for demo
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return NextResponse.json({ error: 'Failed to fetch overview stats' }, { status: 500 });
  }
}

// POST endpoint for updating analytics data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track-search':
        await trackSearch(data);
        break;
      case 'track-review':
        await trackReview(data);
        break;
      case 'track-visit':
        await trackVisit(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
  }
}

async function trackSearch(data: { query: string; timestamp: number }): Promise<void> {
  const key = `analytics:searches:${new Date().toISOString().split('T')[0]}`;
  await redis.hincrby(key, 'count', 1);
  await redis.hset(key, 'lastSearch', data.timestamp);
}

async function trackReview(data: { restaurantId: string; timestamp: number }): Promise<void> {
  const key = `analytics:reviews:${new Date().toISOString().split('T')[0]}`;
  await redis.hincrby(key, 'count', 1);
  await redis.hincrby(key, `restaurant:${data.restaurantId}`, 1);
}

async function trackVisit(data: { restaurantId: string; timestamp: number }): Promise<void> {
  const key = `analytics:visits:${data.restaurantId}`;
  await redis.hincrby(key, 'count', 1);
  await redis.hset(key, 'lastVisit', data.timestamp);
}
