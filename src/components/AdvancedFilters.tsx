'use client';

import { useState } from 'react';
import { Filter, Star, MapPin, Clock, DollarSign, X } from 'lucide-react';

interface FilterOptions {
  priceRange: string[];
  rating: number;
  distance: number;
  openNow: boolean;
  hasReviews: boolean;
  paymentMethods: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
}

const priceRanges = [
  { value: 'budget', label: 'Budget (¥)', icon: '¥' },
  { value: 'moderate', label: 'Moderate (¥¥)', icon: '¥¥' },
  { value: 'expensive', label: 'Expensive (¥¥¥)', icon: '¥¥¥' },
  { value: 'luxury', label: 'Luxury (¥¥¥¥)', icon: '¥¥¥¥' },
];

const distanceOptions = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
];

export default function AdvancedFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearAll,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleFilterChange = (key: keyof FilterOptions, value: string[] | number | boolean) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeToggle = (priceRange: string) => {
    const currentRanges = localFilters.priceRange;
    const newRanges = currentRanges.includes(priceRange)
      ? currentRanges.filter(r => r !== priceRange)
      : [...currentRanges, priceRange];
    
    handleFilterChange('priceRange', newRanges);
  };

  const handleClearAll = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [],
      rating: 0,
      distance: 10,
      openNow: false,
      hasReviews: false,
      paymentMethods: [],
    };
    setLocalFilters(defaultFilters);
    onClearAll();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Advanced Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Price Range
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handlePriceRangeToggle(range.value)}
                  className={`
                    p-2 text-sm rounded-md border transition-all duration-200
                    ${localFilters.priceRange.includes(range.value)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {range.icon} {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Minimum Rating
            </h4>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={localFilters.rating}
                onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                {localFilters.rating}+
              </span>
            </div>
          </div>

          {/* Distance */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Maximum Distance
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('distance', option.value)}
                  className={`
                    p-2 text-sm rounded-md border transition-all duration-200
                    ${localFilters.distance === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Other Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.openNow}
                onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Open Now</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasReviews}
                onChange={(e) => handleFilterChange('hasReviews', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Has Reviews</span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
