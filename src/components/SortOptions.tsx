'use client';

import { useState } from 'react';
import { ArrowUpDown, Star, MessageCircle, MapPin, Alphabetical } from 'lucide-react';

export type SortOption = 'rating' | 'reviewCount' | 'distance' | 'name' | 'newest';

interface SortOptionsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  isAscending: boolean;
  onDirectionChange: (ascending: boolean) => void;
}

const sortOptions = [
  { value: 'rating', label: 'Rating', icon: Star },
  { value: 'reviewCount', label: 'Reviews', icon: MessageCircle },
  { value: 'distance', label: 'Distance', icon: MapPin },
  { value: 'name', label: 'Name', icon: Alphabetical },
  { value: 'newest', label: 'Newest', icon: ArrowUpDown },
] as const;

export default function SortOptions({
  currentSort,
  onSortChange,
  isAscending,
  onDirectionChange,
}: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  const toggleDirection = () => {
    onDirectionChange(!isAscending);
  };

  const currentOption = sortOptions.find(option => option.value === currentSort);

  return (
    <div className="relative">
      {/* Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {currentOption && (
          <>
            <currentOption.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentOption.label}
            </span>
          </>
        )}
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
      </button>

      {/* Direction Toggle */}
      <button
        onClick={toggleDirection}
        className="ml-2 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={isAscending ? 'Ascending' : 'Descending'}
      >
        <ArrowUpDown 
          className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isAscending ? 'rotate-0' : 'rotate-180'
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                ${currentSort === option.value 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300'
                }
                ${option.value === 'newest' ? 'border-t border-gray-200 dark:border-gray-700' : ''}
              `}
            >
              <option.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{option.label}</span>
              {currentSort === option.value && (
                <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
