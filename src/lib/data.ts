export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  group: string;
  attack: number;
  defense: number;
  overall: number;
}

export interface Venue {
  name: string;
  city: string;
  country: string;
  capacity: string;
}

export interface Match {
  id: string;
  date: string; // YYYY-MM-DD
  time_ist: string; // HH:MM
  team1: string; // Team ID or Placeholder (e.g. "Winner Group A")
  team2: string; // Team ID or Placeholder
  venue: string;
  group_name: string; // "Group A" to "Group L" or "Knockout"
  stage: string; // "Group Stage", "Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Third-place", "Final"
  team1_score?: number | null;
  team2_score?: number | null;
  is_completed?: boolean;
}

export const TEAMS: Team[] = [
  // Group A
  { id: 'mex', name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'A', attack: 81, defense: 79, overall: 80 },
  { id: 'rsa', name: 'South Africa', code: 'RSA', flag: '🇿🇦', group: 'A', attack: 74, defense: 75, overall: 75 },
  { id: 'kor', name: 'Korea Republic', code: 'KOR', flag: '🇰🇷', group: 'A', attack: 81, defense: 78, overall: 80 },
  { id: 'cze', name: 'Czechia', code: 'CZE', flag: '🇨🇿', group: 'A', attack: 79, defense: 78, overall: 79 },

  // Group B
  { id: 'can', name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'B', attack: 79, defense: 75, overall: 77 },
  { id: 'bih', name: 'Bosnia & Herzegovina', code: 'BIH', flag: '🇧🇦', group: 'B', attack: 76, defense: 76, overall: 76 },
  { id: 'qat', name: 'Qatar', code: 'QAT', flag: '🇶🇦', group: 'B', attack: 72, defense: 70, overall: 71 },
  { id: 'sui', name: 'Switzerland', code: 'SUI', flag: '🇨🇭', group: 'B', attack: 81, defense: 83, overall: 82 },

  // Group C
  { id: 'bra', name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'C', attack: 93, defense: 90, overall: 92 },
  { id: 'mar', name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'C', attack: 82, defense: 86, overall: 84 },
  { id: 'hai', name: 'Haiti', code: 'HAI', flag: '🇭🇹', group: 'C', attack: 71, defense: 70, overall: 71 },
  { id: 'sco', name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', attack: 78, defense: 78, overall: 78 },

  // Group D
  { id: 'usa', name: 'USA', code: 'USA', flag: '🇺🇸', group: 'D', attack: 81, defense: 80, overall: 81 },
  { id: 'par', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', group: 'D', attack: 76, defense: 77, overall: 77 },
  { id: 'aus', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'D', attack: 76, defense: 76, overall: 76 },
  { id: 'tur', name: 'Türkiye', code: 'TUR', flag: '🇹🇷', group: 'D', attack: 80, defense: 79, overall: 80 },

  // Group E
  { id: 'ger', name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'E', attack: 89, defense: 86, overall: 88 },
  { id: 'cuw', name: 'Curaçao', code: 'CUW', flag: '🇨🇼', group: 'E', attack: 70, defense: 69, overall: 70 },
  { id: 'civ', name: 'Côte d\'Ivoire', code: 'CIV', flag: '🇨🇮', group: 'E', attack: 80, defense: 79, overall: 80 },
  { id: 'ecu', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'E', attack: 79, defense: 78, overall: 79 },

  // Group F
  { id: 'ned', name: 'Netherlands', code: 'NED', flag: '🇳🇱', group: 'F', attack: 87, defense: 88, overall: 88 },
  { id: 'jpn', name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'F', attack: 82, defense: 81, overall: 82 },
  { id: 'swe', name: 'Sweden', code: 'SWE', flag: '🇸🇪', group: 'F', attack: 80, defense: 81, overall: 81 },
  { id: 'tun', name: 'Tunisia', code: 'TUN', flag: '🇹🇳', group: 'F', attack: 75, defense: 77, overall: 76 },

  // Group G
  { id: 'bel', name: 'Belgium', code: 'BEL', flag: '🇧🇪', group: 'G', attack: 86, defense: 81, overall: 84 },
  { id: 'egy', name: 'Egypt', code: 'EGY', flag: '🇪🇬', group: 'G', attack: 80, defense: 77, overall: 79 },
  { id: 'irn', name: 'IR Iran', code: 'IRN', flag: '🇮🇷', group: 'G', attack: 76, defense: 76, overall: 76 },
  { id: 'nzl', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', group: 'G', attack: 72, defense: 73, overall: 73 },

  // Group H
  { id: 'esp', name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'H', attack: 88, defense: 87, overall: 88 },
  { id: 'cpv', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', group: 'H', attack: 75, defense: 75, overall: 75 },
  { id: 'ksa', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', group: 'H', attack: 75, defense: 74, overall: 75 },
  { id: 'uru', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'H', attack: 83, defense: 82, overall: 83 },

  // Group I
  { id: 'fra', name: 'France', code: 'FRA', flag: '🇫🇷', group: 'I', attack: 94, defense: 89, overall: 92 },
  { id: 'sen', name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'I', attack: 83, defense: 84, overall: 84 },
  { id: 'irq', name: 'Iraq', code: 'IRQ', flag: '🇮🇶', group: 'I', attack: 74, defense: 73, overall: 74 },
  { id: 'nor', name: 'Norway', code: 'NOR', flag: '🇳🇴', group: 'I', attack: 84, defense: 78, overall: 81 },

  // Group J
  { id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'J', attack: 92, defense: 89, overall: 91 },
  { id: 'alg', name: 'Algeria', code: 'ALG', flag: '🇩🇿', group: 'J', attack: 80, defense: 78, overall: 79 },
  { id: 'aut', name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'J', attack: 81, defense: 81, overall: 81 },
  { id: 'jor', name: 'Jordan', code: 'JOR', flag: '🇯🇴', group: 'J', attack: 72, defense: 71, overall: 72 },

  // Group K
  { id: 'por', name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'K', attack: 91, defense: 86, overall: 89 },
  { id: 'cod', name: 'Congo DR', code: 'COD', flag: '🇨🇩', group: 'K', attack: 76, defense: 75, overall: 76 },
  { id: 'uzb', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', group: 'K', attack: 76, defense: 75, overall: 76 },
  { id: 'col', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'K', attack: 85, defense: 83, overall: 84 },

  // Group L
  { id: 'eng', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', attack: 91, defense: 88, overall: 90 },
  { id: 'cro', name: 'Croatia', code: 'CRO', flag: '🇭🇷', group: 'L', attack: 84, defense: 85, overall: 85 },
  { id: 'gha', name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'L', attack: 77, defense: 75, overall: 76 },
  { id: 'pan', name: 'Panama', code: 'PAN', flag: '🇵🇦', group: 'L', attack: 76, defense: 75, overall: 76 }
];

export const VENUES: Venue[] = [
  { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: '87,523' },
  { name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', capacity: '82,500' },
  { name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: '80,000' },
  { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: '76,416' },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: '71,000' },
  { name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: '70,240' },
  { name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: '72,220' },
  { name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: '69,000' },
  { name: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA', capacity: '68,500' },
  { name: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: '65,878' },
  { name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: '67,594' },
  { name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: '64,767' },
  { name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: '54,500' },
  { name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: '30,000' },
  { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: '48,071' },
  { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: '53,500' }
];

export const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const RAW_SCHEDULE = `12 Jun	12:30 AM	A	Mexico vs South Africa
12 Jun	7:30 AM	A	South Korea vs Czechia
13 Jun	12:30 AM	B	Canada vs Bosnia & Herzegovina
13 Jun	6:30 AM	D	USA vs Paraguay
14 Jun	12:30 AM	B	Qatar vs Switzerland
14 Jun	3:30 AM	C	Brazil vs Morocco
14 Jun	6:30 AM	C	Haiti vs Scotland
14 Jun	9:30 AM	D	Australia vs Türkiye
14 Jun	10:30 PM	E	Germany vs Curaçao
15 Jun	1:30 AM	F	Netherlands vs Japan
15 Jun	4:30 AM	E	Côte d'Ivoire vs Ecuador
15 Jun	7:30 AM	F	Sweden vs Tunisia
15 Jun	9:30 PM	H	Spain vs Cabo Verde
16 Jun	12:30 AM	G	Belgium vs Egypt
16 Jun	3:30 AM	H	Saudi Arabia vs Uruguay
16 Jun	6:30 AM	G	IR Iran vs New Zealand
17 Jun	12:30 AM	I	France vs Senegal
17 Jun	3:30 AM	I	Iraq vs Norway
17 Jun	6:30 AM	J	Argentina vs Algeria
17 Jun	9:30 AM	J	Austria vs Jordan
17 Jun	10:30 PM	K	Portugal vs Congo DR
18 Jun	1:30 AM	L	England vs Croatia
18 Jun	4:30 AM	L	Ghana vs Panama
18 Jun	7:30 AM	K	Uzbekistan vs Colombia
18 Jun	9:30 PM	A	Czechia vs South Africa
19 Jun	12:30 AM	B	Switzerland vs Bosnia & Herzegovina
19 Jun	3:30 AM	B	Canada vs Qatar
19 Jun	6:30 AM	A	Mexico vs South Korea
20 Jun	12:30 AM	D	USA vs Australia
20 Jun	3:30 AM	C	Scotland vs Morocco
20 Jun	6:00 AM	C	Brazil vs Haiti
20 Jun	8:30 AM	D	Türkiye vs Paraguay
20 Jun	10:30 PM	F	Netherlands vs Sweden
21 Jun	1:30 AM	E	Germany vs Côte d'Ivoire
21 Jun	5:30 AM	E	Ecuador vs Curaçao
21 Jun	9:30 AM	F	Tunisia vs Japan
21 Jun	9:30 PM	H	Spain vs Saudi Arabia
22 Jun	12:30 AM	G	Belgium vs IR Iran
22 Jun	3:30 AM	H	Uruguay vs Cabo Verde
22 Jun	6:30 AM	G	New Zealand vs Egypt
22 Jun	10:30 PM	J	Argentina vs Austria
23 Jun	2:30 AM	I	France vs Iraq
23 Jun	5:30 AM	I	Norway vs Senegal
23 Jun	8:30 AM	J	Jordan vs Algeria
23 Jun	10:30 PM	K	Portugal vs Uzbekistan
24 Jun	1:30 AM	L	England vs Ghana
24 Jun	4:30 AM	L	Panama vs Croatia
24 Jun	7:30 AM	K	Colombia vs Congo DR
25 Jun	12:30 AM	B	Switzerland vs Canada
25 Jun	12:30 AM	B	Bosnia & Herzegovina vs Qatar
25 Jun	3:30 AM	C	Morocco vs Haiti
25 Jun	3:30 AM	C	Scotland vs Brazil
25 Jun	6:30 AM	A	South Africa vs South Korea
25 Jun	6:30 AM	A	Czechia vs Mexico
26 Jun	1:30 AM	E	Curaçao vs Côte d'Ivoire
26 Jun	1:30 AM	E	Ecuador vs Germany
26 Jun	4:30 AM	F	Tunisia vs Netherlands
26 Jun	4:30 AM	F	Japan vs Sweden
26 Jun	7:30 AM	D	Türkiye vs USA
26 Jun	7:30 AM	D	Paraguay vs Australia
27 Jun	12:30 AM	I	Norway vs France
27 Jun	12:30 AM	I	Senegal vs Iraq
27 Jun	5:30 AM	H	Cabo Verde vs Saudi Arabia
27 Jun	5:30 AM	H	Uruguay vs Spain
27 Jun	8:30 AM	G	New Zealand vs Belgium
27 Jun	8:30 AM	G	Egypt vs IR Iran
28 Jun	2:30 AM	L	Panama vs England
28 Jun	2:30 AM	L	Croatia vs Ghana
28 Jun	5:00 AM	K	Colombia vs Portugal
28 Jun	5:00 AM	K	Congo DR vs Uzbekistan
28 Jun	7:30 AM	J	Algeria vs Austria
28 Jun	7:30 AM	J	Jordan vs Argentina`;

// Match schedules generator
function generateGroupStageMatches(): Match[] {
  const matches: Match[] = [];
  const lines = RAW_SCHEDULE.trim().split('\n');
  
  const getTeamIdByName = (name: string): string => {
    const normalized = name.trim().toLowerCase();
    if (normalized === 'south korea') return 'kor';
    const team = TEAMS.find(t => t.name.toLowerCase() === normalized);
    if (!team) {
      throw new Error(`Team not found: "${name}"`);
    }
    return team.id;
  };

  const parseTimeIST = (timeStr: string): string => {
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) {
      throw new Error(`Invalid time format: "${timeStr}"`);
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    return `${formattedHours}:${minutes}`;
  };

  lines.forEach((line, index) => {
    const parts = line.trim().split(/\t|\s{2,}/);
    if (parts.length < 4) return;
    
    const [datePart, timePart, groupPart, matchPart] = parts;
    
    // Parse Date (e.g. "12 Jun")
    const dateSplit = datePart.trim().split(/\s+/);
    if (dateSplit.length < 2) return;
    const day = parseInt(dateSplit[0], 10);
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    // Assuming 2026 and all are in June (Jun)
    const date = `2026-06-${formattedDay}`;
    
    // Parse Time (e.g. "12:30 AM")
    const time_ist = parseTimeIST(timePart);
    
    // Parse Teams (e.g. "Mexico vs South Africa")
    const teamsSplit = matchPart.split(/\s+vs\s+/i);
    if (teamsSplit.length < 2) return;
    const team1 = getTeamIdByName(teamsSplit[0]);
    const team2 = getTeamIdByName(teamsSplit[1]);
    
    // Assign Venue round-robin
    const venue = VENUES[index % VENUES.length].name;
    
    matches.push({
      id: `m_${index + 1}`,
      date,
      time_ist,
      team1,
      team2,
      venue,
      group_name: `Group ${groupPart.trim().toUpperCase()}`,
      stage: 'Group Stage',
      team1_score: null,
      team2_score: null,
      is_completed: false
    });
  });

  return matches;
}

function generateKnockoutMatches(): Match[] {
  const knockouts: Match[] = [];
  
  // Round of 32 (Matches m_73 to m_88)
  // June 28 - July 1
  let currentDay = 28;
  let matchId = 73;
  
  for (let i = 1; i <= 16; i++) {
    if (i > 1 && i % 4 === 0) currentDay++;
    knockouts.push({
      id: `m_${matchId++}`,
      date: `2026-06-${currentDay}`,
      time_ist: i % 2 === 0 ? '02:30' : '23:30',
      team1: `Winner Group ${GROUP_LETTERS[(i - 1) % 12]}`,
      team2: `Runner-up Group ${GROUP_LETTERS[(i + 5) % 12]}`,
      venue: VENUES[i % VENUES.length].name,
      group_name: 'Knockout',
      stage: 'Round of 32',
      team1_score: null,
      team2_score: null,
      is_completed: false
    });
  }

  // Round of 16 (Matches m_89 to m_96)
  // July 2 - July 5
  currentDay = 2; // July
  for (let i = 1; i <= 8; i++) {
    if (i > 1 && i % 2 === 0) currentDay++;
    knockouts.push({
      id: `m_${matchId++}`,
      date: `2026-07-0${currentDay}`,
      time_ist: i % 2 === 0 ? '02:30' : '23:30',
      team1: `Winner R32 Match ${i * 2 - 1}`,
      team2: `Winner R32 Match ${i * 2}`,
      venue: VENUES[(i + 4) % VENUES.length].name,
      group_name: 'Knockout',
      stage: 'Round of 16',
      team1_score: null,
      team2_score: null,
      is_completed: false
    });
  }

  // Quarter-finals (Matches m_97 to m_100)
  // July 9 - July 11
  currentDay = 9;
  for (let i = 1; i <= 4; i++) {
    if (i > 2) currentDay = 10;
    knockouts.push({
      id: `m_${matchId++}`,
      date: `2026-07-${currentDay}`,
      time_ist: i % 2 === 0 ? '02:30' : '23:30',
      team1: `Winner R16 Match ${i * 2 - 1}`,
      team2: `Winner R16 Match ${i * 2}`,
      venue: VENUES[(i + 8) % VENUES.length].name,
      group_name: 'Knockout',
      stage: 'Quarter-finals',
      team1_score: null,
      team2_score: null,
      is_completed: false
    });
  }

  // Semi-finals (Matches m_101 & m_102)
  // July 14 & 15
  knockouts.push({
    id: `m_101`,
    date: '2026-07-14',
    time_ist: '23:30',
    team1: 'Winner QF Match 1',
    team2: 'Winner QF Match 2',
    venue: 'AT&T Stadium',
    group_name: 'Knockout',
    stage: 'Semi-finals',
    team1_score: null,
    team2_score: null,
    is_completed: false
  });
  knockouts.push({
    id: `m_102`,
    date: '2026-07-15',
    time_ist: '23:30',
    team1: 'Winner QF Match 3',
    team2: 'Winner QF Match 4',
    venue: 'Mercedes-Benz Stadium',
    group_name: 'Knockout',
    stage: 'Semi-finals',
    team1_score: null,
    team2_score: null,
    is_completed: false
  });

  // Third Place (Match m_103)
  knockouts.push({
    id: 'm_103',
    date: '2026-07-18',
    time_ist: '20:30',
    team1: 'Loser SF 1',
    team2: 'Loser SF 2',
    venue: 'Hard Rock Stadium',
    group_name: 'Knockout',
    stage: 'Third-place',
    team1_score: null,
    team2_score: null,
    is_completed: false
  });

  // Final (Match m_104)
  knockouts.push({
    id: 'm_104',
    date: '2026-07-19',
    time_ist: '23:30',
    team1: 'Winner SF 1',
    team2: 'Winner SF 2',
    venue: 'MetLife Stadium',
    group_name: 'Knockout',
    stage: 'Final',
    team1_score: null,
    team2_score: null,
    is_completed: false
  });

  return knockouts;
}

export const MATCHES: Match[] = [
  ...generateGroupStageMatches(),
  ...generateKnockoutMatches()
];
