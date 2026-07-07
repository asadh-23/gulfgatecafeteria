'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '@/src/store/cartSlice';
import { placeOrder, selectOrderLoading, selectOrderError, clearOrderError } from '@/src/store/orderSlice';
import { showToast } from '@/src/store/toastSlice';
import { selectUser } from '@/src/store/authSlice';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'notice' | 'form' | 'success';

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const user = useAppSelector(selectUser);

  const [step, setStep] = useState<Step>('notice');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  // Reset on open — auto-fill from logged-in user
  useEffect(() => {
    if (isOpen) {
      setStep('notice');
      setName(user?.name || '');
      setPhone(user?.phone || '');
      setNotes('');
      dispatch(clearOrderError());
    }
  }, [isOpen, dispatch, user]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'success') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, step]);

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim()) return;

    const orderItems = items.map((i) => ({
      productId: i._id || i.id || '',
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    const result = await dispatch(
      placeOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items: orderItems,
        totalAmount: total,
        notes: notes.trim(),
      })
    );

    if (placeOrder.fulfilled.match(result)) {
      setOrderNumber(result.payload.order.orderNumber);
      dispatch(clearCart());
      setStep('success');
      dispatch(showToast({
        type: 'success',
        title: '✅ Order Confirmed!',
        message: `Your order ${result.payload.order.orderNumber} has been placed. We'll notify you when it's ready.`,
        duration: 5000,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => step !== 'success' && onClose()}
        className="absolute inset-0 bg-[#121212]/90 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 shadow-2xl w-full max-w-md p-6 z-10 animate-scaleIn">

        {/* ── STEP 1: Collection Notice ── */}
        {step === 'notice' && (
          <div className="space-y-5">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC107]/15 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Before you order</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Please note the following about your order.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#121212] rounded-xl p-4 border border-[#FFC107]/10">
                <span className="text-2xl flex-shrink-0">🏪</span>
                <div>
                  <p className="text-white font-semibold text-sm">Collection Only</p>
                  <p className="text-gray-400 text-xs mt-0.5">No delivery available. You must collect your order from the restaurant.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#121212] rounded-xl p-4 border border-[#FFC107]/10">
                <span className="text-2xl flex-shrink-0">🔔</span>
                <div>
                  <p className="text-white font-semibold text-sm">Notification When Ready</p>
                  <p className="text-gray-400 text-xs mt-0.5">You will receive a notification here when your food is ready to collect.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#121212] rounded-xl p-4 border border-[#FFC107]/10">
                <span className="text-2xl flex-shrink-0">💵</span>
                <div>
                  <p className="text-white font-semibold text-sm">Pay on Collection</p>
                  <p className="text-gray-400 text-xs mt-0.5">No online payment. Pay in cash when you collect your order.</p>
                </div>
              </div>
            </div>

            {/* Order total summary */}
            <div className="flex items-center justify-between bg-[#FFC107]/10 border border-[#FFC107]/20 rounded-xl px-4 py-3">
              <span className="text-gray-300 text-sm">Order Total</span>
              <span className="text-[#FFC107] font-bold text-lg">AED {total.toFixed(2)}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#FFC107]/20 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('form')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Customer Form ── */}
        {step === 'form' && (
          <div className="space-y-5">
            <button
              onClick={() => setStep('notice')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-[#FFC107] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Your Details</h2>
              <p className="text-gray-400 text-sm mt-1">We need your name and phone so we can notify you when your order is ready.</p>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmed Al Rashidi"
                className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0501234567"
                className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
              />
              <p className="text-xs text-gray-500">Used to track your order and receive notifications.</p>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                rows={3}
                className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* Items summary */}
            <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Summary</p>
              {items.map((i) => (
                <div key={i._id || i.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{i.quantity}x {i.name}</span>
                  <span className="text-[#FFC107] font-semibold">AED {(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-[#FFC107]/10 pt-2 flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#FFC107]">AED {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleConfirm}
              disabled={!name.trim() || !phone.trim() || loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order...
                </>
              ) : (
                'Confirm Order'
              )}
            </button>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 'success' && (
          <div className="space-y-5 text-center">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Order Placed!</h2>
              <p className="text-[#FFC107] font-bold text-lg">{orderNumber}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your order has been received. We&apos;ll notify you right here when your food is ready for collection.
              </p>
            </div>

            <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-4 space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-lg">🏪</span> Come collect from the restaurant
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-lg">💵</span> Pay AED {total.toFixed(2)} in cash on arrival
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-lg">🔔</span> Watch for a notification when it&apos;s ready
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
