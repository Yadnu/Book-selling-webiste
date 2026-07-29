import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { User, Download, Mail, Compass, ExternalLink, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Arthur Milton — Biography & Press Kit',
  description: 'Biography, literary representation, downloadable press kit, and background on author Arthur Milton.',
};

export default async function AboutPage() {
  const settings = await prisma.setting.findMany();
  const settingMap: Record<string, string> = {};
  settings.forEach((s) => {
    settingMap[s.key] = s.value;
  });

  const bioHeading = settingMap.bio_heading || 'Author & Chronicler of Coastal Gothic Realism';
  const bioBody = settingMap.bio_body || 'Arthur Milton was born in Cornwall and educated at Oxford. For over two decades, he has lived in a remote stone cottage on the Lizard Peninsula, writing fiction that explores the quiet intersections of weather, grief, and maritime history.';
  const agentInfo = settingMap.agent_info || 'Represented by Eleanor Vance at Apex Literary Agency, London.';
  const pressContact = settingMap.press_contact_email || 'press@arthurmilton.com';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl border-b border-seafoam/20 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brass/10 border border-brass/30 text-brass font-mono text-xs uppercase tracking-widest">
          <User className="w-3.5 h-3.5" />
          <span>About the Author</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-fog font-normal">
          Arthur Milton
        </h1>
        <p className="font-body text-xl italic text-brass font-serif">
          {bioHeading}
        </p>
      </div>

      {/* Grid: Photo & Biography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Author Photo */}
        <div className="lg:col-span-5 relative h-[480px] rounded-lg overflow-hidden border border-seafoam/20 shadow-2xl bg-storm">
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
            alt="Arthur Milton portrait"
            fill
            className="object-cover filter grayscale contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-transparent to-transparent opacity-60" />
          <span className="absolute bottom-4 left-4 font-mono text-xs text-seafoam">
            Lizard Point Studio • Cornwall
          </span>
        </div>

        {/* Bio Text & Representation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="prose-editorial leading-relaxed text-fog/90 space-y-4">
            <p>{bioBody}</p>
            <p>
              His work has been awarded the Royal Society of Literature Award, shortlisted for the International Dublin Literary Award, and featured in <em>The Guardian</em>, <em>The Times Literary Supplement</em>, and <em>Granta Magazine</em>.
            </p>
            <p>
              When not writing at his study desk overlooking the breakers, he assists the local maritime trust in cataloging 19th-century tide logs and lighthouse signal ledgers.
            </p>
          </div>

          {/* Literary Representation Box */}
          <div className="gothic-card p-6 rounded-lg space-y-3 border border-seafoam/20">
            <h3 className="font-mono text-xs text-brass uppercase tracking-widest font-semibold">
              Literary Representation
            </h3>
            <p className="font-body text-base text-fog/85">{agentInfo}</p>
            <p className="font-mono text-xs text-seafoam">
              For translation rights, film/TV inquiries, or literary festivals, please contact the agency or email press directly.
            </p>
          </div>

          {/* Press Kit Download & Inquiries CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono text-xs">
            <a
              href="/press-kit.zip"
              download
              className="bg-brass hover:bg-brass-hover text-abyssal font-semibold py-3.5 px-6 rounded shadow transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Press Kit (.ZIP)</span>
            </a>
            <Link
              href="/contact"
              className="border border-seafoam/30 hover:border-brass text-fog py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-brass" />
              <span>Press & Event Inquiries</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
