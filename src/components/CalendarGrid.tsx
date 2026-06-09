'use client';

import React, { useState, useMemo } from 'react';
import { Match, TEAMS } from '../lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CalendarGridProps {
  matches: Match[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ matches }: CalendarGridProps) {
  // Tournament spans June-July 2026
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed; 5 = June
  const currentYear = 2026;

  const monthName = MONTH_NAMES[currentMonth];

  // Build a map: "YYYY-MM-DD" -> Match[]
  const matchesByDate = useMemo(() => {
    const map: Record<string, Match[]> = {};
    matches.forEach(m => {
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    });
    return map;
  }, [matches]);

  // Generate calendar grid cells for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells: { day: number; month: number; inMonth: boolean }[] = [];

    // Fill previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, month: currentMonth - 1, inMonth: false });
    }

    // Fill current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: currentMonth, inMonth: true });
    }

    // Fill remaining cells to complete grid (6 rows × 7 cols = 42)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, month: currentMonth + 1, inMonth: false });
    }

    return cells;
  }, [currentMonth, currentYear]);

  const todayStr = new Date().toISOString().split('T')[0];

  const goToPrevMonth = () => {
    if (currentMonth > 5) setCurrentMonth(currentMonth - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth < 6) setCurrentMonth(currentMonth + 1);
  };

  // Find next upcoming match for the "NEXT MATCH" badge
  const now = new Date();
  const nextMatch = useMemo(() => {
    return [...matches]
      .filter(m => {
        const matchTime = new Date(`${m.date}T${m.time_ist}:00+05:30`);
        return matchTime > now && !m.is_completed;
      })
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.time_ist}:00+05:30`).getTime();
        const timeB = new Date(`${b.date}T${b.time_ist}:00+05:30`).getTime();
        return timeA - timeB;
      })[0];
  }, [matches]);

  return (
    <div className="relative glass-card border border-border-card overflow-hidden page-transition">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-text-main tracking-tight">
          Tournament Calendar at a Glance
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevMonth}
              disabled={currentMonth <= 5}
              className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-main disabled:opacity-30 transition-all cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-text-main min-w-[130px] text-center">
              {monthName} {currentYear}
            </span>
            <button
              onClick={goToNextMonth}
              disabled={currentMonth >= 6}
              className="p-1.5 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-main disabled:opacity-30 transition-all cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* NEXT MATCH badge */}
      {nextMatch && (
        <Link
          href={`/matches/${nextMatch.id}`}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-brand-green text-white text-[10px] font-black uppercase tracking-wider hover:bg-brand-green-hover transition-colors animate-slide-in-right animate-pulse-glow cursor-pointer"
        >
          Next Match →
        </Link>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 px-4">
        {DAY_HEADERS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold text-text-dark uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[2px] p-4 pt-0">
        {calendarDays.map((cell, idx) => {
          const dateStr = `${currentYear}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
          const dayMatches = cell.inMonth ? (matchesByDate[dateStr] || []) : [];
          const isToday = dateStr === todayStr;
          const hasMatches = dayMatches.length > 0;

          return (
            <div
              key={idx}
              className={`calendar-day ${!cell.inMonth ? 'opacity-30' : ''} ${hasMatches ? 'has-matches' : ''} ${isToday ? 'today' : ''}`}
            >
              <div className={`text-[11px] font-bold mb-1 px-1 ${isToday ? 'text-brand-gold' : 'text-text-muted'}`}>
                {cell.day}
              </div>
              <div className="flex flex-col gap-[2px]">
                {dayMatches.slice(0, 3).map(m => {
                  const t1 = TEAMS.find(t => t.id === m.team1);
                  const t2 = TEAMS.find(t => t.id === m.team2);
                  return (
                    <Link
                      key={m.id}
                      href={`/matches/${m.id}`}
                      className="calendar-match-pill hover:bg-brand-gold/10 transition-colors cursor-pointer"
                      title={`${t1?.name || m.team1} vs ${t2?.name || m.team2}`}
                    >
                      <span className="text-[11px] leading-none">{t1?.flag || '🏳️'}</span>
                      <span className="text-[8px] font-bold text-text-dark">vs</span>
                      <span className="text-[11px] leading-none">{t2?.flag || '🏳️'}</span>
                    </Link>
                  );
                })}
                {dayMatches.length > 3 && (
                  <span className="text-[8px] text-text-dark font-bold px-1">
                    +{dayMatches.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom help text */}
      <div className="px-5 pb-4 flex items-center gap-2 text-[10px] text-text-dark">
        <span className="inline-block h-2 w-2 rounded-full bg-brand-green/40 border border-brand-green/30"></span>
        <span>Days with scheduled matches</span>
        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-gold/40 border border-brand-gold/30"></span>
        <span>Today</span>
      </div>
    </div>
  );
}
