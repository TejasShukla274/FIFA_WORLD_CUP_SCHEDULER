'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEAMS, Match } from '../lib/data';
import { useFavorites } from './FavoritesContext';
import { Star, MapPin, Calendar, Clock, Bell, BellRing, CalendarPlus } from 'lucide-react';
import Countdown from './Countdown';
import { useToast } from './Toast';
import { getGoogleCalendarUrl } from '../utils/calendar';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);

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

  useEffect(() => {
    const saved = localStorage.getItem(`reminder_${match.id}`);
    if (saved) {
      setActiveReminder(saved);
    }
  }, [match.id]);

  const handleSetReminder = (level: string) => {
    if (level === 'none') {
      localStorage.removeItem(`reminder_${match.id}`);
      setActiveReminder(null);
      showToast(`Reminder removed for ${t1Name} vs ${t2Name}`, 'info');
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

  return (
    <div className={`relative glass-card overflow-hidden p-5 flex flex-col justify-between h-full border transition-all duration-300 ${
      isFav 
        ? 'border-brand-gold bg-brand-gold/5 shadow-gold-glow' 
        : 'border-border-card'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[10px] font-extrabold uppercase bg-bg-hover border border-border-card text-brand-gold px-2 py-0.5 rounded-full">
          {match.group_name === 'Knockout' ? match.stage : match.group_name}
        </span>
        <div className="flex items-center gap-1">
          {team1Obj && (
            <button 
              onClick={() => toggleFavorite(team1Obj.id)}
              className={`p-1 rounded-full hover:bg-bg-hover transition-all cursor-pointer ${
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
              className={`p-1 rounded-full hover:bg-bg-hover transition-all cursor-pointer ${
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
        {team1Obj ? (
          <Link href={`/teams/${team1Obj.id}`} className="flex flex-col items-center flex-1 text-center group cursor-pointer">
            <span className="text-3xl mb-1 select-none transition-transform group-hover:scale-110">{t1Flag}</span>
            <span className="text-xs font-bold text-text-main truncate max-w-[80px] group-hover:underline group-hover:text-brand-gold">{t1Name}</span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider">{t1Code}</span>
          </Link>
        ) : (
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-3xl mb-1 select-none">{t1Flag}</span>
            <span className="text-xs font-bold text-text-main truncate max-w-[80px]">{t1Name}</span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider">{t1Code}</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center min-w-[60px]">
          {match.is_completed ? (
            <div className="flex items-center gap-1 bg-bg-hover border border-border-card px-2.5 py-1 rounded">
              <span className="text-sm font-black text-text-main">{match.team1_score}</span>
              <span className="text-text-dark font-bold text-[10px]">-</span>
              <span className="text-sm font-black text-text-main">{match.team2_score}</span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase text-brand-gold tracking-widest px-2 py-0.5 bg-bg-hover rounded border border-border-card">
              VS
            </span>
          )}
        </div>

        {team2Obj ? (
          <Link href={`/teams/${team2Obj.id}`} className="flex flex-col items-center flex-1 text-center group cursor-pointer">
            <span className="text-3xl mb-1 select-none transition-transform group-hover:scale-110">{t2Flag}</span>
            <span className="text-xs font-bold text-text-main truncate max-w-[80px] group-hover:underline group-hover:text-brand-gold">{t2Name}</span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider">{t2Code}</span>
          </Link>
        ) : (
          <div className="flex flex-col items-center flex-1 text-center">
            <span className="text-3xl mb-1 select-none">{t2Flag}</span>
            <span className="text-xs font-bold text-text-main truncate max-w-[80px]">{t2Name}</span>
            <span className="text-[9px] text-text-muted font-bold tracking-wider">{t2Code}</span>
          </div>
        )}
      </div>

      {/* Venue & Date */}
      <div className="border-t border-border-card pt-3 space-y-1 text-xs">
        <div className="flex items-center gap-1 text-text-muted">
          <Calendar size={12} className="text-brand-gold/60" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-text-muted">
            <Clock size={12} className="text-brand-gold/60" />
            <span className="font-bold text-text-main">{match.time_ist} IST</span>
          </div>
          <div className="flex items-center gap-1 text-text-muted max-w-[100px] truncate" title={match.venue}>
            <MapPin size={10} className="text-text-dark" />
            <span className="text-[9px] truncate">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* Interactive Options Bar (Google Calendar & Reminders) */}
      <div className="mt-3 pt-3 border-t border-border-card flex items-center justify-between gap-2">
        <a 
          href={getGoogleCalendarUrl(match)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-extrabold text-brand-gold hover:text-brand-gold-hover transition-colors uppercase cursor-pointer"
          title="Add to Google Calendar"
        >
          <CalendarPlus size={12} />
          <span>Add to Calendar</span>
        </a>

        {/* Reminder Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            className={`p-1.5 rounded-lg hover:bg-bg-hover transition-all flex items-center gap-1 cursor-pointer text-text-muted hover:text-text-main ${
              activeReminder ? 'text-brand-gold hover:text-brand-gold-hover' : ''
            }`}
            title="Set kickoff reminder"
          >
            {activeReminder ? <BellRing size={12} className="animate-bounce" /> : <Bell size={12} />}
            {activeReminder && <span className="text-[9px] font-bold">{activeReminder}</span>}
          </button>

          {showReminderMenu && (
            <div className="absolute right-0 bottom-full mb-1 w-36 rounded-lg glass-card border border-border-card shadow-xl p-1 z-30 bg-bg-card">
              <div className="text-[9px] font-black text-text-muted uppercase px-2 py-1 border-b border-border-card">Set Reminder</div>
              <button 
                onClick={() => handleSetReminder('15m')}
                className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
              >
                15 Mins Before
              </button>
              <button 
                onClick={() => handleSetReminder('1h')}
                className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
              >
                1 Hour Before
              </button>
              <button 
                onClick={() => handleSetReminder('1d')}
                className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
              >
                1 Day Before
              </button>
              {activeReminder && (
                <button 
                  onClick={() => handleSetReminder('none')}
                  className="w-full text-left px-2 py-1.5 rounded text-[10px] font-bold text-brand-crimson hover:bg-brand-crimson/10 transition-colors border-t border-border-card cursor-pointer mt-1"
                >
                  Remove Reminder
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Countdown and navigation link */}
      <div className="mt-3 flex items-center justify-between border-t border-border-card pt-2">
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
