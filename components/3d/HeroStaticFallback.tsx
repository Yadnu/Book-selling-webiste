'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroStaticFallback() {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] flex items-center justify-center overflow-hidden bg-abyssal border border-seafoam/15 rounded-lg shadow-2xl">
      {/* Fog Background Image & Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-abyssal via-abyssal-800/80 to-transparent z-10" />
      
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
        alt="Cornish coastal sea fog"
        fill
        priority
        className="object-cover opacity-25 filter blur-xs"
      />

      {/* Decorative Book Mockup Card */}
      <div className="relative z-20 text-center px-6 max-w-lg space-y-4">
        <div className="mx-auto w-44 h-64 relative bg-storm border-2 border-brass/60 rounded shadow-2xl overflow-hidden flex flex-col justify-between p-4 group transform transition-transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-tr from-brass/10 to-transparent pointer-events-none" />
          <div className="border border-brass/30 p-2 rounded h-full flex flex-col justify-between">
            <span className="font-mono text-[9px] tracking-widest text-brass uppercase">First Edition</span>
            <div>
              <h3 className="font-display text-lg text-fog font-bold tracking-wide leading-tight">
                THE SALT LIGHT KEEPER
              </h3>
              <p className="font-body text-xs italic text-seafoam mt-1">Arthur Milton</p>
            </div>
            <span className="font-mono text-[9px] text-seafoam/70">Cornwall Novella</span>
          </div>
        </div>

        <p className="font-mono text-xs text-brass tracking-wider uppercase">
          Static 3D Fallback Mode Enabled
        </p>
      </div>
    </div>
  );
}
