'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Video, Camera, Clock, Tag, ExternalLink } from 'lucide-react';
import PhotoLightbox from './PhotoLightbox';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  readingTime?: string | null;
  tags: string;
  publishedAt: Date;
}

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  posterFrame?: string | null;
}

interface Photo {
  id: string;
  title?: string | null;
  caption?: string | null;
  url: string;
  category: string;
}

interface WorkShowcaseProps {
  posts: Post[];
  videos: VideoItem[];
  photos: Photo[];
}

export default function WorkShowcase({ posts, videos, photos }: WorkShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'videos' | 'photos'>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Collect unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags.split(',').map((t) => t.trim())))
  );

  const filteredPosts = posts.filter((post) => {
    if (activeTag) {
      return post.tags.toLowerCase().includes(activeTag.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Filter Tabs & Tag Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-b border-seafoam/20 pb-6">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-2 bg-storm/80 p-1.5 rounded-lg border border-seafoam/20 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap px-4 py-2 rounded text-xs font-mono tracking-wider transition-colors ${
              activeTab === 'all'
                ? 'bg-brass text-abyssal font-bold'
                : 'text-fog/70 hover:text-fog'
            }`}
          >
            All Work
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono tracking-wider transition-colors ${
              activeTab === 'posts'
                ? 'bg-brass text-abyssal font-bold'
                : 'text-fog/70 hover:text-fog'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Essays ({posts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono tracking-wider transition-colors ${
              activeTab === 'videos'
                ? 'bg-brass text-abyssal font-bold'
                : 'text-fog/70 hover:text-fog'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({videos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono tracking-wider transition-colors ${
              activeTab === 'photos'
                ? 'bg-brass text-abyssal font-bold'
                : 'text-fog/70 hover:text-fog'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({photos.length})</span>
          </button>
        </div>

        {/* Tag Filters for Essays */}
        {(activeTab === 'all' || activeTab === 'posts') && allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
            <span className="font-mono text-[11px] text-seafoam flex items-center gap-1 whitespace-nowrap">
              <Tag className="w-3 h-3" /> Tag:
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className={`whitespace-nowrap px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                activeTag === null
                  ? 'border-brass text-brass bg-brass/10 font-semibold'
                  : 'border-seafoam/20 text-seafoam hover:text-fog'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`whitespace-nowrap px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                  activeTag === tag
                    ? 'border-brass text-brass bg-brass/10 font-semibold'
                    : 'border-seafoam/20 text-seafoam hover:text-fog'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ESSAYS / BLOG POSTS SECTION */}
      {(activeTab === 'all' || activeTab === 'posts') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-seafoam/15 pb-2">
            <h2 className="font-display text-2xl text-fog font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brass" />
              <span>Essays & Tide Journals</span>
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center gothic-card rounded space-y-2">
              <p className="font-body text-base text-seafoam">No essays found for tag "{activeTag}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="gothic-card gothic-card-hover rounded-lg overflow-hidden flex flex-col justify-between p-6 space-y-4 h-full border border-seafoam/20">
                  {post.coverImage && (
                    <div className="relative w-full h-48 rounded overflow-hidden bg-storm">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-seafoam">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {post.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brass" />
                          {post.readingTime}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-fog font-medium leading-snug hover:text-brass transition-colors">
                      <Link href={`/work/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {post.excerpt && (
                      <p className="font-body text-sm text-fog/75 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-seafoam/15 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brass uppercase tracking-wider">
                      {post.tags.split(',')[0]}
                    </span>
                    <Link
                      href={`/work/${post.slug}`}
                      className="font-mono text-xs text-fog hover:text-brass flex items-center gap-1"
                    >
                      <span>Read Essay</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIDEOS SECTION */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-seafoam/15 pb-2">
            <h2 className="font-display text-2xl text-fog font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-brass" />
              <span>Readings & Video Recordings</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="gothic-card rounded-lg overflow-hidden p-4 space-y-3 border border-seafoam/20">
                <div className="relative w-full aspect-video rounded overflow-hidden bg-storm border border-seafoam/20">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0"
                  />
                </div>
                <h3 className="font-display text-xl text-fog font-medium">{video.title}</h3>
                {video.description && (
                  <p className="font-body text-sm text-fog/70 leading-relaxed">{video.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PHOTOS / LIGHTBOX GALLERY SECTION */}
      {(activeTab === 'all' || activeTab === 'photos') && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-seafoam/15 pb-2">
            <h2 className="font-display text-2xl text-fog font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5 text-brass" />
              <span>Coastal Research & Tide Archives</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square rounded overflow-hidden gothic-card gothic-card-hover border border-seafoam/20 focus-visible:outline-none"
                aria-label={`Open photo: ${photo.title || 'Gallery item'}`}
              >
                <Image
                  src={photo.url}
                  alt={photo.title || 'Arthur Milton photo archive'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-abyssal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="font-mono text-xs text-brass truncate">
                    {photo.title || photo.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal Trigger */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  );
}
