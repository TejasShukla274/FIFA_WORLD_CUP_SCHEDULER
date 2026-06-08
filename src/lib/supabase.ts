import { createClient } from '@supabase/supabase-js';
import { MATCHES, Match } from './data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

const supabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const MOCK_STORAGE_KEY = 'fifa_2026_matches';

export const getMatches = async (): Promise<Match[]> => {
  if (isSupabaseConfigured && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('matches')
      .select('*')
      .order('id');
    if (!error && data) {
      // Map database schema fields to frontend fields if they differ slightly
      return data.map((d: any) => ({
        id: d.id,
        date: d.date,
        time_ist: d.time_ist,
        team1: d.team1,
        team2: d.team2,
        venue: d.venue,
        group_name: d.group_name,
        stage: d.stage,
        team1_score: d.team1_score,
        team2_score: d.team2_score,
        is_completed: d.is_completed ?? (d.team1_score !== null && d.team2_score !== null)
      })) as Match[];
    }
    console.error('Supabase fetch error, falling back to local storage:', error);
  }
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(MATCHES));
  }
  return MATCHES;
};

export const updateMatchScore = async (
  matchId: string, 
  score1: number | null, 
  score2: number | null, 
  isCompleted: boolean
): Promise<boolean> => {
  if (isSupabaseConfigured && supabaseClient) {
    const { error } = await supabaseClient
      .from('matches')
      .update({
        team1_score: score1,
        team2_score: score2,
        is_completed: isCompleted
      })
      .eq('id', matchId);
    if (!error) return true;
    console.error('Supabase update error:', error);
  }

  if (typeof window !== 'undefined') {
    const matches = await getMatches();
    const index = matches.findIndex(m => m.id === matchId);
    if (index !== -1) {
      matches[index] = {
        ...matches[index],
        team1_score: score1,
        team2_score: score2,
        is_completed: isCompleted
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(matches));
      window.dispatchEvent(new Event('matches-updated'));
      return true;
    }
  }
  return false;
};

export const resetMatchesData = async (): Promise<boolean> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(MATCHES));
    window.dispatchEvent(new Event('matches-updated'));
    return true;
  }
  return false;
};
