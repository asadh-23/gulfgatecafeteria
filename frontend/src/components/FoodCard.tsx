'use client';

import Image from 'next/image';
import { MenuItem } from '@/src/types';

interface FoodCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function FoodCard({ item, onClick }: FoodCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#FFC107]/20 transition-all duration-500 transform hover:-translate-y-2 active:scale-95 border border-[#FFC107]/10 hover:border-[#FFC107]/30 animate-fadeIn"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#121212]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col sm:flex-row gap-1.5 sm:gap-2 z-10">
          {item.isPopular && (
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
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFC107]/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 group-hover:text-[#FFC107] transition-colors duration-300">
            {item.name}
          </h3>
          <div className="flex-shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-sm sm:text-base font-bold rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-[#FFC107]/50 transition-all duration-300">
              AED {item.price}
            </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {item.short_description || item.description || ''}
        </p>

        {/* Category Badge */}
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 rounded-lg bg-[#FFC107]/10 border border-[#FFC107]/20 text-[10px] sm:text-xs font-medium text-[#FFC107]">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
          
          {/* View Details Arrow */}
          <div className="flex items-center text-[#FFC107] text-xs sm:text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
            <span className="mr-1">View</span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFC107] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}
