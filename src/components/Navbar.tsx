'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Search, Star, Home, Users, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Groups', href: '/groups', icon: Users },
    { name: 'Stats', href: '/stats', icon: BarChart3 },
    { name: 'Team Search', href: '/search', icon: Search },
    { name: 'Favorites', href: '/favorites', icon: Star },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="nav-bar sticky top-0 z-50 bg-bg-main/80 backdrop-blur-xl border-b border-border-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
            {/* Soccer ball icon */}
            <div className="relative flex items-center gap-1">
              <span className="text-xl">⚽</span>
              {/* Red and green accent dots like FIFA branding */}
              <div className="flex flex-col gap-[2px]">
                <div className="w-[6px] h-[6px] rounded-full bg-brand-crimson"></div>
                <div className="w-[6px] h-[6px] rounded-full bg-brand-green"></div>
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-text-main group-hover:text-brand-gold transition-colors">
              FWC 26 Planner
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-brand-gold'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
                  }`}
                >
                  <Icon size={15} />
                  {link.name}
                  {/* Active underline indicator */}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-brand-gold" />
                  )}
                </Link>
              );
            })}
            <div className="pl-3 ml-2 border-l border-border-card">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-hover cursor-pointer interactive-scale"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border-card bg-bg-main/95 backdrop-blur-lg page-transition">
          <div className="px-3 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    active
                      ? 'bg-brand-gold/10 text-brand-gold border-l-4 border-brand-gold'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
