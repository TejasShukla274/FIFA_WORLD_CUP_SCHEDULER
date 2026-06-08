'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDateStr: string; // E.g., '2026-06-11T18:30:00+05:30'
}

export default function Countdown({ targetDateStr }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOver: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (timeLeft.isOver) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded bg-brand-green/10 text-brand-green border border-brand-green/20 text-xs font-extrabold uppercase tracking-wide">
        ⚽ Match Active / Over
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base font-extrabold text-brand-gold bg-white/5 border border-white/5 px-2 py-0.5 rounded shadow-inner min-w-[28px] sm:min-w-[34px] text-center">
          {timeLeft.days.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">D</span>
      </div>
      <span className="text-white/20 font-bold pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base font-extrabold text-brand-gold bg-white/5 border border-white/5 px-2 py-0.5 rounded shadow-inner min-w-[28px] sm:min-w-[34px] text-center">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">H</span>
      </div>
      <span className="text-white/20 font-bold pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base font-extrabold text-brand-gold bg-white/5 border border-white/5 px-2 py-0.5 rounded shadow-inner min-w-[28px] sm:min-w-[34px] text-center">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">M</span>
      </div>
      <span className="text-white/20 font-bold pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-sm sm:text-base font-extrabold text-brand-gold bg-white/5 border border-white/5 px-2 py-0.5 rounded shadow-inner min-w-[28px] sm:min-w-[34px] text-center">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">S</span>
      </div>
    </div>
  );
}
