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

    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newBook = await prisma.book.create({
      data: {
        slug,
        title: body.title,
        subtitle: body.subtitle || null,
        coverImage: body.coverImage,
        synopsis: body.synopsis,
        excerpt: body.excerpt,
        priceInCents: body.priceInCents || 2400,
        isbn: body.isbn,
        pageCount: body.pageCount || 200,
        publicationDate: new Date(),
        format: body.format || 'Hardcover',
        stockQuantity: body.stockQuantity || 50,
        isForSale: true,
      },
    });

    return NextResponse.json(newBook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
