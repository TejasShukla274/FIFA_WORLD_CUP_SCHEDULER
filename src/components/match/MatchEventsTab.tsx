'use client';

import React from 'react';
import { MatchEvent, LiveMatchData } from '../../lib/footballApi';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface MatchEventsTabProps {
  data: LiveMatchData;
}

export default function MatchEventsTab({ data }: MatchEventsTabProps) {
  const { events } = data;

  if (events.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl bg-bg-hover border border-border-card space-y-2">
        <span className="text-3xl">⏱️</span>
        <h4 className="text-sm font-bold text-text-main">No Events Logged Yet</h4>
        <p className="text-xs text-text-muted max-w-xs mx-auto">
          Start the live simulation in the Game tab. As goals, cards, and substitutions occur, they will appear here in chronological order.
        </p>
      </div>
    );
  }

  const renderEventDetails = (ev: MatchEvent) => {
    switch (ev.type) {
      case 'goal':
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <div>
              <span className="font-extrabold text-text-main text-sm">{ev.playerName}</span>
              {ev.detail && (
                <span className="text-[10px] text-text-muted block mt-0.5 font-bold uppercase tracking-wider">{ev.detail}</span>
              )}
            </div>
          </div>
        );
      case 'yellow_card':
        return (
          <div className="flex items-center gap-2">
            <span className="h-4 w-3 bg-amber-500 rounded-sm border border-black/10 inline-block shadow-sm"></span>
            <div>
              <span className="font-extrabold text-text-main text-sm">{ev.playerName}</span>
              <span className="text-[10px] text-amber-500 block font-black uppercase tracking-wider">Yellow Card</span>
            </div>
          </div>
        );
      case 'red_card':
        return (
          <div className="flex items-center gap-2">
            <span className="h-4 w-3 bg-brand-crimson rounded-sm border border-black/10 inline-block shadow-sm animate-pulse"></span>
            <div>
              <span className="font-extrabold text-text-main text-sm">{ev.playerName}</span>
              <span className="text-[10px] text-brand-crimson block font-black uppercase tracking-wider">
                {ev.detail || 'Red Card'}
              </span>
            </div>
          </div>
        );
      case 'substitution':
        return (
          <div className="flex items-start gap-2">
            <span className="text-blue-400 text-sm mt-0.5">🔄</span>
            <div className="text-xs">
              <span className="text-brand-green font-bold flex items-center gap-0.5">
                <ArrowUpRight size={10} /> {ev.playerName}
              </span>
              <span className="text-brand-crimson font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowDownLeft size={10} /> {ev.playerNameOut}
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-3 text-center">
        Match Timeline
      </h3>

      <div className="relative">
        {/* Center Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border-card -translate-x-1/2 z-0"></div>

        <div className="space-y-6 relative z-10">
          {events.map((ev) => {
            const isHome = ev.teamId === 'home';
            return (
              <div key={ev.id} className="flex items-center w-full">
                {/* Home Event Column */}
                <div className="w-1/2 pr-6 flex justify-end">
                  {isHome && (
                    <div className="p-3 rounded-xl bg-bg-card border border-border-card shadow-sm max-w-[90%] text-right">
                      {renderEventDetails(ev)}
                    </div>
                  )}
                </div>

                {/* Minute Label Column */}
                <div className="flex-shrink-0 w-10 flex justify-center">
                  <div className="h-7 w-7 rounded-full bg-bg-main border border-brand-gold text-brand-gold text-[10px] font-black flex items-center justify-center shadow-inner">
                    {ev.minute}'
                  </div>
                </div>

                {/* Away Event Column */}
                <div className="w-1/2 pl-6 flex justify-start">
                  {!isHome && (
                    <div className="p-3 rounded-xl bg-bg-card border border-border-card shadow-sm max-w-[90%] text-left">
                      {renderEventDetails(ev)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
