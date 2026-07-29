import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BookCard from '@/components/books/BookCard';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Books & Editions',
  description: 'Explore and purchase published novellas, hardcover collections, and tide journals directly from author Arthur Milton.',
};

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { publicationDate: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-seafoam/20 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brass/10 border border-brass/30 text-brass font-mono text-xs uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Direct Bookstore</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-fog font-normal">
          Published Works & First Editions
        </h1>
        <p className="font-body text-lg text-fog/80 leading-relaxed">
          Every hardcover ordered directly through this studio is hand-signed by Arthur Milton and dispatched from Lizard Point, Cornwall.
        </p>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="p-16 text-center gothic-card rounded-lg space-y-3">
          <p className="font-body text-lg text-seafoam">No published books found in the record.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
