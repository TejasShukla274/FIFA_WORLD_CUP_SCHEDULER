'use client';

import React, { useEffect, useState, use } from 'react';
import { getMatches, updateMatchScore } from '../../../lib/supabase';
import { Match, TEAMS, VENUES, Venue } from '../../../lib/data';
import Countdown from '../../../components/Countdown';
import Link from 'next/link';
import { useFavorites } from '../../../components/FavoritesContext';
import { useToast } from '../../../components/Toast';
import { getGoogleCalendarUrl } from '../../../utils/calendar';
import { 
  Star, MapPin, Calendar, Clock, Trophy, RefreshCw, CircleAlert, Sparkles, 
  Bell, BellRing, CalendarPlus 
} from 'lucide-react';

interface MatchDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [team1Score, setTeam1Score] = useState<string>('');
  const [team2Score, setTeam2Score] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [prediction, setPrediction] = useState<{ score1: number; score2: number } | null>(null);

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

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

  const match = matches.find(m => m.id === matchId);

  // Sync form inputs when match scores load
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
      
      // Open Google Calendar in new tab
      const gcalUrl = getGoogleCalendarUrl(match);
      window.open(gcalUrl, '_blank');
    }
    setShowReminderMenu(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="animate-spin text-brand-gold" size={36} />
        <p className="text-text-muted text-sm font-bold">Loading match details...</p>
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

  // Handle manual score save
  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    const s1 = team1Score.trim() === '' ? null : parseInt(team1Score);
    const s2 = team2Score.trim() === '' ? null : parseInt(team2Score);
    const isCompleted = s1 !== null && s2 !== null;

    const success = await updateMatchScore(match.id, s1, s2, isCompleted);
    setUpdating(false);

    if (success) {
      loadData();
      showToast("Match score updated successfully!", "success");
    } else {
      alert('Failed to update scores. Check database config.');
    }
  };

  const handleResetMatch = async () => {
    setUpdating(true);
    setTeam1Score('');
    setTeam2Score('');
    setPrediction(null);
    await updateMatchScore(match.id, null, null, false);
    setUpdating(false);
    loadData();
    showToast("Match score reset successfully.", "info");
  };

  // Predict Match score based on team overall rating
  const predictScore = () => {
    if (!team1Obj || !team2Obj) {
      // Mock random scores for placeholders
      const s1 = Math.floor(Math.random() * 4);
      const s2 = Math.floor(Math.random() * 4);
      setPrediction({ score1: s1, score2: s2 });
      return;
    }

    const t1Overall = team1Obj.overall;
    const t2Overall = team2Obj.overall;

    const ratingDiff = t1Overall - t2Overall;
    
    // Base goals
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

  const isFav = (team1Obj && isFavorite(team1Obj.id)) || (team2Obj && isFavorite(team2Obj.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link href="/calendar" className="text-xs font-bold text-brand-gold hover:underline">
          &larr; Back to Calendar
        </Link>
      </div>

      {/* Match Spotlight Header Card */}
      <div className={`glass-card overflow-hidden p-6 sm:p-10 border transition-all duration-300 ${
        isFav ? 'border-brand-gold/40 shadow-gold-glow bg-brand-gold/5' : 'border-border-card'
      }`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="text-[11px] font-extrabold uppercase bg-bg-hover border border-border-card text-brand-gold px-3 py-1 rounded-full">
            {match.group_name === 'Knockout' ? match.stage : match.group_name}
          </span>
          
          {/* Main Versus Display */}
          <div className="w-full flex items-center justify-center gap-4 sm:gap-12 py-4">
            {/* Team 1 */}
            <div className="flex flex-col items-center flex-1 space-y-2">
              {team1Obj ? (
                <Link href={`/teams/${team1Obj.id}`} className="flex flex-col items-center group cursor-pointer">
                  <span className="text-6xl sm:text-7xl select-none leading-none transition-transform group-hover:scale-110">{t1Flag}</span>
                  <span className="text-lg sm:text-2xl font-black text-text-main truncate max-w-[150px] group-hover:underline group-hover:text-brand-gold">{t1Name}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-6xl sm:text-7xl select-none leading-none">{t1Flag}</span>
                  <span className="text-lg sm:text-2xl font-black text-text-main truncate max-w-[150px]">{t1Name}</span>
                </div>
              )}
              <span className="text-xs text-text-muted font-bold tracking-widest uppercase">{t1Code}</span>
              {team1Obj && (
                <button
                  onClick={() => toggleFavorite(team1Obj.id)}
                  className={`p-1 rounded-full hover:bg-bg-hover transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    isFavorite(team1Obj.id) ? 'text-brand-gold' : 'text-text-dark'
                  }`}
                >
                  <Star size={12} fill={isFavorite(team1Obj.id) ? 'currentColor' : 'none'} />
                  <span>Favorite</span>
                </button>
              )}
            </div>

            {/* Score VS */}
            <div className="flex flex-col items-center justify-center min-w-[100px] gap-2">
              {match.is_completed ? (
                <div className="text-4xl sm:text-5xl font-black text-text-main bg-bg-hover border border-border-card px-4 sm:px-6 py-2 rounded-2xl shadow-inner">
                  {match.team1_score} - {match.team2_score}
                </div>
              ) : (
                <span className="text-xs font-black uppercase text-brand-gold tracking-widest px-3 py-1 bg-bg-hover rounded-lg border border-border-card shadow-inner">
                  VS
                </span>
              )}
              {match.is_completed && (
                <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">
                  Match Completed
                </span>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center flex-1 space-y-2">
              {team2Obj ? (
                <Link href={`/teams/${team2Obj.id}`} className="flex flex-col items-center group cursor-pointer">
                  <span className="text-6xl sm:text-7xl select-none leading-none transition-transform group-hover:scale-110">{t2Flag}</span>
                  <span className="text-lg sm:text-2xl font-black text-text-main truncate max-w-[150px] group-hover:underline group-hover:text-brand-gold">{t2Name}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-6xl sm:text-7xl select-none leading-none">{t2Flag}</span>
                  <span className="text-lg sm:text-2xl font-black text-text-main truncate max-w-[150px]">{t2Name}</span>
                </div>
              )}
              <span className="text-xs text-text-muted font-bold tracking-widest uppercase">{t2Code}</span>
              {team2Obj && (
                <button
                  onClick={() => toggleFavorite(team2Obj.id)}
                  className={`p-1 rounded-full hover:bg-bg-hover transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                    isFavorite(team2Obj.id) ? 'text-brand-gold' : 'text-text-dark'
                  }`}
                >
                  <Star size={12} fill={isFavorite(team2Obj.id) ? 'currentColor' : 'none'} />
                  <span>Favorite</span>
                </button>
              )}
            </div>
          </div>

          {/* Date, Time and Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full pt-6 border-t border-border-card text-sm text-text-muted">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Calendar className="text-brand-gold/60" size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Clock className="text-brand-gold/60" size={16} />
              <span className="font-bold text-text-main">{match.time_ist} IST</span>
            </div>
          </div>

          {/* Dynamic Calendar & Reminder Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border-card text-xs mt-4 w-full">
            <a 
              href={getGoogleCalendarUrl(match)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-extrabold text-brand-gold hover:text-brand-gold-hover transition-colors uppercase cursor-pointer"
              title="Add to Google Calendar"
            >
              <CalendarPlus size={14} />
              <span>Add to Google Calendar</span>
            </a>

            <div className="relative">
              <button
                onClick={() => setShowReminderMenu(!showReminderMenu)}
                className={`p-1.5 rounded-lg hover:bg-bg-hover transition-all flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text-main ${
                  activeReminder ? 'text-brand-gold hover:text-brand-gold-hover' : ''
                }`}
                title="Set kickoff reminder"
              >
                {activeReminder ? <BellRing size={14} className="animate-bounce text-brand-gold" /> : <Bell size={14} />}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Match Countdown & Score Updates */}
        <div className="space-y-6">
          {/* Live Countdown Box */}
          {!match.is_completed && (
            <div className="p-5 rounded-2xl glass-card border border-border-card space-y-3">
              <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">KICKOFF COUNTDOWN</h3>
              <div className="flex justify-center py-4 bg-bg-hover border border-border-card rounded-xl">
                <Countdown targetDateStr={targetDateStr} />
              </div>
            </div>
          )}

          {/* Score Updater Card */}
          <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
            <h3 className="text-sm font-black text-text-main uppercase tracking-wider">
              {match.is_completed ? "Update Match Score" : "Enter Match Score"}
            </h3>

            <form onSubmit={handleSaveScore} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="team1-score-input" className="text-xs text-text-muted font-bold uppercase">{t1Name} Score</label>
                  <input
                    id="team1-score-input"
                    type="number"
                    min="0"
                    placeholder="--"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    className="w-full text-center py-3 bg-bg-hover border border-border-card text-text-main font-black text-xl rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="team2-score-input" className="text-xs text-text-muted font-bold uppercase">{t2Name} Score</label>
                  <input
                    id="team2-score-input"
                    type="number"
                    min="0"
                    placeholder="--"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    className="w-full text-center py-3 bg-bg-hover border border-border-card text-text-main font-black text-xl rounded-xl focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-bg-main text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer interactive-scale"
                >
                  {updating ? "Saving..." : "Save Score"}
                </button>

                {(match.is_completed || team1Score !== '' || team2Score !== '') && (
                  <button
                    type="button"
                    onClick={handleResetMatch}
                    disabled={updating}
                    className="px-4 py-2.5 rounded-xl bg-bg-hover border border-border-card text-text-muted hover:text-text-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer interactive-scale"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Prediction & Stadium details */}
        <div className="space-y-6">
          {/* Match Score Predictor */}
          <div className="p-5 rounded-2xl glass-card border border-border-card space-y-4">
            <h3 className="text-sm font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} className="text-brand-gold" /> Predictor Simulator
            </h3>
            
            <p className="text-xs text-text-muted">
              Simulate scores based on team rankings (Attack, Defense, and Overall ratings).
            </p>

            {prediction ? (
              <div className="p-4 bg-brand-gold/5 rounded-xl border border-brand-gold/20 flex flex-col items-center space-y-3 animate-in fade-in duration-200">
                <div className="text-[10px] font-black text-brand-gold tracking-widest uppercase">PREDICTED OUTCOME</div>
                <div className="text-2xl font-black text-text-main">
                  {t1Name} <span className="text-brand-gold">{prediction.score1} - {prediction.score2}</span> {t2Name}
                </div>
                <button
                  onClick={applyPrediction}
                  className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer interactive-scale"
                >
                  Apply to Score Sheet
                </button>
              </div>
            ) : (
              <button
                onClick={predictScore}
                className="w-full py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/20 text-brand-gold text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer interactive-scale"
              >
                Run Match Simulation
              </button>
            )}
          </div>

          {/* Stadium Venue Info */}
          {venueObj && (
            <div className="p-5 rounded-2xl glass-card border border-border-card space-y-3">
              <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">VENUE DETAILS</h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-gold" />
                  <div>
                    <h4 className="text-sm font-extrabold text-text-main leading-tight">{venueObj.name}</h4>
                    <p className="text-[11px] text-text-muted">{venueObj.city}, {venueObj.country}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-card text-xs text-text-muted">
                  <div>
                    <span className="text-text-dark font-bold text-[10px] uppercase block">Stadium Capacity</span>
                    <span className="font-extrabold text-text-main">{venueObj.capacity} seats</span>
                  </div>
                  <div>
                    <span className="text-text-dark font-bold text-[10px] uppercase block">Host Country</span>
                    <span className="font-extrabold text-text-main">{venueObj.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
