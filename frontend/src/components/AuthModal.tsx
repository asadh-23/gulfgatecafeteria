'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  loginUser,
  registerUser,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
} from '@/src/store/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // called after successful login/register
  initialMode?: Mode;
}

type Mode = 'login' | 'register';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const [mode, setMode] = useState<Mode>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setName(''); setEmail(''); setPhone(''); setPassword('');
      setShowPassword(false);
      dispatch(clearAuthError());
    }
  }, [isOpen, dispatch, initialMode]);

  // If already logged in when modal opens → skip straight to onSuccess
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      onSuccess();
    }
  }, [isOpen, isLoggedIn, onSuccess]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setName(''); setEmail(''); setPhone(''); setPassword('');
    dispatch(clearAuthError());
  };

  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!email.trim() || !password) return;
      const result = await dispatch(loginUser({ email: email.trim(), password }));
      if (loginUser.fulfilled.match(result)) {
        onSuccess();
      }
    } else {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) return;
      const result = await dispatch(registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      }));
      if (registerUser.fulfilled.match(result)) {
        onSuccess();
      }
    }
  };

  const canSubmit = mode === 'login'
    ? email.trim() && password
    : name.trim() && email.trim() && phone.trim() && password.length >= 6;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121212]/90 backdrop-blur-md"
      />

      {/* Card */}
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 shadow-2xl w-full max-w-md p-6 z-10 animate-scaleIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFC107]/15 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login'
              ? 'Sign in to place your order and track it easily.'
              : 'Register to place orders and receive notifications.'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-[#121212] rounded-xl p-1 mb-5">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === m
                  ? 'bg-[#FFC107] text-[#121212]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name — register only */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmed Al Rashidi"
                className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
            />
          </div>

          {/* Phone — register only */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0501234567"
                className="w-full px-4 py-3 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
              />
              <p className="text-xs text-gray-500">Used to notify you when your order is ready.</p>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300">
              Password * {mode === 'register' && <span className="text-gray-500 font-normal">(min 6 characters)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-[#121212] border border-[#FFC107]/20 focus:border-[#FFC107] rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold text-sm hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#FFC107] font-semibold hover:text-[#FFD54F] transition-colors"
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
