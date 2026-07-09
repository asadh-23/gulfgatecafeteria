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

type Step = 'confirm' | 'success';

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const user = useAppSelector(selectUser);

  const [step, setStep] = useState<Step>('confirm');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Editable user details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setStep('confirm');
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
      setNotes('');
      dispatch(clearOrderError());
    }
  }, [isOpen, user, dispatch]);

  // Close on Escape (only when not success)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'success') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, step]);

  const handleConfirm = async () => {
    if (!user || !customerName.trim() || !customerPhone.trim()) return;

    const orderItems = items.map((i) => ({
      productId: i._id || i.id || '',
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    const result = await dispatch(
      placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        items: orderItems,
        totalAmount: total,
        notes: notes.trim(),
      })
    );

    if (placeOrder.fulfilled.match(result)) {
      setOrderNumber(result.payload.order.orderNumber);
      setOrderTotal(total); // Save the total before cart is cleared
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => step !== 'success' && onClose()}
        className="fixed inset-0 bg-[#121212]/90 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 shadow-2xl w-full max-w-md my-8 z-10 animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Close button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#121212] border border-[#FFC107]/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#FFC107] transition-all"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 custom-scrollbar">

        {/* ── STEP 1: Confirmation ── */}
        {step === 'confirm' && (
          <div className="space-y-4">
            {/* Icon */}
            <div className="flex justify-center pt-2">
              <div className="w-14 h-14 rounded-full bg-[#FFC107]/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">Confirm Your Order</h2>
              <p className="text-gray-400 text-sm">
                Please review before confirming
              </p>
            </div>

            {/* User Info - Editable */}
            {user && (
              <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-3.5 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Details</p>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-lg text-white text-sm outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-lg text-white text-sm outline-none transition-colors"
                      placeholder="Your phone"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-lg text-white text-sm outline-none transition-colors"
                      placeholder="Your email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Info cards */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 bg-[#121212] rounded-xl p-3 border border-[#FFC107]/10">
                <span className="text-xl flex-shrink-0">🏪</span>
                <div>
                  <p className="text-white font-semibold text-sm">Collection Only</p>
                  <p className="text-gray-400 text-xs mt-0.5">Collect your order from the restaurant</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-[#121212] rounded-xl p-3 border border-[#FFC107]/10">
                <span className="text-xl flex-shrink-0">🔔</span>
                <div>
                  <p className="text-white font-semibold text-sm">Notification When Ready</p>
                  <p className="text-gray-400 text-xs mt-0.5">You&apos;ll be notified when it&apos;s ready</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-[#121212] rounded-xl p-3 border border-[#FFC107]/10">
                <span className="text-xl flex-shrink-0">💵</span>
                <div>
                  <p className="text-white font-semibold text-sm">Pay on Collection</p>
                  <p className="text-gray-400 text-xs mt-0.5">Pay in cash when you collect</p>
                </div>
              </div>
            </div>

            {/* Items summary */}
            <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-3.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Summary</p>
              <div className="space-y-1.5">
                {items.map((i) => (
                  <div key={i._id || i.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{i.quantity}x {i.name}</span>
                    <span className="text-[#FFC107] font-semibold">AED {(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#FFC107]/10 mt-2 pt-2 flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#FFC107] font-bold text-lg">AED {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes field */}
            <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-3.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-lg text-white text-sm outline-none transition-colors resize-none"
                placeholder="E.g., Extra spicy, no onions, allergies, etc."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1.5">Let us know if you have any special requests</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#FFC107]/20 text-gray-400 hover:text-white hover:border-[#FFC107]/50 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !customerName.trim() || !customerPhone.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Success ── */}
        {step === 'success' && (
          <div className="space-y-4 text-center">
            {/* Success Icon */}
            <div className="flex justify-center pt-2">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Order Placed!</h2>
              <p className="text-[#FFC107] font-bold text-lg">#{orderNumber}</p>
              <p className="text-gray-400 text-sm">
                Your order has been confirmed. We&apos;ll notify you when it&apos;s ready for collection.
              </p>
            </div>

            {/* Order Amount */}
            <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-[#FFC107]">AED {orderTotal.toFixed(2)}</p>
            </div>

            {/* Payment & Collection Info */}
            <div className="bg-[#121212] rounded-xl border border-[#FFC107]/10 p-3.5 space-y-2.5 text-left">
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">🏪</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Collection Only</p>
                  <p className="text-xs text-gray-400 mt-0.5">Come collect from our restaurant</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">💳</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Payment Options</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cash or Card payment on collection</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">🔔</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Stay Updated</p>
                  <p className="text-xs text-gray-400 mt-0.5">Watch for notification when ready</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href="/my-orders"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Go to My Orders
              </a>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-[#FFC107]/20 text-gray-300 hover:text-white hover:border-[#FFC107]/50 text-sm font-semibold transition-all"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
