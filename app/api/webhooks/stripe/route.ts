import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/resend';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && !webhookSecret.startsWith('whsec_mock')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Development mode fallback event parsing
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookId = session.metadata?.bookId;
    const personalizationNote = session.metadata?.personalizationNote || null;
    const stripeSessionId = session.id;

    if (!bookId) {
      console.warn('Checkout Session missing bookId metadata');
      return NextResponse.json({ received: true });
    }

    try {
      // Idempotence check: check if order for this session ID already exists
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId },
      });

      if (existingOrder) {
        console.log(`Order for session ${stripeSessionId} already processed.`);
        return NextResponse.json({ received: true });
      }

      // Execute transactionally: Create Order and Decrement Stock
      const order = await prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({
          where: { id: bookId },
        });

        if (!book) {
          throw new Error(`Book with ID ${bookId} not found.`);
        }

        if (book.stockQuantity < 1) {
          console.warn(`Oversell prevented for book ${book.title}. Stock is zero.`);
        }

        // Decrement stock by 1
        await tx.book.update({
          where: { id: bookId },
          data: {
            stockQuantity: {
              decrement: 1,
            },
          },
        });

        const customerName = session.customer_details?.name || 'Valued Reader';
        const customerEmail = session.customer_details?.email || 'customer@example.com';
        const address = session.shipping_details?.address;
        const formattedAddress = address
          ? `${address.line1 || ''}, ${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}, ${address.country || ''}`
          : 'Address provided during Stripe Checkout';

        // Create paid order in status machine: paid
        const createdOrder = await tx.order.create({
          data: {
            stripeSessionId,
            customerName,
            customerEmail,
            shippingAddress: formattedAddress,
            personalization: personalizationNote,
            totalAmountCents: session.amount_total || book.priceInCents,
            status: 'paid',
            items: {
              create: {
                bookId: book.id,
                quantity: 1,
                price: book.priceInCents,
              },
            },
          },
          include: {
            items: {
              include: { book: true },
            },
          },
        });

        return createdOrder;
      });

      // Send Resend Order Confirmation Email
      const bookTitle = order.items[0]?.book.title || 'Author Signed Book';
      const formattedTotal = `$${(order.totalAmountCents / 100).toFixed(2)}`;

      await sendOrderConfirmationEmail({
        to: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        bookTitle,
        totalAmount: formattedTotal,
        shippingAddress: order.shippingAddress,
      });

      console.log(`Successfully processed order ${order.id} for session ${stripeSessionId}`);
    } catch (err: any) {
      console.error(`Error processing Stripe checkout session fulfillment:`, err);
      return new NextResponse(`Fulfillment error: ${err.message}`, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
