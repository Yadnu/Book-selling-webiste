'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import BookScene from './BookScene';
import HeroStaticFallback from './HeroStaticFallback';

export default function BookCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (reducedMotion || hasError) {
    return <HeroStaticFallback />;
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-lg overflow-hidden border border-seafoam/15 bg-abyssal shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0D131A');
        }}
        onError={() => setHasError(true)}
      >
        <BookScene />
      </Canvas>
    </div>
  );
}
