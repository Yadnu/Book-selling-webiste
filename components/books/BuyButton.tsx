'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { createCheckoutSession } from '@/app/actions/stripe';

interface BuyButtonProps {
  bookId: string;
  bookTitle: string;
  priceInCents: number;
  stockQuantity: number;
  isForSale: boolean;
  className?: string;
  showDedicationInput?: boolean;
}

export default function BuyButton({
  bookId,
  bookTitle,
  priceInCents,
  stockQuantity,
  isForSale,
  className = '',
  showDedicationInput = false,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [personalizationNote, setPersonalizationNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formattedPrice = (priceInCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const isOutOfStock = !isForSale || stockQuantity <= 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData(e.currentTarget);
      await createCheckoutSession(formData);
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
        setLoading(false);
      }
    }
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full bg-storm-border/50 text-seafoam/50 font-mono text-sm py-3 px-6 rounded cursor-not-allowed border border-seafoam/10 flex items-center justify-center gap-2"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Edition Out of Stock</span>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="p-3 bg-red-900/30 border border-red-500/40 rounded text-red-200 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="bookId" value={bookId} />
        <input type="hidden" name="quantity" value="1" />

        {showDedicationInput && (
          <div className="space-y-1.5">
            <label htmlFor={`note-${bookId}`} className="block font-mono text-xs text-seafoam uppercase tracking-wider">
              Optional Dedication / Personalization Note
            </label>
            <input
              id={`note-${bookId}`}
              type="text"
              name="personalizationNote"
              value={personalizationNote}
              onChange={(e) => setPersonalizationNote(e.target.value)}
              placeholder="e.g. For Eleanor, with best wishes on the high tide..."
              className="w-full bg-storm text-fog placeholder-seafoam/40 text-xs p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-brass hover:bg-brass-hover text-abyssal font-mono text-sm font-semibold py-3 px-6 rounded shadow-lg transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none ${className}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-abyssal" />
              <span>Connecting to Stripe...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Direct — {formattedPrice}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
