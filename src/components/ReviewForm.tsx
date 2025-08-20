'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X, Send, Check } from 'lucide-react';

const reviewSchema = z.object({
  paymentMethods: z.array(z.string()).min(1, 'Please select at least one payment method'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Please enter at least 10 characters').max(500, 'Maximum 500 characters allowed'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  restaurantName: string;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

const paymentMethods = [
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

export default function ReviewForm({ restaurantName, onClose, onSubmit }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      paymentMethods: [],
      rating: 0,
      comment: '',
    },
  });

  const currentRating = watch('rating');

  const handleRatingChange = (rating: number) => {
    setValue('rating', rating);
  };

  const handlePaymentMethodToggle = (method: string) => {
    setSelectedPaymentMethods(prev => {
      const newSelection = prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method];
      
      setValue('paymentMethods', newSelection);
      return newSelection;
    });
  };

  const handleFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Write Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Restaurant</p>
            <p className="font-medium text-gray-900">{restaurantName}</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Payment Methods Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Methods * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedPaymentMethods.includes(method)}
                        onChange={() => handlePaymentMethodToggle(method)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        selectedPaymentMethods.includes(method)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethods.includes(method) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethods && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentMethods.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Selected: {selectedPaymentMethods.length} payment method(s)
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= (hoveredRating || currentRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {currentRating > 0 ? `${currentRating} stars` : 'Please select a rating'}
              </p>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">Please select a rating</p>
              )}
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Content *
              </label>
              <textarea
                {...register('comment')}
                rows={4}
                placeholder="Please share your experience with these payment methods..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {watch('comment')?.length || 0}/500 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
