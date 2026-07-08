'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  selectNotifications,
  selectUnreadCount,
  selectLastOrderPhone,
  markNotificationsRead,
  fetchNotifications,
  hydrateOrderPhone,
} from '@/src/store/orderSlice';

export type NotificationType = 'order_received' | 'order_ready' | 'general';

interface NotificationItem {
  _id: string;
  orderId: string;
  orderNumber: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const TYPE_CONFIG: Record<NotificationType, { label: string; icon: string; color: string; bg: string }> = {
  order_received: { label: 'Order Received',        icon: '🛍️', color: 'text-blue-600',  bg: 'bg-blue-50'  },
  order_ready:    { label: 'Ready for Collection',  icon: '🎉', color: 'text-green-600', bg: 'bg-green-50' },
  general:        { label: 'Notification',           icon: '🔔', color: 'text-gray-600',  bg: 'bg-gray-100' },
};

export default function NotificationPanel() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const phone = useAppSelector(selectLastOrderPhone);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'unread' | 'all'>('unread');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      dispatch(hydrateOrderPhone());
    } catch {
      // localStorage blocked by browser/extension — silently ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!phone) return;
    dispatch(fetchNotifications(phone));
    const interval = setInterval(() => dispatch(fetchNotifications(phone)), 10000);
    return () => clearInterval(interval);
  }, [phone, dispatch]);

  const handleOpen = () => {
    setOpen(prev => {
      if (!prev && phone) dispatch(fetchNotifications(phone));
      return !prev;
    });
  };

  const handleMarkAllRead = () => {
    if (phone) dispatch(markNotificationsRead(phone));
  };

  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const ready = (notifications as NotificationItem[]).find(n => n.type === 'order_ready' && !n.isRead);
    if (!ready) return;
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification('🎉 Your food is ready!', { body: ready.message, icon: '/gulfgatecafeterialogo.png' });
    }
  }, [notifications]);

  if (!mounted || !phone) return null;

  const items = notifications as NotificationItem[];
  const displayed = tab === 'unread' ? items.filter(n => !n.isRead) : items;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell */}
      <button onClick={handleOpen}
        className="relative p-2 rounded-lg text-[#FFC107] hover:bg-[#FFC107]/10 transition-all duration-300"
        aria-label="Notifications">
        <svg className={`w-6 h-6 ${unreadCount > 0 ? 'animate-wiggle' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500/40 animate-ping" />
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#121212]" />
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#1A1A1A] rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#FFC107]/20 animate-fadeIn">

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FFC107]/15 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Notification</h3>
                <p className="text-xs text-gray-400">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} title="Mark all as read"
                  className="w-7 h-7 bg-[#FFC107]/15 hover:bg-[#FFC107]/25 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 pb-2 border-b border-[#FFC107]/10">
            <button onClick={() => setTab('unread')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'unread'
                  ? 'bg-[#FFC107] text-[#121212]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              Unread
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === 'unread' ? 'bg-[#121212] text-[#FFC107]' : 'bg-white/10 text-gray-300'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => setTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              All
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm text-gray-500">{tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
              </div>
            ) : (
              displayed.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.general;
                return (
                  <div key={n._id} className={`px-4 py-3 transition-colors ${!n.isRead ? 'bg-[#FFC107]/5' : 'hover:bg-white/5'}`}>
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                        n.type === 'order_ready' ? 'bg-green-500/20' : n.type === 'order_received' ? 'bg-blue-500/20' : 'bg-[#FFC107]/10'
                      }`}>
                        {cfg.icon}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-bold ${
                            n.type === 'order_ready' ? 'text-green-400' : 'text-[#FFC107]'}`}>
                            {cfg.label}
                          </p>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap flex-shrink-0">{formatTime(n.createdAt)}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-300 mt-0.5">Order #{n.orderNumber}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                        {!n.isRead && (
                          <button onClick={handleMarkAllRead}
                            className="mt-1.5 px-2.5 py-1 bg-[#FFC107]/10 border border-[#FFC107]/20 hover:border-[#FFC107]/40 text-[#FFC107] text-[10px] font-semibold rounded-lg transition-colors">
                            Mark as read
                          </button>
                        )}
                      </div>
                      {/* Unread dot */}
                      {!n.isRead && <span className="w-2 h-2 bg-[#FFC107] rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#FFC107]/10 bg-[#111111]">
            <a href="/my-orders" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 text-xs text-[#FFC107] hover:text-[#FFD54F] font-bold transition-colors">
              View All Orders
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
