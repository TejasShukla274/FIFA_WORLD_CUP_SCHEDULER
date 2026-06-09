'use client';

import React from 'react';
import { LiveMatchData } from '../../lib/footballApi';

interface MatchStatsTabProps {
  data: LiveMatchData;
}

export default function MatchStatsTab({ data }: MatchStatsTabProps) {
  const { stats } = data;

  const renderStatRow = (
    label: string, 
    homeVal: number, 
    awayVal: number, 
    isPercentage = false
  ) => {
    const total = homeVal + awayVal;
    const homePercent = total === 0 ? 50 : (homeVal / total) * 100;
    const awayPercent = total === 0 ? 50 : (awayVal / total) * 100;

    // Highlight color selection based on values
    const homeIsGreater = homeVal > awayVal;
    const awayIsGreater = awayVal > homeVal;

    return (
      <div className="space-y-1.5 py-3 border-b border-border-card/60 last:border-0">
        {/* Label & Numbers row */}
        <div className="flex items-center justify-between text-xs font-black">
          <span className={`w-12 text-left text-sm ${homeIsGreater ? 'text-brand-gold' : 'text-text-main'}`}>
            {homeVal}{isPercentage && '%'}
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
          <span className={`w-12 text-right text-sm ${awayIsGreater ? 'text-brand-gold' : 'text-text-main'}`}>
            {awayVal}{isPercentage && '%'}
          </span>
        </div>

        {/* Double-sided Progress Bar */}
        <div className="h-2 w-full flex rounded-full overflow-hidden bg-bg-hover">
          {/* Home Bar (progressing right to left, we build it standard as side-by-side) */}
          <div className="w-1/2 flex justify-end bg-bg-hover pr-0.5">
            <div 
              style={{ width: `${homePercent}%` }} 
              className={`h-full rounded-l-full transition-all duration-300 ${
                homeIsGreater ? 'bg-brand-gold' : 'bg-text-dark'
              }`}
            ></div>
          </div>
          {/* Away Bar */}
          <div className="w-1/2 flex justify-start bg-bg-hover pl-0.5">
            <div 
              style={{ width: `${awayPercent}%` }} 
              className={`h-full rounded-r-full transition-all duration-300 ${
                awayIsGreater ? 'bg-brand-gold' : 'bg-text-dark'
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // If no stats exist yet
  const totalActions = stats.possession[0] + stats.shots[0] + stats.fouls[0];
  if (totalActions === 0 || (stats.possession[0] === 50 && stats.possession[1] === 50 && stats.shots[0] === 0 && stats.shots[1] === 0)) {
    return (
      <div className="text-center py-12 rounded-2xl bg-bg-hover border border-border-card space-y-2">
        <span className="text-3xl">📊</span>
        <h4 className="text-sm font-bold text-text-main">No Live Statistics Available Yet</h4>
        <p className="text-xs text-text-muted max-w-xs mx-auto">
          Start the live simulation in the Game tab to watch the statistics update dynamically in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-bg-card border border-border-card p-6 rounded-2xl shadow-sm">
      <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-3 mb-4 text-center">
        Team Statistics Comparison
      </h3>
      <div className="space-y-4">
        {renderStatRow('Ball Possession', stats.possession[0], stats.possession[1], true)}
        {renderStatRow('Total Shots', stats.shots[0], stats.shots[1])}
        {renderStatRow('Shots on Target', stats.shotsOnTarget[0], stats.shotsOnTarget[1])}
        {renderStatRow('Corner Kicks', stats.corners[0], stats.corners[1])}
        {renderStatRow('Fouls Committed', stats.fouls[0], stats.fouls[1])}
        {renderStatRow('Offsides Called', stats.offsides[0], stats.offsides[1])}
        {renderStatRow('Goalkeeper Saves', stats.saves[0], stats.saves[1])}
        {renderStatRow('Yellow Cards', stats.yellowCards[0], stats.yellowCards[1])}
        {renderStatRow('Red Cards', stats.redCards[0], stats.redCards[1])}
      </div>
    </div>
  );
}
