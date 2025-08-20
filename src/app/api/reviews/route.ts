import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  paymentMethods: string[];
  comment: string;
  rating: number;
  createdAt: string;
  anonymousId: string;
  helpfulCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Get reviews for specific restaurant
    const reviews = await redis.hgetall(`restaurant:${restaurantId}:reviews`);
    
    // Convert to array format
    const reviewsArray = Object.values(reviews || {}).map((review: unknown) => {
      const typedReview = review as Review;
      return {
        ...typedReview,
        id: typedReview.id,
        restaurantId: typedReview.restaurantId,
        restaurantName: typedReview.restaurantName,
        paymentMethods: typedReview.paymentMethods,
        comment: typedReview.comment,
        rating: typedReview.rating,
        createdAt: typedReview.createdAt,
        anonymousId: typedReview.anonymousId,
        helpfulCount: typedReview.helpfulCount || 0
      };
    });

    return NextResponse.json({ reviews: reviewsArray });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, restaurantName, paymentMethods, comment, rating, anonymousId } = body;

    // Validate required fields
    if (!restaurantId || !restaurantName || !paymentMethods || !comment || !rating || !anonymousId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reviewId = Date.now().toString();
    const review: Review = {
      id: reviewId,
      restaurantId,
      restaurantName,
      paymentMethods,
      comment,
      rating,
      createdAt: new Date().toISOString().split('T')[0],
      anonymousId,
      helpfulCount: 0
    };

    // Save review to Redis
    await redis.hset(`restaurant:${restaurantId}:reviews`, { [reviewId]: review });
    
    // Update restaurant review count
    await redis.hincrby(`restaurant:${restaurantId}`, 'reviewCount', 1);

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    const restaurantId = searchParams.get('restaurantId');
    const anonymousId = searchParams.get('anonymousId');

    if (!reviewId || !restaurantId || !anonymousId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get review to check ownership
    const review = await redis.hget(`restaurant:${restaurantId}:reviews`, reviewId) as Review | null;
    
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user owns the review
    if (review.anonymousId !== anonymousId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete review
    await redis.hdel(`restaurant:${restaurantId}:reviews`, reviewId);
    
    // Decrease restaurant review count
    await redis.hincrby(`restaurant:${restaurantId}`, 'reviewCount', -1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
