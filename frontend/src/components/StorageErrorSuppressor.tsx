'use client';

import { useEffect } from 'react';

/**
 * Suppresses browser extension-caused sessionStorage/localStorage
 * SecurityError which is not a real app error.
 */
export default function StorageErrorSuppressor() {
  useEffect(() => {
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        typeof message === 'string' &&
        (message.includes('sessionStorage') || message.includes('localStorage')) &&
        message.includes('Access is denied')
      ) {
        // Silently swallow — caused by browser privacy extensions, not our code
        return true;
      }
      if (originalError) return originalError(message, source, lineno, colno, error);
      return false;
    };

    const originalUnhandled = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      if (
        event.reason?.message?.includes('sessionStorage') ||
        event.reason?.message?.includes('localStorage')
      ) {
        event.preventDefault();
        return;
      }
      if (originalUnhandled) originalUnhandled.call(window, event);
    };
  }, []);

  return null;
}
