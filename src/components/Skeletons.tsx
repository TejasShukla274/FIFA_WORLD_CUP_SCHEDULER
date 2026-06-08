import React from 'react';

export function MatchCardSkeleton() {
  return (
    <div className="glass-card p-5 border border-border-card h-[220px] flex flex-col justify-between animate-skeleton">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-20 bg-white/5 rounded"></div>
        <div className="h-4 w-4 bg-white/5 rounded-full"></div>
      </div>
      
      {/* Teams Info */}
      <div className="flex items-center justify-between gap-2 py-2 mb-4">
        <div className="flex flex-col items-center flex-1">
          <div className="h-8 w-8 bg-white/5 rounded-full mb-1"></div>
          <div className="h-2.5 w-12 bg-white/5 rounded"></div>
        </div>
        <div className="h-5 w-10 bg-white/5 rounded"></div>
        <div className="flex flex-col items-center flex-1">
          <div className="h-8 w-8 bg-white/5 rounded-full mb-1"></div>
          <div className="h-2.5 w-12 bg-white/5 rounded"></div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="border-t border-white/5 pt-3 space-y-1">
        <div className="h-2.5 w-24 bg-white/5 rounded"></div>
        <div className="flex justify-between">
          <div className="h-2.5 w-16 bg-white/5 rounded"></div>
          <div className="h-2.5 w-12 bg-white/5 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function MatchGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="glass-card p-5 border border-border-card animate-skeleton">
      <div className="h-5 w-20 bg-white/5 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-5 bg-white/5 rounded"></div>
              <div className="h-3 w-20 bg-white/5 rounded"></div>
            </div>
            <div className="h-3 w-8 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
