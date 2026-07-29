import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, Package, ArrowRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your studio order confirmation from author Arthur Milton.',
};

interface OrderSuccessProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl text-fog">Order Confirmation</h1>
        <p className="font-body text-base text-seafoam">No active Checkout Session ID provided.</p>
        <Link href="/books" className="font-mono text-xs text-brass hover:underline">
          Return to Bookstore
        </Link>
      </div>
    );
  }

  // Query order by stripeSessionId
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Confirmation Header */}
      <div className="gothic-card p-8 lg:p-12 rounded-xl text-center space-y-4 border border-brass/40">
        <CheckCircle2 className="w-16 h-16 text-brass mx-auto" />
        <span className="font-mono text-xs text-brass uppercase tracking-widest block">
          Dispatch Register Sealed
        </span>
        <h1 className="font-display text-4xl text-fog font-semibold">
          Thank You For Your Order
        </h1>
        <p className="font-body text-lg text-fog/80 max-w-lg mx-auto">
          Your book is being prepared at Arthur Milton's studio on the Lizard Peninsula, Cornwall.
        </p>

        <div className="pt-4 inline-flex items-center gap-2 px-4 py-2 bg-storm rounded border border-seafoam/20 font-mono text-xs text-seafoam">
          <span>Order Reference: #{order ? order.id.slice(-8).toUpperCase() : sessionId.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      {/* Order Details Panel */}
      {order && (
        <div className="gothic-card p-8 rounded-xl space-y-6 border border-seafoam/20">
          <h2 className="font-display text-2xl text-fog font-semibold flex items-center gap-2 border-b border-seafoam/15 pb-3">
            <Package className="w-5 h-5 text-brass" />
            <span>Items Ordered</span>
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2 border-b border-seafoam/10">
                <div className="relative w-16 h-20 rounded overflow-hidden bg-storm border border-seafoam/20 flex-shrink-0">
                  <Image
                    src={item.book.coverImage}
                    alt={item.book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-display text-lg text-fog font-medium">{item.book.title}</h3>
                  <p className="font-mono text-xs text-seafoam">
                    {item.book.format} • Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-display text-lg text-brass font-bold">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {order.personalization && (
            <div className="p-4 bg-abyssal-800 rounded border border-brass/30 space-y-1">
              <span className="font-mono text-xs text-brass uppercase">Dedication Request</span>
              <p className="font-body text-sm italic text-fog/90">"{order.personalization}"</p>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-seafoam gap-2">
            <span>Customer: {order.customerName} ({order.customerEmail})</span>
            <span>Status: <strong className="text-brass uppercase">{order.status}</strong></span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 font-mono text-xs text-brass hover:underline"
        >
          <span>Continue Exploring Arthur Milton's Works</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
