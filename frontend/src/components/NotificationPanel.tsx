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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICON: Record<NotificationType, string> = {
  order_received: '✅',
  order_ready: '🎉',
  general: '🔔',
};

const TYPE_LABEL: Record<NotificationType, string> = {
  order_received: 'Order Received',
  order_ready: 'Ready for Collection!',
  general: 'Notification',
};

export default function NotificationPanel() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const phone = useAppSelector(selectLastOrderPhone);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    dispatch(hydrateOrderPhone());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // When panel opens → refresh notifications
  const handleOpen = () => {
    setOpen((prev) => {
      if (!prev && phone) {
        dispatch(fetchNotifications(phone));
      }
      return !prev;
    });
  };

  // Auto-poll every 10s in background
  useEffect(() => {
    if (!phone) return;
    dispatch(fetchNotifications(phone));
    const interval = setInterval(() => {
      dispatch(fetchNotifications(phone));
    }, 10000);
    return () => clearInterval(interval);
  }, [phone, dispatch]);

  const handleMarkRead = () => {
    if (phone) {
      dispatch(markNotificationsRead(phone));
    }
  };

  // Browser push notification when a new "ready" notification arrives
  useEffect(() => {
    const ready = notifications.find(
      (n) => n.type === 'order_ready' && !n.isRead
    );
    if (!ready) return;
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification('🎉 Your food is ready!', {
        body: ready.message,
        icon: '/gulfgatecafeterialogo.png',
      });
    }
  }, [notifications]);

  // Request browser notification permission once
  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  if (!mounted || !phone) return null;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-[#FFC107] hover:bg-[#FFC107]/10 transition-all duration-300"
        aria-label="Notifications"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${unreadCount > 0 ? 'animate-wiggle' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Red dot indicator */}
        {unreadCount > 0 && (
          <>
            {/* Pulsing outer ring */}
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500/40 animate-ping" />
            {/* Solid dot */}
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#121212] shadow-md" />
          </>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#1A1A1A] border border-[#FFC107]/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#FFC107]/10">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkRead}
                className="text-xs text-[#FFC107] hover:text-[#FFD54F] transition-colors font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#FFC107]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              (notifications as NotificationItem[]).map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 px-4 py-3.5 border-b border-[#FFC107]/5 last:border-0 transition-colors ${
                    !n.isRead ? 'bg-[#FFC107]/5' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                    n.type === 'order_ready'
                      ? 'bg-green-500/20'
                      : n.type === 'order_received'
                      ? 'bg-blue-500/20'
                      : 'bg-[#FFC107]/10'
                  }`}>
                    {TYPE_ICON[n.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      n.type === 'order_ready' ? 'text-green-400' : 'text-[#FFC107]'
                    }`}>
                      {TYPE_LABEL[n.type]} · #{n.orderNumber}
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="w-2 h-2 bg-[#FFC107] rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-[#FFC107]/10 text-center">
              <a
                href="/my-orders"
                onClick={() => setOpen(false)}
                className="text-xs text-[#FFC107] hover:text-[#FFD54F] font-semibold transition-colors"
              >
                View all orders →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
