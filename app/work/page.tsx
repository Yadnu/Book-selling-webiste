import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import WorkShowcase from '@/components/work/WorkShowcase';
import { Feather } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Work Showcase — Essays, Videos & Tide Archives',
  description: 'Read essays on literary craft, watch reading performances, and explore coastal research photography by Arthur Milton.',
};

export default async function WorkPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-seafoam/20 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brass/10 border border-brass/30 text-brass font-mono text-xs uppercase tracking-widest">
          <Feather className="w-3.5 h-3.5" />
          <span>Collected Archives</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-fog font-normal">
          Essays, Media & Research Logs
        </h1>
        <p className="font-body text-lg text-fog/80 leading-relaxed">
          A unified showcase of written reflections, recorded public readings, and photography from five seasons on the Lizard Peninsula.
        </p>
      </div>

      {/* Unified Showcase Filter Container */}
      <WorkShowcase posts={posts} videos={videos} photos={photos} />
    </div>
  );
}
