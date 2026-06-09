'use client';

import React from 'react';
import { Player, LiveMatchData } from '../../lib/footballApi';
import { ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

interface MatchLineupsTabProps {
  data: LiveMatchData;
}

export default function MatchLineupsTab({ data }: MatchLineupsTabProps) {
  // Sort function to order players by GK -> DEF -> MID -> FWD
  const positionOrder = { GK: 1, DEF: 2, MID: 3, FWD: 4 };
  const sortPlayers = (players: Player[]) => {
    return [...players].sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);
  };

  const homeStarters = sortPlayers(data.lineups.home.startingXI);
  const awayStarters = sortPlayers(data.lineups.away.startingXI);

  const homeBench = sortPlayers(data.lineups.home.bench);
  const awayBench = sortPlayers(data.lineups.away.bench);

  const getRatingBg = (rating: number) => {
    if (rating >= 7.5) return 'bg-brand-green text-white';
    if (rating >= 6.5) return 'bg-amber-500 text-bg-main';
    return 'bg-brand-crimson text-white';
  };

  const renderPlayerRow = (p: Player, teamColor: string) => {
    return (
      <div 
        key={p.id} 
        className="flex items-center justify-between py-2 border-b border-border-card last:border-0 hover:bg-bg-hover/50 px-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Shirt Number */}
          <span className="text-xs font-black text-text-dark w-5 text-center">{p.number}</span>
          
          {/* Player name & substitution markers */}
          <div className="min-w-0">
            <span className="text-sm font-bold text-text-main truncate block">{p.name}</span>
            <div className="flex items-center gap-1.5 text-[9px] text-text-dark font-extrabold uppercase mt-0.5">
              <span>{p.position}</span>
              {p.isSubbedOut && (
                <span className="text-brand-crimson flex items-center gap-0.5">
                  <ArrowDownLeft size={10} /> Subbed Out ({p.subMin}')
                </span>
              )}
              {p.isSubbedIn && (
                <span className="text-brand-green flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> Subbed In ({p.subMin}')
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Player stats & Match Rating */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            {p.stats.goals > 0 && (
              <span className="flex items-center gap-0.5" title="Goals">
                ⚽<span className="text-[10px] font-black">{p.stats.goals}</span>
              </span>
            )}
            {p.stats.assists > 0 && (
              <span className="flex items-center gap-0.5" title="Assists">
                🅰️<span className="text-[10px] font-black">{p.stats.assists}</span>
              </span>
            )}
            {p.stats.yellowCards > 0 && (
              <span className="h-3.5 w-2.5 bg-amber-500 rounded-sm border border-black/10 inline-block" title="Yellow Cards"></span>
            )}
            {p.stats.redCards > 0 && (
              <span className="h-3.5 w-2.5 bg-brand-crimson rounded-sm border border-black/10 inline-block animate-pulse" title="Red Card"></span>
            )}
          </div>
          {/* Rating Badge */}
          <div className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getRatingBg(p.rating)} shadow-sm`}>
            {p.rating.toFixed(1)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ── STARTING LINEUPS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Home Starting XI */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider flex items-center gap-1.5 border-b border-border-card pb-2">
            <Shield size={14} className="text-brand-gold" /> Starting Lineup (Home)
          </h3>
          <div className="bg-bg-card border border-border-card rounded-2xl p-4 shadow-sm">
            {homeStarters.map(p => renderPlayerRow(p, 'home'))}
          </div>
        </div>

        {/* Away Starting XI */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider flex items-center gap-1.5 border-b border-border-card pb-2">
            <Shield size={14} className="text-text-dark" /> Starting Lineup (Away)
          </h3>
          <div className="bg-bg-card border border-border-card rounded-2xl p-4 shadow-sm">
            {awayStarters.map(p => renderPlayerRow(p, 'away'))}
          </div>
        </div>
      </div>

      {/* ── BENCH PLAYERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Home Bench */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-2">
            Substitutes Bench (Home)
          </h3>
          <div className="bg-bg-card border border-border-card rounded-2xl p-4 shadow-sm">
            {homeBench.map(p => renderPlayerRow(p, 'home'))}
          </div>
        </div>

        {/* Away Bench */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-2">
            Substitutes Bench (Away)
          </h3>
          <div className="bg-bg-card border border-border-card rounded-2xl p-4 shadow-sm">
            {awayBench.map(p => renderPlayerRow(p, 'away'))}
          </div>
        </div>
      </div>
    </div>
  );
}
