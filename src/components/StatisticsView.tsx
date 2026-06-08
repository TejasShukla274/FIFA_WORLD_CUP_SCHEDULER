import type { Team, Match } from '../types';

interface StatisticsViewProps {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ teams, matches }) => {
  const matchValues = Object.values(matches);
  const completedMatches = matchValues.filter(m => m.isCompleted);
  const totalCompleted = completedMatches.length;

  // 1. Basic Stats
  let totalGoals = 0;
  completedMatches.forEach(m => {
    if (m.homeScore !== null && m.awayScore !== null) {
      totalGoals += m.homeScore + m.awayScore;
      if (m.extraTime) {
        totalGoals += m.extraTime.homeScore + m.extraTime.awayScore;
      }
    }
  });

  // 2. Team metrics calculations
  const teamStats: Record<string, {
    id: string;
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    played: number;
  }> = {};

  Object.keys(teams).forEach(id => {
    teamStats[id] = { id, goalsScored: 0, goalsConceded: 0, cleanSheets: 0, played: 0 };
  });

  completedMatches.forEach(m => {
    if (m.homeScore === null || m.awayScore === null) return;
    const homeId = m.homeTeamId;
    const awayId = m.awayTeamId;

    const hGoals = m.homeScore + (m.extraTime?.homeScore || 0);
    const aGoals = m.awayScore + (m.extraTime?.awayScore || 0);

    teamStats[homeId].played += 1;
    teamStats[awayId].played += 1;

    teamStats[homeId].goalsScored += hGoals;
    teamStats[awayId].goalsScored += aGoals;

    teamStats[homeId].goalsConceded += aGoals;
    teamStats[awayId].goalsConceded += hGoals;

    if (aGoals === 0) teamStats[homeId].cleanSheets += 1;
    if (hGoals === 0) teamStats[awayId].cleanSheets += 1;
  });

  // Sort Teams by Goals Scored
  const topScorers = Object.values(teamStats)
    .filter(s => s.played > 0)
    .sort((a, b) => b.goalsScored - a.goalsScored)
    .slice(0, 5);

  // Sort Teams by Best Defense (conceded per game, min 3 games played to filter out early exits/unplayed)
  const bestDefenses = Object.values(teamStats)
    .filter(s => s.played >= 3)
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
  interface MatchRecord {
    match: Match;
    homeTeam: Team;
    awayTeam: Team;
    goalDiff: number;
    totalGoals: number;
  }

  const matchRecords: MatchRecord[] = completedMatches.map(m => {
    const homeTeam = teams[m.homeTeamId];
    const awayTeam = teams[m.awayTeamId];
    const normalHome = m.homeScore || 0;
    const normalAway = m.awayScore || 0;
    const etHome = m.extraTime?.homeScore || 0;
    const etAway = m.extraTime?.awayScore || 0;

    const finalHome = normalHome + etHome;
    const finalAway = normalAway + etAway;

    return {
      match: m,
      homeTeam,
      awayTeam,
      goalDiff: Math.abs(finalHome - finalAway),
      totalGoals: finalHome + finalAway
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div className="card">
        <h3 style={{ fontSize: '1.4rem', color: 'var(--color-gold-light)' }}>Tournament Statistics</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
          Real-time leaderboards and scoring achievements.
        </p>
      </div>

      {totalCompleted === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
          📊 No matches simulated yet. Play some matches to see leaderboards!
        </div>
      ) : (
        <>
          {/* Main Leaderboard Row */}
          <div className="grid-3">
            {/* Top Goals Scored */}
            <div className="card">
              <div className="card-title">⚽ Top Scoring Teams</div>
              <table style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th style={{ textAlign: 'center' }}>Played</th>
                    <th style={{ textAlign: 'center' }}>Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {topScorers.map(stat => {
                    const team = teams[stat.id];
                    return (
                      <tr key={stat.id}>
                        <td>
                          <div className="team-cell">
                            <span className="team-flag">{team.flag}</span>
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{stat.played}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-gold-light)' }}>{stat.goalsScored}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Best Defenses */}
            <div className="card">
              <div className="card-title">🛡️ Best Defenses (Min 3 GP)</div>
              <table style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th style={{ textAlign: 'center' }}>Conceded</th>
                    <th style={{ textAlign: 'center' }}>Avg / Game</th>
                  </tr>
                </thead>
                <tbody>
                  {bestDefenses.map(stat => {
                    const team = teams[stat.id];
                    return (
                      <tr key={stat.id}>
                        <td>
                          <div className="team-cell">
                            <span className="team-flag">{team.flag}</span>
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{stat.goalsConceded}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-success)' }}>
                          {(stat.goalsConceded / stat.played).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Most Clean Sheets */}
            <div className="card">
              <div className="card-title">🧤 Clean Sheets</div>
              <table style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th style={{ textAlign: 'center' }}>Played</th>
                    <th style={{ textAlign: 'center' }}>Clean Sheets</th>
                  </tr>
                </thead>
                <tbody>
                  {mostCleanSheets.map(stat => {
                    const team = teams[stat.id];
                    return (
                      <tr key={stat.id}>
                        <td>
                          <div className="team-cell">
                            <span className="team-flag">{team.flag}</span>
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{stat.played}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-success)' }}>{stat.cleanSheets}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Matches Grid */}
          <div className="grid-3">
            {/* Biggest Wins */}
            <div className="card" style={{ gridColumn: 'span 1' }}>
              <div className="card-title">🔥 Biggest Victories</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {biggestWins.map(({ match, homeTeam, awayTeam }) => {
                  const homeTotal = (match.homeScore || 0) + (match.extraTime?.homeScore || 0);
                  const awayTotal = (match.awayScore || 0) + (match.extraTime?.awayScore || 0);
                  return (
                    <div key={match.id} className="match-item" style={{ fontSize: '0.85rem', padding: '10px' }}>
                      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{homeTeam.flag}</span>
                        <strong style={{ color: homeTotal > awayTotal ? 'var(--color-gold-light)' : 'var(--color-text-main)' }}>{homeTeam.code}</strong>
                      </span>
                      <span style={{ padding: '2px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {homeTotal} - {awayTotal}
                        {match.penalties && <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}> ({match.penalties.homeScore}-{match.penalties.awayScore} p)</span>}
                      </span>
                      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                        <strong style={{ color: awayTotal > homeTotal ? 'var(--color-gold-light)' : 'var(--color-text-main)' }}>{awayTeam.code}</strong>
                        <span>{awayTeam.flag}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highest Scoring Games */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="card-title">🥅 Highest Scoring Matches</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {highestScoringMatches.map(({ match, homeTeam, awayTeam, totalGoals: matchGoals }) => {
                  const homeTotal = (match.homeScore || 0) + (match.extraTime?.homeScore || 0);
                  const awayTotal = (match.awayScore || 0) + (match.extraTime?.awayScore || 0);
                  return (
                    <div key={match.id} className="match-item" style={{ fontSize: '0.85rem', padding: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{homeTeam.flag}</span>
                        <span>{homeTeam.name}</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {homeTotal} - {awayTotal}
                          {match.extraTime && <span style={{ fontSize: '0.65rem', color: 'var(--color-gold)' }}> (AET)</span>}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-light)', background: 'var(--color-maroon-glow)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          {matchGoals} Goals
                        </span>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <span>{awayTeam.name}</span>
                        <span>{awayTeam.flag}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
