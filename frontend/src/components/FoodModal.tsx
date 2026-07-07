'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/src/types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { addToCart, openCart } from '@/src/store/cartSlice';
import { toggleSaved, selectIsSaved } from '@/src/store/savedSlice';

interface FoodModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FoodModal({ item, isOpen, onClose }: FoodModalProps) {
  const dispatch = useAppDispatch();
  const itemId = item?._id || item?.id || '';
  const isSaved = useAppSelector(selectIsSaved(itemId));
  const [activeImg, setActiveImg] = useState(0);

  // Reset gallery index when item changes
  useEffect(() => { setActiveImg(0); }, [item]);

  // Escape key + scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // ── Handlers (must be before early return) ────────────────────────────────
  const handleAddToCart = () => {
    if (!item) return;
    dispatch(addToCart(item));
    dispatch(openCart());
    onClose();
  };

  const handleToggleSave = () => {
    if (!item) return;
    dispatch(toggleSaved(item));
  };

  // ── Early return ──────────────────────────────────────────────────────────
  if (!isOpen || !item) return null;

  // ── Derived data ──────────────────────────────────────────────────────────
  const isOutOfStock = (item.stock ?? 1) === 0;
  const images = [item.image, ...(item.gallery?.filter(Boolean) ?? [])].filter(Boolean);

  const ingredientList = item.ingredients
    ? item.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const description = item.full_description || item.description || item.short_description || '';

  const prevImg = () => setActiveImg((p) => (p - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((p) => (p + 1) % images.length);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fadeIn">

      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[#111111] rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[92vh] flex flex-col overflow-hidden border border-[#FFC107]/15 animate-slideUp sm:animate-scaleIn">

        {/* ── Main Image ── */}
        <div className="relative flex-shrink-0 w-full bg-[#0a0a0a]" style={{ aspectRatio: '16/9', maxHeight: '320px' }}>
          {images.length > 0 ? (
            <Image
              src={images[activeImg]}
              alt={`${item.name} — photo ${activeImg + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover transition-all duration-300"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🍽️</div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#FFC107] hover:text-black transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {item.isPopular && !isOutOfStock && (
              <span className="px-2.5 py-1 bg-[#FFC107] text-[#111] text-xs font-bold rounded-full shadow-lg">
                ⭐ Popular
              </span>
            )}
            {item.isSpicy && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                🌶️ Spicy
              </span>
            )}
            {isOutOfStock && (
              <span className="px-3 py-1.5 bg-gray-900/90 border border-gray-600 text-gray-300 text-xs font-bold rounded-full tracking-widest uppercase">
                Out of Stock
              </span>
            )}
          </div>

          {/* Arrow navigation */}
          {images.length > 1 && (
            <>
              <button onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#FFC107] hover:text-black transition-all"
                aria-label="Previous photo">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#FFC107] hover:text-black transition-all"
                aria-label="Next photo">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)}
                  className={`transition-all duration-200 rounded-full ${
                    idx === activeImg ? 'w-5 h-2 bg-[#FFC107]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Thumbnail Strip ── */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-3 bg-[#0d0d0d] border-b border-[#FFC107]/10 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === activeImg
                    ? 'border-[#FFC107] ring-1 ring-[#FFC107]/50 scale-105'
                    : 'border-white/10 hover:border-[#FFC107]/50 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image src={src} alt={`thumb ${idx + 1}`} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>

          {/* Name + Price */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight flex-1">
              {item.name}
            </h2>
            <div className="flex-shrink-0 px-3 py-1.5 bg-[#FFC107] text-[#111] font-bold text-lg rounded-xl shadow-lg shadow-[#FFC107]/20">
              AED {item.price.toFixed(2)}
            </div>
          </div>

          {/* Category */}
          <span className="inline-block px-3 py-1 bg-[#FFC107]/10 border border-[#FFC107]/20 text-[#FFC107] text-xs font-semibold rounded-full capitalize">
            {item.category.replace(/_/g, ' ')}
          </span>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-300 leading-relaxed">
              {description}
            </p>
          )}

          {/* Ingredients */}
          {ingredientList.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {ingredientList.map((ing, idx) => (
                  <span key={idx}
                    className="px-3 py-1 bg-[#1A1A1A] border border-[#FFC107]/20 text-gray-300 text-xs font-medium rounded-full hover:border-[#FFC107]/50 transition-colors">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Photos grid */}
          {images.length > 1 && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Photos ({images.length})
              </p>
              <div className="grid grid-cols-4 gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      idx === activeImg
                        ? 'border-[#FFC107] ring-1 ring-[#FFC107]/40'
                        : 'border-[#FFC107]/10 hover:border-[#FFC107]/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={src} alt={`photo ${idx + 1}`} fill sizes="96px" className="object-cover" />
                    {idx === activeImg && (
                      <div className="absolute inset-0 bg-[#FFC107]/10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="bg-[#FFC107]/5 border border-[#FFC107]/15 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 flex items-start gap-2">
              <svg className="w-4 h-4 text-[#FFC107]/60 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Prepared fresh to order · 15–20 mins · Prices include VAT · Pay on collection
            </p>
          </div>

          <div className="h-2 sm:hidden" />
        </div>

        {/* ── Sticky Bottom Actions ── */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-[#FFC107]/10 bg-[#111111] space-y-2.5">

          {/* Add to Cart / Out of Stock */}
          {isOutOfStock ? (
            <div className="w-full py-4 bg-gray-800 border border-gray-700 text-gray-500 font-bold text-base rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Currently Out of Stock
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] active:scale-95 text-[#111] font-bold text-base rounded-xl shadow-lg shadow-[#FFC107]/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart — AED {item.price.toFixed(2)}
            </button>
          )}

          {/* Save for later */}
          <button
            onClick={handleToggleSave}
            className={`w-full py-3 rounded-xl border font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-[#FFC107]/10 border-[#FFC107] text-[#FFC107]'
                : 'bg-transparent border-[#FFC107]/20 text-gray-400 hover:border-[#FFC107]/50 hover:text-[#FFC107]'
            }`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isSaved ? '♥ Saved for Later' : 'Save for Later'}
          </button>

        </div>
      </div>
    </div>
  );
}
