import type { Metadata } from 'next';
import './globals.css';
import { fontCormorant, fontNewsreader, fontJetBrains } from '@/lib/fonts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/layout/SkipLink';
import LenisProvider from '@/components/layout/LenisProvider';
import { prisma } from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Arthur Milton — Author of Coastal Gothic Fiction & Novellas',
      template: '%s | Arthur Milton',
    },
    description: 'Official portfolio and bookstore for Arthur Milton. Quiet Gothic novellas set on the storm-swept Cornish coast, preoccupied with solitary lighthouses, fogbound memories, and tide logs.',
    keywords: ['Arthur Milton', 'Gothic Fiction', 'Cornwall Author', 'The Salt Light Keeper', 'Maritime Literature', 'Bookstore'],
    authors: [{ name: 'Arthur Milton' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: 'Arthur Milton Author Portfolio',
      title: 'Arthur Milton — Author & Bookstore',
      description: 'Quiet Gothic novellas set on the Cornish coast. Buy signed first edition hardcovers directly from the author.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
          width: 1200,
          height: 630,
          alt: 'Arthur Milton — Coastal Gothic Fiction',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Arthur Milton — Coastal Gothic Fiction',
      description: 'Explore books, essays, and tide journals by Cornish author Arthur Milton.',
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch social settings
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['facebook_url', 'instagram_url', 'tiktok_url'],
      },
    },
  });

  const socialMap: Record<string, string> = {};
  settings.forEach((s) => {
    socialMap[s.key] = s.value;
  });

  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arthur Milton',
    jobTitle: 'Author',
    genre: 'Gothic Fiction / Maritime Realism',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    sameAs: [
      socialMap.facebook_url,
      socialMap.instagram_url,
      socialMap.tiktok_url,
    ].filter(Boolean),
  };

  return (
    <html
      lang="en"
      className={`${fontCormorant.variable} ${fontNewsreader.variable} ${fontJetBrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="bg-abyssal text-fog flex flex-col min-h-screen">
        <LenisProvider>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer
            facebookUrl={socialMap.facebook_url}
            instagramUrl={socialMap.instagram_url}
            tiktokUrl={socialMap.tiktok_url}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
