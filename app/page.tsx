import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Feather, Sparkles, Instagram, Compass } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import HeroStaticFallback from '@/components/3d/HeroStaticFallback';
import BuyButton from '@/components/books/BuyButton';

// Lazy load 3D Canvas per requirements
const BookCanvas = dynamic(() => import('@/components/3d/BookCanvas'), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});

export default async function HomePage() {
  // Fetch featured book and latest content
  const featuredBook = await prisma.book.findFirst({
    where: { isFeatured: true },
  }) || await prisma.book.findFirst();

  const recentPosts = await prisma.post.findMany({
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  const recentPhotos = await prisma.photo.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  const jsonLdBook = featuredBook
    ? {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: featuredBook.title,
        author: {
          '@type': 'Person',
          name: 'Arthur Milton',
        },
        isbn: featuredBook.isbn,
        numberOfPages: featuredBook.pageCount,
        bookFormat: featuredBook.format,
        offers: {
          '@type': 'Offer',
          price: (featuredBook.priceInCents / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: featuredBook.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  return (
    <div className="space-y-24 pb-20">
      {jsonLdBook && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBook) }}
        />
      )}

      {/* HERO SECTION WITH 3D CANVAS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Author Statement & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brass/40 bg-brass/10 text-brass font-mono text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Author Studio & Store</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-fog leading-[1.1] tracking-tight">
              Quiet Gothic novellas set on the <span className="italic text-brass font-serif">Cornish coast</span>.
            </h1>

            <p className="font-body text-lg sm:text-xl text-fog/80 leading-relaxed font-light">
              Preoccupied with solitary lighthouses, fogbound memories, historical tide logs, and forgotten grief.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-xs">
              {featuredBook && (
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="bg-brass hover:bg-brass-hover text-abyssal font-semibold py-3.5 px-6 rounded shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore "{featuredBook.title}"</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="/books"
                className="border border-seafoam/30 hover:border-brass text-fog py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-brass" />
                <span>View Full Bookstore</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Interactive Tome Scene */}
          <div className="lg:col-span-6">
            <BookCanvas />
          </div>
        </div>
      </section>

      {/* FEATURED BOOK SHOWCASE */}
      {featuredBook && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gothic-card rounded-xl p-8 lg:p-12 border border-brass/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Cover Image */}
              <div className="lg:col-span-5 relative h-96 lg:h-[450px] rounded-lg overflow-hidden border border-seafoam/20 shadow-2xl">
                <Image
                  src={featuredBook.coverImage}
                  alt={`Cover of ${featuredBook.title}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-abyssal/90 text-brass font-mono text-xs px-3 py-1 rounded border border-brass/40">
                  {featuredBook.format} • Direct First Edition
                </span>
              </div>

              {/* Book Overview & Direct Purchase Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-seafoam uppercase tracking-widest">
                    Featured Release • ISBN: {featuredBook.isbn}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-fog font-semibold">
                    {featuredBook.title}
                  </h2>
                  {featuredBook.subtitle && (
                    <p className="font-body text-lg italic text-brass">{featuredBook.subtitle}</p>
                  )}
                </div>

                <p className="font-body text-base text-fog/80 leading-relaxed">
                  {featuredBook.synopsis}
                </p>

                <div className="p-4 bg-abyssal-800 rounded border border-seafoam/15 space-y-2">
                  <span className="font-mono text-xs text-brass uppercase">Sample Excerpt</span>
                  <p className="font-body text-sm italic text-fog/70 line-clamp-3">
                    "{featuredBook.excerpt.slice(0, 220)}..."
                  </p>
                </div>

                <div className="pt-2 max-w-md">
                  <BuyButton
                    bookId={featuredBook.id}
                    bookTitle={featuredBook.title}
                    priceInCents={featuredBook.priceInCents}
                    stockQuantity={featuredBook.stockQuantity}
                    isForSale={featuredBook.isForSale}
                    showDedicationInput={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ESSAYS & WORK TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-seafoam/20 pb-4 gap-4">
          <div>
            <span className="font-mono text-xs text-brass uppercase tracking-widest">
              From the Desk at Lizard Point
            </span>
            <h2 className="font-display text-3xl text-fog font-semibold">Recent Essays & Reflections</h2>
          </div>
          <Link
            href="/work"
            className="font-mono text-xs text-brass hover:underline flex items-center gap-1.5"
          >
            <span>View All Work & Media</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <article key={post.id} className="gothic-card gothic-card-hover rounded-lg p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-[11px] text-seafoam">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 className="font-display text-xl text-fog font-medium leading-snug hover:text-brass transition-colors">
                  <Link href={`/work/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.excerpt && (
                  <p className="font-body text-sm text-fog/70 line-clamp-3">{post.excerpt}</p>
                )}
              </div>
              <Link
                href={`/work/${post.slug}`}
                className="font-mono text-xs text-brass hover:underline pt-2 border-t border-seafoam/15 flex items-center gap-1"
              >
                <span>Read Essay</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* LAZY LOADED INSTAGRAM & MARITIME DISPATCH FEED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-seafoam/15 pb-3">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-brass" />
            <h2 className="font-display text-xl text-fog font-medium">Cornish Tide & Writing Logs (@arthurmilton_books)</h2>
          </div>
          <a
            href="https://instagram.com/arthurmilton_books"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-seafoam hover:text-brass"
          >
            Follow Instagram →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recentPhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded overflow-hidden gothic-card border border-seafoam/20 group">
              <Image
                src={photo.url}
                alt={photo.title || 'Arthur Milton coastal photo log'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-abyssal/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="font-mono text-xs text-brass truncate">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
