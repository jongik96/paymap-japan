'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Star, X, Trash2 } from 'lucide-react';
import { Restaurant } from '@/lib/api';

interface FavoriteItem {
  id: string;
  restaurant: Restaurant;
  addedAt: number;
  note?: string;
}

interface FavoritesProps {
  isOpen: boolean;
  onClose: () => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

export default function Favorites({
  isOpen,
  onClose,
  onRestaurantSelect,
}: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('paymap_favorites');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse favorites:', error);
        }
      }
    }
  }, [isOpen]);

  const addToFavorites = (restaurant: Restaurant, note?: string) => {
    const newFavorite: FavoriteItem = {
      id: Date.now().toString(),
      restaurant,
      addedAt: Date.now(),
      note,
    };

    const updatedFavorites = [newFavorite, ...favorites.filter(f => f.restaurant.id !== restaurant.id)];
    setFavorites(updatedFavorites);
    localStorage.setItem('paymap_favorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter(f => f.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('paymap_favorites', JSON.stringify(updatedFavorites));
  };

  const updateNote = (id: string, note: string) => {
    const updatedFavorites = favorites.map(f => 
      f.id === id ? { ...f, note } : f
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('paymap_favorites', JSON.stringify(updatedFavorites));
    setEditingNote(null);
    setNoteText('');
  };

  const startEditingNote = (id: string, currentNote: string) => {
    setEditingNote(id);
    setNoteText(currentNote || '');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Favorites
            </h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {favorites.length}
            </span>
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
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Add restaurants to your favorites to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Restaurant Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {favorite.restaurant.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{favorite.restaurant.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{favorite.restaurant.rating}</span>
                        <span>•</span>
                        <span>{favorite.restaurant.reviewCount} reviews</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      <button
                        onClick={() => onRestaurantSelect(favorite.restaurant)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => removeFromFavorites(favorite.id)}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Note Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    {editingNote === favorite.id ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => updateNote(favorite.id, noteText)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setNoteText('');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {favorite.note ? (
                            <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                              "{favorite.note}"
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              No note added
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startEditingNote(favorite.id, favorite.note || '')}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-2"
                        >
                          {favorite.note ? 'Edit' : 'Add'} Note
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Added {formatDate(favorite.addedAt)}
                    </span>
                    
                    {/* Payment Methods */}
                    <div className="flex flex-wrap gap-1">
                      {favorite.restaurant.paymentMethods.slice(0, 3).map((method, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium"
                        >
                          {method}
                        </span>
                      ))}
                      {favorite.restaurant.paymentMethods.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{favorite.restaurant.paymentMethods.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => {
                setFavorites([]);
                localStorage.removeItem('paymap_favorites');
              }}
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

// Export function to add items to favorites from other components
export const addToFavorites = (restaurant: Restaurant, note?: string) => {
  const saved = localStorage.getItem('paymap_favorites');
  let favorites: FavoriteItem[] = [];
  
  if (saved) {
    try {
      favorites = JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse favorites:', error);
    }
  }

  const newFavorite: FavoriteItem = {
    id: Date.now().toString(),
    restaurant,
    addedAt: Date.now(),
    note,
  };

  const updatedFavorites = [newFavorite, ...favorites.filter(f => f.restaurant.id !== restaurant.id)];
  localStorage.setItem('paymap_favorites', JSON.stringify(updatedFavorites));
};

export const isInFavorites = (restaurantId: string): boolean => {
  const saved = localStorage.getItem('paymap_favorites');
  if (!saved) return false;
  
  try {
    const favorites: FavoriteItem[] = JSON.parse(saved);
    return favorites.some(f => f.restaurant.id === restaurantId);
  } catch (error) {
    return false;
  }
};
