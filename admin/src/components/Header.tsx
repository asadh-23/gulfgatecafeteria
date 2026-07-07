'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AdminNotification {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Admin', href: '/dashboard' }];
  let path = '';
  for (const segment of segments) {
    path += `/${segment}`;
    crumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: path,
    });
  }
  return crumbs;
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

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1].label;

  const [pendingOrders, setPendingOrders] = useState<AdminNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch pending orders
  const fetchPending = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/orders?status=pending`);
      const data = await res.json();
      if (data.success) setPendingOrders(data.data);
    } catch {
      // silently ignore
    }
  }, []);

  // Poll every 15 seconds
  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 15000);
    return () => clearInterval(interval);
  }, [fetchPending]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Unread = pending orders not yet "seen" by clicking the bell
  const unreadCount = pendingOrders.filter((o) => !seenIds.has(o._id)).length;

  const handleOpen = () => {
    setOpen((prev) => {
      if (!prev) {
        // Mark all current pending orders as seen
        setSeenIds(new Set(pendingOrders.map((o) => o._id)));
        fetchPending();
      }
      return !prev;
    });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-[240px] right-0 z-20 flex items-center justify-between px-6">

      {/* Left — Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {crumb.label}
                </Link>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <span className="text-gray-900 font-semibold">{pageTitle}</span>
            )}
          </span>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* ── Notification Bell ── */}
        <div ref={panelRef} className="relative">
          <button
            onClick={handleOpen}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>

            {/* Red dot — only shows when there are unseen pending orders */}
            {unreadCount > 0 && (
              <>
                {/* Pulsing ring */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500/40 animate-ping" />
                {/* Solid dot */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow" />
              </>
            )}
          </button>

          {/* ── Dropdown Panel ── */}
          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">New Orders</h3>
                  {pendingOrders.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {pendingOrders.length} pending
                    </span>
                  )}
                </div>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="text-xs text-green-600 hover:text-green-700 font-semibold"
                >
                  View all →
                </Link>
              </div>

              {/* Order List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {pendingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">No pending orders</p>
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <Link
                      key={order._id}
                      href="/orders"
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        !seenIds.has(order._id) ? 'bg-red-50/50' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          New order #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {order.customerName} · AED {order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(order.createdAt)}</p>
                      </div>

                      {/* Unread dot */}
                      {!seenIds.has(order._id) && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </Link>
                  ))
                )}
              </div>

              {/* Footer */}
              {pendingOrders.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Manage Orders
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Admin Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Gulfgate Admin</p>
            <p className="text-xs text-gray-500 leading-tight">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
        </div>

      </div>
    </header>
  );
}
