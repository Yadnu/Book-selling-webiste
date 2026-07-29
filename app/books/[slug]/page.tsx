import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BuyButton from '@/components/books/BuyButton';
import { ArrowLeft, BookOpen, CheckCircle, ShieldCheck, Quote } from 'lucide-react';

interface BookDetailProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BookDetailProps): Promise<Metadata> {
  const book = await prisma.book.findUnique({
    where: { slug: params.slug },
  });

  if (!book) return { title: 'Book Not Found' };

  return {
    title: `${book.title} — ${book.format}`,
    description: book.synopsis.slice(0, 160),
    openGraph: {
      title: `${book.title} by Arthur Milton`,
      description: book.synopsis.slice(0, 160),
      images: [{ url: book.coverImage }],
    },
  };
}

export default async function BookDetailPage({ params }: BookDetailProps) {
  const book = await prisma.book.findUnique({
    where: { slug: params.slug },
  });

  if (!book) {
    notFound();
  }

  const formattedPrice = (book.priceInCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const jsonLdBook = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: 'Arthur Milton',
    },
    isbn: book.isbn,
    numberOfPages: book.pageCount,
    bookFormat: book.format,
    offers: {
      '@type': 'Offer',
      price: (book.priceInCents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: book.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBook) }}
      />

      {/* Back Link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 font-mono text-xs text-seafoam hover:text-brass transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Bookstore</span>
      </Link>

      {/* Top Grid: Cover & Purchase Spec Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cover Column */}
        <div className="lg:col-span-5 relative h-[480px] sm:h-[580px] rounded-lg overflow-hidden border border-seafoam/20 shadow-2xl bg-storm">
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-transparent to-transparent opacity-60" />
          <span className="absolute top-4 left-4 bg-abyssal/90 text-brass font-mono text-xs px-3 py-1 rounded border border-brass/40 backdrop-blur-md">
            {book.format}
          </span>
        </div>

        {/* Details & Buy Action Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-seafoam/20 pb-6">
            <span className="font-mono text-xs text-brass uppercase tracking-widest block">
              ISBN: {book.isbn} • Published {new Date(book.publicationDate).getFullYear()}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-fog font-semibold">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="font-body text-xl italic text-seafoam">{book.subtitle}</p>
            )}
          </div>

          {/* Book Metadata Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 bg-storm rounded border border-seafoam/15">
              <span className="text-seafoam/70 block uppercase text-[10px]">Price</span>
              <span className="text-fog font-bold text-lg">{formattedPrice}</span>
            </div>
            <div className="p-3 bg-storm rounded border border-seafoam/15">
              <span className="text-seafoam/70 block uppercase text-[10px]">Length</span>
              <span className="text-fog font-bold text-lg">{book.pageCount} Pages</span>
            </div>
            <div className="p-3 bg-storm rounded border border-seafoam/15 col-span-2 sm:col-span-1">
              <span className="text-seafoam/70 block uppercase text-[10px]">Stock Status</span>
              <span className={`font-bold text-sm ${book.stockQuantity > 0 ? 'text-brass' : 'text-red-400'}`}>
                {book.stockQuantity > 0 ? `${book.stockQuantity} copies remaining` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs text-brass uppercase tracking-widest">Synopsis</h3>
            <p className="font-body text-base text-fog/85 leading-relaxed whitespace-pre-line">
              {book.synopsis}
            </p>
          </div>

          {/* Direct Buy Box with Personalization Note */}
          <div className="gothic-card p-6 rounded-lg space-y-4 border border-brass/30">
            <div className="flex items-center gap-2 text-brass font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Studio Purchase • Author Signed Edition</span>
            </div>

            <BuyButton
              bookId={book.id}
              bookTitle={book.title}
              priceInCents={book.priceInCents}
              stockQuantity={book.stockQuantity}
              isForSale={book.isForSale}
              showDedicationInput={true}
            />

            <p className="font-mono text-[11px] text-seafoam/70 text-center">
              Ships worldwide from Lizard Point, Cornwall via Royal Mail Tracked.
            </p>
          </div>
        </div>
      </div>

      {/* SAMPLE EXCERPT READER */}
      <section className="space-y-6 pt-8 border-t border-seafoam/20">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brass" />
          <h2 className="font-display text-2xl text-fog font-semibold">Sample Excerpt</h2>
        </div>

        <div className="gothic-card p-8 lg:p-12 rounded-lg border border-seafoam/20 max-w-4xl mx-auto space-y-6">
          <div className="font-mono text-xs text-brass uppercase tracking-widest border-b border-seafoam/15 pb-3">
            Reading Room • {book.title} Excerpt
          </div>

          <div className="prose-editorial leading-relaxed font-body text-lg text-fog/90 space-y-4">
            {book.excerpt.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* CRITICAL ACCLAIM / PRESS QUOTES */}
      <section className="space-y-6 pt-4">
        <h2 className="font-display text-2xl text-fog font-semibold text-center">Critical Acclaim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gothic-card p-6 rounded-lg space-y-3 border-l-4 border-l-brass">
            <Quote className="w-6 h-6 text-brass opacity-60" />
            <p className="font-body text-base italic text-fog/90">
              "A masterclass in coastal Gothic dread. Milton writes with the cold clarity of granite and salt."
            </p>
            <span className="font-mono text-xs text-seafoam block">— The Guardian Literary Review</span>
          </div>

          <div className="gothic-card p-6 rounded-lg space-y-3 border-l-4 border-l-brass">
            <Quote className="w-6 h-6 text-brass opacity-60" />
            <p className="font-body text-base italic text-fog/90">
              "Few writers alive evoke weather and solitary grief with such quiet, luminous authority."
            </p>
            <span className="font-mono text-xs text-seafoam block">— The Times Literary Supplement</span>
          </div>
        </div>
      </section>
    </div>
  );
}
