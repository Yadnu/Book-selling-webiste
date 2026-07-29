import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  bookTitle,
  totalAmount,
  shippingAddress,
}: {
  to: string;
  customerName: string;
  orderId: string;
  bookTitle: string;
  totalAmount: string;
  shippingAddress: string;
}) {
  const subject = `Order Confirmation #${orderId.slice(-8)} — Arthur Milton Bookstore`;
  const html = `
    <div style="font-family: 'Georgia', serif; background-color: #0D131A; color: #F3F4F6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #16202C; border: 1px solid #1C373E; padding: 30px; border-radius: 6px;">
        <h1 style="font-family: 'Cormorant Garamond', serif; color: #C78D4E; margin-top: 0;">Arthur Milton — Dispatch Log</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for ordering directly from the author's studio. Your shipment is being prepared at Lizard Point, Cornwall.</p>
        
        <div style="background: #0D131A; padding: 20px; border-left: 3px solid #C78D4E; margin: 20px 0;">
          <p style="margin: 0; font-family: monospace; color: #98B0B7;">ORDER REF: #${orderId}</p>
          <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #F3F4F6;">${bookTitle}</p>
          <p style="margin: 4px 0 0 0; color: #C78D4E;">Total: ${totalAmount}</p>
        </div>

        <p><strong>Shipping Address:</strong><br />${shippingAddress.replace(/\n/g, '<br />')}</p>

        <p style="font-style: italic; color: #98B0B7; margin-top: 30px;">"Between the high tide and the granite shelf, the past leaves behind what the sea refused."</p>
        
        <hr style="border: 0; border-top: 1px solid #1C373E; margin: 30px 0;" />
        <p style="font-size: 12px; color: #98B0B7; text-align: center;">Arthur Milton Studio • Lizard Point • Cornwall, UK</p>
      </div>
    </div>
  `;

  if (!resend || !resendApiKey || resendApiKey.startsWith('re_mock')) {
    console.log(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: 'orders@arthurmilton.com',
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send Resend email:', error);
    return { success: false, error };
  }
}

export async function sendContactInquiryEmail({
  name,
  email,
  phone,
  organization,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
}) {
  const subject = `Press / Event Inquiry from ${name} (${organization || 'Individual'})`;
  const html = `
    <div style="font-family: sans-serif; background: #0D131A; color: #F3F4F6; padding: 30px;">
      <h2 style="color: #C78D4E;">New Press / Event Inquiry</h2>
      <p><strong>Sender:</strong> ${name} (${email})</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
      <hr style="border: 1px solid #1C373E;" />
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  `;

  if (!resend || !resendApiKey || resendApiKey.startsWith('re_mock')) {
    console.log(`[MOCK CONTACT EMAIL] From: ${email} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    console.error('CONTACT_TO_EMAIL env variable is not set.');
    return { success: false, error: 'Server misconfiguration: missing recipient email.' };
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error };
  }
}
