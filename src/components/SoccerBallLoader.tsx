'use client';

import React from 'react';

interface SoccerBallLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SoccerBallLoader({ text = 'Loading...', size = 'md' }: SoccerBallLoaderProps) {
  const sizeMap = { sm: 28, md: 44, lg: 64 };
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="animate-ball-bounce">
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-ball drop-shadow-lg">
          {/* Ball body */}
          <circle cx="32" cy="32" r="30" fill="currentColor" className="text-text-main" stroke="var(--color-border-card)" strokeWidth="1.5" />
          {/* Pentagon patches */}
          <path d="M32 8 L38 18 L34 26 L26 26 L22 18 Z" fill="var(--color-bg-main)" opacity="0.85" />
          <path d="M50 22 L54 32 L48 40 L40 38 L38 28 Z" fill="var(--color-bg-main)" opacity="0.85" />
          <path d="M14 22 L26 28 L24 38 L16 40 L10 32 Z" fill="var(--color-bg-main)" opacity="0.85" />
          <path d="M20 48 L28 42 L36 42 L44 48 L38 56 L26 56 Z" fill="var(--color-bg-main)" opacity="0.85" />
          {/* Stitch lines */}
          <path d="M32 2 L32 8" stroke="var(--color-text-dark)" strokeWidth="0.5" opacity="0.3" />
          <path d="M56 20 L50 22" stroke="var(--color-text-dark)" strokeWidth="0.5" opacity="0.3" />
          <path d="M8 20 L14 22" stroke="var(--color-text-dark)" strokeWidth="0.5" opacity="0.3" />
          <path d="M50 52 L44 48" stroke="var(--color-text-dark)" strokeWidth="0.5" opacity="0.3" />
          <path d="M14 52 L20 48" stroke="var(--color-text-dark)" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>
      {text && (
        <p className="text-sm font-semibold text-text-muted animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
}
