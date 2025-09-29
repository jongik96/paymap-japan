'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X, Send, AlertTriangle, Shield, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
// import { reviewsApi } from '@/lib/api'; // 사용하지 않는 import
import { validateReview, ContentFilterResult } from '@/lib/contentFilter';

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
  const { t } = useLanguage();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [contentValidation, setContentValidation] = useState<ContentFilterResult | null>(null);
  const [showContentWarning, setShowContentWarning] = useState(false);

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
  const currentComment = watch('comment');

  // 실시간 콘텐츠 검증
  useEffect(() => {
    if (currentComment && currentComment.length >= 10) {
      const validation = validateReview(currentComment, t('common.language') === 'ko' ? 'ko' : t('common.language') === 'ja' ? 'ja' : 'en');
      setContentValidation(validation);
      setShowContentWarning(validation.violations.length > 0 || validation.warning !== null);
    } else {
      setContentValidation(null);
      setShowContentWarning(false);
    }
  }, [currentComment, t]);

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
    // 최종 콘텐츠 검증
    const finalValidation = validateReview(data.comment, t('common.language') === 'ko' ? 'ko' : t('common.language') === 'ja' ? 'ja' : 'en');
    
    if (!finalValidation.isValid) {
      setContentValidation(finalValidation);
      setShowContentWarning(true);
      return;
    }

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

  const getViolationIcon = (violation: string) => {
    if (violation.includes('부적절한 언어')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (violation.includes('광고성')) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (violation.includes('민감한 주제')) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (violation.includes('스팸성')) return <AlertTriangle className="h-4 w-4 text-purple-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t('restaurant.writeReview')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">{t('restaurant.writeReview')} for:</p>
            <p className="font-semibold text-gray-900">{restaurantName}</p>
          </div>

          {/* 콘텐츠 필터링 경고 */}
          {showContentWarning && contentValidation && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                 <div className="flex-1">
                   <h4 className="font-medium text-yellow-800 mb-2">{t('contentFilter.title')}</h4>
                   
                   {contentValidation.violations.length > 0 && (
                     <div className="mb-2">
                       <p className="text-sm text-yellow-700 mb-1">{t('contentFilter.violations')}</p>
                       <ul className="space-y-1">
                         {contentValidation.violations.map((violation, index) => (
                           <li key={index} className="flex items-center space-x-2 text-sm text-yellow-700">
                             {getViolationIcon(violation)}
                             <span>{violation}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                   
                   {contentValidation.warning && (
                     <div className="text-sm text-yellow-700">
                       <p className="font-medium">{t('contentFilter.warning')}</p>
                       <p>{contentValidation.warning}</p>
                     </div>
                   )}
                   
                   {contentValidation.violations.length > 0 && (
                     <div className="mt-2 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                       <p className="font-medium">{t('contentFilter.filteredText')}</p>
                       <p className="font-mono text-xs">{contentValidation.filteredText}</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.paymentMethods')} *
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {paymentMethods.map((method) => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPaymentMethods.includes(method)}
                      onChange={() => handlePaymentMethodToggle(method)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethods && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentMethods.message}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= (hoveredRating || currentRating)
                          ? 'text-yellow-400 fill-current'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">Please select a rating</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                {...register('comment')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Share your experience with payment methods at this restaurant..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.comment && (
                  <p className="text-red-500 text-sm">{errors.comment.message}</p>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {currentComment?.length || 0}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (contentValidation ? !contentValidation.isValid : false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Review</span>
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
