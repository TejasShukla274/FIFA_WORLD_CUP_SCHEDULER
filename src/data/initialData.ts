import type { Team } from '../types';

export const INITIAL_TEAMS: Team[] = [
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
  { id: 'sco', name: 'Scotland', code: 'SCO', flag: '🏴\u200d󠁧\u200d󠁢\u200d󠁳\u200d󠁣\u200d󠁴\u200d󠁿', group: 'C', attack: 78, defense: 78, overall: 78 },

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

export const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
