'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Video, Compass, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export default function Footer({
  facebookUrl = 'https://facebook.com/arthurmiltonauthor',
  instagramUrl = 'https://instagram.com/arthurmilton_books',
  tiktokUrl = 'https://tiktok.com/@arthurmilton_writer',
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="bg-abyssal-900 border-t border-seafoam/20 pt-16 pb-12 text-fog/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-seafoam/15">
          {/* Col 1: Author Quote & Bio Teaser */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-brass" />
              <span className="font-display text-xl text-fog font-semibold tracking-wider">
                ARTHUR MILTON
              </span>
            </div>
            <p className="font-body text-base italic text-fog/70 leading-relaxed max-w-md">
              "Between the high tide and the granite shelf, the past leaves behind what the sea refused."
            </p>
            <p className="font-mono text-xs text-seafoam">
              Lizard Point • Cornwall, United Kingdom
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs tracking-widest uppercase text-brass font-medium">
              Navigation
            </h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/books" className="hover:text-brass transition-colors">
                  Published Books
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-brass transition-colors">
                  Work Showcase (Essays & Media)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brass transition-colors">
                  Biography & Press Kit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brass transition-colors">
                  Event & Press Inquiries
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brass transition-colors text-seafoam/60">
                  Writer Studio Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Maritime Dispatch Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-mono text-xs tracking-widest uppercase text-brass font-medium">
              The Maritime Dispatch
            </h3>
            <p className="font-body text-sm text-fog/70">
              Receive occasional letters on winter light, tide logs, and upcoming novel releases. No spam.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 text-brass font-body text-sm bg-brass/10 border border-brass/30 p-3 rounded">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you. You have been added to the tide register.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-storm text-fog placeholder-seafoam/50 text-sm px-3.5 py-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-brass hover:bg-brass-hover text-abyssal font-mono text-xs font-semibold px-4 py-2.5 rounded transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-4">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Arthur Milton on Facebook"
                  className="p-2 rounded border border-seafoam/20 text-seafoam hover:text-brass hover:border-brass transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Arthur Milton on Instagram"
                  className="p-2 rounded border border-seafoam/20 text-seafoam hover:text-brass hover:border-brass transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Arthur Milton on TikTok"
                  className="p-2 rounded border border-seafoam/20 text-seafoam hover:text-brass hover:border-brass transition-colors"
                >
                  <Video className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-seafoam/60 gap-4">
          <p>© {new Date().getFullYear()} Arthur Milton. All rights reserved.</p>
          <p>Crafted for Cornwall Gothic Realism • Powered by Next.js & Stripe</p>
        </div>
      </div>
    </footer>
  );
}
