"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeZoneData {
  name: string;
  displayName: string;
  timezone: string;
  label: string;
  diffText?: string;
}

const defaultCities: TimeZoneData[] = [
  { 
    name: 'London', 
    displayName: 'London', 
    timezone: 'Europe/London', 
    label: 'GMT',
    diffText: '比北京慢8小时'
  },
  { 
    name: 'Shanghai', 
    displayName: 'Shanghai', 
    timezone: 'Asia/Shanghai', 
    label: 'GMT+8',
    diffText: '当前时间'
  },
  { 
    name: 'Kolkata', 
    displayName: 'Kolkata', 
    timezone: 'Asia/Kolkata', 
    label: 'GMT+5:30',
    diffText: '比北京慢2.5小时'
  },
  { 
    name: 'Hamburg', 
    displayName: 'Hamburg', 
    timezone: 'Europe/Berlin', 
    label: 'GMT+1',
    diffText: '比北京慢7小时'
  }
];

export default function WorldClock() {
  const [times, setTimes] = useState<{[key: string]: {time: string, date: string}}>({});
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: {[key: string]: {time: string, date: string}} = {};
      defaultCities.forEach(city => {
        try {
          const now = new Date();
          const time = now.toLocaleTimeString('en-US', {
            timeZone: city.timezone,
            hour12: !is24Hour,
            hour: '2-digit',
            minute: '2-digit'
          });

          const date = now.toLocaleDateString('en-US', {
            timeZone: city.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          newTimes[city.name] = { time, date };
        } catch (e) {
          newTimes[city.name] = { time: '--:--', date: '' };
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
        >
          <Clock className="h-4 w-4" />
          {is24Hour ? '12小时制' : '24小时制'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultCities.map(city => (
          <div 
            key={city.name} 
            className="relative bg-white dark:bg-[var(--card-bg)] rounded-2xl p-8 text-center shadow-sm overflow-hidden group hover:shadow-md transition-all"
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* 内容 */}
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-[var(--foreground)]">
                {city.displayName}
              </h3>
              <p className="text-sm text-[var(--foreground)]/60 mt-1">
                {times[city.name]?.date}
              </p>
              <div className="text-6xl font-mono font-bold mt-4 mb-3 text-[var(--foreground)] tracking-tight">
                {times[city.name]?.time}
              </div>
              <div className="space-y-1">
                <p className="text-[var(--foreground)]/60">
                  {city.label}
                </p>
                {city.diffText && (
                  <p className="text-sm text-[var(--foreground)]/50">
                    {city.diffText}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 