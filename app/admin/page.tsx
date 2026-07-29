import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial data for admin management
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { book: true },
      },
    },
  });

  const settings = await prisma.setting.findMany();

  return (
    <AdminDashboardClient
      adminName={session.name || session.email}
      initialBooks={books}
      initialPosts={posts}
      initialVideos={videos}
      initialPhotos={photos}
      initialOrders={orders}
      initialSettings={settings}
    />
  );
}
