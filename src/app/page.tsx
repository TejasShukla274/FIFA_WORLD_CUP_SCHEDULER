'use client';

import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { getMatches, isSupabaseConfigured } from '../lib/supabase';
import { Match, TEAMS } from '../lib/data';
import MatchCard from '../components/MatchCard';
import { MatchGridSkeleton } from '../components/Skeletons';
import { Search, Star, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import Countdown from '../components/Countdown';

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('matches-updated', loadData);
    return () => window.removeEventListener('matches-updated', loadData);
  }, []);

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
  const otherUpcoming = sortedUpcoming.slice(1, 4);

  // Today's matches
  const todayDateStr = now.toISOString().split('T')[0];
  const todaysMatches = matches.filter(m => m.date === todayDateStr);

  // Fallback: if no matches today, show the opening match day (June 11, 2026)
  const featuredDate = todaysMatches.length > 0 ? todayDateStr : '2026-06-11';
  const displayMatches = matches.filter(m => m.date === featuredDate).slice(0, 3);

  // Filter teams for search dropdown or suggestion
  const filteredTeams = searchQuery.trim() === '' 
    ? []
    : TEAMS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);

  return (
    <div className="space-y-10">
      <Hero />

      {/* Database Connection Notice */}
      {!isSupabaseConfigured && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium">
          <span className="text-lg">ℹ️</span>
          <p>
            Running in Local Offline Mode. Set <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> in environment variables to link your database.
          </p>
        </div>
      )}

      {/* Next Match Spotlight */}
      {nextMatch && !loading && (
        <div className="relative overflow-hidden rounded-2xl glass-card border border-brand-gold/30 bg-gradient-to-br from-bg-card to-brand-gold/5 p-6 sm:p-8">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-black uppercase tracking-wider text-brand-gold bg-brand-gold/10 rounded-bl-xl border-l border-b border-brand-gold/10">
            Next Match
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase bg-white/5 border border-white/5 text-brand-gold px-2.5 py-1 rounded-full">
                {nextMatch.group_name === 'Knockout' ? nextMatch.stage : nextMatch.group_name}
              </span>
              
              {/* Teams Flex */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl select-none">
                    {TEAMS.find(t => t.id === nextMatch.team1)?.flag || '🏳️'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {TEAMS.find(t => t.id === nextMatch.team1)?.name || nextMatch.team1}
                  </span>
                </div>
                <span className="text-xs font-black text-brand-gold">VS</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl select-none">
                    {TEAMS.find(t => t.id === nextMatch.team2)?.flag || '🏳️'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {TEAMS.find(t => t.id === nextMatch.team2)?.name || nextMatch.team2}
                  </span>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-brand-gold/80" />
                  <span className="font-bold text-white">{nextMatch.time_ist} IST ({new Date(nextMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-text-dark" />
                  <span>{nextMatch.venue}</span>
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex flex-col items-start md:items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 min-w-[240px]">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider mb-2">KICKOFF COUNTDOWN</span>
              <Countdown targetDateStr={`${nextMatch.date}T${nextMatch.time_ist}:00+05:30`} />
              <Link 
                href={`/matches/${nextMatch.id}`}
                className="mt-4 w-full py-2 text-center rounded-xl bg-brand-gold text-bg-main text-xs font-extrabold hover:bg-brand-gold-hover transition-colors uppercase tracking-wider"
              >
                Match details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search */}
      <div className="relative max-w-xl mx-auto">
        <label htmlFor="team-search-home" className="sr-only">Search Team</label>
        <div className="relative">
          <input
            id="team-search-home"
            type="text"
            placeholder="Quick search team fixtures (e.g. Argentina, Brazil, USA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-card border border-border-card text-text-main focus:outline-none focus:border-brand-gold transition-colors text-sm font-semibold placeholder:text-text-dark shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark" size={18} />
        </div>
        
        {/* Search Results Dropdown */}
        {filteredTeams.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 p-2 rounded-xl bg-bg-card border border-border-card shadow-2xl z-20 space-y-1 max-h-[300px] overflow-y-auto">
            {filteredTeams.map((team) => (
              <Link
                key={team.id}
                href={`/search?team=${team.name}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-sm transition-colors text-white font-bold group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{team.flag}</span>
                  <span>{team.name}</span>
                </div>
                <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">View Fixtures &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Match Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>📅</span>
            {todaysMatches.length > 0 ? "Today's Matches" : "Opening Day Fixtures (June 11)"}
          </h2>
          <Link href="/calendar" className="text-sm font-bold text-brand-gold hover:text-brand-gold-hover transition-colors hover:underline">
            View Full Calendar &rarr;
          </Link>
        </div>

        {loading ? (
          <MatchGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* Other Upcoming matches */}
      {otherUpcoming.length > 0 && !loading && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⏱️</span> Upcoming Fixtures
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherUpcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
