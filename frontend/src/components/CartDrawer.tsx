'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartIsOpen,
  closeCart,
  openOrderModal,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from '@/src/store/cartSlice';
import { selectIsLoggedIn } from '@/src/store/authSlice';
import AuthModal from './AuthModal';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectCartIsOpen);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    dispatch(closeCart());
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      dispatch(openOrderModal());
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeCart())}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-[#1A1A1A] border-l border-[#FFC107]/20 shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFC107]/20">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-bold text-white">Your Cart</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-[#FFC107] text-[#121212] text-xs font-bold rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 rounded-lg text-gray-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10 transition-all"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#FFC107]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add items from the menu to get started</p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const id = item._id || item.id || '';
              return (
                <div key={id} className="flex items-center gap-3 bg-[#121212] rounded-xl p-3 border border-[#FFC107]/10">
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-[#FFC107] text-sm font-bold mt-0.5">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-xs">AED {item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => dispatch(decrementQuantity(id))}
                      className="w-7 h-7 rounded-lg bg-[#FFC107]/10 hover:bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center transition-all"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(incrementQuantity(id))}
                      className="w-7 h-7 rounded-lg bg-[#FFC107]/10 hover:bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center transition-all"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => dispatch(removeFromCart(id))}
                      className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all ml-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#FFC107]/20 px-5 py-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-[#FFC107] font-bold text-xl">AED {total.toFixed(2)}</span>
            </div>

            {/* Collection note */}
            <div className="bg-[#FFC107]/10 border border-[#FFC107]/20 rounded-xl p-3">
              <p className="text-[#FFC107] text-xs flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Pay on collection · No delivery available</span>
              </p>
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-[#121212] font-bold rounded-xl shadow-lg hover:shadow-[#FFC107]/30 transition-all duration-300 active:scale-95"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal — shown when user is not logged in */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          dispatch(openOrderModal());
        }}
      />
    </>
  );
}
