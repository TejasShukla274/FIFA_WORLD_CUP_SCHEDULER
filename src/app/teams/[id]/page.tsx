'use client';

import React, { useEffect, useState, use } from 'react';
import { TEAMS, Team, Match, VENUES } from '../../../lib/data';
import { getMatches } from '../../../lib/supabase';
import MatchCard from '../../../components/MatchCard';
import { MatchGridSkeleton } from '../../../components/Skeletons';
import { useFavorites } from '../../../components/FavoritesContext';
import { useToast } from '../../../components/Toast';
import { Star, Shield, Zap, CircleAlert, ArrowLeft, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

interface TeamDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const resolvedParams = use(params);
  const teamId = resolvedParams.id;

  const team = TEAMS.find(t => t.id === teamId);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!team) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 rounded-2xl glass-card border border-border-card space-y-4">
        <CircleAlert className="mx-auto text-brand-crimson" size={48} />
        <h1 className="text-2xl font-black text-text-main">Team Not Found</h1>
        <p className="text-text-muted text-sm">The team ID you are requesting does not exist in the FWC 26 registry.</p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-brand-gold text-bg-main text-xs font-bold uppercase transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const teamFixtures = matches.filter(m => m.team1 === team.id || m.team2 === team.id);
  const isFav = isFavorite(team.id);

  const handleToggleFavorite = () => {
    toggleFavorite(team.id);
    if (isFav) {
      showToast(`${team.name} removed from favorites`, 'info');
    } else {
      showToast(`${team.name} added to favorites! ⭐️`, 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div>
        <Link href="/search" className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline">
          <ArrowLeft size={14} /> Back to Teams Search
        </Link>
      </div>

      {/* Team Header Hero Card */}
      <div className={`relative overflow-hidden rounded-2xl glass-card border p-6 sm:p-8 transition-all duration-300 ${
        isFav ? 'border-brand-gold bg-brand-gold/5 shadow-gold-glow' : 'border-border-card'
      }`}>
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-full glass-card hover:text-brand-gold transition-colors cursor-pointer interactive-scale flex items-center justify-center ${
              isFav ? 'text-brand-gold border-brand-gold/50' : 'text-text-dark'
            }`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star size={20} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Large flag badge */}
          <div className="flex items-center justify-center text-6xl h-24 w-24 rounded-2xl bg-bg-hover border border-border-card shadow-inner">
            {team.flag}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-text-main leading-none">
                {team.name}
              </h1>
              <span className="text-sm font-extrabold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 uppercase tracking-widest">
                {team.code}
              </span>
            </div>
            
            <p className="text-sm font-semibold text-text-muted flex items-center gap-1.5">
              <Users size={16} className="text-brand-gold/80" />
              <span>Competing in <strong className="text-text-main font-bold">Group {team.group}</strong></span>
            </p>

            {/* Ratings row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Zap size={14} className="text-brand-gold" />
                <span>Attack: <strong className="text-text-main">{team.attack}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Shield size={14} className="text-brand-green" />
                <span>Defense: <strong className="text-text-main">{team.defense}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Trophy size={14} className="text-brand-gold-hover" />
                <span>Overall Rating: <strong className="text-text-main">{team.overall}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <span>📅</span> Schedule & Fixtures ({teamFixtures.length})
        </h2>

        {loading ? (
          <MatchGridSkeleton count={3} />
        ) : teamFixtures.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-bg-hover border border-border-card">
            <CircleAlert className="mx-auto text-text-dark mb-2" size={24} />
            <p className="text-text-muted text-sm font-semibold">No fixtures generated for this team.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamFixtures.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
