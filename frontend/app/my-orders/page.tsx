'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  fetchUserOrders,
  fetchNotifications,
  markNotificationsRead,
  selectOrders,
  selectNotifications,
  selectUnreadCount,
  selectOrderLoading,
  setLastOrderPhone,
} from '@/src/store/orderSlice';
import { selectUser, selectIsLoggedIn } from '@/src/store/authSlice';

type OrderStatus = 'pending' | 'confirmed' | 'ready_for_collection' | 'collected' | 'completed';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  ready_for_collection: '🎉 Ready for Collection!',
  collected: 'Collected',
  completed: 'Completed',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  ready_for_collection: 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse',
  collected: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  completed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'ready_for_collection', 'collected', 'completed'];

const STATUS_STEP_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  ready_for_collection: 'Ready',
  collected: 'Collected',
  completed: 'Done',
};

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const loading = useAppSelector(selectOrderLoading);
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [savedPhone, setSavedPhone] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-load if logged in — use user's phone from account
  useEffect(() => {
    if (!mounted) return;
    if (isLoggedIn && user?.phone) {
      const p = user.phone;
      setSavedPhone(p);
      dispatch(setLastOrderPhone(p));
      dispatch(fetchUserOrders(p));
      dispatch(fetchNotifications(p));
      setSearched(true);
    }
  }, [mounted, isLoggedIn, user, dispatch]);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    const trimmed = phone.trim();
    setSavedPhone(trimmed);
    dispatch(setLastOrderPhone(trimmed));
    await dispatch(fetchUserOrders(trimmed));
    await dispatch(fetchNotifications(trimmed));
    setSearched(true);
  };

  const handleMarkRead = () => {
    if (savedPhone) dispatch(markNotificationsRead(savedPhone));
  };

  const getStepIndex = (status: OrderStatus) => STATUS_STEPS.indexOf(status);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#121212] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
            My Orders
          </h1>
          {isLoggedIn && user ? (
            <p className="text-gray-400 text-sm mt-1">
              Showing orders for <span className="text-[#FFC107] font-semibold">{user.name}</span> · {user.phone}
            </p>
          ) : (
            <p className="text-gray-400 text-sm mt-1">Sign in to track your orders</p>
          )}
        </div>

        {/* ── Not logged in — prompt to sign in ── */}
        {!isLoggedIn && (
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#FFC107]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Sign in to view your orders</p>
              <p className="text-gray-400 text-sm mt-1">Login or register to track your orders and receive notifications.</p>
            </div>
            <a href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm rounded-xl transition-all active:scale-95">
              Go to Menu & Sign In
            </a>
          </div>
        )}

        {/* ── Loading spinner (for logged-in auto-fetch) ── */}
        {isLoggedIn && loading && !searched && (
          <div className="flex items-center justify-center py-12">
            <svg className="w-8 h-8 text-[#FFC107] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* ── Notifications ── */}
        {searched && notifications.length > 0 && (
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h2 className="text-white font-bold text-sm">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkRead} className="text-xs text-[#FFC107] hover:text-[#FFD54F] transition-colors">
                  Mark all read
                </button>
              )}
            </div>
            {notifications.map((n) => (
              <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                !n.isRead ? 'bg-[#FFC107]/10 border-[#FFC107]/30' : 'bg-[#121212] border-[#FFC107]/10'
              }`}>
                <span className="text-lg flex-shrink-0">{!n.isRead ? '🔔' : '🔕'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && <span className="w-2 h-2 bg-[#FFC107] rounded-full flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        )}

        {/* ── Orders List ── */}
        {searched && (
          <>
            {orders.length === 0 && !loading ? (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#FFC107]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">No orders found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {isLoggedIn ? "You haven't placed any orders yet." : "No orders placed with this phone number."}
                  </p>
                </div>
                <a href="/" className="px-5 py-2.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm rounded-xl transition-all active:scale-95">
                  Browse Menu
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>

                {orders.map((order) => {
                  const currentStep = getStepIndex(order.status as OrderStatus);
                  return (
                    <div key={order._id} className="bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 overflow-hidden">
                      {/* Order Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFC107]/10">
                        <div>
                          <p className="text-[#FFC107] font-bold text-lg">{order.orderNumber}</p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">AED {order.totalAmount.toFixed(2)}</p>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${STATUS_STYLES[order.status as OrderStatus]}`}>
                            {STATUS_LABELS[order.status as OrderStatus]}
                          </span>
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <div className="px-5 py-4 border-b border-[#FFC107]/10">
                        <div className="flex items-center justify-between">
                          {STATUS_STEPS.map((step, idx) => (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  idx < currentStep ? 'bg-[#FFC107] text-[#121212]'
                                    : idx === currentStep ? 'bg-[#FFC107] text-[#121212] ring-4 ring-[#FFC107]/30'
                                    : 'bg-[#2A2A2A] text-gray-600 border border-gray-700'
                                }`}>
                                  {idx < currentStep ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : idx + 1}
                                </div>
                                <span className={`text-[9px] font-semibold whitespace-nowrap ${idx <= currentStep ? 'text-[#FFC107]' : 'text-gray-600'}`}>
                                  {STATUS_STEP_LABELS[step]}
                                </span>
                              </div>
                              {idx < STATUS_STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${idx < currentStep ? 'bg-[#FFC107]' : 'bg-[#2A2A2A]'}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="px-5 py-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.quantity}x {item.name}</span>
                            <span className="text-[#FFC107] font-semibold">AED {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.notes && (
                          <p className="text-xs text-amber-400/80 italic mt-2">📝 {order.notes}</p>
                        )}
                      </div>

                      {/* Ready banner */}
                      {order.status === 'ready_for_collection' && (
                        <div className="mx-5 mb-4 bg-green-500/15 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                          <span className="text-2xl">🎉</span>
                          <div>
                            <p className="text-green-400 font-bold text-sm">Your food is ready!</p>
                            <p className="text-green-400/70 text-xs mt-0.5">Please come to the restaurant to collect your order.</p>
                          </div>
                        </div>
                      )}

                      {/* Pay note */}
                      {order.status !== 'completed' && order.status !== 'collected' && (
                        <div className="px-5 pb-4">
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#FFC107]/50" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Pay with cash or card when you collect (AED {order.totalAmount.toFixed(2)})
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
