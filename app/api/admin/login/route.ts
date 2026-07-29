import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await setAdminSession(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
