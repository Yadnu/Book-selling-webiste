'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function createCheckoutSession(formData: FormData) {
  const bookId = formData.get('bookId') as string;
  const quantity = parseInt((formData.get('quantity') as string) || '1', 10);
  const personalizationNote = (formData.get('personalizationNote') as string) || '';

  if (!bookId) {
    throw new Error('Book ID is required.');
  }

  // Look up book price & details from the database (NEVER accept client price)
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new Error('Book not found.');
  }

  if (!book.isForSale || book.stockQuantity < quantity) {
    throw new Error('This edition is currently out of stock or unavailable.');
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Build Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${book.title} (${book.format})`,
            description: `Author Signed Edition • ISBN: ${book.isbn}`,
            images: [book.coverImage],
          },
          unit_amount: book.priceInCents,
        },
        quantity: quantity,
      },
    ],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IE'],
    },
    phone_number_collection: {
      enabled: true,
    },
    allow_promotion_codes: true,
    custom_fields: [
      {
        key: 'personalization_note',
        label: {
          type: 'custom',
          custom: 'Dedication / Personalization Note',
        },
        type: 'text',
        optional: true,
      },
    ],
    metadata: {
      bookId: book.id,
      bookTitle: book.title,
      personalizationNote: personalizationNote.slice(0, 500),
    },
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/books/${book.slug}?canceled=1`,
  });

  if (!session.url) {
    throw new Error('Failed to create Stripe Checkout session.');
  }

  redirect(session.url);
}
