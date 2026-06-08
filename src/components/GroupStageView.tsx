import React, { useState } from 'react';
import type { Team, Match, Group } from '../types';

interface GroupStageViewProps {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
  groups: Record<string, Group>;
  onSimulateGroup: (groupLetter: string) => void;
  onSimulateMatch: (matchId: string) => void;
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
}

export const GroupStageView: React.FC<GroupStageViewProps> = ({
  teams,
  matches,
  groups,
  onSimulateGroup,
  onSimulateMatch,
  onUpdateScore
}) => {
  const [selectedGroupLetter, setSelectedGroupLetter] = useState<string>('A');

  const selectedGroup = groups[selectedGroupLetter];
  const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '24px', alignItems: 'start' }}>
      
      {/* Left Pane: Standings for all 8 Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Group Standings
        </h3>
        
        <div className="grid-groups">
          {groupLetters.map(letter => {
            const grp = groups[letter];
            const isSelected = selectedGroupLetter === letter;

            return (
              <div 
                key={letter} 
                className="card"
                onClick={() => setSelectedGroupLetter(letter)}
                style={{ 
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? 'var(--shadow-gold)' : 'none',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: isSelected ? 'var(--color-gold-light)' : 'var(--color-text-main)' }}>
                    Group {letter}
                  </h4>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSimulateGroup(letter);
                    }}
                  >
                    ⚡ Sim Group
                  </button>
                </div>

                <table style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Pos</th>
                      <th>Team</th>
                      <th style={{ textAlign: 'center' }}>PL</th>
                      <th style={{ textAlign: 'center' }}>GD</th>
                      <th style={{ textAlign: 'center' }}>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grp.standings.map((standing, index) => {
                      const team = teams[standing.teamId];
                      const isQualifying = index < 2;
                      const rowClass = index === 0 ? 'qualify-first' : index === 1 ? 'qualify-second' : '';

                      return (
                        <tr key={standing.teamId} className={`standing-row ${rowClass}`}>
                          <td>
                            <span className="standing-badge">{index + 1}</span>
                          </td>
                          <td>
                            <div className="team-cell">
                              <span className="team-flag">{team.flag}</span>
                              <span className="team-code" title={team.name}>{team.code}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>{standing.played}</td>
                          <td style={{ textAlign: 'center', color: standing.goalDifference > 0 ? 'var(--color-success)' : standing.goalDifference < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                            {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 'bold', color: isQualifying ? 'var(--color-gold-light)' : 'var(--color-text-main)' }}>
                            {standing.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Fixtures and Simulator for Currently Selected Group */}
      {selectedGroup && (
        <div className="card" style={{ position: 'sticky', top: '24px' }}>
          <div className="card-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <span>Group {selectedGroupLetter} Fixtures</span>
            <button 
              className="btn btn-gold" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => onSimulateGroup(selectedGroupLetter)}
            >
              ⚡ Simulate Group
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {selectedGroup.matches.map((matchId, index) => {
              const match = matches[matchId];
              const homeTeam = teams[match.homeTeamId];
              const awayTeam = teams[match.awayTeamId];

              return (
                <div key={match.id} className="match-item" style={{ flexDirection: 'column', gap: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                    <span>Match {index + 1}</span>
                    <span style={{ color: match.isCompleted ? 'var(--color-success)' : 'var(--color-text-dark)' }}>
                      {match.isCompleted ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {/* Home Team */}
                    <div className="match-team home" style={{ width: '40%' }}>
                      <span className="team-name" style={{ marginRight: '6px' }}>{homeTeam.name}</span>
                      <span className="team-flag">{homeTeam.flag}</span>
                    </div>

                    {/* Score inputs */}
                    <div className="match-score-section">
                      <input 
                        type="number" 
                        min="0"
                        placeholder="-"
                        className="score-input"
                        value={match.homeScore !== null ? match.homeScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          onUpdateScore(match.id, val, match.awayScore);
                        }}
                      />
                      <span className="match-vs">vs</span>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="-"
                        className="score-input"
                        value={match.awayScore !== null ? match.awayScore : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value);
                          onUpdateScore(match.id, match.homeScore, val);
                        }}
                      />
                    </div>

                    {/* Away Team */}
                    <div className="match-team away" style={{ width: '40%' }}>
                      <span className="team-flag">{awayTeam.flag}</span>
                      <span className="team-name" style={{ marginLeft: '6px' }}>{awayTeam.name}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '4px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                      onClick={() => onSimulateMatch(match.id)}
                    >
                      🎲 Simulate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
    </div>
  );
};
