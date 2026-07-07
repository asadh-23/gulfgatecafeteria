'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { hydrateSaved, selectSavedItems, removeSaved, clearSaved } from '@/src/store/savedSlice';
import { addToCart, openCart } from '@/src/store/cartSlice';
import { MenuItem } from '@/src/types';
import FoodModal from '@/src/components/FoodModal';

export default function SavedPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectSavedItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Hydrate saved items from localStorage on mount
  useEffect(() => {
    dispatch(hydrateSaved());
  }, [dispatch]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart(item));
    dispatch(openCart());
  };

  const handleRemove = (id: string) => {
    dispatch(removeSaved(id));
  };

  return (
    <div className="min-h-screen bg-[#121212] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
              Saved for Later
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearSaved())}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* ── Empty State ── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#FFC107]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Nothing saved yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Browse the menu and tap <span className="text-[#FFC107]">&quot;Save for Later&quot;</span> on any item.
              </p>
            </div>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm rounded-xl hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          /* ── Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const id = item._id || item.id || '';
              return (
                <div
                  key={id}
                  className="bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/15 overflow-hidden group hover:border-[#FFC107]/40 transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className="relative h-44 w-full cursor-pointer overflow-hidden"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.isPopular && (
                        <span className="px-2 py-1 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-xs font-bold rounded-full">
                          ⭐ Popular
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="px-2 py-1 bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white text-xs font-bold rounded-full">
                          🌶️ Spicy
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#121212]/80 hover:bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:text-white transition-all duration-200"
                      aria-label="Remove from saved"
                    >
                      <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#FFC107] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {item.short_description || item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#FFC107] font-bold text-lg">
                        AED {item.price.toFixed(2)}
                      </span>
                      <span className="px-2.5 py-1 bg-[#FFC107]/10 border border-[#FFC107]/20 text-[#FFC107] text-xs font-medium rounded-lg">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-[#121212] font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(id)}
                        className="px-3 py-2.5 bg-[#121212] hover:bg-red-500/10 border border-[#FFC107]/10 hover:border-red-500/30 text-red-400 rounded-xl transition-all active:scale-95"
                        aria-label="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Food modal for item details */}
      <FoodModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
