import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-card pitch-bg gold-glow py-12 px-6 sm:px-12 text-center border border-brand-gold/20 shadow-gold-glow mb-8">
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider mb-6">
          <Trophy size={14} /> June 11 – July 19, 2026
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">
          FIFA World Cup <span className="bg-gradient-to-r from-brand-gold via-brand-gold-hover to-brand-green bg-clip-text text-transparent">2026</span> Planner
        </h1>
        <p className="text-base sm:text-lg text-text-muted mb-8 max-w-2xl mx-auto">
          Track the biggest World Cup in history. View schedules, manage your favorite teams, and follow all 104 matches across Canada, Mexico, and the United States in Indian Standard Time (IST).
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link href="/calendar" className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-bg-main font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer interactive-scale">
            Explore Full Calendar
          </Link>
          <Link href="/search" className="px-6 py-3 rounded-xl glass-card text-text-main hover:text-brand-gold border border-border-card hover:border-brand-gold/30 font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer interactive-scale">
            Find Your Team
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5 max-w-2xl mx-auto">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">48</div>
            <div className="text-xs sm:text-sm font-semibold text-text-muted">Teams</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">12</div>
            <div className="text-xs sm:text-sm font-semibold text-text-muted">Groups</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">104</div>
            <div className="text-xs sm:text-sm font-semibold text-text-muted">Matches</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">16</div>
            <div className="text-xs sm:text-sm font-semibold text-text-muted">Venues</div>
          </div>
        </div>
      </div>
    </div>
  );
}
