import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const ADMIN_SESSION_COOKIE = 'am_admin_session';

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) return false;

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  return isPasswordValid;
}

export async function setAdminSession(email: string) {
  const cookieStore = cookies();
  // Simple token encoding email and secret hash
  const token = Buffer.from(JSON.stringify({ email, timestamp: Date.now() })).toString('base64');
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (!decoded.email) return null;

    const admin = await prisma.adminUser.findUnique({
      where: { email: decoded.email },
      select: { id: true, email: true, name: true },
    });

    return admin;
  } catch (error) {
    return null;
  }
}
