'use client';

import Image from 'next/image';
import { MenuItem } from '@/src/types';

interface FoodCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function FoodCard({ item, onClick }: FoodCardProps) {
  const isOutOfStock = (item.stock ?? 1) === 0;

  return (
    <div
      onClick={onClick}
      className={`group bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg border animate-fadeIn transition-all duration-500 ${
        isOutOfStock
          ? 'cursor-not-allowed opacity-70 border-gray-700'
          : 'cursor-pointer hover:shadow-2xl hover:shadow-[#FFC107]/20 transform hover:-translate-y-2 active:scale-95 border-[#FFC107]/10 hover:border-[#FFC107]/30'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#121212]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-110' : 'grayscale-[40%]'}`}
        />

        {/* Out of Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900/90 border border-gray-600 text-gray-300 text-xs sm:text-sm font-bold rounded-full tracking-widest uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col sm:flex-row gap-1.5 sm:gap-2 z-10">
          {item.isPopular && !isOutOfStock && (
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
              ⭐ Popular
            </span>
          )}
          {item.isSpicy && (
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              🌶️ Spicy
            </span>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Shine Effect — only in stock */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFC107]/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className={`text-base sm:text-lg font-bold line-clamp-1 transition-colors duration-300 ${
            isOutOfStock ? 'text-gray-500' : 'text-white group-hover:text-[#FFC107]'
          }`}>
            {item.name}
          </h3>
          <div className={`flex-shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 ${
            isOutOfStock
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] shadow-md group-hover:shadow-lg group-hover:shadow-[#FFC107]/50'
          }`}>
            AED {item.price}
          </div>
        </div>

        {/* Description */}
        {(item.short_description || item.description || item.ingredients) ? (
          <p className={`text-xs sm:text-sm line-clamp-3 leading-relaxed transition-colors duration-300 ${
            isOutOfStock ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-300'
          }`}>
            {item.short_description || item.description || item.ingredients}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-gray-600 italic">No description available.</p>
        )}

        {/* Category + arrow / out-of-stock note */}
        <div className="flex items-center justify-between pt-1">
          <span className={`inline-flex items-center px-2.5 py-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-medium ${
            isOutOfStock
              ? 'bg-gray-800 border border-gray-700 text-gray-500'
              : 'bg-[#FFC107]/10 border border-[#FFC107]/20 text-[#FFC107]'
          }`}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>

          {isOutOfStock ? (
            <span className="text-xs text-gray-600 font-medium">Unavailable</span>
          ) : (
            <div className="flex items-center text-[#FFC107] text-xs sm:text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span className="mr-1">Details</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Accent — only in stock */}
      {!isOutOfStock && (
        <div className="h-1 bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFC107] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      )}
    </div>
  );
}
