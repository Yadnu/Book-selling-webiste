import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { orderId, status, trackingNumber } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
