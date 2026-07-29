'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Feather, User, Mail, Compass, Shield } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Books', href: '/books', icon: BookOpen },
    { label: 'Work', href: '/work', icon: Feather },
    { label: 'About', href: '/about', icon: User },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full gothic-card border-b border-seafoam/20 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="Arthur Milton Home"
        >
          <div className="w-10 h-10 rounded border border-brass/40 bg-storm/80 flex items-center justify-center text-brass group-hover:border-brass group-hover:bg-brass/10 transition-colors flex-shrink-0">
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl tracking-wider text-fog font-semibold group-hover:text-brass transition-colors leading-none">
              ARTHUR MILTON
            </span>
            <span className="font-mono text-[10px] tracking-widest text-seafoam uppercase mt-1">
              Cornish Coastal Fiction
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-body text-base tracking-wide transition-colors relative py-1 ${
                  isActive ? 'text-brass font-medium' : 'text-fog/80 hover:text-brass'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brass rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <Link
            href="/admin"
            className="flex items-center gap-1.5 font-mono text-xs text-seafoam hover:text-brass border border-seafoam/20 hover:border-brass/40 px-3 py-1.5 rounded transition-colors"
            title="Writer Studio Login"
          >
            <Shield className="w-3.5 h-3.5 text-brass" />
            <span>Studio</span>
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded text-fog hover:text-brass focus-visible:outline-none"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-abyssal-800 border-b border-seafoam/20 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2 font-display text-lg border-b border-seafoam/10 ${
                      isActive ? 'text-brass font-semibold' : 'text-fog hover:text-brass'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-brass" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 font-mono text-sm text-seafoam hover:text-brass"
              >
                <Shield className="w-4 h-4 text-brass" />
                <span>Writer Studio Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
