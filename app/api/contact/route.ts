import { NextResponse } from 'next/server';
import { sendContactInquiryEmail } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, organization, message, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Dispatched.' });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const result = await sendContactInquiryEmail({ name, email, phone, organization, message });
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
