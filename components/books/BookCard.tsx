import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BuyButton from './BuyButton';

interface BookCardProps {
  book: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    coverImage: string;
    synopsis: string;
    priceInCents: number;
    isbn: string;
    pageCount: number;
    format: string;
    stockQuantity: number;
    isForSale: boolean;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const formattedPrice = (book.priceInCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <article className="gothic-card gothic-card-hover rounded-lg overflow-hidden flex flex-col justify-between group h-full border border-seafoam/20">
      {/* Cover Image Header */}
      <div className="relative w-full aspect-[4/5] bg-storm overflow-hidden flex items-center justify-center">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-storm via-transparent to-transparent opacity-75 pointer-events-none" />

        {/* Format Badge */}
        <span className="absolute top-3 left-3 bg-abyssal/90 text-brass font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-brass/40 backdrop-blur-sm shadow-md">
          {book.format}
        </span>
      </div>

      {/* Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <span className="font-mono text-[11px] text-seafoam tracking-wider block">
            ISBN: {book.isbn} • {book.pageCount} Pages
          </span>
          <h3 className="font-display text-2xl text-fog font-semibold leading-snug group-hover:text-brass transition-colors">
            <Link href={`/books/${book.slug}`}>{book.title}</Link>
          </h3>
          {book.subtitle && (
            <p className="font-body text-sm italic text-brass/90">{book.subtitle}</p>
          )}
          <p className="font-body text-sm text-fog/75 line-clamp-3 leading-relaxed">
            {book.synopsis}
          </p>
        </div>

        {/* Purchase & View Actions */}
        <div className="pt-4 border-t border-seafoam/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-fog font-bold">{formattedPrice}</span>
            <Link
              href={`/books/${book.slug}`}
              className="font-mono text-xs text-brass hover:underline flex items-center gap-1"
            >
              <span>Read Excerpt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <BuyButton
            bookId={book.id}
            bookTitle={book.title}
            priceInCents={book.priceInCents}
            stockQuantity={book.stockQuantity}
            isForSale={book.isForSale}
          />
        </div>
      </div>
    </article>
  );
}
