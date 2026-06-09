import type { Team, Match, GroupStandings, ScoreDetails } from '../types';

export function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > L && k < 12);
  return k - 1;
}

export function simulateMatch(home: Team, away: Team): ScoreDetails {
  // Expected goals (lambda) calculation
  // attack ranges 10-99, defense ranges 10-99
  // average goals in football match is around 2.7 total (1.35 per team)
  const homeFactor = home.attack / away.defense;
  const awayFactor = away.attack / home.defense;

  // We give the home team a slight advantage (1.05 multiplier)
  const lambdaHome = Math.max(0.2, Math.min(6.0, 1.35 * homeFactor * 1.05));
  const lambdaAway = Math.max(0.2, Math.min(6.0, 1.35 * awayFactor));

  return {
    homeScore: poissonRandom(lambdaHome),
    awayScore: poissonRandom(lambdaAway)
  };
}

export function simulateKnockoutMatch(home: Team, away: Team): Omit<Match, 'id' | 'stage' | 'group'> {
  // Main 90 minutes
  const normalTime = simulateMatch(home, away);
  const homeScore = normalTime.homeScore;
  const awayScore = normalTime.awayScore;
  let winnerId = '';
  let extraTime: ScoreDetails | undefined;
  let penalties: ScoreDetails | undefined;
  const isCompleted = true;

  if (homeScore > awayScore) {
    winnerId = home.id;
  } else if (awayScore > homeScore) {
    winnerId = away.id;
  } else {
    // Extra time (30 mins) - scale expected goals by 1/3
    const homeFactor = home.attack / away.defense;
    const awayFactor = away.attack / home.defense;
    const lambdaHomeET = Math.max(0.08, Math.min(2.0, 0.45 * homeFactor * 1.05));
    const lambdaAwayET = Math.max(0.08, Math.min(2.0, 0.45 * awayFactor));

    const etHomeGoals = poissonRandom(lambdaHomeET);
    const etAwayGoals = poissonRandom(lambdaAwayET);

    extraTime = { homeScore: etHomeGoals, awayScore: etAwayGoals };
    const finalHomeETScore = homeScore + etHomeGoals;
    const finalAwayETScore = awayScore + etAwayGoals;

    if (finalHomeETScore > finalAwayETScore) {
      winnerId = home.id;
    } else if (finalAwayETScore > finalHomeETScore) {
      winnerId = away.id;
    } else {
      // Penalty shootout
      // Base penalty conversion rate is ~75%
      const baseHomeProb = 0.75 + (home.overall - away.overall) * 0.001;
      const baseAwayProb = 0.75 + (away.overall - home.overall) * 0.001;
      
      const homeProb = Math.max(0.5, Math.min(0.9, baseHomeProb));
      const awayProb = Math.max(0.5, Math.min(0.9, baseAwayProb));

      let homePenScore = 0;
      let awayPenScore = 0;

      // First 5 rounds
      for (let round = 0; round < 5; round++) {
        const homeIn = Math.random() < homeProb;
        const awayIn = Math.random() < awayProb;
        if (homeIn) homePenScore++;
        if (awayIn) awayPenScore++;
      }

      // Sudden death if tied
      while (homePenScore === awayPenScore) {
        const homeIn = Math.random() < homeProb;
        const awayIn = Math.random() < awayProb;
        if (homeIn) homePenScore++;
        if (awayIn) awayPenScore++;
      }

      penalties = { homeScore: homePenScore, awayScore: awayPenScore };
      winnerId = homePenScore > awayPenScore ? home.id : away.id;
    }
  }

  return {
    homeTeamId: home.id,
    awayTeamId: away.id,
    homeScore: normalTime.homeScore,
    awayScore: normalTime.awayScore,
    isCompleted,
    winnerId,
    extraTime,
    penalties
  };
}

export function calculateGroupStandings(
  teams: Team[],
  matches: Match[]
): GroupStandings[] {
  // Initialize standings map
  const standingsMap: Record<string, GroupStandings> = {};
  teams.forEach(team => {
    standingsMap[team.id] = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    };
  });

  // Calculate stats from matches
  matches.forEach(match => {
    if (!match.isCompleted || match.homeScore === null || match.awayScore === null) return;

    const home = standingsMap[match.homeTeamId];
    const away = standingsMap[match.awayTeamId];

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.awayScore > match.homeScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  });

  // Update goal difference
  Object.values(standingsMap).forEach(s => {
    s.goalDifference = s.goalsFor - s.goalsAgainst;
  });

  // Sort according to FIFA rules:
  // 1. Points
  // 2. Goal Difference
  // 3. Goals For
  // 4. Head-to-Head
  return Object.values(standingsMap).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }

    // Head-to-head match check
    const h2hMatch = matches.find(
      m =>
        m.isCompleted &&
        ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
          (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId))
    );

    if (h2hMatch && h2hMatch.homeScore !== null && h2hMatch.awayScore !== null) {
      const isAHome = h2hMatch.homeTeamId === a.teamId;
      const scoreA = isAHome ? h2hMatch.homeScore : h2hMatch.awayScore;
      const scoreB = isAHome ? h2hMatch.awayScore : h2hMatch.homeScore;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
    }

    // Default tiebreaker: overall rating
    const teamA = teams.find(t => t.id === a.teamId);
    const teamB = teams.find(t => t.id === b.teamId);
    if (teamA && teamB && teamB.overall !== teamA.overall) {
      return teamB.overall - teamA.overall;
    }

    return a.teamId.localeCompare(b.teamId);
  });
}
