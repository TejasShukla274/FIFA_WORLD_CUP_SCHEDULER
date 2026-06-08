'use client';

import React from 'react';
import Link from 'next/link';
import { TEAMS, Match } from '../lib/data';
import { useFavorites } from './FavoritesContext';
import { Star, MapPin, Calendar, Clock } from 'lucide-react';
import Countdown from './Countdown';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const team1Obj = TEAMS.find(t => t.id === match.team1);
  const team2Obj = TEAMS.find(t => t.id === match.team2);

  const t1Name = team1Obj ? team1Obj.name : match.team1;
  const t2Name = team2Obj ? team2Obj.name : match.team2;

  const t1Flag = team1Obj ? team1Obj.flag : '🏳️';
  const t2Flag = team2Obj ? team2Obj.flag : '🏳️';

  const t1Code = team1Obj ? team1Obj.code : 'T1';
  const t2Code = team2Obj ? team2Obj.code : 'T2';

  const isFav = (team1Obj && isFavorite(team1Obj.id)) || (team2Obj && isFavorite(team2Obj.id));
  const targetDateStr = `${match.date}T${match.time_ist}:00+05:30`;

  const formattedDate = new Date(match.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`relative glass-card overflow-hidden p-5 flex flex-col justify-between h-full border ${
      isFav 
        ? 'border-brand-gold bg-brand-gold/5 shadow-gold-glow' 
        : 'border-border-card'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[10px] font-extrabold uppercase bg-white/5 border border-white/5 text-brand-gold px-2 py-0.5 rounded-full">
          {match.group_name === 'Knockout' ? match.stage : match.group_name}
        </span>
        <div className="flex items-center gap-1">
          {team1Obj && (
            <button 
              onClick={() => toggleFavorite(team1Obj.id)}
              className={`p-1 rounded-full hover:bg-white/5 transition-all cursor-pointer ${
                isFavorite(team1Obj.id) ? 'text-brand-gold' : 'text-text-dark hover:text-text-muted'
              }`}
              title={`Favorite ${team1Obj.name}`}
            >
              <Star size={12} fill={isFavorite(team1Obj.id) ? 'currentColor' : 'none'} />
            </button>
          )}
          {team2Obj && (
            <button 
              onClick={() => toggleFavorite(team2Obj.id)}
              className={`p-1 rounded-full hover:bg-white/5 transition-all cursor-pointer ${
                isFavorite(team2Obj.id) ? 'text-brand-gold' : 'text-text-dark hover:text-text-muted'
              }`}
              title={`Favorite ${team2Obj.name}`}
            >
              <Star size={12} fill={isFavorite(team2Obj.id) ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Teams Display */}
      <div className="flex items-center justify-between gap-2 py-2 mb-4">
        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-3xl mb-1 select-none">{t1Flag}</span>
          <span className="text-xs font-bold text-white truncate max-w-[80px]">{t1Name}</span>
          <span className="text-[9px] text-text-muted font-bold tracking-wider">{t1Code}</span>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[60px]">
          {match.is_completed ? (
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded">
              <span className="text-sm font-black text-white">{match.team1_score}</span>
              <span className="text-text-dark font-bold text-[10px]">-</span>
              <span className="text-sm font-black text-white">{match.team2_score}</span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase text-brand-gold tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/5">
              VS
            </span>
          )}
        </div>

        <div className="flex flex-col items-center flex-1 text-center">
          <span className="text-3xl mb-1 select-none">{t2Flag}</span>
          <span className="text-xs font-bold text-white truncate max-w-[80px]">{t2Name}</span>
          <span className="text-[9px] text-text-muted font-bold tracking-wider">{t2Code}</span>
        </div>
      </div>

      {/* Venue & Date */}
      <div className="border-t border-white/5 pt-3 space-y-1 text-xs">
        <div className="flex items-center gap-1 text-text-muted">
          <Calendar size={12} className="text-brand-gold/60" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-text-muted">
            <Clock size={12} className="text-brand-gold/60" />
            <span className="font-bold text-white">{match.time_ist} IST</span>
          </div>
          <div className="flex items-center gap-1 text-text-muted max-w-[100px] truncate" title={match.venue}>
            <MapPin size={10} className="text-text-dark" />
            <span className="text-[9px] truncate">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* Countdown and navigation link */}
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
        <Countdown targetDateStr={targetDateStr} />
        <Link 
          href={`/matches/${match.id}`} 
          className="text-[10px] font-extrabold text-brand-gold hover:text-brand-gold-hover transition-colors uppercase flex items-center gap-0.5 hover:underline"
        >
          Details &rarr;
        </Link>
      </div>
    </div>
  );
}
