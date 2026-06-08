'use client';

import React, { useEffect, useState } from 'react';
import { getMatches } from '../../lib/supabase';
import { Match, TEAMS } from '../../lib/data';
import MatchCard from '../../components/MatchCard';
import { MatchGridSkeleton } from '../../components/Skeletons';
import { useFavorites } from '../../components/FavoritesContext';
import { Star, CircleAlert } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { favorites } = useFavorites();

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

  // Filter matches containing favorited teams
  const favoriteMatches = matches.filter(m => 
    favorites.includes(m.team1) || favorites.includes(m.team2)
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Star className="text-brand-gold animate-bounce" fill="currentColor" size={28} /> Favorited Matches
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          Keep track of matches and schedules for your custom list of favorite teams.
        </p>
      </div>

      {/* List of favorited teams */}
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-white/5 border border-white/5 items-center">
          <span className="text-xs text-text-dark font-extrabold uppercase tracking-wider mr-2">FAVORITE TEAMS ({favorites.length}):</span>
          {favorites.map(id => {
            const team = TEAMS.find(t => t.id === id);
            if (!team) return null;
            return (
              <Link
                key={id}
                href={`/search?team=${team.name}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-xs font-bold border border-brand-gold/20 transition-all cursor-pointer"
              >
                <span>{team.flag}</span>
                <span>{team.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Fixtures grid */}
      {loading ? (
        <MatchGridSkeleton count={3} />
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-card border border-border-card max-w-xl mx-auto space-y-6">
          <span className="text-5xl block select-none">⭐</span>
          <h2 className="text-2xl font-black text-white">No Favorite Teams</h2>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            You haven&apos;t added any teams to your favorites yet. Click the star icon on any match card, or select a team on the search page and click favorite.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/calendar"
              className="px-5 py-2.5 rounded-xl bg-brand-gold text-bg-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
            >
              Explore Calendar
            </Link>
            <Link
              href="/search"
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white hover:text-brand-gold text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
            >
              Search Teams
            </Link>
          </div>
        </div>
      ) : favoriteMatches.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white/5 border border-white/5">
          <CircleAlert className="mx-auto text-text-dark mb-2" size={24} />
          <p className="text-text-muted text-sm font-semibold">No matches found for your favorited teams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
