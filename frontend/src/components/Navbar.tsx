'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { selectCartCount, toggleCart, selectOrderModalOpen, closeOrderModal, clearCart } from '@/src/store/cartSlice';
import { selectSavedCount, hydrateSaved, clearSaved } from '@/src/store/savedSlice';
import { selectUser, selectIsLoggedIn, logout } from '@/src/store/authSlice';
import CartDrawer from './CartDrawer';
import OrderModal from './OrderModal';
import Toast from './Toast';
import NotificationPanel from './NotificationPanel';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const cartCount = useAppSelector(selectCartCount);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectUser);
  const isOrderModalOpen = useAppSelector(selectOrderModalOpen);
  const savedCount = useAppSelector(selectSavedCount);

  // Mount + hydrate on client only
  useEffect(() => {
    setMounted(true);
    dispatch(hydrateSaved());
  }, [dispatch]);

  const navLinks = [
    { href: '/', label: 'Menu' },
    { href: '/saved', label: 'Saved' },
    { href: '/my-orders', label: 'My Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-[#121212]/95 border-b border-[#FFC107]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative h-12 w-auto flex-shrink-0">
              <Image
                src="/gulfgatecafeterialogo.png"
                alt="Gulfgate Cafeteria Logo"
                width={120}
                height={48}
                className="object-contain h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
                Gulfgate Cafeteria
              </span>
              <span className="text-xs text-gray-400">
                Dhaid, Sharjah
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] shadow-lg shadow-[#FFC107]/30'
                    : 'text-gray-300 hover:text-[#FFC107]'
                }`}
              >
                {!isActive(link.href) && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#FFC107]/10 to-[#FFD54F]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right: Bell + Saved + Cart + Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Notification Bell — self-contained component */}
            <NotificationPanel />

            {/* Saved / Heart Button */}
            <Link
              href="/saved"
              className="relative p-2 rounded-lg text-[#FFC107] hover:bg-[#FFC107]/10 transition-all duration-300"
              aria-label="Saved items"
            >
              <svg className="w-6 h-6" fill={mounted && savedCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {mounted && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFC107] text-[#121212] text-xs font-bold rounded-full flex items-center justify-center">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg text-[#FFC107] hover:bg-[#FFC107]/10 transition-all duration-300"
              aria-label="Open cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFC107] text-[#121212] text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#FFC107] hover:bg-[#FFC107]/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Auth buttons (not logged in) or User Menu (logged in) */}
            {mounted && !isLoggedIn && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => { setAuthInitialMode('login'); setShowAuthModal(true); }}
                  className="px-4 py-2 text-sm font-semibold text-[#FFC107] hover:text-[#FFD54F] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthInitialMode('register'); setShowAuthModal(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-sm font-bold rounded-xl hover:from-[#FFD54F] hover:to-[#FFC107] transition-all active:scale-95"
                >
                  Register
                </button>
              </div>
            )}

            {/* User Menu — only render after mount to avoid hydration mismatch */}
            {mounted && isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFC107]/10 hover:bg-[#FFC107]/20 border border-[#FFC107]/20 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center text-[#121212] font-bold text-xs flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[#FFC107] text-sm font-semibold hidden sm:block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-[#FFC107]/70 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-[#1A1A1A] border border-[#FFC107]/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[#FFC107]/10">
                      <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{user.phone}</p>
                    </div>
                    {/* Links */}
                    <div className="py-2">
                      <Link
                        href="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#FFC107]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#FFC107]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Saved Items
                      </Link>
                    </div>
                    {/* Logout */}
                    <div className="border-t border-[#FFC107]/10 py-2">
                      <button
                        onClick={() => { 
                          dispatch(logout()); 
                          dispatch(clearCart());
                          dispatch(clearSaved());
                          setShowUserMenu(false); 
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-[#FFC107]/20 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] shadow-lg'
                    : 'text-gray-300 hover:text-[#FFC107] hover:bg-[#FFC107]/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile auth buttons */}
            {mounted && !isLoggedIn && (
              <div className="flex gap-2 pt-2 border-t border-[#FFC107]/10">
                <button
                  onClick={() => { setAuthInitialMode('login'); setShowAuthModal(true); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-[#FFC107] border border-[#FFC107]/30 rounded-xl hover:bg-[#FFC107]/10 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthInitialMode('register'); setShowAuthModal(true); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] text-sm font-bold rounded-xl transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>

    {/* Toast notifications */}
    <Toast />

    {/* Navbar Auth Modal */}
    <AuthModal
      isOpen={showAuthModal}
      initialMode={authInitialMode}
      onClose={() => setShowAuthModal(false)}
      onSuccess={() => setShowAuthModal(false)}
    />

    {/* Cart Drawer — rendered outside nav so it overlays the full page */}
    <CartDrawer />

    {/* Order Modal — lives here so it persists when cart drawer closes */}
    <OrderModal
      isOpen={isOrderModalOpen}
      onClose={() => dispatch(closeOrderModal())}
    />
  </>
  );
}
