"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-6">
            <Link 
              href="/tools" 
              className="inline-flex items-center text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
              style={{ fontSize: '16px', fontWeight: '500' }}
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              返回
            </Link>
          </div>
          
          <h1 className="text-2xl font-semibold mb-8 text-[var(--foreground)]">日期计算器</h1>
          
          {/* 日期差值计算部分 */}
          <div className="space-y-6 bg-[var(--background-elevated)] p-6 rounded-2xl shadow-sm dark:shadow-none border border-[var(--border)] backdrop-blur-xl mb-8">
            <h2 className="text-xl font-semibold">计算日期差值</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                第一个日期
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                第二个日期
              </label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
              />
            </div>

            {diffDays !== null && (
              <div className="mt-6 p-4 rounded-xl bg-[var(--background-elevated)] border border-[var(--border)]">
                <p className="text-center text-lg font-medium text-[var(--foreground)]">
                  相差 <span className="text-blue-500 font-semibold">{diffDays}</span> 天
                </p>
              </div>
            )}
          </div>

          {/* 日期推算部分 */}
          <div className="space-y-6 bg-[var(--background-elevated)] p-6 rounded-2xl shadow-sm dark:shadow-none border border-[var(--border)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold">日期推算</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                起始日期
              </label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                天数: {days}天
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="-365"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-20 p-2 rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-center"
                />
              </div>
            </div>

            {resultDate && (
              <div className="mt-6 p-4 rounded-xl bg-[var(--background-elevated)] border border-[var(--border)]">
                <p className="text-center text-lg font-medium text-[var(--foreground)]">
                  {days}天{parseInt(days) >= 0 ? '后' : '前'}是: <span className="text-blue-500 font-semibold">{resultDate}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 