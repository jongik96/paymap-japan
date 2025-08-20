import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('id');
    
    if (restaurantId) {
      // Get specific restaurant
      const restaurant = await redis.hgetall(`restaurant:${restaurantId}`);
      if (!restaurant || Object.keys(restaurant).length === 0) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
      }
      return NextResponse.json({ restaurant });
    }

    // Get all restaurants
    const restaurantKeys = await redis.keys('restaurant:*');
    const restaurants = [];
    
    for (const key of restaurantKeys) {
      if (!key.includes(':reviews')) {
        const restaurant = await redis.hgetall(key);
        if (restaurant && Object.keys(restaurant).length > 0) {
          restaurants.push(restaurant);
        }
      }
    }

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, address, lat, lng, paymentMethods, rating, reviewCount } = body;

    // Validate required fields
    if (!id || !name || !address || !lat || !lng) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const restaurant = {
      id,
      name,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      paymentMethods: paymentMethods || [],
      rating: rating || 0,
      reviewCount: reviewCount || 0
    };

    // Save restaurant to Redis
    await redis.hset(`restaurant:${id}`, restaurant);

    return NextResponse.json({ success: true, restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, paymentMethods, rating } = body;

    if (!id) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Update restaurant data
    if (paymentMethods) {
      await redis.hset(`restaurant:${id}`, { paymentMethods });
    }
    
    if (rating !== undefined) {
      await redis.hset(`restaurant:${id}`, { rating });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}
