'use client';

import React, { useEffect, useState, use, useCallback, useRef } from 'react';
import { Match, TEAMS, VENUES, Venue } from '../../../lib/data';
import Countdown from '../../../components/Countdown';
import Link from 'next/link';
import { useFavorites } from '../../../components/FavoritesContext';
import { useToast } from '../../../components/Toast';
import { getGoogleCalendarUrl } from '../../../utils/calendar';
import { useMatches } from '../../../components/MatchesContext';
import { 
  Star, MapPin, Calendar, Clock, Trophy, RefreshCw, CircleAlert, Sparkles, 
  Bell, BellRing, CalendarPlus, AlertTriangle
} from 'lucide-react';

// API imports
import { 
  fetchLiveMatchData, LiveMatchData, tickSimulation, initializeLiveSimulation, 
  deleteLiveSession, getLiveSession, manualTriggerEvent 
} from '../../../lib/footballApi';

// Tabs imports
import MatchGameTab from '../../../components/match/MatchGameTab';
import MatchLineupsTab from '../../../components/match/MatchLineupsTab';
import MatchStatsTab from '../../../components/match/MatchStatsTab';
import MatchEventsTab from '../../../components/match/MatchEventsTab';
import MatchNewsTab from '../../../components/match/MatchNewsTab';
import MatchH2HTab from '../../../components/match/MatchH2HTab';

interface MatchDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;

  const { matches, loading: matchesLoading, updateScore } = useMatches();
  
  // Tab states: 'game' | 'lineups' | 'stats' | 'events' | 'news' | 'h2h'
  const [activeTab, setActiveTab] = useState<'game' | 'lineups' | 'stats' | 'events' | 'news' | 'h2h'>('game');
  
  // Live Data & Loading
  const [liveData, setLiveData] = useState<LiveMatchData | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Manual Score Form states (in Game tab)
  const [team1Score, setTeam1Score] = useState<string>('');
  const [team2Score, setTeam2Score] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [prediction, setPrediction] = useState<{ score1: number; score2: number } | null>(null);

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const match = matches.find(m => m.id === matchId);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync manual scores if loaded
  useEffect(() => {
    if (match) {
      setTeam1Score(match.team1_score !== null && match.team1_score !== undefined ? match.team1_score.toString() : '');
      setTeam2Score(match.team2_score !== null && match.team2_score !== undefined ? match.team2_score.toString() : '');
      
      const saved = localStorage.getItem(`reminder_${match.id}`);
      if (saved) {
        setActiveReminder(saved);
      }
    }
  }, [match]);

  // Main loader function
  const loadLiveData = useCallback(async (force = false) => {
    if (!match) return;
    try {
      const data = await fetchLiveMatchData(match.id, match, force);
      setLiveData(data);
      setError(null);
      setLastUpdated(new Date());

      // If active simulation session is live in storage, sync state
      const session = getLiveSession(match.id);
      if (session && session.status === 'live') {
        setIsSimulating(true);
      } else {
        setIsSimulating(false);
      }
    } catch (err) {
      console.error(err);
      setError('Could not establish real-time connection. Showing offline schedules.');
    } finally {
      setLiveLoading(false);
    }
  }, [match]);

  // Initial load
  useEffect(() => {
    if (match) {
      setLiveLoading(true);
      loadLiveData();
    }
  }, [match, loadLiveData]);

  // Auto-refresh polling (every 30 seconds)
  useEffect(() => {
    if (!match || isSimulating) return;

    const interval = setInterval(() => {
      loadLiveData();
    }, 30000);

    return () => clearInterval(interval);
  }, [match, isSimulating, loadLiveData]);

  // Active Simulation Interval tick runner (ticks every 1s for visual effect)
  useEffect(() => {
    if (isSimulating && match) {
      simulationIntervalRef.current = setInterval(async () => {
        // Ticks simulation in localstorage
        const updatedSession = tickSimulation(match.id, 1);
        setLiveData(updatedSession);
        setLastUpdated(new Date());

        // If simulation finishes
        if (updatedSession.status === 'finished') {
          setIsSimulating(false);
          if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
          
          // Save the simulated score to general planner database/context
          await updateScore(match.id, updatedSession.homeScore, updatedSession.awayScore, true);
          showToast(`Match simulation finished! Final score saved: ${updatedSession.homeScore} - ${updatedSession.awayScore}`, 'success');
        }
      }, 1000);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    }

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isSimulating, match, updateScore, showToast]);

  const handleStartSim = () => {
    if (!match) return;
    const session = initializeLiveSimulation(match.id, match);
    setLiveData(session);
    setIsSimulating(true);
    showToast('Live Simulation Started! ⚽ Check tabs for updates.', 'success');
  };

  const handleTogglePlay = () => {
    setIsSimulating(prev => !prev);
  };

  const handleResetSim = async () => {
    if (!match) return;
    deleteLiveSession(match.id);
    setIsSimulating(false);
    await updateScore(match.id, null, null, false);
    await loadLiveData(true);
    setTeam1Score('');
    setTeam2Score('');
    showToast('Simulation session reset.', 'info');
  };

  const handleTriggerEvent = (type: 'goal' | 'yellow_card' | 'red_card' | 'substitution', team: 'home' | 'away') => {
    if (!match) return;
    const updated = manualTriggerEvent(match.id, type, team);
    setLiveData(updated);
    showToast(`Triggered ${type.replace('_', ' ')} for ${team}!`, 'info');
  };

  const handleSetReminder = (level: string) => {
    if (!match) return;
    if (level === 'none') {
      localStorage.removeItem(`reminder_${match.id}`);
      setActiveReminder(null);
      showToast(`Reminder removed`, 'info');
    } else {
      localStorage.setItem(`reminder_${match.id}`, level);
      setActiveReminder(level);
      const label = level === '15m' ? '15 minutes' : level === '1h' ? '1 hour' : '1 day';
      showToast(`Reminder set: ${label} before kickoff!`, 'success');
      const gcalUrl = getGoogleCalendarUrl(match);
      window.open(gcalUrl, '_blank');
    }
    setShowReminderMenu(false);
  };

  // Handle manual score save
  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    const s1 = team1Score.trim() === '' ? null : parseInt(team1Score);
    const s2 = team2Score.trim() === '' ? null : parseInt(team2Score);
    const isCompleted = s1 !== null && s2 !== null;

    const success = await updateScore(match!.id, s1, s2, isCompleted);
    setUpdating(false);

    if (success) {
      showToast("Match score updated successfully!", "success");
      // Update simulator details to match manual input
      await loadLiveData(true);
    } else {
      alert('Failed to update scores. Check database config.');
    }
  };

  const handleResetMatch = async () => {
    setUpdating(true);
    setTeam1Score('');
    setTeam2Score('');
    setPrediction(null);
    await updateScore(match!.id, null, null, false);
    // Remove simulation session
    deleteLiveSession(match!.id);
    await loadLiveData(true);
    setUpdating(false);
    showToast("Match score reset successfully.", "info");
  };

  // Predict Match score based on team overall rating
  const predictScore = () => {
    if (!team1Obj || !team2Obj) {
      const s1 = Math.floor(Math.random() * 4);
      const s2 = Math.floor(Math.random() * 4);
      setPrediction({ score1: s1, score2: s2 });
      return;
    }
    const t1Overall = team1Obj.overall;
    const t2Overall = team2Obj.overall;
    const ratingDiff = t1Overall - t2Overall;
    
    let g1 = Math.max(0, Math.floor(Math.random() * 3) + (ratingDiff > 5 ? 1 : 0));
    let g2 = Math.max(0, Math.floor(Math.random() * 3) + (ratingDiff < -5 ? 1 : 0));

    if (ratingDiff > 12) g1 += 1;
    if (ratingDiff < -12) g2 += 1;

    setPrediction({ score1: g1, score2: g2 });
  };

  const applyPrediction = () => {
    if (prediction) {
      setTeam1Score(prediction.score1.toString());
      setTeam2Score(prediction.score2.toString());
      showToast("Simulation applied to scoresheet!", "info");
    }
  };

  if (matchesLoading || (liveLoading && !liveData)) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-bg-hover rounded"></div>
        {/* Header card skeleton */}
        <div className="h-[250px] bg-bg-card border border-border-card rounded-2xl p-8 flex flex-col justify-between">
          <div className="h-4 w-24 bg-bg-hover mx-auto rounded"></div>
          <div className="flex justify-between items-center px-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 bg-bg-hover rounded-full"></div>
              <div className="h-4 w-20 bg-bg-hover rounded"></div>
            </div>
            <div className="h-10 w-24 bg-bg-hover rounded"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 bg-bg-hover rounded-full"></div>
              <div className="h-4 w-20 bg-bg-hover rounded"></div>
            </div>
          </div>
          <div className="h-4 w-48 bg-bg-hover mx-auto rounded"></div>
        </div>
        {/* Tabs skeleton */}
        <div className="h-10 bg-bg-card border border-border-card rounded-xl"></div>
        {/* Content skeleton */}
        <div className="h-[200px] bg-bg-card border border-border-card rounded-2xl p-6"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-16 rounded-2xl glass-card border border-border-card max-w-xl mx-auto space-y-6">
        <CircleAlert className="mx-auto text-brand-crimson" size={48} />
        <h2 className="text-2xl font-black text-text-main">Match Not Found</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          The match ID you are trying to view does not exist. Check the URL or return to the calendar.
        </p>
        <Link
          href="/calendar"
          className="inline-block px-5 py-2.5 rounded-lg bg-brand-gold text-bg-main text-xs font-bold uppercase transition-all"
        >
          Return to Calendar
        </Link>
      </div>
    );
  }

  const team1Obj = TEAMS.find(t => t.id === match.team1);
  const team2Obj = TEAMS.find(t => t.id === match.team2);

  const t1Name = team1Obj ? team1Obj.name : match.team1;
  const t2Name = team2Obj ? team2Obj.name : match.team2;

  const t1Flag = team1Obj ? team1Obj.flag : '🏳️';
  const t2Flag = team2Obj ? team2Obj.flag : '🏳️';

  const t1Code = team1Obj ? team1Obj.code : 'T1';
  const t2Code = team2Obj ? team2Obj.code : 'T2';

  const venueObj = VENUES.find(v => v.name === match.venue);

  const targetDateStr = `${match.date}T${match.time_ist}:00+05:30`;

  const formattedDate = new Date(match.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isFav = (team1Obj && isFavorite(team1Obj.id)) || (team2Obj && isFavorite(team2Obj.id));

  // Determine Live Status UI tags
  const renderLiveStatus = () => {
    if (liveData?.status === 'live') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-brand-crimson bg-brand-crimson/15 border border-brand-crimson/30 animate-pulse">
          <span className="h-1.5 w-1.5 bg-brand-crimson rounded-full"></span>
          Live {liveData.minute}'
        </span>
      );
    }
    if (liveData?.status === 'finished') {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-brand-green bg-brand-green/10 border border-brand-green/20">
          FT (Completed)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-brand-gold bg-brand-gold/10 border border-brand-gold/20">
        Scheduled
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-transition">
      {/* Top Breadcrumb & Caching Status */}
      <div className="flex justify-between items-center text-xs font-bold text-text-muted">
        <Link href="/calendar" className="text-brand-gold hover:underline">
          &larr; Back to Calendar
        </Link>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button 
            onClick={() => {
              setLiveLoading(true);
              loadLiveData(true);
            }}
            className="p-1 hover:text-text-main rounded transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw size={12} className={liveLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Connection Failure banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-crimson/10 border border-brand-crimson/20 text-xs font-bold text-brand-crimson">
          <AlertTriangle size={18} />
          <p>{error}</p>
        </div>
      )}

      {/* ── SOFASCORE / FLASHSCORE CENTRAL CARD ── */}
      <div className={`relative overflow-hidden rounded-2xl glass-card border transition-all duration-300 ${
        isFav ? 'border-brand-gold/40 shadow-gold-glow bg-brand-gold/5' : 'border-border-card'
      }`}>
        {/* Favourite Star Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => {
              if (team1Obj) toggleFavorite(team1Obj.id);
              showToast(isFav ? 'Removed from favorites' : 'Added to favorites!', 'info');
            }}
            className={`p-1.5 rounded-full hover:bg-bg-hover transition-colors cursor-pointer ${
              isFav ? 'text-brand-gold' : 'text-text-dark hover:text-text-muted'
            }`}
            title="Toggle Match Favorite Status"
          >
            <Star size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black uppercase bg-bg-hover border border-border-card text-text-muted px-2.5 py-0.5 rounded-full">
              {match.group_name === 'Knockout' ? match.stage : match.group_name}
            </span>
            {renderLiveStatus()}
          </div>
          
          {/* Main Versus Display */}
          <div className="w-full flex items-center justify-center gap-4 sm:gap-12 py-2">
            {/* Team 1 */}
            <div className="flex flex-col items-center flex-1 space-y-2">
              {team1Obj ? (
                <Link href={`/teams/${team1Obj.id}`} className="flex flex-col items-center group cursor-pointer">
                  <span className="text-5xl sm:text-6xl select-none leading-none transition-transform group-hover:scale-110">{t1Flag}</span>
                  <span className="text-base sm:text-xl font-black text-text-main mt-1 truncate max-w-[150px] group-hover:underline group-hover:text-brand-gold">{t1Name}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl select-none leading-none">{t1Flag}</span>
                  <span className="text-base sm:text-xl font-black text-text-main mt-1 truncate max-w-[150px]">{t1Name}</span>
                </div>
              )}
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{t1Code}</span>
            </div>

            {/* Score VS Center */}
            <div className="flex flex-col items-center justify-center min-w-[100px] gap-2">
              {liveData && (liveData.status === 'live' || liveData.status === 'finished') ? (
                <div className="text-3xl sm:text-4xl font-black text-text-main bg-bg-hover border border-border-card px-4 py-2 rounded-2xl shadow-inner">
                  {liveData.homeScore} - {liveData.awayScore}
                </div>
              ) : (
                <span className="text-xs font-black uppercase text-brand-gold tracking-widest px-3 py-1 bg-bg-hover rounded-lg border border-border-card shadow-inner">
                  VS
                </span>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center flex-1 space-y-2">
              {team2Obj ? (
                <Link href={`/teams/${team2Obj.id}`} className="flex flex-col items-center group cursor-pointer">
                  <span className="text-5xl sm:text-6xl select-none leading-none transition-transform group-hover:scale-110">{t2Flag}</span>
                  <span className="text-base sm:text-xl font-black text-text-main mt-1 truncate max-w-[150px] group-hover:underline group-hover:text-brand-gold">{t2Name}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl select-none leading-none">{t2Flag}</span>
                  <span className="text-base sm:text-xl font-black text-text-main mt-1 truncate max-w-[150px]">{t2Name}</span>
                </div>
              )}
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{t2Code}</span>
            </div>
          </div>

          {/* Date, Time and Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full pt-4 border-t border-border-card text-xs text-text-muted">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Calendar className="text-brand-gold/60" size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Clock className="text-brand-gold/60" size={14} />
              <span className="font-bold text-text-main">{match.time_ist} IST</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-border-card text-[10px] w-full">
            <a 
              href={getGoogleCalendarUrl(match)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-extrabold text-brand-gold hover:text-brand-gold-hover transition-colors uppercase cursor-pointer"
            >
              <CalendarPlus size={12} />
              <span>Add to Google Calendar</span>
            </a>

            <div className="relative">
              <button
                onClick={() => setShowReminderMenu(!showReminderMenu)}
                className={`p-1 rounded-lg hover:bg-bg-hover transition-all flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text-main ${
                  activeReminder ? 'text-brand-gold hover:text-brand-gold-hover' : ''
                }`}
              >
                {activeReminder ? <BellRing size={12} className="animate-bounce text-brand-gold" /> : <Bell size={12} />}
                <span>Reminder: <strong className="text-text-main font-bold">{activeReminder ? (activeReminder === '15m' ? '15m' : activeReminder === '1h' ? '1h' : '1d') : 'None'}</strong></span>
              </button>

              {showReminderMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-36 rounded-lg glass-card border border-border-card shadow-xl p-1 z-30 bg-bg-card">
                  <div className="text-[9px] font-black text-text-muted uppercase px-2 py-1 border-b border-border-card text-center">Set Reminder</div>
                  <button 
                    onClick={() => handleSetReminder('15m')}
                    className="w-full text-center px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    15 Mins Before
                  </button>
                  <button 
                    onClick={() => handleSetReminder('1h')}
                    className="w-full text-center px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    1 Hour Before
                  </button>
                  <button 
                    onClick={() => handleSetReminder('1d')}
                    className="w-full text-center px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    1 Day Before
                  </button>
                  {activeReminder && (
                    <button 
                      onClick={() => handleSetReminder('none')}
                      className="w-full text-center px-2 py-1.5 rounded text-[10px] font-bold text-brand-crimson hover:bg-brand-crimson/10 transition-colors border-t border-border-card cursor-pointer mt-1"
                    >
                      Remove Reminder
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── RESPONSIVE TAB BAR ── */}
      <div className="border-b border-border-card flex overflow-x-auto whitespace-nowrap scrollbar-none gap-2 py-1 bg-bg-card rounded-xl px-2 border">
        {(['game', 'lineups', 'stats', 'events', 'news', 'h2h'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'h2h' ? 'Head-to-Head' : tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive 
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-hover/30'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── ACTIVE TAB CONTENT PANEL ── */}
      <div className="py-4">
        {liveLoading ? (
          <div className="h-[200px] rounded-2xl border border-border-card bg-bg-card animate-pulse p-6 flex flex-col justify-center items-center gap-3">
            <RefreshCw className="animate-spin text-brand-gold" size={24} />
            <span className="text-xs text-text-muted font-bold">Refetching Match Details...</span>
          </div>
        ) : liveData ? (
          <>
            {activeTab === 'game' && (
              <div className="space-y-6">
                <MatchGameTab 
                  data={liveData}
                  onStartSim={handleStartSim}
                  onTogglePlay={handleTogglePlay}
                  onResetSim={handleResetSim}
                  onTriggerEvent={handleTriggerEvent}
                  isSimulating={isSimulating}
                />

                {/* Manual score updater and stadium details in game tab for planner utility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Updater Card */}
                  <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
                    <h3 className="text-xs font-black text-text-main uppercase tracking-wider border-b border-border-card pb-2">
                      {match.is_completed ? "Edit Match Score" : "Manual Match Score Entry"}
                    </h3>

                    <form onSubmit={handleSaveScore} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="team1-score-input" className="text-[10px] text-text-muted font-bold uppercase">{t1Name} Score</label>
                          <input
                            id="team1-score-input"
                            type="number"
                            min="0"
                            placeholder="--"
                            value={team1Score}
                            onChange={(e) => setTeam1Score(e.target.value)}
                            className="w-full text-center py-2 bg-bg-hover border border-border-card text-text-main font-black text-lg rounded-xl focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="team2-score-input" className="text-[10px] text-text-muted font-bold uppercase">{t2Name} Score</label>
                          <input
                            id="team2-score-input"
                            type="number"
                            min="0"
                            placeholder="--"
                            value={team2Score}
                            onChange={(e) => setTeam2Score(e.target.value)}
                            className="w-full text-center py-2 bg-bg-hover border border-border-card text-text-main font-black text-lg rounded-xl focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex-1 py-2 rounded-xl bg-brand-green hover:bg-brand-green-hover text-bg-main text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer interactive-scale"
                        >
                          {updating ? "Saving..." : "Save Score"}
                        </button>

                        {(match.is_completed || team1Score !== '' || team2Score !== '') && (
                          <button
                            type="button"
                            onClick={handleResetMatch}
                            disabled={updating}
                            className="px-4 py-2 rounded-xl bg-bg-hover border border-border-card text-text-muted hover:text-text-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Predictor Simulator Card */}
                  <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
                    <h3 className="text-xs font-black text-text-main uppercase tracking-wider border-b border-border-card pb-2 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-gold" /> Predictor Simulator
                    </h3>
                    
                    <p className="text-[11px] text-text-muted">
                      Simulate match outcome based on team ratings (Attack, Defense, and Overall ratings).
                    </p>

                    {prediction ? (
                      <div className="p-3 bg-brand-gold/5 rounded-xl border border-brand-gold/20 flex flex-col items-center space-y-2 animate-in fade-in duration-200">
                        <div className="text-[9px] font-black text-brand-gold tracking-widest uppercase">PREDICTED OUTCOME</div>
                        <div className="text-base font-black text-text-main">
                          {t1Name} <span className="text-brand-gold">{prediction.score1} - {prediction.score2}</span> {t2Name}
                        </div>
                        <button
                          type="button"
                          onClick={applyPrediction}
                          className="px-3 py-1 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer"
                        >
                          Apply to Score Sheet
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={predictScore}
                        className="w-full py-2 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/20 text-brand-gold text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Run Match Simulation
                      </button>
                    )}
                  </div>
                </div>

                {/* Kickoff Countdown Box */}
                {!match.is_completed && liveData.status === 'scheduled' && (
                  <div className="p-5 rounded-2xl glass-card border border-border-card space-y-3">
                    <h3 className="text-xs font-black uppercase text-text-muted tracking-wider text-center">KICKOFF COUNTDOWN</h3>
                    <div className="flex justify-center py-4 bg-bg-hover border border-border-card rounded-xl">
                      <Countdown targetDateStr={targetDateStr} />
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'lineups' && <MatchLineupsTab data={liveData} />}
            {activeTab === 'stats' && <MatchStatsTab data={liveData} />}
            {activeTab === 'events' && <MatchEventsTab data={liveData} />}
            {activeTab === 'news' && <MatchNewsTab data={liveData} />}
            {activeTab === 'h2h' && <MatchH2HTab data={liveData} />}
          </>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-bg-hover border border-border-card space-y-2">
            <CircleAlert className="mx-auto text-brand-gold" size={36} />
            <h4 className="text-sm font-bold text-text-main">Enriched Details Offline</h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              We couldn't reach the football live server, but you can still manage scheduling, set calendars and input scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
