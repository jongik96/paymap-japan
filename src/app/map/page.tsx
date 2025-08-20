'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { MapPin, CreditCard, Star, X, MessageCircle, Search, Loader2, Filter, User, Clock, Trash2, Heart, History, Navigation } from 'lucide-react';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { reviewsApi, type Review, type Restaurant } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import AdvancedFilters from '@/components/AdvancedFilters';
// import SortOptions, { type SortOption } from '@/components/SortOptions'; // Hidden
import SearchHistory from '@/components/SearchHistory';
import Favorites, { addToFavorites, isInFavorites } from '@/components/Favorites';
import { addSearchToHistory } from '@/components/SearchHistory';
import { useLanguage } from '@/contexts/LanguageContext';



const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Ramen Yamamoto',
    address: '2-1-1 Gion, Higashiyama-ku, Kyoto',
    lat: 34.9857706,
    lng: 135.6977854,
    paymentMethods: ['Cash', 'Credit Card', 'Suica', 'PayPay'],
    rating: 4.5,
    reviewCount: 23
  }, 
  {
    id: '2',
    name: 'Sushi Sato',
    address: '5-2-1 Pontocho, Nakagyo-ku, Kyoto',
    lat: 34.9857706,
    lng: 135.6977854,
    paymentMethods: ['Cash', 'Credit Card', 'Suica'],
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: '3',
    name: 'Udon Kinokuni',
    address: '3-1-1 Arashiyama, Ukyo-ku, Kyoto',
    lat: 34.9857706,
    lng: 135.6977854,
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

// Google Maps libraries를 상수로 정의하여 경고 방지
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ['places'];

export default function MapPage() {
  const { t } = useLanguage();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string>('');
  const [restaurantReviews, setRestaurantReviews] = useState<{ [key: string]: Review[] }>({});
  
  // 현재 선택된 식당의 리뷰만 가져오는 computed value
  const currentReviews = useMemo(() => {
    if (!currentRestaurantId) return [];
    return restaurantReviews[currentRestaurantId] || [];
  }, [currentRestaurantId, restaurantReviews]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // 기본 위치를 교토로 설정 (위치 정보를 허용하지 않는 경우)
  const [mapCenter, setMapCenter] = useState({ lat: 34.9857706, lng: 135.6977854 }); // 교토
  const [mapZoom, setMapZoom] = useState(12);
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'success' | 'error' | 'default'>('detecting');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>('');
  
  // 검색 결과 리스트 표시 상태
  const [showSearchResultsList, setShowSearchResultsList] = useState(true);
  // Advanced search states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // const [showSortOptions, setShowSortOptions] = useState(false); // Hidden
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  // const [currentSort, setCurrentSort] = useState<SortOption>('rating'); // Hidden
  // const [isAscending, setIsAscending] = useState(false); // Hidden
  
  // Advanced filter states
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [] as string[],
    rating: 0,
    distance: 10,
    openNow: false,
    hasReviews: false,
    paymentMethods: [] as string[]
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Initialize anonymous ID and get current location
  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);
    
    // Get current location when page loads
    const getLocation = () => {
      if (navigator.geolocation) {
        console.log('Attempting to get current location...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('✅ Current location detected:', latitude, longitude);
            
            // Check if the detected location is actually in Kyoto area
            // Kyoto coordinates: approximately 34.9857706, 135.6977854
            const kyotoLat = 34.9857706;
            const kyotoLng = 135.6977854;
            const distanceThreshold = 0.1; // About 11km radius
            
            const latDiff = Math.abs(latitude - kyotoLat);
            const lngDiff = Math.abs(longitude - kyotoLng);
            
            if (latDiff < distanceThreshold && lngDiff < distanceThreshold) {
              // User is actually in Kyoto area
              console.log('📍 User is in Kyoto area, using Kyoto coordinates');
              setMapCenter({ lat: kyotoLat, lng: kyotoLng });
              setMapZoom(14);
              setLocationStatus('success');
            } else {
              // User is not in Kyoto, use detected location
              console.log('📍 User is not in Kyoto, using detected location:', latitude, longitude);
              setMapCenter({ lat: latitude, lng: longitude });
              setMapZoom(14);
              setLocationStatus('success');
            }
          },
          (error) => {
            console.log('❌ Geolocation error:', error);
            console.log('📍 Using Kyoto as default location due to geolocation error');
            setLocationStatus('error');
            // 에러가 발생해도 교토는 이미 기본값으로 설정되어 있음
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0 // Always get fresh location
          }
        );
      } else {
        console.log('❌ Geolocation not supported, using Kyoto as default');
        setLocationStatus('default');
      }
    };

    // Try to get location immediately
    getLocation();
    
    // Also try after a short delay in case of permission issues
    const timer = setTimeout(() => {
      console.log('🔄 Retrying location detection...');
      getLocation();
    }, 1000);
    
    // Set default status if geolocation is not supported
    if (!navigator.geolocation) {
      setLocationStatus('default');
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Monitor mapCenter changes for debugging
  useEffect(() => {
    console.log('🗺️ Map center updated to:', mapCenter.lat, mapCenter.lng);
  }, [mapCenter]);

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
        // 새 리뷰를 현재 식당의 리뷰에 추가
        const updatedReviews = [newReview, ...currentReviews];
        
        // 캐시 업데이트
        setRestaurantReviews(prev => ({
          ...prev,
          [currentRestaurantId]: updatedReviews
        }));
        
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleMarkerClick = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentRestaurantId(restaurant.id);
    
    // 검색 결과 식당을 선택할 때 다른 검색 결과의 캐시 정리
    if (restaurant.id.startsWith('search-')) {
      setRestaurantReviews(prev => {
        const newCache: { [key: string]: Review[] } = {};
        // 기본 식당들과 현재 선택된 식당의 리뷰만 유지
        Object.keys(prev).forEach(key => {
          if (!key.startsWith('search-') || key === restaurant.id) {
            newCache[key] = prev[key];
          }
        });
        return newCache;
      });
    }
    
    try {
      // 이미 로드된 리뷰가 있는지 확인
      if (restaurantReviews[restaurant.id]) {
        return;
      }
      
      // Load reviews for this restaurant from API
      const apiReviews = await loadReviews(restaurant.id);
      let finalReviews: Review[];
      
      if (apiReviews.length === 0) {
        // Show sample review if no real reviews exist
        finalReviews = [
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
        ];
      } else {
        finalReviews = apiReviews;
      }
      
      // 캐시에 저장
      setRestaurantReviews(prev => ({
        ...prev,
        [restaurant.id]: finalReviews
      }));
      
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Show sample review on error
      const errorReviews = [
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
      ];
      // 에러 시에도 캐시에 저장
      setRestaurantReviews(prev => ({
        ...prev,
        [restaurant.id]: errorReviews
      }));
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!selectedRestaurant) return;
    
    try {
      const success = await reviewsApi.deleteReview(reviewId, selectedRestaurant.id, anonymousId);
      if (success) {
        const updatedReviews = currentReviews.filter(review => review.id !== reviewId);
        
        // 캐시 업데이트
        if (currentRestaurantId) {
          setRestaurantReviews(prev => ({
            ...prev,
            [currentRestaurantId]: updatedReviews
          }));
        }
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (!selectedRestaurant) return;
    
    try {
             const success = await reviewsApi.updateHelpfulCount();
      if (success) {
        const updatedReviews = currentReviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        );
        
        // 캐시 업데이트
        if (currentRestaurantId) {
          setRestaurantReviews(prev => ({
            ...prev,
            [currentRestaurantId]: updatedReviews
          }));
        }
      }
    } catch (error) {
      console.error('Failed to update helpful count:', error);
    }
  };

  const searchRestaurants = useCallback(async (query: string) => {
    if (!query.trim() || !window.google) return;

    setIsSearching(true);
    
    // 새로운 검색 시 이전 검색 결과의 리뷰 캐시 초기화
    setRestaurantReviews(prev => {
      const newCache: { [key: string]: Review[] } = {};
      // 기본 식당들의 리뷰는 유지
      Object.keys(prev).forEach(key => {
        if (!key.startsWith('search-')) {
          newCache[key] = prev[key];
        }
      });
      return newCache;
    });
    
    try {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        query: query, // 일본 전체 지역 검색
        // location과 radius 제거하여 일본 전체에서 검색
        type: 'restaurant'
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const restaurants: Restaurant[] = results.slice(0, 20).map((place, index) => ({ // 결과 수를 20개로 증가
            id: `search-${Date.now()}-${index}-${place.place_id}`,
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
          
          // 검색 결과가 있을 때 리스트를 자동으로 표시
          if (restaurants.length > 0) {
            setShowSearchResultsList(true);
          }
          
          // Add to search history
          addSearchToHistory(query, { lat: mapCenter.lat, lng: mapCenter.lng });
          
          // 검색 결과가 있을 때만 지도 중심을 이동 (사용자가 원하는 경우)
          if (restaurants.length > 0) {
            // 첫 번째 결과로 지도 중심 이동 (선택사항)
            // setMapCenter({ lat: restaurants[0].lat, lng: restaurants[0].lng });
            // setMapZoom(15);
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
    setShowSearchResultsList(false); // 검색 결과 리스트도 함께 숨기기
    setMapCenter({ lat: 34.9857706, lng: 135.6977854 }); // 교토로 변경
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

  // Advanced search handlers
  const handleAdvancedFiltersChange = (filters: {
    priceRange: string[];
    rating: number;
    distance: number;
    openNow: boolean;
    hasReviews: boolean;
    paymentMethods: string[];
  }) => {
    setAdvancedFilters(filters);
  };

  const handleAdvancedFiltersClear = () => {
    setAdvancedFilters({
      priceRange: [],
      rating: 0,
      distance: 10,
      openNow: false,
      hasReviews: false,
      paymentMethods: []
    });
  };

  // const handleSortChange = (sort: SortOption) => { // Hidden
  //   setCurrentSort(sort);
  // };

  // const handleDirectionChange = (ascending: boolean) => { // Hidden
  //   setIsAscending(ascending);
  // };

  const handleSearchHistorySelect = (query: string, location?: { lat: number; lng: number }) => {
    setSearchQuery(query);
    if (location) {
      setMapCenter(location);
      setMapZoom(15);
    }
    searchRestaurants(query);
  };

  const handleFavoriteRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setMapCenter({ lat: restaurant.lat, lng: restaurant.lng });
    setMapZoom(15);
  };

  const handleAddToFavorites = (restaurant: Restaurant) => {
    addToFavorites(restaurant);
    // Force re-render to update favorite status
    setSelectedRestaurant({ ...restaurant });
  };

  // Get current location and center map
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      console.log('🔄 Getting current location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✅ Current location updated:', latitude, longitude);
          
          // Check if the detected location is actually in Kyoto area
          const kyotoLat = 34.9857706;
          const kyotoLng = 135.6977854;
          const distanceThreshold = 0.1; // About 11km radius
          
          const latDiff = Math.abs(latitude - kyotoLat);
          const lngDiff = Math.abs(longitude - kyotoLng);
          
          if (latDiff < distanceThreshold && lngDiff < distanceThreshold) {
            // User is actually in Kyoto area
            console.log('📍 User is in Kyoto area, using Kyoto coordinates');
            setMapCenter({ lat: kyotoLat, lng: kyotoLng });
            setMapZoom(14);
            setLocationStatus('success');
          } else {
            // User is not in Kyoto, use detected location
            console.log('📍 User is not in Kyoto, using detected location:', latitude, longitude);
            setMapCenter({ lat: latitude, lng: longitude });
            setMapZoom(14);
            setLocationStatus('success');
          }
        },
        (error) => {
          console.log('❌ Geolocation error:', error);
          console.log('📍 Moving to Kyoto due to geolocation error');
          // 위치 정보를 허용하지 않는 경우 교토로 이동
          setMapCenter({ lat: 34.9857706, lng: 135.6977854 });
          setMapZoom(12);
          setLocationStatus('error');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      console.log('❌ Geolocation not supported');
      console.log('📍 Moving to Kyoto');
      // 교토로 이동
      setMapCenter({ lat: 34.9857706, lng: 135.6977854 });
      setMapZoom(12);
      setLocationStatus('default');
    }
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
      // Don't auto-update map center when filters change to preserve user's location
      // setMapCenter({ lat: avgLat, lng: avgLng });
      // setMapZoom(13);
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
               <LanguageToggle />
               <ThemeToggle />
               <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                 <User className="h-4 w-4" />
                 <span>{t('header.anonymous')}: {anonymousId}</span>
               </div>
               <Link 
                 href="/" 
                 className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
               >
                 {t('header.backToHome')}
               </Link>
             </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search Bar */}
          <div className="relative mb-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('search.searching')}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    {t('search.button')}
                  </>
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  {t('search.clear')}
                </button>
              )}
            </form>
            
            {/* 검색 안내 텍스트 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong>일본 전체 지역의 식당을 검색할 수 있습니다!</strong><br/>
                  예시: &ldquo;라멘&rdquo;, &ldquo;스시&rdquo;, &ldquo;오사카 음식점&rdquo;, &ldquo;도쿄 카페&rdquo;, &ldquo;교토 전통음식&rdquo; 등<br/>
                  검색 결과는 일본 전역에서 찾아집니다.
                </span>
              </p>
            </div>
          </div>

                     {/* Advanced Search Tools */}
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               {/* Basic Payment Methods Filter */}
               <button
                 onClick={() => setShowFilters(!showFilters)}
                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
               >
                 <Filter className="h-4 w-4" />
                 <span>{t('filters.paymentMethods')}</span>
                 {selectedPaymentMethods.length > 0 && (
                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                     {selectedPaymentMethods.length}
                   </span>
                 )}
               </button>

               {/* Advanced Filters */}
               <button
                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
               >
                 <Filter className="h-4 w-4" />
                 <span>{t('filters.advanced')}</span>
                 {(advancedFilters.priceRange.length > 0 || advancedFilters.rating > 0 || advancedFilters.distance !== 10 || advancedFilters.openNow || advancedFilters.hasReviews) && (
                   <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                     Active
                   </span>
                 )}
               </button>

               {/* Sort Options - Hidden */}
               {/* <button
                 onClick={() => setShowSortOptions(!showSortOptions)}
                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
               >
                 <SortAsc className="h-4 w-4" />
                 <span>{t('filters.sort')}</span>
               </button> */}

               {/* Search History */}
               <button
                 onClick={() => setShowSearchHistory(!showSearchHistory)}
                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
               >
                 <History className="h-4 w-4" />
                 <span>{t('filters.history')}</span>
               </button>

               {/* Favorites */}
               <button
                 onClick={() => setShowFavorites(!showFavorites)}
                 className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
               >
                 <Heart className="h-4 w-4" />
                 <span>{t('filters.favorites')}</span>
               </button>
             </div>
             
             {(selectedPaymentMethods.length > 0 || advancedFilters.priceRange.length > 0 || advancedFilters.rating > 0 || advancedFilters.distance !== 10 || advancedFilters.openNow || advancedFilters.hasReviews) && (
               <button
                 onClick={() => {
                   clearFilters();
                   handleAdvancedFiltersClear();
                 }}
                 className="text-sm text-blue-600 hover:text-blue-700 underline"
               >
                 {t('filters.clearAll')}
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
            <div className="flex items-center space-x-3">
              {searchResults.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    🔍 검색 결과: {searchResults.length}개 식당
                  </span>
                  <span className="text-gray-500">•</span>
                  <span>일본 전체 지역에서 검색됨</span>
                </div>
              ) : (
                <span>기본 식당 {filteredRestaurants.length}개 표시 중</span>
              )}
              
              {selectedPaymentMethods.length > 0 && (
                <>
                  <span className="text-gray-500">•</span>
                  <span>선택된 결제수단으로 필터링됨</span>
                </>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                기본 식당으로 돌아가기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Location Status */}
          <div className="absolute top-4 left-4 z-10">
            {locationStatus === 'detecting' && (
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>위치 감지 중...</span>
              </div>
            )}
            {locationStatus === 'success' && (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <span>✅</span>
                <span>현재 위치</span>
              </div>
            )}
            {locationStatus === 'error' && (
              <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <span>📍</span>
                <span>교토 (기본)</span>
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            {/* Zoom Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
                title="확대"
              >
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">+</span>
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="축소"
              >
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">−</span>
              </button>
            </div>
            
            {/* Current Location Button */}
            <button
              onClick={getCurrentLocation}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              title="현재 위치로 이동"
            >
              <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
          
          {/* Search Results List Overlay */}
          {searchResults.length > 0 && showSearchResultsList && (
            <div className="absolute top-20 left-4 z-10 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
                <h3 className="font-semibold text-sm">
                  🔍 검색 결과 ({searchResults.length}개)
                </h3>
                <button
                  onClick={() => setShowSearchResultsList(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  title="리스트 숨기기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Results List */}
              <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {searchResults.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors last:border-b-0"
                    onClick={() => handleMarkerClick(restaurant)}
                  >
                    {/* Restaurant Name & Category */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight flex-1 mr-2">
                        {restaurant.name}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-shrink-0">
                        식당
                      </span>
                    </div>
                    
                    {/* City */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      📍 {restaurant.address.split(',').slice(-2).join(', ')}
                    </p>
                    
                    {/* Payment Methods */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {restaurant.paymentMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {restaurant.rating > 0 ? restaurant.rating : '평점 없음'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Show Search Results Button (when hidden) */}
          {searchResults.length > 0 && !showSearchResultsList && (
            <button
              onClick={() => setShowSearchResultsList(true)}
              className="absolute top-20 left-4 z-10 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
              title="검색 결과 보기"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">검색 결과 보기 ({searchResults.length})</span>
            </button>
          )}
          
          <GoogleMap
            key={`${mapCenter.lat}-${mapCenter.lng}-${mapZoom}`}
            mapContainerClassName="w-full h-full"
            center={mapCenter}
            zoom={mapZoom}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ],
              // Hide default Google Maps controls to prevent overlap
              disableDefaultUI: true,
              zoomControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false
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
                     <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${restaurant.id.startsWith('search-') ? '#10B981' : '#3B82F6'}"/>
                       <circle cx="12" cy="9" r="2.5" fill="white"/>
                     </svg>
                   `),
                   scaledSize: new google.maps.Size(restaurant.id.startsWith('search-') ? 72 : 24, restaurant.id.startsWith('search-') ? 72 : 24)
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
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => handleAddToFavorites(selectedRestaurant)}
                     className={`p-2 rounded-full transition-colors ${
                       isInFavorites(selectedRestaurant.id)
                         ? 'text-red-500 hover:text-red-600'
                         : 'text-gray-400 hover:text-red-500'
                     }`}
                     title={isInFavorites(selectedRestaurant.id) ? 'Remove from favorites' : 'Add to favorites'}
                   >
                     <Heart className={`h-5 w-5 ${isInFavorites(selectedRestaurant.id) ? 'fill-current' : ''}`} />
                   </button>
                   <button
                     onClick={() => setSelectedRestaurant(null)}
                     className="text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     <X className="h-5 w-5" />
                   </button>
                 </div>
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

                {currentReviews.length > 0 ? (
                  <div className="space-y-3">
                    {currentReviews.map((review) => (
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

         {/* Advanced Filters Modal */}
         <AdvancedFilters
           isOpen={showAdvancedFilters}
           onClose={() => setShowAdvancedFilters(false)}
           filters={advancedFilters}
           onFiltersChange={handleAdvancedFiltersChange}
           onClearAll={handleAdvancedFiltersClear}
         />

         {/* Sort Options Modal - Hidden */}
         {/* <SortOptions
           currentSort={currentSort}
           onSortChange={handleSortChange}
           isAscending={isAscending}
           onDirectionChange={handleDirectionChange}
         /> */}

         {/* Search History Modal */}
         <SearchHistory
           isOpen={showSearchHistory}
           onClose={() => setShowSearchHistory(false)}
           onSearchSelect={handleSearchHistorySelect}
         />

         {/* Favorites Modal */}
         <Favorites
           isOpen={showFavorites}
           onClose={() => setShowFavorites(false)}
           onRestaurantSelect={handleFavoriteRestaurantSelect}
         />
       </div>
     </div>
   );
 }