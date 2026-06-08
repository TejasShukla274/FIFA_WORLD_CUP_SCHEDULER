'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getMatches } from '../../lib/supabase';
import { Match, TEAMS, Team } from '../../lib/data';
import MatchCard from '../../components/MatchCard';
import { MatchGridSkeleton } from '../../components/Skeletons';
import { useFavorites } from '../../components/FavoritesContext';
import { Search, Star, Shield, Zap, CircleAlert } from 'lucide-react';

function highlightText(text: string, search: string) {
  if (!search.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-brand-gold/30 text-text-main font-black px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
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

  // Update selected team based on query parameter
  useEffect(() => {
    const teamParam = searchParams.get('team');
    if (teamParam) {
      const found = TEAMS.find(t => t.name.toLowerCase() === teamParam.toLowerCase() || t.code.toLowerCase() === teamParam.toLowerCase());
      if (found) {
        setSelectedTeam(found);
        setSearchQuery(found.name);
      }
    } else if (TEAMS.length > 0 && !selectedTeam) {
      // default select USA (or first team)
      const defaultTeam = TEAMS.find(t => t.id === 'usa') || TEAMS[0];
      setSelectedTeam(defaultTeam);
      setSearchQuery(defaultTeam.name);
    }
  }, [searchParams]);

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    setSearchQuery(team.name);
    router.push(`/search?team=${encodeURIComponent(team.name)}`);
  };

  // Filter teams list based on search query (by Team Name, Group, Venue, or Date)
  const filteredTeamsList = searchQuery.trim() === ''
    ? TEAMS
    : TEAMS.filter(t => {
        const query = searchQuery.toLowerCase();
        
        // 1. Team name / code match
        if (t.name.toLowerCase().includes(query)) return true;
        if (t.code.toLowerCase().includes(query)) return true;
        
        // 2. Group match
        const groupStr = `group ${t.group.toLowerCase()}`;
        if (groupStr.includes(query) || t.group.toLowerCase() === query) return true;
        
        // 3. Match fixtures (Venue or Date) matching this team
        const teamMatches = matches.filter(m => m.team1 === t.id || m.team2 === t.id);
        return teamMatches.some(m => {
          if (m.venue.toLowerCase().includes(query)) return true;
          
          const dateStr = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
          const fullDateStr = new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toLowerCase();
          if (m.date.includes(query) || dateStr.includes(query) || fullDateStr.includes(query)) return true;
          return false;
        });
      });

  const getMatchReason = (t: Team) => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    if (t.name.toLowerCase().includes(query) || t.code.toLowerCase().includes(query)) return null;
    
    const groupStr = `group ${t.group.toLowerCase()}`;
    if (groupStr.includes(query) || t.group.toLowerCase() === query) {
      return <span className="text-[9px] text-brand-gold uppercase font-bold">Group {t.group}</span>;
    }
    
    const teamMatches = matches.filter(m => m.team1 === t.id || m.team2 === t.id);
    for (const m of teamMatches) {
      if (m.venue.toLowerCase().includes(query)) {
        return <span className="text-[9px] text-text-muted">Plays at: {highlightText(m.venue, searchQuery)}</span>;
      }
      const dateStr = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
      const fullDateStr = new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toLowerCase();
      if (m.date.includes(query) || dateStr.includes(query) || fullDateStr.includes(query)) {
        const displayDate = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return <span className="text-[9px] text-text-muted">Plays on: {highlightText(displayDate, searchQuery)}</span>;
      }
    }
    return null;
  };

  // Filter fixtures for selected team
  const teamFixtures = selectedTeam
    ? matches.filter(m => m.team1 === selectedTeam.id || m.team2 === selectedTeam.id)
    : [];

  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar: Team Selector */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
          <h2 className="text-lg font-black text-text-main flex items-center gap-2">
            <span>⚽</span> Select Team
          </h2>
          
          {/* Team Search Input */}
          <div className="relative">
            <label htmlFor="team-search-input" className="sr-only">Search Team</label>
            <input
              id="team-search-input"
              type="text"
              placeholder="Search by team, group, venue, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-hover border border-border-card text-text-main focus:outline-none focus:border-brand-gold text-xs font-semibold placeholder:text-text-dark"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dark" size={14} />
          </div>

          {/* Teams List (scrollable) */}
          <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
            {filteredTeamsList.length === 0 ? (
              <p className="text-text-dark text-xs text-center py-4">No teams match your search.</p>
            ) : (
              filteredTeamsList.map((team) => {
                const active = selectedTeam?.id === team.id;
                const matchReason = getMatchReason(team);
                return (
                  <button
                    key={team.id}
                    onClick={() => selectTeam(team)}
                    className={`w-full flex flex-col p-2.5 rounded-lg text-left text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                        : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{team.flag}</span>
                        <span>{highlightText(team.name, searchQuery)}</span>
                      </div>
                      <span className="text-[10px] text-text-dark uppercase">{team.code}</span>
                    </div>
                    {matchReason && (
                      <div className="mt-1 pl-7">
                        {matchReason}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Panel: Team Details & Fixtures */}
      <div className="lg:col-span-3 space-y-6">
        {selectedTeam ? (
          <>
            {/* Team Overview Card */}
            <div className="relative overflow-hidden rounded-2xl glass-card border border-border-card p-6 sm:p-8">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => toggleFavorite(selectedTeam.id)}
                  className={`p-2 rounded-full glass-card hover:text-brand-gold transition-colors cursor-pointer interactive-scale flex items-center justify-center ${
                    isFavorite(selectedTeam.id) ? 'text-brand-gold border-brand-gold/50' : 'text-text-dark'
                  }`}
                  title="Toggle Favorite status"
                >
                  <Star size={20} fill={isFavorite(selectedTeam.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Flag Badge */}
                <div className="flex items-center justify-center text-6xl h-20 w-20 rounded-2xl bg-bg-hover border border-border-card shadow-inner">
                  {selectedTeam.flag}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-text-main leading-none">
                      {selectedTeam.name}
                    </h1>
                    <span className="text-sm font-extrabold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 uppercase tracking-widest">
                      {selectedTeam.code}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-text-muted">
                    Allocated to <span className="text-text-main font-bold">Group {selectedTeam.group}</span>
                  </p>

                  {/* Rating Metrics */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Zap size={14} className="text-brand-gold" />
                      <span>Attack: <strong className="text-text-main">{selectedTeam.attack}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Shield size={14} className="text-brand-green" />
                      <span>Defense: <strong className="text-text-main">{selectedTeam.defense}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Star size={14} className="text-brand-gold-hover" />
                      <span>Overall: <strong className="text-text-main">{selectedTeam.overall}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixtures Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <span>📅</span> {selectedTeam.name} Fixtures
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
          </>
        ) : (
          <div className="text-center py-20 rounded-2xl glass-card border border-border-card">
            <span className="text-4xl">⚽</span>
            <h3 className="text-lg font-bold text-text-main mt-3">No Team Selected</h3>
            <p className="text-text-muted mt-1 text-sm">
              Please choose a team from the selector on the left.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-text-main font-bold">Loading search queries...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
