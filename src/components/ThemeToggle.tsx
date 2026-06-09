'use client';

import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-text-muted hover:text-brand-gold hover:bg-bg-hover flex items-center justify-center transition-all cursor-pointer interactive-scale"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="transition-transform hover:rotate-45" />
      ) : (
        <Moon size={18} className="transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
