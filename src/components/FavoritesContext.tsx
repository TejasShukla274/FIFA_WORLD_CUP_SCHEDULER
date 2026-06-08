'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (teamId: string) => void;
  isFavorite: (teamId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('fifa_2026_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleFavorite = (teamId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(teamId);
      const next = isFav 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId];
      localStorage.setItem('fifa_2026_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (teamId: string) => {
    return favorites.includes(teamId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
