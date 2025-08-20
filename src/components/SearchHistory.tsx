'use client';

import { useState, useEffect } from 'react';
import { Clock, X, Search, MapPin } from 'lucide-react';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  location?: { lat: number; lng: number };
}

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSelect: (query: string, location?: { lat: number; lng: number }) => void;
}

export default function SearchHistory({
  isOpen,
  onClose,
  onSearchSelect,
}: SearchHistoryProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('paymap_search_history');
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse search history:', error);
        }
      }
    }
  }, [isOpen]);

  const addToHistory = (query: string, location?: { lat: number; lng: number }) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      location,
    };

    const updatedHistory = [newItem, ...searchHistory.filter(item => item.query !== query)].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('paymap_search_history', JSON.stringify(updatedHistory));
  };

  const removeFromHistory = (id: string) => {
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem('paymap_search_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('paymap_search_history');
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {searchHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No search history yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Your recent searches will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onSearchSelect(item.query, item.location);
                      onClose();
                    }}
                    className="flex-1 flex items-center space-x-3 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.query}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(item.timestamp)}</span>
                        {item.location && (
                          <>
                            <MapPin className="h-3 w-3" />
                            <span>Location saved</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                    title="Remove from history"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchHistory.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {searchHistory.length} recent searches
            </span>
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export function to add items to history from other components
export const addSearchToHistory = (query: string, location?: { lat: number; lng: number }) => {
  const saved = localStorage.getItem('paymap_search_history');
  let history: SearchHistoryItem[] = [];
  
  if (saved) {
    try {
      history = JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse search history:', error);
    }
  }

  const newItem: SearchHistoryItem = {
    id: Date.now().toString(),
    query,
    timestamp: Date.now(),
    location,
  };

  const updatedHistory = [newItem, ...history.filter(item => item.query !== query)].slice(0, 10);
  localStorage.setItem('paymap_search_history', JSON.stringify(updatedHistory));
};
