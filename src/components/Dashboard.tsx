import React from 'react';
import type { Team, Match } from '../types';

interface DashboardProps {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
  currentStage: string;
  onSimulateAllGroups: () => void;
  onSimulateAllKnockouts: () => void;
  onReset: () => void;
  setActiveTab: (tab: 'dashboard' | 'groups' | 'bracket' | 'teams' | 'stats') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  teams,
  matches,
  currentStage,
  onSimulateAllGroups,
  onSimulateAllKnockouts,
  onReset,
  setActiveTab
}) => {
  const matchValues = Object.values(matches);
  const totalMatches = matchValues.length;
  const completedMatches = matchValues.filter(m => m.isCompleted).length;
  const progressPercent = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

  // Calculate statistics
  let totalGoals = 0;
  matchValues.forEach(m => {
    if (m.isCompleted && m.homeScore !== null && m.awayScore !== null) {
      totalGoals += m.homeScore + m.awayScore;
      if (m.extraTime) {
        totalGoals += m.extraTime.homeScore + m.extraTime.awayScore;
      }
    }
  });

  const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(2) : '0.00';

  // Find highest scoring team
  const teamGoals: Record<string, number> = {};
  Object.keys(teams).forEach(id => { teamGoals[id] = 0; });

  matchValues.forEach(m => {
    if (m.isCompleted && m.homeScore !== null && m.awayScore !== null) {
      teamGoals[m.homeTeamId] = (teamGoals[m.homeTeamId] || 0) + m.homeScore + (m.extraTime?.homeScore || 0);
      teamGoals[m.awayTeamId] = (teamGoals[m.awayTeamId] || 0) + m.awayScore + (m.extraTime?.awayScore || 0);
    }
  });

  let topScoringTeamId = '';
  let maxGoals = -1;
  Object.entries(teamGoals).forEach(([id, goals]) => {
    if (goals > maxGoals) {
      maxGoals = goals;
      topScoringTeamId = id;
    }
  });

  const topScoringTeam = teams[topScoringTeamId];

  // Stage display translations
  const stageLabels: Record<string, string> = {
    group: 'Group Stage',
    r16: 'Round of 16',
    quarter: 'Quarter-Finals',
    semi: 'Semi-Finals',
    final_stages: 'Finals Day',
    completed: 'Tournament Completed'
  };

  const isGroupStage = currentStage === 'group';
  const isKnockoutStage = currentStage !== 'group' && currentStage !== 'completed';
  const isCompleted = currentStage === 'completed';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner / Hero Section */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(86, 4, 44, 0.45) 0%, rgba(19, 27, 44, 0.9) 100%)',
        border: '1px solid rgba(195, 155, 56, 0.25)',
        padding: '30px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', zIndex: 2, position: 'relative' }}>
          <span style={{
            background: 'var(--color-gold)',
            color: '#0b0f19',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {stageLabels[currentStage] || currentStage}
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '12px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            Welcome to the FIFA World Cup Simulator
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Simulate or manually play matches for all 48 teams. Edit team strength ratings, view dynamic standings, track live stats, and watch the bracket update in real-time.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {isGroupStage && (
              <button className="btn btn-gold" onClick={onSimulateAllGroups}>
                ⚡ Simulate Entire Group Stage
              </button>
            )}
            {isKnockoutStage && (
              <button className="btn btn-gold" onClick={onSimulateAllKnockouts}>
                ⚡ Simulate Remainder of Tournament
              </button>
            )}
            {isCompleted && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--color-success)',
                color: 'var(--color-success)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏆 Tournament Successfully Completed!
              </div>
            )}
            <button className="btn btn-secondary" onClick={() => setActiveTab('groups')}>
              📅 View Groups & Fixtures
            </button>
            <button className="btn btn-danger" onClick={onReset}>
              🔄 Reset Tournament
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="stats-cards-grid">
        <div className="stat-metric-card">
          <div className="stat-metric-num">{progressPercent}%</div>
          <div className="stat-metric-label">Tournament Progress</div>
          <div style={{ marginTop: '12px' }}>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px', color: 'var(--color-text-muted)' }}>
              <span>{completedMatches} played</span>
              <span>{totalMatches} total</span>
            </div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-num">{totalGoals}</div>
          <div className="stat-metric-label">Total Goals Scored</div>
          <div style={{ fontSize: '0.8rem', marginTop: '12px', color: 'var(--color-text-muted)' }}>
            Average: <strong style={{ color: 'var(--color-gold-light)' }}>{avgGoals}</strong> goals/match
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-num">
            {topScoringTeam ? `${topScoringTeam.flag}` : 'N/A'}
          </div>
          <div className="stat-metric-label">Top Scoring Team</div>
          <div style={{ fontSize: '0.85rem', marginTop: '12px', fontWeight: 600 }}>
            {topScoringTeam ? `${topScoringTeam.name} (${maxGoals} Goals)` : 'No goals yet'}
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-num" style={{ fontSize: '1.8rem', paddingTop: '6px', paddingBottom: '6px' }}>
            🏆
          </div>
          <div className="stat-metric-label">Champions</div>
          <div style={{ fontSize: '0.85rem', marginTop: '12px', fontWeight: 700, color: 'var(--color-gold-light)' }}>
            {isCompleted && matches['final']?.winnerId ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {teams[matches['final'].winnerId!]?.flag} {teams[matches['final'].winnerId!]?.name}
              </span>
            ) : (
              'Simulating...'
            )}
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid-3">
        <div className="card" onClick={() => setActiveTab('groups')} style={{ cursor: 'pointer' }}>
          <div className="card-title">
            <span>⚽ 1. Group Stage</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>→</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Navigate to the Group Stage tab to view standings, simulate matches group-by-group, or input custom scores manually.
          </p>
        </div>

        <div className="card" onClick={() => setActiveTab('bracket')} style={{ cursor: 'pointer' }}>
          <div className="card-title">
            <span>🌳 2. Knockout Bracket</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>→</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Once the top 2 teams from each group qualify, they enter the knockout bracket. Simulate Extra Time and Penalties!
          </p>
        </div>

        <div className="card" onClick={() => setActiveTab('teams')} style={{ cursor: 'pointer' }}>
          <div className="card-title">
            <span>⚙️ 3. Team Ratings</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>→</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Adjust Attack and Defense values for any team to dynamically affect their chances of scoring and winning in simulations.
          </p>
        </div>
      </div>
    </div>
  );
};
