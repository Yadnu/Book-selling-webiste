import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Clock, Tag, Share2, Facebook, Twitter } from 'lucide-react';

interface PostDetailProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostDetailProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: 'Essay Not Found' };

  return {
    title: post.title,
    description: post.excerpt || `Essay by Arthur Milton: ${post.title}`,
    openGraph: {
      title: `${post.title} — Arthur Milton Essay`,
      description: post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  const tagsList = post.tags.split(',').map((t) => t.trim());
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Link */}
      <Link
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-xs text-seafoam hover:text-brass transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Work Showcase</span>
      </Link>

      {/* Essay Header */}
      <header className="space-y-6 border-b border-seafoam/20 pb-8">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-seafoam">
          <span>{formattedDate}</span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brass" />
              {post.readingTime}
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-fog font-normal leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="font-body text-xl italic text-brass/90 leading-relaxed">
            "{post.excerpt}"
          </p>
        )}

        {/* Tag list */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tagsList.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded bg-storm border border-seafoam/20 font-mono text-[11px] text-seafoam"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-80 sm:h-[420px] rounded-lg overflow-hidden border border-seafoam/20 shadow-2xl bg-storm">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Essay HTML Content */}
      <div
        className="prose-editorial max-w-none font-body text-lg space-y-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Share Footer */}
      <footer className="pt-8 border-t border-seafoam/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-seafoam">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-brass" />
          <span>Share this essay:</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded border border-seafoam/20 hover:border-brass hover:text-brass transition-colors"
          >
            Twitter / X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}/work/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded border border-seafoam/20 hover:border-brass hover:text-brass transition-colors"
          >
            Facebook
          </a>
        </div>
      </footer>
    </article>
  );
}
