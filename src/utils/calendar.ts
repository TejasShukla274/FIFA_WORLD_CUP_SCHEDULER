import { Match, TEAMS } from '../lib/data';

/**
 * Generates a Google Calendar template URL for a given match.
 */
export function getGoogleCalendarUrl(match: Match): string {
  const team1Obj = TEAMS.find(t => t.id === match.team1);
  const team2Obj = TEAMS.find(t => t.id === match.team2);
  const t1Name = team1Obj ? team1Obj.name : match.team1;
  const t2Name = team2Obj ? team2Obj.name : match.team2;
  
  const title = `${t1Name} vs ${t2Name} - FIFA World Cup 2026`;
  
  // Parse IST time (+05:30)
  const matchTimeStr = `${match.date}T${match.time_ist}:00+05:30`;
  const startDate = new Date(matchTimeStr);
  
  // Default match length: 2 hours (120 minutes)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  const formatUTC = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  
  const dates = `${formatUTC(startDate)}/${formatUTC(endDate)}`;
  const location = `${match.venue}, USA/Canada/Mexico`;
  const details = `FIFA World Cup 2026 Group Stage Match\n\nKickoff: ${match.time_ist} IST\nGroup/Stage: ${match.group_name === 'Knockout' ? match.stage : match.group_name}\nVenue: ${match.venue}\n\nAdded via FIFA World Cup 2026 Planner.`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}
