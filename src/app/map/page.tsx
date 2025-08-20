'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { MapPin, CreditCard, Star, X, MessageCircle, Search, Loader2, Filter, User, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { reviewsApi, restaurantsApi, type Review, type Restaurant } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';

// Extend Restaurant interface to include placeId for Google Places
interface ExtendedRestaurant extends Restaurant {
  placeId?: string;
}

const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Ramen Yamamoto',
    address: '2-1-1 Shibuya, Shibuya-ku, Tokyo',
    lat: 35.6581,
    lng: 139.7016,
    paymentMethods: ['Cash', 'Credit Card', 'Suica', 'PayPay'],
    rating: 4.5,
    reviewCount: 23
  },
  {
    id: '2',
    name: 'Sushi Sato',
    address: '5-2-1 Roppongi, Minato-ku, Tokyo',
    lat: 35.6654,
    lng: 139.7296,
    paymentMethods: ['Cash', 'Credit Card', 'Suica'],
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: '3',
    name: 'Udon Kinokuni',
    address: '3-1-1 Shinjuku, Shinjuku-ku, Tokyo',
    lat: 35.6909,
    lng: 139.7005,
    paymentMethods: ['Cash', 'Credit Card', 'PayPay', 'LINE Pay'],
    rating: 4.2,
    reviewCount: 18
  }
];

const allPaymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Suica',
  'Pasmo',
  'PayPay',
  'LINE Pay',
  'd払い (d-Barai)',
  '楽天Pay (Rakuten Pay)',
  'メルPay (MeruPay)',
  'au PAY',
  'Apple Pay',
  'Google Pay',
  'Amazon Pay',
  'Other'
];

// Generate anonymous user ID
const generateAnonymousId = () => {
  const adjectives = ['Happy', 'Friendly', 'Curious', 'Adventurous', 'Wise', 'Cheerful', 'Brave', 'Calm', 'Energetic', 'Gentle'];
  const nouns = ['Traveler', 'Explorer', 'Foodie', 'Adventurer', 'Discoverer', 'Wanderer', 'Seeker', 'Observer', 'Collector', 'Enthusiast'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

// Get or create anonymous user ID
const getAnonymousId = () => {
  let anonymousId = localStorage.getItem('paymap_anonymous_id');
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem('paymap_anonymous_id', anonymousId);
  }
  return anonymousId;
};

// Load reviews from API
const loadReviews = async (restaurantId: string): Promise<Review[]> => {
  try {
    return await reviewsApi.getReviews(restaurantId);
  } catch (error) {
    console.error('Failed to load reviews:', error);
    return [];
  }
};

export default function MapPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6762, lng: 139.6503 });
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  // Initialize anonymous ID
  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);
  }, []);

  const handleReviewSubmit = async (data: { paymentMethods: string[]; comment: string; rating: number }) => {
    if (!selectedRestaurant) return;

    try {
      const newReview = await reviewsApi.createReview({
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        paymentMethods: data.paymentMethods,
        comment: data.comment,
        rating: data.rating,
        anonymousId: anonymousId
      });

      if (newReview) {
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleMarkerClick = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    
    try {
      // Load reviews for this restaurant from API
      const restaurantReviews = await loadReviews(restaurant.id);
      if (restaurantReviews.length === 0) {
        // Show sample review if no real reviews exist
        setReviews([
          {
            id: 'sample-1',
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            paymentMethods: ['Credit Card'],
            comment: 'Sample review - Add your own review to share actual payment options!',
            rating: 5,
            createdAt: '2024-01-15',
            anonymousId: 'SampleUser',
            helpfulCount: 0
          }
        ]);
      } else {
        setReviews(restaurantReviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Show sample review on error
      setReviews([
        {
          id: 'sample-1',
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          paymentMethods: ['Credit Card'],
          comment: 'Sample review - Add your own review to share actual payment options!',
          rating: 5,
          createdAt: '2024-01-15',
          anonymousId: 'SampleUser',
          helpfulCount: 0
        }
      ]);
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!selectedRestaurant) return;
    
    try {
      const success = await reviewsApi.deleteReview(reviewId, selectedRestaurant.id, anonymousId);
      if (success) {
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (!selectedRestaurant) return;
    
    try {
      const success = await reviewsApi.updateHelpfulCount(reviewId, selectedRestaurant.id, true);
      if (success) {
        const updatedReviews = reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        );
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Failed to update helpful count:', error);
    }
  };

  const searchRestaurants = useCallback(async (query: string) => {
    if (!query.trim() || !window.google) return;

    setIsSearching(true);
    try {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        query: query + ' restaurant',
        location: new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        radius: 5000,
        type: 'restaurant'
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const restaurants: Restaurant[] = results.slice(0, 10).map((place, index) => ({
            id: `search-${index}`,
            name: place.name || 'Unknown Restaurant',
            address: place.formatted_address || 'Address not available',
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            paymentMethods: ['Cash', 'Credit Card'], // Default payment methods
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            placeId: place.place_id
          }));

          setSearchResults(restaurants);
          
          // Center map on first result
          if (restaurants.length > 0) {
            setMapCenter({ lat: restaurants[0].lat, lng: restaurants[0].lng });
            setMapZoom(15);
          }
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      });
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
    }
  }, [mapCenter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchRestaurants(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setMapCenter({ lat: 35.6762, lng: 139.6503 });
    setMapZoom(12);
  };

  const togglePaymentMethod = (method: string) => {
    setSelectedPaymentMethods(prev => 
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const clearFilters = () => {
    setSelectedPaymentMethods([]);
  };

  // Filter restaurants based on selected payment methods
  const filteredRestaurants = useMemo(() => {
    const allRestaurants = [...sampleRestaurants, ...searchResults];
    
    if (selectedPaymentMethods.length === 0) {
      return allRestaurants;
    }

    return allRestaurants.filter(restaurant =>
      restaurant.paymentMethods.some(method =>
        selectedPaymentMethods.includes(method)
      )
    );
  }, [searchResults, selectedPaymentMethods]);

  // Update map center when filters change
  useMemo(() => {
    if (filteredRestaurants.length > 0 && selectedPaymentMethods.length > 0) {
      const avgLat = filteredRestaurants.reduce((sum, r) => sum + r.lat, 0) / filteredRestaurants.length;
      const avgLng = filteredRestaurants.reduce((sum, r) => sum + r.lng, 0) / filteredRestaurants.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(13);
    }
  }, [filteredRestaurants, selectedPaymentMethods]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load Google Maps</h2>
          <p className="text-gray-600">Please check your API key and try again.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

          return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PayMap Japan</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>Anonymous: {anonymousId}</span>
              </div>
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants in Tokyo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
            {searchResults.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {/* Filter Toggle and Payment Methods */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter by Payment Methods</span>
              {selectedPaymentMethods.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {selectedPaymentMethods.length}
                </span>
              )}
            </button>
            
            {selectedPaymentMethods.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Payment Methods Filter */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Payment Methods:</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {allPaymentMethods.map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPaymentMethods.includes(method)}
                      onChange={() => togglePaymentMethod(method)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {searchResults.length > 0 && (
                <span>Found {searchResults.length} restaurant(s) • </span>
              )}
              <span>Showing {filteredRestaurants.length} restaurant(s)</span>
              {selectedPaymentMethods.length > 0 && (
                <span> with selected payment methods</span>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Show original restaurants
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Map Container */}
        <div className="flex-1 relative">
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={mapCenter}
            zoom={mapZoom}
            onCenterChanged={() => {
              // Center will be updated automatically by Google Maps
            }}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            {filteredRestaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                position={{ lat: restaurant.lat, lng: restaurant.lng }}
                title={restaurant.name}
                onClick={() => handleMarkerClick(restaurant)}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${restaurant.id.startsWith('search-') ? '#10B981' : '#3B82F6'}"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(24, 24)
                }}
              />
            ))}
          </GoogleMap>
        </div>

        {/* Restaurant Info Sidebar */}
        {selectedRestaurant && (
          <div className="w-96 bg-white shadow-lg border-l overflow-y-auto">
            <div className="p-6">
              {/* Restaurant Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Restaurant Details */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2">{selectedRestaurant.address}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-700">
                    {selectedRestaurant.rating} ({selectedRestaurant.reviewCount} reviews)
                  </span>
                </div>
                {selectedRestaurant.id.startsWith('search-') && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Search className="h-3 w-3 mr-1" />
                      Search Result
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRestaurant.paymentMethods.map((method, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        selectedPaymentMethods.includes(method)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {method}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  * Payment methods are based on sample data. Add your own review to share actual payment options.
                </p>
              </div>

              {/* Reviews Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center font-medium transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Write Review
                  </button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-wrap gap-1">
                            {review.paymentMethods.map((method, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        
                        {/* Review Footer */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{review.anonymousId}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{review.createdAt}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleHelpfulClick(review.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                            >
                              <span>👍</span>
                              <span>{review.helpfulCount}</span>
                            </button>
                            
                            {review.anonymousId === anonymousId && (
                              <button
                                onClick={() => handleReviewDelete(review.id)}
                                className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && selectedRestaurant && (
          <ReviewForm
            restaurantName={selectedRestaurant.name}
            onClose={() => setShowReviewForm(false)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </div>
    </div>
  );
}