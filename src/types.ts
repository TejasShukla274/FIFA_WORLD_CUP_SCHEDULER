export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  group: string;
  attack: number; // 1-99
  defense: number; // 1-99
  overall: number; // 1-99
}

export interface ScoreDetails {
  homeScore: number;
  awayScore: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  isCompleted: boolean;
  stage: 'group' | 'r32' | 'r16' | 'quarter' | 'semi' | 'thirdPlace' | 'final';
  group?: string; // only for group stage
  winnerId?: string; // for knockout stages
  extraTime?: ScoreDetails; // if went to extra time
  penalties?: ScoreDetails; // if went to penalties
}

export interface GroupStandings {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Group {
  letter: string; // A to L
  teams: string[]; // Team IDs
  matches: string[]; // Match IDs
  standings: GroupStandings[];
}

export interface TournamentState {
  teams: Record<string, Team>;
  matches: Record<string, Match>;
  groups: Record<string, Group>;
  currentStage: 'group' | 'r32' | 'r16' | 'quarter' | 'semi' | 'final_stages' | 'completed';
  activeTab: 'dashboard' | 'groups' | 'bracket' | 'teams' | 'stats';
}
