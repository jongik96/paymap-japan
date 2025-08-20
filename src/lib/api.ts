// API utility functions for interacting with the backend

export interface Review {
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

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  paymentMethods: string[];
  rating: number;
  reviewCount: number;
}

// Reviews API
export const reviewsApi = {
  // Get reviews for a specific restaurant
  async getReviews(restaurantId: string): Promise<Review[]> {
    try {
      const response = await fetch(`/api/reviews?restaurantId=${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Create a new review
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>): Promise<Review | null> {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create review');
      }
      
      const data = await response.json();
      return data.review;
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  },

  // Delete a review
  async deleteReview(reviewId: string, restaurantId: string, anonymousId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/reviews?reviewId=${reviewId}&restaurantId=${restaurantId}&anonymousId=${anonymousId}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  },

  // Update helpful count
  async updateHelpfulCount(_reviewId: string, _restaurantId: string, _increment: boolean): Promise<boolean> {
    try {
      // This would need a new API endpoint for updating helpful count
      // For now, we'll return true as a placeholder
      return true;
    } catch (error) {
      console.error('Error updating helpful count:', error);
      return false;
    }
  }
};

// Restaurants API
export const restaurantsApi = {
  // Get all restaurants
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await fetch('/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      return data.restaurants || [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  // Get a specific restaurant
  async getRestaurant(id: string): Promise<Restaurant | null> {
    try {
      const response = await fetch(`/api/restaurants?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }
      const data = await response.json();
      return data.restaurant;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
  },

  // Create a new restaurant
  async createRestaurant(restaurantData: Omit<Restaurant, 'rating' | 'reviewCount'>): Promise<Restaurant | null> {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }
      
      const data = await response.json();
      return data.restaurant;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      return null;
    }
  },

  // Update restaurant
  async updateRestaurant(id: string, updates: Partial<Pick<Restaurant, 'paymentMethods' | 'rating'>>): Promise<boolean> {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      return false;
    }
  }
};
