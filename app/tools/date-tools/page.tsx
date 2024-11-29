"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';
import './styles.css';

export default function DateTools() {
  // 日期差值计算的状态
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [diffDays, setDiffDays] = useState<number | null>(null);

  // 日期推算的状态
  const [baseDate, setBaseDate] = useState('');
  const [days, setDays] = useState('');
  const [resultDate, setResultDate] = useState<string | null>(null);

  // 添加一个格式化日期的函数
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

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

  // 修改日期推算的效果
  useEffect(() => {
    if (baseDate && days !== '') {
      try {
        const date = new Date(baseDate);
        // 确保 days 是有效数字
        const daysNum = parseInt(days) || 0;
        // 使用 UTC 时间来避免时区问题
        const utcDate = new Date(Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + daysNum
        ));
        // 格式化日期
        const resultDateStr = utcDate.toISOString().split('T')[0];
        setResultDate(resultDateStr);
      } catch (error) {
        console.error('Date calculation error:', error);
        setResultDate(null);
      }
    } else {
      setResultDate(null);
    }
  }, [baseDate, days]);

  // 修改按钮点击处理函数
  const handleDaysChange = (change: number) => {
    setDays(prev => {
      const currentDays = prev === '' ? 0 : parseInt(prev);
      return (currentDays + change).toString();
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/90 via-white/60 to-gray-100/90 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-800">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="max-w-full mx-auto">
          {/* 返回按钮优化 */}
          <div className="flex items-center mb-8 sm:mb-12">
            <Link 
              href="/tools" 
              className="group inline-flex items-center px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-sm font-medium">返回</span>
            </Link>
          </div>

          {/* 网格布局优化 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* 日期差值计算部分 - 优化卡片样式 */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-fit hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                计算日期差值
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <div className="date-input-wrapper group">
                      <input
                        id="date1"
                        type="date"
                        value={date1}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          setDate1(newDate);
                          e.target.value = formatDate(newDate);
                        }}
                        className="custom-date-input w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 
                          bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all 
                          hover:border-blue-500/50 appearance-none pl-12 text-base h-12"
                      />
                      <span className="date-placeholder">结束日期</span>
                      <svg 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500/70 transition-colors"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <span className="text-gray-600 dark:text-gray-300 text-lg font-medium select-none">-</span>
                  </div>

                  <div className="relative flex-1">
                    <div className="date-input-wrapper">
                      <input
                        id="date2"
                        type="date"
                        value={date2}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          setDate2(newDate);
                          e.target.value = formatDate(newDate);
                        }}
                        className="custom-date-input w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 
                          bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all 
                          hover:border-blue-500/50 appearance-none pl-12 text-base h-12"
                      />
                      <span className="date-placeholder">开始日期</span>
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
                  <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50/90 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-900/10 backdrop-blur-xl border border-blue-100/80 dark:border-blue-800/30">
                    <p className="text-center text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                      计算结果：相差
                      <span className="text-blue-600 dark:text-blue-400 font-semibold mx-2">{diffDays}</span>
                      天
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 日期推算部分 - 优化卡片样式 */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-fit hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                日期推算
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <div className="date-input-wrapper">
                      <input
                        id="baseDate"
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        className="custom-date-input w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 
                          bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all 
                          hover:border-blue-500/50 appearance-none pl-12 text-base h-12"
                      />
                      <span className="date-placeholder">开始日期</span>
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

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <span className="text-gray-600 dark:text-gray-300 text-lg font-medium select-none">-</span>
                  </div>

                  <div className="relative flex-1">
                    <div className="relative">
                      <input
                        id="daysInput"
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 
                          bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all 
                          hover:border-blue-500/50 text-center text-base h-12"
                      />
                      {!days && (
                        <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-gray-400 text-center pointer-events-none">
                          间隔天数
                        </span>
                      )}
                      {days && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">天</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
                  <div className="relative px-2">
                    <input
                      type="range"
                      min="-365"
                      max="365"
                      step="1"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="range-input"
                    />
                  </div>

                  <div className="flex items-center justify-between px-2 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDaysChange(-30)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        -1月
                      </button>
                      <button
                        onClick={() => handleDaysChange(-7)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        -1周
                      </button>
                      <button
                        onClick={() => handleDaysChange(-1)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        -1天
                      </button>
                    </div>

                    <button
                      onClick={() => setDays('0')}
                      className="px-3 py-1 text-sm rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium"
                    >
                      当天
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDaysChange(1)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        +1天
                      </button>
                      <button
                        onClick={() => handleDaysChange(7)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        +1周
                      </button>
                      <button
                        onClick={() => handleDaysChange(30)}
                        className="px-2 py-1 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        +1月
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {resultDate && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-100 dark:border-blue-800/50">
                  <p className="text-center text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                    {days}天{parseInt(days) >= 0 ? '后' : '前'}是: 
                    <span className="text-blue-600 dark:text-blue-400 font-semibold ml-2">{formatDate(resultDate)}</span>
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