'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { hideToast, selectToast } from '@/src/store/toastSlice';

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => dispatch(hideToast()), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.duration, dispatch]);

  if (!toast.visible) return null;

  const icons = {
    success: (
      <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 text-[#FFC107] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const borders = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-[#FFC107]/30',
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] animate-slideDown">
      <div className={`flex items-center gap-3 bg-[#1A1A1A] border ${borders[toast.type ?? 'success']} rounded-2xl shadow-2xl px-5 py-4 min-w-[280px] max-w-sm`}>
        {icons[toast.type ?? 'success']}
        <div className="flex-1">
          {toast.title && (
            <p className="text-white font-bold text-sm">{toast.title}</p>
          )}
          {toast.message && (
            <p className="text-gray-300 text-sm mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => dispatch(hideToast())}
          className="text-gray-500 hover:text-gray-300 transition-colors ml-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
