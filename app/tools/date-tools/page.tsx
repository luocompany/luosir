"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';

// 在组件内添加自定义样式
const dateInputStyles = `
  .custom-date-input::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
`;

export default function DateTools() {
  // 日期差值计算的状态
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [diffDays, setDiffDays] = useState<number | null>(null);

  // 日期推算的状态
  const [baseDate, setBaseDate] = useState('');
  const [days, setDays] = useState('0');
  const [resultDate, setResultDate] = useState<string | null>(null);

  // 日期差值计算的效果
  useEffect(() => {
    if (date1 && date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDiffDays(diffDays);
    } else {
      setDiffDays(null);
    }
  }, [date1, date2]);

  // 日期推算的效果
  useEffect(() => {
    if (baseDate && days) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + parseInt(days));
      setResultDate(date.toISOString().split('T')[0]);
    } else {
      setResultDate(null);
    }
  }, [baseDate, days]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <style>{dateInputStyles}</style>
      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4 sm:mb-8">
            <Link 
              href="/tools" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
              <span className="text-sm sm:text-base font-medium">返回</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* 日期差值计算部分 */}
            <div className="space-y-4 sm:space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">计算日期差值</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    第一个日期
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                      className="custom-date-input w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-blue-500/50 appearance-none pl-10 sm:pl-12 text-sm sm:text-base"
                    />
                    <svg 
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    第二个日期
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date2}
                      onChange={(e) => setDate2(e.target.value)}
                      className="custom-date-input w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-blue-500/50 appearance-none pl-10 sm:pl-12 text-sm sm:text-base"
                    />
                    <svg 
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {diffDays !== null && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-100 dark:border-blue-800/50">
                  <p className="text-center text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                    相差 <span className="text-blue-600 dark:text-blue-400 font-semibold">{diffDays}</span> 天
                  </p>
                </div>
              )}
            </div>

            {/* 日期推算部分 */}
            <div className="space-y-4 sm:space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">日期推算</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    起始日期
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                      className="custom-date-input w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-blue-500/50 appearance-none pl-10 sm:pl-12 text-sm sm:text-base"
                    />
                    <svg 
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    天数: {days}天
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <input
                      type="range"
                      min="-365"
                      max="365"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600 transition-all"
                    />
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-20 sm:w-24 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-center hover:border-blue-500/50 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {resultDate && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-100 dark:border-blue-800/50">
                  <p className="text-center text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                    {days}天{parseInt(days) >= 0 ? '后' : '前'}是: 
                    <span className="text-blue-600 dark:text-blue-400 font-semibold ml-2">{resultDate}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 