'use client';

import React, { useEffect, useState } from 'react';
import { getMatches } from '../../lib/supabase';
import { Match, GROUP_LETTERS } from '../../lib/data';
import MatchCard from '../../components/MatchCard';
import { MatchGridSkeleton } from '../../components/Skeletons';
import { Search, Filter, CalendarDays, X } from 'lucide-react';

export default function CalendarPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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

  // Unique match dates for date filter dropdown
  const uniqueDates = Array.from(new Set(matches.map(m => m.date))).sort();

  // Stages list
  const stages = [
    'Group Stage',
    'Round of 32',
    'Round of 16',
    'Quarter-finals',
    'Semi-finals',
    'Third-place',
    'Final'
  ];

  // Filtering logic
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.team1.toLowerCase().includes(search.toLowerCase()) ||
      match.team2.toLowerCase().includes(search.toLowerCase()) ||
      match.venue.toLowerCase().includes(search.toLowerCase());

    const matchesGroup = selectedGroup === '' || match.group_name === `Group ${selectedGroup}` || (selectedGroup === 'Knockout' && match.group_name === 'Knockout');
    const matchesStage = selectedStage === '' || match.stage === selectedStage;
    const matchesDate = selectedDate === '' || match.date === selectedDate;

    return matchesSearch && matchesGroup && matchesStage && matchesDate;
  });

  // Group matches by date
  const groupedMatches: { [key: string]: Match[] } = {};
  filteredMatches.forEach(match => {
    if (!groupedMatches[match.date]) {
      groupedMatches[match.date] = [];
    }
    groupedMatches[match.date].push(match);
  });

  const sortedDates = Object.keys(groupedMatches).sort();

  const clearFilters = () => {
    setSearch('');
    setSelectedGroup('');
    setSelectedStage('');
    setSelectedDate('');
  };

  const hasActiveFilters = search !== '' || selectedGroup !== '' || selectedStage !== '' || selectedDate !== '';

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="text-brand-gold" /> Full Match Calendar
          </h1>
          <p className="text-text-muted mt-1.5 text-sm">
            Explore and filter the entire schedule of 104 matches.
          </p>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-crimson/10 border border-brand-crimson/20 text-brand-crimson hover:bg-brand-crimson/20 text-xs font-bold uppercase transition-all cursor-pointer interactive-scale"
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl glass-card border border-border-card">
        {/* Search */}
        <div className="relative">
          <label htmlFor="calendar-search-team" className="sr-only">Search teams or venues</label>
          <input
            id="calendar-search-team"
            type="text"
            placeholder="Search teams or venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-black/20 border border-border-card text-text-main focus:outline-none focus:border-brand-gold text-sm font-semibold placeholder:text-text-dark"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dark" size={16} />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <label htmlFor="calendar-date-select" className="sr-only">Filter by Date</label>
          <select
            id="calendar-date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-lg bg-black/20 border border-border-card text-text-main focus:outline-none focus:border-brand-gold text-sm font-semibold cursor-pointer"
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
              </option>
            ))}
          </select>
        </div>

        {/* Group Filter */}
        <div className="relative">
          <label htmlFor="calendar-group-select" className="sr-only">Filter by Group</label>
          <select
            id="calendar-group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-lg bg-black/20 border border-border-card text-text-main focus:outline-none focus:border-brand-gold text-sm font-semibold cursor-pointer"
          >
            <option value="">All Groups</option>
            {GROUP_LETTERS.map(letter => (
              <option key={letter} value={letter}>Group {letter}</option>
            ))}
            <option value="Knockout">Knockouts Only</option>
          </select>
        </div>

        {/* Stage Filter */}
        <div className="relative">
          <label htmlFor="calendar-stage-select" className="sr-only">Filter by Tournament Stage</label>
          <select
            id="calendar-stage-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-lg bg-black/20 border border-border-card text-text-main focus:outline-none focus:border-brand-gold text-sm font-semibold cursor-pointer"
          >
            <option value="">All Stages</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches List grouped by Date */}
      {loading ? (
        <MatchGridSkeleton count={6} />
      ) : sortedDates.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-card border border-border-card">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-white mt-3">No Matches Found</h3>
          <p className="text-text-muted mt-1 text-sm max-w-xs mx-auto">
            Try adjusting your search queries or clearing active filters.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedDates.map(date => {
            const dateMatches = groupedMatches[date];
            const dateObj = new Date(date);
            const dateHeader = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-gold"></div>
                  <h2 className="text-lg font-extrabold text-white tracking-wide">
                    {dateHeader}
                  </h2>
                  <span className="text-xs font-bold text-text-muted px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    {dateMatches.length} {dateMatches.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dateMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
