'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/src/types';
import { useAppDispatch } from '@/src/store/hooks';
import { addToCart, openCart } from '@/src/store/cartSlice';

interface FoodModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FoodModal({ item, isOpen, onClose }: FoodModalProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!item) return;
    dispatch(addToCart(item));
    dispatch(openCart());
    onClose();
  };
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121212]/90 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="relative bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn border-t sm:border border-[#FFC107]/20 scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-2 sm:absolute sm:top-4 right-2 sm:right-4 z-10 ml-auto mr-2 sm:mr-0 mt-2 sm:mt-0 p-2.5 sm:p-3 bg-[#121212]/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#FFC107] hover:text-[#121212] transition-all duration-300 group border border-[#FFC107]/20 active:scale-95"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC107] group-hover:text-[#121212] group-hover:rotate-90 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-56 sm:h-72 md:h-96 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          
          {/* Badges */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col sm:flex-row gap-2">
            {item.isPopular && (
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-xs sm:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                ⭐ Popular
              </span>
            )}
            {item.isSpicy && (
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                🌶️ Spicy
              </span>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent leading-tight">
                {item.name}
              </h2>
              <div className="flex-shrink-0 self-start px-4 py-2 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-lg sm:text-xl rounded-xl shadow-lg shadow-[#FFC107]/30">
                {item.price} AED
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg bg-[#FFC107]/10 border border-[#FFC107]/20 text-xs sm:text-sm font-medium text-[#FFC107]">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-[#FFC107]">
              Quick Overview
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {item.short_description}
            </p>
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-[#FFC107]">
              About This Dish
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {item.full_description}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FFC107]/20" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleAddToCart} className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFC107] hover:from-[#FFD54F] hover:via-[#FFC107] hover:to-[#FFD54F] active:scale-95 text-[#121212] font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#FFC107]/50 transition-all duration-300 transform sm:hover:scale-105 btn-glow">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </div>
            </button>
            
            <button className="sm:w-auto px-6 py-3 sm:py-4 bg-[#121212] hover:bg-[#FFC107]/10 active:scale-95 border border-[#FFC107]/20 hover:border-[#FFC107] text-[#FFC107] font-semibold rounded-xl transition-all duration-300 group">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Save to Favorites</span>
              </div>
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-[#FFC107]/10 border border-[#FFC107]/20 rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#FFC107] flex items-start gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="leading-relaxed">
                All our dishes are prepared fresh to order. Please allow 15-20 minutes for preparation. 
                Prices include VAT.
              </span>
            </p>
          </div>

          {/* Mobile Bottom Padding for safe area */}
          <div className="h-4 sm:hidden" />
        </div>
      </div>
    </div>
  );
}
