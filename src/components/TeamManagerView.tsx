import React, { useState } from 'react';
import type { Team } from '../types';

interface TeamManagerViewProps {
  teams: Record<string, Team>;
  onUpdateTeamRatings: (teamId: string, attack: number, defense: number) => void;
}

export const TeamManagerView: React.FC<TeamManagerViewProps> = ({
  teams,
  onUpdateTeamRatings
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');

  const allTeams = Object.values(teams);

  // Filter teams
  const filteredTeams = allTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          team.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'ALL' || team.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const groups = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search and Filters Header */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-gold-light)' }}>Team Ratings Manager</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Modify attack and defense statistics. Ratings directly impact simulation odds.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Search Input */}
          <input 
            type="text"
            placeholder="Search team..."
            className="score-input"
            style={{ width: '180px', height: '38px', textAlign: 'left', padding: '0 12px', fontSize: '0.9rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Group Filter Buttons */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            {groups.map(grp => (
              <button
                key={grp}
                onClick={() => setGroupFilter(grp)}
                style={{
                  background: groupFilter === grp ? 'var(--color-gold)' : 'transparent',
                  color: groupFilter === grp ? '#0b0f19' : 'var(--color-text-muted)',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-family)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {grp === 'ALL' ? 'All' : grp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Team Cards */}
      <div className="grid-4">
        {filteredTeams.map(team => {
          return (
            <div key={team.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Team Flag & Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="team-flag" style={{ fontSize: '1.8rem' }}>{team.flag}</span>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{team.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Group {team.group} • {team.code}
                    </span>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, var(--color-maroon-light), var(--color-maroon))',
                  border: '1px solid var(--color-gold)',
                  boxShadow: '0 0 8px var(--color-gold-glow)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  color: 'var(--color-gold-light)'
                }} title="Overall Rating">
                  {team.overall}
                </div>
              </div>

              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.03)', paddingTop: '12px' }}>
                
                {/* Attack Slider */}
                <div className="slider-group">
                  <label>
                    <span>⚔️ Attack Strength</span>
                    <span className="slider-val">{team.attack}</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="99" 
                    value={team.attack} 
                    onChange={(e) => onUpdateTeamRatings(team.id, parseInt(e.target.value), team.defense)}
                  />
                </div>

                {/* Defense Slider */}
                <div className="slider-group">
                  <label>
                    <span>🛡️ Defense Strength</span>
                    <span className="slider-val">{team.defense}</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="99" 
                    value={team.defense} 
                    onChange={(e) => onUpdateTeamRatings(team.id, team.attack, parseInt(e.target.value))}
                  />
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
          🔍 No teams match your search or filters.
        </div>
      )}

    </div>
  );
};
