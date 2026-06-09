'use client';

import React from 'react';
import { LiveMatchData } from '../../lib/footballApi';
import { Newspaper, CalendarDays, ExternalLink } from 'lucide-react';

interface MatchNewsTabProps {
  data: LiveMatchData;
}

export default function MatchNewsTab({ data }: MatchNewsTabProps) {
  const { news } = data;

  if (news.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl bg-bg-hover border border-border-card space-y-2">
        <span className="text-3xl">📰</span>
        <h4 className="text-sm font-bold text-text-main">No Match News Available</h4>
        <p className="text-xs text-text-muted">
          Check back closer to match kickoff for pre-match reports and updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase text-text-muted tracking-wider border-b border-border-card pb-3 flex items-center gap-2">
        <Newspaper size={16} className="text-brand-gold" /> Latest Coverage & Reports
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((n) => (
          <div 
            key={n.id} 
            className="glass-card p-5 border border-border-card flex flex-col justify-between hover:border-brand-gold/30 hover:shadow-gold-glow/5 transition-all duration-300"
          >
            <div className="space-y-3">
              {/* Header: source & time */}
              <div className="flex items-center justify-between text-[10px] text-text-dark font-extrabold uppercase tracking-wider">
                <span className="text-brand-gold">{n.source}</span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={10} /> {n.time}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-text-main leading-snug group-hover:text-brand-gold hover:underline cursor-pointer">
                  {n.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {n.summary}
                </p>
              </div>
            </div>

            {/* Read more button */}
            <div className="mt-4 pt-3 border-t border-border-card flex justify-end">
              <a 
                href="#read-more" 
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-brand-gold hover:text-brand-gold-hover transition-colors"
              >
                <span>Read Full Coverage</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
