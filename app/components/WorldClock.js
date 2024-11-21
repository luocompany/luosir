import React, { useEffect, useState } from 'react';

const cities = [
  { name: 'London', timezone: 'Europe/London', label: 'GMT' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai', label: 'GMT+8' },
  { name: 'Kolkata', timezone: 'Asia/Kolkata', label: 'GMT+5:30' },
  { name: 'Hamburg', timezone: 'Europe/Berlin', label: 'GMT+1' },
];

function WorldClock() {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      cities.forEach(city => {
        const date = new Date().toLocaleString('en-US', { timeZone: city.timezone });
        newTimes[city.name] = new Date(date).toLocaleTimeString();
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
      <h3 className="text-xl font-medium mb-3 text-white">World Clock</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cities.map(city => (
          <div key={city.name} className="bg-gray-900 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-medium text-white">{city.name}</h4>
            <p className="text-3xl font-bold text-white">{times[city.name]}</p>
            <p className="text-gray-400">{city.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldClock;
