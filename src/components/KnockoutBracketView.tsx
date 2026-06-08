import { useState } from 'react';
import type { Team, Match } from '../types';

interface KnockoutBracketViewProps {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
  groupStageCompleted: boolean;
  onSimulateMatch: (matchId: string) => void;
  onUpdateScore: (matchId: string, homeScore: number | null, awayScore: number | null, extraTime?: { homeScore: number; awayScore: number } | null, penalties?: { homeScore: number; awayScore: number } | null, winnerId?: string) => void;
}

export const KnockoutBracketView: React.FC<KnockoutBracketViewProps> = ({
  teams,
  matches,
  groupStageCompleted,
  onSimulateMatch,
  onUpdateScore
}) => {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  
  // Custom manual edit states
  const [mHomeScore, setMHomeScore] = useState<string>('');
  const [mAwayScore, setMAwayScore] = useState<string>('');
  const [mHomePen, setMHomePen] = useState<string>('');
  const [mAwayPen, setMAwayPen] = useState<string>('');

  const handleStartEdit = (match: Match) => {
    setEditingMatchId(match.id);
    setMHomeScore(match.homeScore !== null ? String(match.homeScore) : '');
    setMAwayScore(match.awayScore !== null ? String(match.awayScore) : '');
    setMHomePen(match.penalties ? String(match.penalties.homeScore) : '');
    setMAwayPen(match.penalties ? String(match.penalties.awayScore) : '');
  };

  const handleSaveEdit = (matchId: string) => {
    const hs = mHomeScore === '' ? null : parseInt(mHomeScore);
    const as = mAwayScore === '' ? null : parseInt(mAwayScore);
    
    if (hs === null || as === null) {
      setEditingMatchId(null);
      return;
    }

    let extraTime = null;
    let penalties = null;
    let winnerId = '';

    const match = matches[matchId];
    if (hs > as) {
      winnerId = match.homeTeamId;
    } else if (as > hs) {
      winnerId = match.awayTeamId;
    } else {
      const hp = mHomePen === '' ? 0 : parseInt(mHomePen);
      const ap = mAwayPen === '' ? 0 : parseInt(mAwayPen);
      
      extraTime = { homeScore: 0, awayScore: 0 };
      penalties = { homeScore: hp, awayScore: ap };
      
      if (hp > ap) {
        winnerId = match.homeTeamId;
      } else {
        winnerId = match.awayTeamId;
      }
    }

    onUpdateScore(matchId, hs, as, extraTime, penalties, winnerId);
    setEditingMatchId(null);
  };

  const renderBracketTeam = (teamId: string, placeholder: string, score: number | null, isWinner: boolean, isLoser: boolean, penaltiesScore?: number) => {
    const team = teams[teamId];
    
    if (!team) {
      return (
        <div className="bracket-match-team loser">
          <span className="team-cell">
            <span style={{ fontSize: '1rem', color: 'var(--color-text-dark)' }}>❓</span>
            <span className="team-name" style={{ color: 'var(--color-text-dark)', fontSize: '0.8rem' }}>{placeholder}</span>
          </span>
          <span className="bracket-score">-</span>
        </div>
      );
    }

    return (
      <div className={`bracket-match-team ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
        <span className="team-cell">
          <span className="team-flag">{team.flag}</span>
          <span className="team-name" title={team.name}>{team.name}</span>
          <span className="team-code" style={{ fontSize: '0.7rem' }}>({team.overall})</span>
        </span>
        <span className={`bracket-score ${isWinner ? 'winner-score' : ''}`}>
          {score !== null ? score : '-'}
          {penaltiesScore !== undefined && (
            <span className="penalty-subscript">({penaltiesScore})</span>
          )}
        </span>
      </div>
    );
  };

  const renderMatchCard = (matchId: string, placeholderHome: string, placeholderAway: string) => {
    const match = matches[matchId];
    if (!match) return null;

    const isReady = match.homeTeamId && match.awayTeamId;
    const isEditing = editingMatchId === matchId;

    const homeWinner = match.isCompleted && match.winnerId === match.homeTeamId;
    const awayWinner = match.isCompleted && match.winnerId === match.awayTeamId;
    const homeLoser = match.isCompleted && match.winnerId !== match.homeTeamId;
    const awayLoser = match.isCompleted && match.winnerId !== match.awayTeamId;

    return (
      <div className="bracket-match-card">
        {isEditing ? (
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-input)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-gold)' }}>
              <span>Edit Score</span>
              <button 
                onClick={() => setEditingMatchId(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
              >
                ✕ Cancel
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>{teams[match.homeTeamId]?.name}</span>
                <input 
                  type="number" 
                  min="0" 
                  className="score-input" 
                  style={{ height: '26px', width: '40px' }}
                  value={mHomeScore} 
                  onChange={(e) => setMHomeScore(e.target.value)} 
                />
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>{teams[match.awayTeamId]?.name}</span>
                <input 
                  type="number" 
                  min="0" 
                  className="score-input" 
                  style={{ height: '26px', width: '40px' }}
                  value={mAwayScore} 
                  onChange={(e) => setMAwayScore(e.target.value)} 
                />
              </div>

              {mHomeScore !== '' && mAwayScore !== '' && mHomeScore === mAwayScore && (
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginBottom: '4px', textAlign: 'center' }}>
                    Tie-breaker Penalties
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span>Pens</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="H"
                        className="score-input" 
                        style={{ height: '24px', width: '32px', fontSize: '0.75rem' }}
                        value={mHomePen} 
                        onChange={(e) => setMHomePen(e.target.value)} 
                      />
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="A"
                        className="score-input" 
                        style={{ height: '24px', width: '32px', fontSize: '0.75rem' }}
                        value={mAwayPen} 
                        onChange={(e) => setMAwayPen(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn btn-gold" 
              style={{ width: '100%', padding: '4px', fontSize: '0.75rem', marginTop: '4px' }}
              onClick={() => handleSaveEdit(matchId)}
            >
              💾 Save Score
            </button>
          </div>
        ) : (
          <>
            {renderBracketTeam(match.homeTeamId, placeholderHome, match.homeScore, homeWinner, homeLoser, match.penalties?.homeScore)}
            {renderBracketTeam(match.awayTeamId, placeholderAway, match.awayScore, awayWinner, awayLoser, match.penalties?.awayScore)}

            {isReady && (
              <div className="bracket-actions">
                <button onClick={() => onSimulateMatch(matchId)}>🎲 Sim</button>
                <button onClick={() => handleStartEdit(match)}>✏️ Edit</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <h3 style={{ fontSize: '1.4rem' }}>Knockout Stage Bracket (48-Team Format)</h3>
        {!groupStageCompleted && (
          <span style={{ fontSize: '0.85rem', color: 'var(--color-danger)', fontWeight: 600 }}>
            ⚠️ Complete the Group Stage to populate the bracket!
          </span>
        )}
      </div>

      <div className="bracket-wrapper">
        <div className="bracket-container">
          
          {/* Round of 32 */}
          <div className="bracket-round">
            <div className="round-header">Round of 32</div>
            {renderMatchCard('r32_1', '2nd Group A', '2nd Group B')}
            {renderMatchCard('r32_2', '1st Group C', '2nd Group F')}
            {renderMatchCard('r32_3', '1st Group E', '3rd Group A/B/C/D/F')}
            {renderMatchCard('r32_4', '1st Group F', '2nd Group C')}
            {renderMatchCard('r32_5', '2nd Group E', '2nd Group I')}
            {renderMatchCard('r32_6', '1st Group I', '3rd Group C/D/F/G/H')}
            {renderMatchCard('r32_7', '1st Group A', '3rd Group C/E/F/H/I')}
            {renderMatchCard('r32_8', '1st Group L', '3rd Group E/H/I/J/K')}
            {renderMatchCard('r32_9', '1st Group G', '3rd Group A/E/H/I/J')}
            {renderMatchCard('r32_10', '1st Group D', '3rd Group B/E/F/I/J')}
            {renderMatchCard('r32_11', '1st Group H', '2nd Group J')}
            {renderMatchCard('r32_12', '2nd Group K', '2nd Group L')}
            {renderMatchCard('r32_13', '1st Group B', '3rd Group E/F/G/I/J')}
            {renderMatchCard('r32_14', '2nd Group D', '2nd Group G')}
            {renderMatchCard('r32_15', '1st Group J', '2nd Group H')}
            {renderMatchCard('r32_16', '1st Group K', '3rd Group D/E/I/J/L')}
          </div>

          {/* Round of 16 */}
          <div className="bracket-round">
            <div className="round-header">Round of 16</div>
            {renderMatchCard('r16_1', 'Winner R32 Match 1', 'Winner R32 Match 3')}
            {renderMatchCard('r16_2', 'Winner R32 Match 2', 'Winner R32 Match 5')}
            {renderMatchCard('r16_3', 'Winner R32 Match 4', 'Winner R32 Match 6')}
            {renderMatchCard('r16_4', 'Winner R32 Match 7', 'Winner R32 Match 8')}
            {renderMatchCard('r16_5', 'Winner R32 Match 11', 'Winner R32 Match 12')}
            {renderMatchCard('r16_6', 'Winner R32 Match 9', 'Winner R32 Match 10')}
            {renderMatchCard('r16_7', 'Winner R32 Match 14', 'Winner R32 Match 16')}
            {renderMatchCard('r16_8', 'Winner R32 Match 13', 'Winner R32 Match 15')}
          </div>

          {/* Quarter-Finals */}
          <div className="bracket-round">
            <div className="round-header">Quarter-Finals</div>
            {renderMatchCard('qf_1', 'Winner R16 Match 1', 'Winner R16 Match 2')}
            {renderMatchCard('qf_2', 'Winner R16 Match 3', 'Winner R16 Match 4')}
            {renderMatchCard('qf_3', 'Winner R16 Match 5', 'Winner R16 Match 6')}
            {renderMatchCard('qf_4', 'Winner R16 Match 7', 'Winner R16 Match 8')}
          </div>

          {/* Semi-Finals */}
          <div className="bracket-round">
            <div className="round-header">Semi-Finals</div>
            {renderMatchCard('sf_1', 'Winner QF 1', 'Winner QF 2')}
            {renderMatchCard('sf_2', 'Winner QF 3', 'Winner QF 4')}
          </div>

          {/* Finals (Final & 3rd Place) */}
          <div className="bracket-round" style={{ gap: '30px' }}>
            <div>
              <div className="round-header">Third Place Play-off</div>
              {renderMatchCard('thirdPlace', 'Loser SF 1', 'Loser SF 2')}
            </div>
            
            <div>
              <div className="round-header" style={{ color: 'var(--color-gold-light)', textShadow: '0 0 10px var(--color-gold-glow)' }}>🏆 Final 🏆</div>
              {renderMatchCard('final', 'Winner SF 1', 'Winner SF 2')}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
