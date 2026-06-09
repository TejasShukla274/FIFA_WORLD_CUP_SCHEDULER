'use client';

import React from 'react';
import { MapPin, Users, Sun, ShieldAlert, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import { LiveMatchData } from '../../lib/footballApi';

interface MatchGameTabProps {
  data: LiveMatchData;
  onStartSim: () => void;
  onTogglePlay: () => void;
  onResetSim: () => void;
  onTriggerEvent: (type: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'home' | 'away') => void;
  isSimulating: boolean;
}

export default function MatchGameTab({
  data,
  onStartSim,
  onTogglePlay,
  onResetSim,
  onTriggerEvent,
  isSimulating
}: MatchGameTabProps) {
  // Deterministic Referee & Weather
  const refSeed = data.matchId.charCodeAt(data.matchId.length - 1);
  const referees = [
    'Szymon Marciniak (Poland)',
    'Daniele Orsato (Italy)',
    'Clement Turpin (France)',
    'Anthony Taylor (England)',
    'Jesus Valenzuela (Venezuela)',
    'Cesar Arturo Ramos (Mexico)',
    'Mustapha Ghorbal (Algeria)',
    'Michael Oliver (England)'
  ];
  const refereeName = referees[refSeed % referees.length];

  const weatherOptions = [
    'Clear Sky, 22°C, Wind: 8 km/h',
    'Partly Cloudy, 19°C, Wind: 12 km/h',
    'Mostly Sunny, 25°C, Wind: 5 km/h',
    'Overcast, 17°C, Wind: 15 km/h',
    'Mild Breeze, 21°C, Wind: 10 km/h'
  ];
  const weather = weatherOptions[refSeed % weatherOptions.length];

  return (
    <div className="space-y-6">
      {/* ── LIVE SIMULATION CONTROL PANEL ── */}
      <div className="p-5 rounded-2xl border border-brand-gold/25 bg-gradient-to-br from-bg-card to-brand-gold/5 space-y-4">
        <div className="flex items-center justify-between border-b border-border-card pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-gold animate-ping"></span>
            <h3 className="text-sm font-black text-text-main uppercase tracking-wider">
              Live Simulation Control Center
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/25">
            Demo Console
          </span>
        </div>

        {data.status === 'scheduled' && (
          <div className="flex flex-col items-center py-4 text-center space-y-3">
            <AlertCircle className="text-brand-gold" size={32} />
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-main">Match is currently Scheduled</p>
              <p className="text-xs text-text-muted max-w-md">
                This match hasn't started yet. You can launch a simulated live session to watch events unfold in real-time, ticker stats, and test automatic refreshing.
              </p>
            </div>
            <button
              onClick={onStartSim}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-bg-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
            >
              <Play size={14} fill="currentColor" />
              <span>Kick off Live Simulation</span>
            </button>
          </div>
        )}

        {data.status === 'live' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-brand-crimson/10 border border-brand-crimson/20 px-3 py-1.5 rounded-xl">
                  <span className="text-brand-crimson text-xs font-black uppercase tracking-widest animate-pulse">
                    LIVE • {data.minute}'
                  </span>
                </div>
                <div className="text-xs text-text-muted font-bold">
                  Simulation Clock running at 1 min/sec
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onTogglePlay}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    isSimulating
                      ? 'bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20 hover:bg-brand-crimson/20'
                      : 'bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green/20'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <Pause size={14} fill="currentColor" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="currentColor" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onResetSim}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-hover border border-border-card text-text-muted hover:text-text-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Injected events trigger */}
            <div className="border-t border-border-card pt-4 space-y-3">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
                Trigger Match Events Instantly:
              </span>
              <div className="grid grid-cols-2 gap-4">
                {/* Home controls */}
                <div className="space-y-2 p-3 rounded-xl bg-bg-hover border border-border-card">
                  <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-wider block text-center">
                    Home Team ({data.lineups.home.startingXI[0].id.split('_')[0].toUpperCase()})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onTriggerEvent('goal', 'home')}
                      className="py-1.5 px-2 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      ⚽ Goal
                    </button>
                    <button
                      onClick={() => onTriggerEvent('yellow_card', 'home')}
                      className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🟨 Yellow
                    </button>
                    <button
                      onClick={() => onTriggerEvent('red_card', 'home')}
                      className="py-1.5 px-2 rounded-lg bg-brand-crimson/10 hover:bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🟥 Red
                    </button>
                    <button
                      onClick={() => onTriggerEvent('substitution', 'home')}
                      className="py-1.5 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🔄 Sub
                    </button>
                  </div>
                </div>

                {/* Away controls */}
                <div className="space-y-2 p-3 rounded-xl bg-bg-hover border border-border-card">
                  <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-wider block text-center">
                    Away Team ({data.lineups.away.startingXI[0].id.split('_')[0].toUpperCase()})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onTriggerEvent('goal', 'away')}
                      className="py-1.5 px-2 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      ⚽ Goal
                    </button>
                    <button
                      onClick={() => onTriggerEvent('yellow_card', 'away')}
                      className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🟨 Yellow
                    </button>
                    <button
                      onClick={() => onTriggerEvent('red_card', 'away')}
                      className="py-1.5 px-2 rounded-lg bg-brand-crimson/10 hover:bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🟥 Red
                    </button>
                    <button
                      onClick={() => onTriggerEvent('substitution', 'away')}
                      className="py-1.5 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                    >
                      🔄 Sub
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {data.status === 'finished' && (
          <div className="flex items-center justify-between py-2 text-sm bg-bg-hover px-4 rounded-xl border border-border-card">
            <div className="flex items-center gap-2 text-brand-green">
              <ShieldAlert size={16} />
              <span className="font-bold text-text-main">Simulation Session Completed (FT)</span>
            </div>
            <button
              onClick={onResetSim}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-bg-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
            >
              <RotateCcw size={14} />
              <span>Reset & Restart Session</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pitch Display */}
        <div className="rounded-2xl border border-border-card overflow-hidden bg-emerald-950 p-4 flex flex-col justify-between items-center relative aspect-[4/3] w-full">
          {/* Custom CSS Pitch Background */}
          <div className="absolute inset-0 border-[2px] border-white/20 m-4 flex flex-col justify-between pointer-events-none">
            {/* Center line */}
            <div className="w-full h-px bg-white/20 absolute top-1/2 left-0"></div>
            {/* Center circle */}
            <div className="w-24 h-24 rounded-full border-[2px] border-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            {/* Penalty boxes */}
            <div className="w-32 h-16 border-[2px] border-t-0 border-white/20 absolute top-0 left-1/2 -translate-x-1/2"></div>
            <div className="w-32 h-16 border-[2px] border-b-0 border-white/20 absolute bottom-0 left-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative text-center w-full text-white/50 text-[10px] font-black uppercase tracking-widest pt-2">
            Pitch Layout
          </div>

          {/* Simple representative positioning */}
          <div className="flex justify-around items-center w-full z-10 py-12 px-6">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xl bg-bg-hover text-white px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border border-white/30 backdrop-blur-sm">
                4-4-2
              </span>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Home Formation</span>
            </div>
            <span className="text-xs text-white/30 font-black">VS</span>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xl bg-bg-hover text-white px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border border-white/30 backdrop-blur-sm">
                4-4-2
              </span>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Away Formation</span>
            </div>
          </div>

          <div className="relative text-white/40 text-[9px] font-bold pb-2 z-10">
            Standard Grass Surface (Natural)
          </div>
        </div>

        {/* Info list */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-wider">Match Officials</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-bg-hover flex items-center justify-center text-brand-gold border border-border-card">
                  👔
                </div>
                <div>
                  <span className="text-[10px] text-text-dark font-bold uppercase block">Referee</span>
                  <span className="text-sm font-extrabold text-text-main">{refereeName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-wider">Venue and Weather</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-brand-gold" size={18} />
                <div>
                  <span className="text-[10px] text-text-dark font-bold uppercase block">Stadium Capacity</span>
                  <span className="text-sm font-extrabold text-text-main flex items-center gap-1">
                    <Users size={12} className="text-text-muted" /> {data.stats.possession[0] > 0 ? 'Full House' : 'Expected to Sell Out'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-border-card pt-3">
                <Sun className="text-brand-gold" size={18} />
                <div>
                  <span className="text-[10px] text-text-dark font-bold uppercase block">Conditions</span>
                  <span className="text-xs font-bold text-text-main">{weather}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
