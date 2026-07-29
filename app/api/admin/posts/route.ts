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

    await prisma.post.delete({ where: { id } });
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

    const newPost = await prisma.post.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        readingTime: body.readingTime || '5 min read',
        tags: body.tags || 'Essays',
        status: 'published',
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
