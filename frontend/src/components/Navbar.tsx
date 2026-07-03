'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Menu' },
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
          </div>
        )}
      </div>
    </nav>
  );
}
