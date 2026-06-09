'use client';

import React from 'react';
import { LiveMatchData } from '../../lib/footballApi';
import { History, Calendar } from 'lucide-react';

interface MatchH2HTabProps {
  data: LiveMatchData;
}

export default function MatchH2HTab({ data }: MatchH2HTabProps) {
  const { h2h } = data;

  const homeTeamName = data.lineups.home.startingXI[0].id.split('_')[0].toUpperCase();
  const awayTeamName = data.lineups.away.startingXI[0].id.split('_')[0].toUpperCase();

  // Calculate H2H summary stats
  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;

  h2h.forEach((match) => {
    if (match.homeScore > match.awayScore) {
      if (match.homeTeam.toLowerCase().includes(data.lineups.home.startingXI[0].id.split('_')[0])) homeWins++;
      else awayWins++;
    } else if (match.awayScore > match.homeScore) {
      if (match.awayTeam.toLowerCase().includes(data.lineups.home.startingXI[0].id.split('_')[0])) homeWins++;
      else awayWins++;
    } else {
      draws++;
    }
  });

  const totalMatches = h2h.length;
  const homeWinPct = totalMatches > 0 ? (homeWins / totalMatches) * 100 : 0;
  const drawPct = totalMatches > 0 ? (draws / totalMatches) * 100 : 0;
  const awayWinPct = totalMatches > 0 ? (awayWins / totalMatches) * 100 : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-3 flex items-center gap-2">
        <History size={16} className="text-brand-gold" /> Head-to-Head History
      </h3>

      {totalMatches === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-bg-hover border border-border-card">
          <p className="text-xs text-text-muted">No historical matchups found for these teams.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary stats visual indicator */}
          <div className="bg-bg-card border border-border-card p-5 rounded-2xl space-y-4">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-wider text-center">
              Historical Match Ratios
            </h4>

            {/* Segmented bar */}
            <div className="h-6 w-full flex rounded-lg overflow-hidden text-[10px] font-black text-bg-main">
              {homeWins > 0 && (
                <div 
                  style={{ width: `${homeWinPct}%` }}
                  className="bg-brand-green flex items-center justify-center min-w-[30px]"
                  title={`${homeWins} Home Wins`}
                >
                  {homeWins}W
                </div>
              )}
              {draws > 0 && (
                <div 
                  style={{ width: `${drawPct}%` }}
                  className="bg-text-dark flex items-center justify-center min-w-[30px] text-white"
                  title={`${draws} Draws`}
                >
                  {draws}D
                </div>
              )}
              {awayWins > 0 && (
                <div 
                  style={{ width: `${awayWinPct}%` }}
                  className="bg-brand-gold flex items-center justify-center min-w-[30px]"
                  title={`${awayWins} Away Wins`}
                >
                  {awayWins}W
                </div>
              )}
            </div>

            {/* Labels bar */}
            <div className="flex items-center justify-between text-xs font-bold text-text-muted px-1">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-brand-green"></span>
                <span>{homeWins} {homeTeamName} Wins</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-text-dark"></span>
                <span>{draws} Draws</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-brand-gold"></span>
                <span>{awayWins} {awayTeamName} Wins</span>
              </span>
            </div>
          </div>

          {/* Previous Match List */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
              Past Match Results
            </span>

            <div className="bg-bg-card border border-border-card rounded-2xl overflow-hidden divide-y divide-border-card">
              {h2h.map((match, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-bg-hover/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-text-dark" />
                    <div>
                      <span className="text-xs font-extrabold text-text-main block">{match.competition}</span>
                      <span className="text-[10px] text-text-dark font-semibold block">{new Date(match.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-text-muted">{match.homeTeam}</span>
                    <span className="bg-bg-hover border border-border-card text-xs font-black text-text-main px-2.5 py-1 rounded">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="text-xs font-bold text-text-muted">{match.awayTeam}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
