'use client';

import React, { useEffect, useState } from 'react';
import { getMatches } from '../../lib/supabase';
import { Match, GROUP_LETTERS, TEAMS, Team } from '../../lib/data';
import { GroupCardSkeleton } from '../../components/Skeletons';
import Link from 'next/link';
import { Users, Info } from 'lucide-react';

interface Standing {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export default function GroupsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('matches-updated', loadData);
    return () => window.removeEventListener('matches-updated', loadData);
  }, []);

  // Standings calculator
  const calculateGroupStandings = (groupLetter: string): Standing[] => {
    const groupTeams = TEAMS.filter(t => t.group === groupLetter);
    const groupMatches = matches.filter(m => m.group_name === `Group ${groupLetter}`);
    
    const standings: Record<string, Standing> = {};

    // Initialize standings structures
    groupTeams.forEach(team => {
      standings[team.id] = {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0
      };
    });

    // Compute stats
    groupMatches.forEach(m => {
      if (!m.is_completed || m.team1_score === null || m.team1_score === undefined || m.team2_score === null || m.team2_score === undefined) return;
      
      const t1 = m.team1;
      const t2 = m.team2;
      const s1 = m.team1_score;
      const s2 = m.team2_score;

      if (standings[t1] && standings[t2]) {
        standings[t1].played += 1;
        standings[t2].played += 1;
        standings[t1].gf += s1;
        standings[t1].ga += s2;
        standings[t2].gf += s2;
        standings[t2].ga += s1;

        if (s1 > s2) {
          standings[t1].won += 1;
          standings[t1].pts += 3;
          standings[t2].lost += 1;
        } else if (s2 > s1) {
          standings[t2].won += 1;
          standings[t2].pts += 3;
          standings[t1].lost += 1;
        } else {
          standings[t1].drawn += 1;
          standings[t1].pts += 1;
          standings[t2].drawn += 1;
          standings[t2].pts += 1;
        }
      }
    });

    // Compute goal difference
    Object.keys(standings).forEach(id => {
      standings[id].gd = standings[id].gf - standings[id].ga;
    });

    // Sort: pts -> gd -> gf -> name
    return Object.values(standings).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.name.localeCompare(b.team.name);
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
          <Users className="text-brand-gold" /> Tournament Groups
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          Groups A through L. Top 2 from each group plus the 8 best 3rd placed teams advance to the Round of 32.
        </p>
      </div>

      {/* Grid of groups */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {GROUP_LETTERS.map(letter => (
            <GroupCardSkeleton key={letter} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {GROUP_LETTERS.map(letter => {
            const standings = calculateGroupStandings(letter);
            return (
              <div key={letter} className="glass-card overflow-hidden p-5 border border-border-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-border-card pb-3 mb-4">
                    <h2 className="text-lg font-black text-text-main">Group {letter}</h2>
                    <Link
                      href={`/calendar?group=${letter}`}
                      className="text-[10px] font-extrabold uppercase text-brand-gold hover:text-brand-gold-hover transition-colors"
                    >
                      View matches &rarr;
                    </Link>
                  </div>

                  {/* Standing Table */}
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-text-dark font-black uppercase tracking-wider border-b border-border-card pb-2">
                        <th className="pb-2 w-[45%]">Team</th>
                        <th className="pb-2 text-center">P</th>
                        <th className="pb-2 text-center">GD</th>
                        <th className="pb-2 text-center text-brand-gold">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-card">
                      {standings.map((row, idx) => (
                        <tr key={row.team.id} className="hover:bg-bg-hover transition-colors">
                          <td className="py-2.5 font-bold flex items-center gap-2 text-text-main">
                            <span className="text-text-muted font-bold text-[10px] w-3">{idx + 1}</span>
                            <Link 
                              href={`/teams/${row.team.id}`}
                              className="flex items-center gap-2 hover:text-brand-gold hover:underline cursor-pointer truncate max-w-[150px]"
                            >
                              <span className="text-lg leading-none select-none">{row.team.flag}</span>
                              <span>{row.team.name}</span>
                            </Link>
                          </td>
                          <td className="py-2.5 text-center text-text-muted font-bold">{row.played}</td>
                          <td className={`py-2.5 text-center font-bold ${row.gd > 0 ? 'text-brand-green' : row.gd < 0 ? 'text-brand-crimson' : 'text-text-muted'}`}>
                            {row.gd > 0 ? `+${row.gd}` : row.gd}
                          </td>
                          <td className="py-2.5 text-center text-brand-gold font-extrabold">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-border-card flex items-center gap-2 text-[10px] text-text-muted">
                  <Info size={12} className="text-brand-gold" />
                  <span>Rank 1-2 advance. Matches simulated dynamically.</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
