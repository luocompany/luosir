"use client";

import React, { useEffect, useState } from 'react';
import { Settings, X, Plus } from 'lucide-react';

// 简化为扁平的时区列表
const availableTimezones = [
  { name: '上海', timezone: 'Asia/Shanghai', label: 'GMT+8' },
  { name: '北京', timezone: 'Asia/Shanghai', label: 'GMT+8' },
  { name: '东京', timezone: 'Asia/Tokyo', label: 'GMT+9' },
  { name: '新德里', timezone: 'Asia/Kolkata', label: 'GMT+5:30' },
  { name: '迪拜', timezone: 'Asia/Dubai', label: 'GMT+4' },
  { name: '伦敦', timezone: 'Europe/London', label: 'GMT' },
  { name: '巴黎', timezone: 'Europe/Paris', label: 'GMT+2' },
  { name: '柏林', timezone: 'Europe/Berlin', label: 'GMT+2' },
  { name: '纽约', timezone: 'America/New_York', label: 'GMT-4' },
  { name: '洛杉矶', timezone: 'America/Los_Angeles', label: 'GMT-7' },
  { name: '温哥华', timezone: 'America/Vancouver', label: 'GMT-7' },
  { name: '多伦多', timezone: 'America/Toronto', label: 'GMT-4' },
  { name: '悉尼', timezone: 'Australia/Sydney', label: 'GMT+10' },
];

const defaultCities = [
  { name: '伦敦', timezone: 'Europe/London', label: 'GMT' },
  { name: '上海', timezone: 'Asia/Shanghai', label: 'GMT+8' },
  { name: '新德里', timezone: 'Asia/Kolkata', label: 'GMT+5:30' },
  { name: '柏林', timezone: 'Europe/Berlin', label: 'GMT+2' },
];

const buttonClasses = "px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors";

const timeDisplayClasses = "text-gray-800 dark:text-gray-200";

const cityNameClasses = "text-gray-700 dark:text-gray-300";

const cellClasses = "p-4 text-gray-700 dark:text-gray-300";

const linkClasses = "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100";

function WorldClock() {
  const [times, setTimes] = useState({});
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('worldClockCities');
    return saved ? JSON.parse(saved) : defaultCities;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSearchTerm, setSettingsSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('worldClockCities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      cities.forEach(city => {
        try {
          const now = new Date();
          const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: city.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          
          const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: city.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          
          const time = timeFormatter.format(now);
          const date = dateFormatter.format(now);
          newTimes[city.name] = { time, date };
        } catch (e) {
          console.error(`Error formatting time for ${city.name}:`, e);
          newTimes[city.name] = { time: '--:--', date: '----' };
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, [cities]);

  const filteredTimezones = availableTimezones.filter(city => 
    !cities.some(existingCity => existingCity.name === city.name)
  );

  const addCity = (city) => {
    setCities([...cities, city]);
  };

  const removeCity = (cityToRemove) => {
    setCities(cities.filter(city => city.name !== cityToRemove.name));
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">添加城市</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredTimezones.map((city) => (
                <button
                  key={city.name}
                  onClick={() => addCity(city)}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 
                           dark:hover:bg-gray-600 rounded-lg text-left"
                >
                  <div>
                    <span className="text-gray-900 dark:text-white text-sm">{city.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{city.label}</span>
                  </div>
                  <Plus className="h-4 w-4 text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <div 
            key={city.timezone} 
            className="group bg-white dark:bg-gray-700 rounded-xl p-4 shadow-md
                     border border-gray-100 dark:border-gray-600
                     hover:shadow-lg transition-shadow relative"
          >
            {showSettings && (
              <button
                onClick={() => removeCity(city)}
                className="absolute right-2 top-2 p-1 opacity-0 group-hover:opacity-100
                         hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-opacity"
              >
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            )}
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                {city.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">{city.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {times[city.name]?.time || '--:--'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {times[city.name]?.date || '----'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldClock;
