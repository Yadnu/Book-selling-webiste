import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const books = await prisma.book.findMany();
  const posts = await prisma.post.findMany({ where: { status: 'published' } });

  const bookUrls = books.map((b) => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: b.updatedAt,
  }));

  const postUrls = posts.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/books`, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...bookUrls,
    ...postUrls,
  ];
}
