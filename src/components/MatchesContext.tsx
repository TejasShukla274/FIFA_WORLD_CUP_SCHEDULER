'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Match } from '../lib/data';
import { getMatches, updateMatchScore as rawUpdateMatchScore, resetMatchesData as rawResetMatchesData } from '../lib/supabase';

interface MatchesContextType {
  matches: Match[];
  loading: boolean;
  refreshMatches: () => Promise<void>;
  updateScore: (matchId: string, score1: number | null, score2: number | null, isCompleted: boolean) => Promise<boolean>;
  resetMatches: () => Promise<boolean>;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const refreshMatches = useCallback(async () => {
    try {
      const data = await getMatches();
      if (isMounted.current) {
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Update a match score and immediately reflect it in state
  const updateScore = useCallback(async (
    matchId: string,
    score1: number | null,
    score2: number | null,
    isCompleted: boolean
  ): Promise<boolean> => {
    const success = await rawUpdateMatchScore(matchId, score1, score2, isCompleted);
    if (success) {
      // Optimistically update local state so all consumers re-render instantly
      setMatches(prev => prev.map(m =>
        m.id === matchId
          ? { ...m, team1_score: score1, team2_score: score2, is_completed: isCompleted }
          : m
      ));
    }
    return success;
  }, []);

  // Reset all matches
  const resetMatches = useCallback(async (): Promise<boolean> => {
    const success = await rawResetMatchesData();
    if (success) {
      await refreshMatches();
    }
    return success;
  }, [refreshMatches]);

  // Initial load
  useEffect(() => {
    isMounted.current = true;
    refreshMatches();
    return () => {
      isMounted.current = false;
    };
  }, [refreshMatches]);

  // Also listen for the legacy 'matches-updated' event for backwards compatibility
  // (e.g., if something else dispatches it directly)
  useEffect(() => {
    const handler = () => refreshMatches();
    window.addEventListener('matches-updated', handler);
    return () => window.removeEventListener('matches-updated', handler);
  }, [refreshMatches]);

  return (
    <MatchesContext.Provider value={{ matches, loading, refreshMatches, updateScore, resetMatches }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
}
