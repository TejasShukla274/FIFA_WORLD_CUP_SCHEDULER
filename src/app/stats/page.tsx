'use client';

import React from 'react';
import StatisticsView from '../../components/StatisticsView';
import { BarChart3 } from 'lucide-react';

export default function StatsPage() {
  return (
    <div className="space-y-8 page-transition">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
          <BarChart3 className="text-brand-gold" /> Tournament Stats & Leaderboard
        </h1>
        <p className="text-text-muted mt-1.5 text-sm">
          Follow scoring records, defense statistics, and real-time tournament achievements.
        </p>
      </div>

      {/* Stats View */}
      <StatisticsView />
    </div>
  );
}
