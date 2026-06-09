'use client';

import React from 'react';
import Hero from '../components/Hero';
import { isSupabaseConfigured } from '../lib/supabase';
import { TEAMS } from '../lib/data';
import MatchCard from '../components/MatchCard';
import { MatchGridSkeleton, CalendarGridSkeleton } from '../components/Skeletons';
import { Clock, MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import Countdown from '../components/Countdown';
import { useMatches } from '../components/MatchesContext';
import CalendarGrid from '../components/CalendarGrid';
import SoccerBallLoader from '../components/SoccerBallLoader';

export default function Home() {
  const { matches, loading } = useMatches();

  // Filter next upcoming matches
  const now = new Date();
  const sortedUpcoming = [...matches]
    .filter(m => {
      const matchTime = new Date(`${m.date}T${m.time_ist}:00+05:30`);
      return matchTime > now && !m.is_completed;
    })
    .sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time_ist}:00+05:30`).getTime();
      const timeB = new Date(`${b.date}T${b.time_ist}:00+05:30`).getTime();
      return timeA - timeB;
    });

  const nextMatch = sortedUpcoming[0];

  // Today's matches
  const todayDateStr = now.toISOString().split('T')[0];
  const todaysMatches = matches.filter(m => m.date === todayDateStr);

  // Fallback: if no matches today, show the opening match day (June 12, 2026)
  const featuredDate = todaysMatches.length > 0 ? todayDateStr : '2026-06-12';
  const displayMatches = matches.filter(m => m.date === featuredDate).slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-10 page-transition">
        <SoccerBallLoader text="Loading FIFA World Cup 2026..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 page-transition">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Info Banner */}
      {!isSupabaseConfigured && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-gold/8 border border-brand-gold/15 text-sm font-medium card-enter card-enter-1">
          <Info size={18} className="text-brand-gold flex-shrink-0" />
          <p className="text-text-muted">
            Running in Local Offline Mode. Set{' '}
            <code className="bg-bg-hover px-1.5 py-0.5 rounded font-mono text-xs text-brand-gold border border-border-card">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{' '}
            in environment variables to link your database.
          </p>
        </div>
      )}

      {/* 3. Tournament Calendar at a Glance */}
      <CalendarGrid matches={matches} />

      {/* 4. Next Match Spotlight */}
      {nextMatch && (
        <div className="relative overflow-hidden rounded-2xl glass-card border border-brand-gold/20 bg-gradient-to-br from-bg-card to-brand-gold/5 p-6 sm:p-8 card-enter card-enter-2">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-gold/10 rounded-bl-xl border-l border-b border-brand-gold/10 animate-pulse-glow">
            Next Match
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase bg-bg-hover border border-border-card text-brand-gold px-2.5 py-1 rounded-full">
                {nextMatch.group_name === 'Knockout' ? nextMatch.stage : nextMatch.group_name}
              </span>
              
              {/* Teams Flex */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl select-none">
                    {TEAMS.find(t => t.id === nextMatch.team1)?.flag || '🏳️'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-text-main">
                    {TEAMS.find(t => t.id === nextMatch.team1)?.name || nextMatch.team1}
                  </span>
                </div>
                <span className="text-xs font-black text-brand-gold">VS</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl select-none">
                    {TEAMS.find(t => t.id === nextMatch.team2)?.flag || '🏳️'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-text-main">
                    {TEAMS.find(t => t.id === nextMatch.team2)?.name || nextMatch.team2}
                  </span>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-brand-gold/80" />
                  <span className="font-bold text-text-main">{nextMatch.time_ist} IST ({new Date(nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-text-dark" />
                  <span>{nextMatch.venue}</span>
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex flex-col items-start md:items-center justify-center p-5 rounded-2xl bg-bg-hover border border-border-card min-w-[240px]">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-2">KICKOFF COUNTDOWN</span>
              <Countdown targetDateStr={`${nextMatch.date}T${nextMatch.time_ist}:00+05:30`} />
              <Link 
                href={`/matches/${nextMatch.id}`}
                className="mt-4 w-full py-2.5 text-center rounded-xl bg-brand-gold text-bg-main text-xs font-extrabold hover:bg-brand-gold-hover transition-colors uppercase tracking-wider cursor-pointer interactive-scale"
              >
                Match details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. Featured Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-text-main flex items-center gap-2">
            <span>📅</span>
            {todaysMatches.length > 0 ? "Today's Matches" : "Opening Day Fixtures"}
          </h2>
          <Link href="/calendar" className="text-sm font-bold text-brand-gold hover:text-brand-gold-hover transition-colors hover:underline">
            View Full Calendar &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMatches.map((match, i) => (
            <div key={match.id} className={`card-enter card-enter-${i + 1}`}>
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
