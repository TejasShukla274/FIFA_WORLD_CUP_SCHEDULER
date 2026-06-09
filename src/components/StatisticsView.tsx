'use client';

import React from 'react';
import { TEAMS } from '../lib/data';
import { useMatches } from './MatchesContext';
import { Trophy, Shield, Zap, Info, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function StatisticsView() {
  const { matches, loading } = useMatches();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin text-brand-gold text-3xl">⚽</div>
        <p className="text-text-muted text-sm font-bold">Loading statistics...</p>
      </div>
    );
  }

  const completedMatches = matches.filter(m => m.is_completed);
  const totalCompleted = completedMatches.length;

  // 1. Basic Stats
  let totalGoals = 0;
  completedMatches.forEach(m => {
    if (m.team1_score !== null && m.team1_score !== undefined && m.team2_score !== null && m.team2_score !== undefined) {
      totalGoals += m.team1_score + m.team2_score;
    }
  });

  const avgGoals = totalCompleted > 0 ? (totalGoals / totalCompleted).toFixed(2) : '0.00';

  // 2. Team metrics calculations
  const teamStats: Record<string, {
    id: string;
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    played: number;
  }> = {};

  TEAMS.forEach(team => {
    teamStats[team.id] = { id: team.id, goalsScored: 0, goalsConceded: 0, cleanSheets: 0, played: 0 };
  });

  completedMatches.forEach(m => {
    if (m.team1_score === null || m.team1_score === undefined || m.team2_score === null || m.team2_score === undefined) return;
    const t1 = m.team1;
    const t2 = m.team2;
    const s1 = m.team1_score;
    const s2 = m.team2_score;

    if (teamStats[t1] && teamStats[t2]) {
      teamStats[t1].played += 1;
      teamStats[t2].played += 1;

      teamStats[t1].goalsScored += s1;
      teamStats[t2].goalsScored += s2;

      teamStats[t1].goalsConceded += s2;
      teamStats[t2].goalsConceded += s1;

      if (s2 === 0) teamStats[t1].cleanSheets += 1;
      if (s1 === 0) teamStats[t2].cleanSheets += 1;
    }
  });

  // Sort Teams by Goals Scored
  const topScorers = Object.values(teamStats)
    .filter(s => s.played > 0)
    .sort((a, b) => b.goalsScored - a.goalsScored)
    .slice(0, 5);

  // Sort Teams by Best Defense (conceded per game, min 2 games played)
  const bestDefenses = Object.values(teamStats)
    .filter(s => s.played >= 2)
    .sort((a, b) => {
      const avgA = a.goalsConceded / a.played;
      const avgB = b.goalsConceded / b.played;
      return avgA - avgB;
    })
    .slice(0, 5);

  // Sort Teams by Clean Sheets
  const mostCleanSheets = Object.values(teamStats)
    .filter(s => s.played > 0)
    .sort((a, b) => b.cleanSheets - a.cleanSheets)
    .slice(0, 5);

  // 3. Match records
  const matchRecords = completedMatches.map(m => {
    const homeTeam = TEAMS.find(t => t.id === m.team1);
    const awayTeam = TEAMS.find(t => t.id === m.team2);
    const s1 = m.team1_score || 0;
    const s2 = m.team2_score || 0;

    return {
      match: m,
      homeTeam,
      awayTeam,
      goalDiff: Math.abs(s1 - s2),
      totalGoals: s1 + s2,
      s1,
      s2
    };
  });

  // Biggest wins (highest goal difference)
  const biggestWins = [...matchRecords]
    .sort((a, b) => b.goalDiff - a.goalDiff)
    .slice(0, 5);

  // Highest scoring matches
  const highestScoringMatches = [...matchRecords]
    .sort((a, b) => b.totalGoals - a.totalGoals)
    .slice(0, 5);

  return (
    <div className="space-y-8 page-transition">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 border border-border-card flex flex-col justify-between">
          <span className="text-xs text-text-muted font-black uppercase tracking-wider block">Matches Completed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-text-main">{totalCompleted}</strong>
            <span className="text-xs text-text-dark font-semibold">/ 104 matches</span>
          </div>
        </div>
        <div className="glass-card p-5 border border-border-card flex flex-col justify-between">
          <span className="text-xs text-text-muted font-black uppercase tracking-wider block">Goals Scored</span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-brand-gold">{totalGoals}</strong>
            <span className="text-xs text-text-dark font-semibold">total goals</span>
          </div>
        </div>
        <div className="glass-card p-5 border border-border-card flex flex-col justify-between">
          <span className="text-xs text-text-muted font-black uppercase tracking-wider block">Average Goals / Match</span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-brand-green">{avgGoals}</strong>
            <span className="text-xs text-text-dark font-semibold">G/M ratio</span>
          </div>
        </div>
      </div>

      {totalCompleted === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-card border border-border-card space-y-4 max-w-xl mx-auto">
          <span className="text-4xl">📊</span>
          <h2 className="text-lg font-bold text-text-main">No Match Statistics Available</h2>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            Simulate or enter scores on match details pages to generate live leaderboards!
          </p>
          <Link
            href="/calendar"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-gold text-bg-main text-xs font-bold uppercase transition-all"
          >
            Explore matches
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Leaderboard Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Goals Scored */}
            <div className="glass-card p-5 border border-border-card">
              <h2 className="text-base font-black text-text-main flex items-center gap-2 border-b border-border-card pb-3 mb-4">
                <Trophy className="text-brand-gold" size={16} /> Top Scoring Teams
              </h2>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-text-dark font-black uppercase tracking-wider border-b border-border-card pb-2">
                    <th className="pb-2">Team</th>
                    <th className="pb-2 text-center">Played</th>
                    <th className="pb-2 text-center text-brand-gold">Goals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-card">
                  {topScorers.map((stat, idx) => {
                    const team = TEAMS.find(t => t.id === stat.id);
                    if (!team) return null;
                    return (
                      <tr key={stat.id} className="hover:bg-bg-hover transition-colors">
                        <td className="py-2.5 font-bold flex items-center gap-2 text-text-main">
                          <span className="text-text-muted font-bold text-[10px] w-3">{idx + 1}</span>
                          <Link href={`/teams/${team.id}`} className="flex items-center gap-2 hover:text-brand-gold hover:underline cursor-pointer truncate max-w-[130px]">
                            <span className="text-lg leading-none select-none">{team.flag}</span>
                            <span>{team.name}</span>
                          </Link>
                        </td>
                        <td className="py-2.5 text-center text-text-muted font-semibold">{stat.played}</td>
                        <td className="py-2.5 text-center text-brand-gold font-black">{stat.goalsScored}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Best Defenses */}
            <div className="glass-card p-5 border border-border-card">
              <h2 className="text-base font-black text-text-main flex items-center gap-2 border-b border-border-card pb-3 mb-4">
                <Shield className="text-brand-green" size={16} /> Best Defenses (Min 2 GP)
              </h2>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-text-dark font-black uppercase tracking-wider border-b border-border-card pb-2">
                    <th className="pb-2">Team</th>
                    <th className="pb-2 text-center">Conceded</th>
                    <th className="pb-2 text-center text-brand-green">Avg / GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-card">
                  {bestDefenses.map((stat, idx) => {
                    const team = TEAMS.find(t => t.id === stat.id);
                    if (!team) return null;
                    return (
                      <tr key={stat.id} className="hover:bg-bg-hover transition-colors">
                        <td className="py-2.5 font-bold flex items-center gap-2 text-text-main">
                          <span className="text-text-muted font-bold text-[10px] w-3">{idx + 1}</span>
                          <Link href={`/teams/${team.id}`} className="flex items-center gap-2 hover:text-brand-gold hover:underline cursor-pointer truncate max-w-[130px]">
                            <span className="text-lg leading-none select-none">{team.flag}</span>
                            <span>{team.name}</span>
                          </Link>
                        </td>
                        <td className="py-2.5 text-center text-text-muted font-semibold">{stat.goalsConceded}</td>
                        <td className="py-2.5 text-center text-brand-green font-black">
                          {(stat.goalsConceded / stat.played).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Most Clean Sheets */}
            <div className="glass-card p-5 border border-border-card">
              <h2 className="text-base font-black text-text-main flex items-center gap-2 border-b border-border-card pb-3 mb-4">
                <Zap className="text-brand-gold-hover" size={16} /> Clean Sheets
              </h2>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-text-dark font-black uppercase tracking-wider border-b border-border-card pb-2">
                    <th className="pb-2">Team</th>
                    <th className="pb-2 text-center">Played</th>
                    <th className="pb-2 text-center text-brand-gold-hover">Clean Sheets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-card">
                  {mostCleanSheets.map((stat, idx) => {
                    const team = TEAMS.find(t => t.id === stat.id);
                    if (!team) return null;
                    return (
                      <tr key={stat.id} className="hover:bg-bg-hover transition-colors">
                        <td className="py-2.5 font-bold flex items-center gap-2 text-text-main">
                          <span className="text-text-muted font-bold text-[10px] w-3">{idx + 1}</span>
                          <Link href={`/teams/${team.id}`} className="flex items-center gap-2 hover:text-brand-gold hover:underline cursor-pointer truncate max-w-[130px]">
                            <span className="text-lg leading-none select-none">{team.flag}</span>
                            <span>{team.name}</span>
                          </Link>
                        </td>
                        <td className="py-2.5 text-center text-text-muted font-semibold">{stat.played}</td>
                        <td className="py-2.5 text-center text-brand-gold-hover font-black">{stat.cleanSheets}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biggest Wins */}
            <div className="glass-card p-5 border border-border-card">
              <h2 className="text-base font-black text-text-main border-b border-border-card pb-3 mb-4">
                🔥 Biggest Victories
              </h2>
              <div className="space-y-3">
                {biggestWins.map(({ match, homeTeam, awayTeam, s1, s2 }) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-bg-hover rounded-xl border border-border-card text-xs">
                    <span className="flex-1 flex items-center gap-2">
                      <span className="text-base">{homeTeam?.flag || '🏳️'}</span>
                      <Link href={`/teams/${homeTeam?.id}`} className="font-extrabold text-text-main hover:text-brand-gold hover:underline truncate max-w-[80px]">
                        {homeTeam?.name || match.team1}
                      </Link>
                    </span>
                    <Link href={`/matches/${match.id}`} className="px-3.5 py-1.5 bg-bg-main border border-border-card rounded-lg font-black text-sm text-text-main hover:border-brand-gold transition-colors">
                      {s1} - {s2}
                    </Link>
                    <span className="flex-1 flex items-center gap-2 justify-end text-right">
                      <Link href={`/teams/${awayTeam?.id}`} className="font-extrabold text-text-main hover:text-brand-gold hover:underline truncate max-w-[80px]">
                        {awayTeam?.name || match.team2}
                      </Link>
                      <span className="text-base">{awayTeam?.flag || '🏳️'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Scoring Games */}
            <div className="glass-card p-5 border border-border-card">
              <h2 className="text-base font-black text-text-main border-b border-border-card pb-3 mb-4">
                🥅 Highest Scoring Matches
              </h2>
              <div className="space-y-3">
                {highestScoringMatches.map(({ match, homeTeam, awayTeam, s1, s2, totalGoals }) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-bg-hover rounded-xl border border-border-card text-xs">
                    <span className="flex-1 flex items-center gap-2">
                      <span className="text-base">{homeTeam?.flag || '🏳️'}</span>
                      <Link href={`/teams/${homeTeam?.id}`} className="font-extrabold text-text-main hover:text-brand-gold hover:underline truncate max-w-[80px]">
                        {homeTeam?.name || match.team1}
                      </Link>
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/matches/${match.id}`} className="px-3.5 py-1.5 bg-bg-main border border-border-card rounded-lg font-black text-sm text-text-main hover:border-brand-gold transition-colors">
                        {s1} - {s2}
                      </Link>
                      <span className="text-[10px] text-brand-gold font-bold bg-brand-gold/10 px-2 py-1 rounded border border-brand-gold/20">
                        {totalGoals} Goals
                      </span>
                    </div>
                    <span className="flex-1 flex items-center gap-2 justify-end text-right">
                      <Link href={`/teams/${awayTeam?.id}`} className="font-extrabold text-text-main hover:text-brand-gold hover:underline truncate max-w-[80px]">
                        {awayTeam?.name || match.team2}
                      </Link>
                      <span className="text-base">{awayTeam?.flag || '🏳️'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info footer */}
      <div className="flex items-center gap-2 text-[10px] text-text-muted p-4 bg-bg-hover rounded-xl border border-border-card">
        <Info size={12} className="text-brand-gold" />
        <span>Statistics update instantly as you enter scorecards. Head-to-head records and details are compiled live.</span>
      </div>
    </div>
  );
}
