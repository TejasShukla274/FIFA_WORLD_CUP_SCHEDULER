'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { useTheme } from './ThemeContext';

export default function Hero() {
  const { theme } = useTheme();
  const trophySrc = theme === 'dark' ? '/trophy-dark.png' : '/trophy-light.png';

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card pitch-bg gold-glow py-10 px-6 sm:px-12 border border-brand-gold/15 shadow-gold-glow page-transition">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Left column — Content */}
        <div className="flex-1 max-w-xl space-y-5">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Trophy size={13} />
            <span>June 11 – July 19, 2026</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main leading-[1.1]">
            FIFA <span className="bg-gradient-to-r from-brand-gold via-brand-gold-hover to-brand-green bg-clip-text text-transparent">2026</span> Planner
          </h1>

          {/* Description */}
          <p className="text-base text-text-muted leading-relaxed max-w-lg">
            Track the biggest World Cup in history. View schedules, your favorite teams, and follow all 104 matches across Canada, and the United States in Indian Standard Time (IST).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/calendar"
              className="px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer interactive-scale text-sm"
            >
              Explore Full Calendar
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 rounded-xl glass-card text-text-main hover:text-brand-gold border border-border-card hover:border-brand-gold/30 font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer interactive-scale text-sm"
            >
              Find Your Team
            </Link>
          </div>
        </div>

        {/* Right column — Trophy image */}
        <div className="hidden md:flex items-center justify-center flex-shrink-0">
          <div className="animate-float">
            <Image
              src={trophySrc}
              alt="FIFA World Cup 2026 Trophy"
              width={240}
              height={320}
              className="drop-shadow-2xl select-none pointer-events-none rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-4 pt-8 mt-8 border-t border-border-card">
        {[
          { value: 48, label: 'Teams' },
          { value: 12, label: 'Groups' },
          { value: 104, label: 'Matches' },
          { value: 16, label: 'Host Cities' },
          { value: 3, label: 'Host Countries' },
        ].map((stat, i) => (
          <div key={stat.label} className={`text-center card-enter card-enter-${i + 1}`}>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-main">
              <AnimatedCounter end={stat.value} />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-text-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
