"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function DateCalculator() {
  const [baseDate, setBaseDate] = useState('');
  const [days, setDays] = useState('0');
  const [resultDate, setResultDate] = useState<string | null>(null);

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
          
          <h1 className="text-2xl font-semibold mb-8 text-[var(--foreground)]">日期推算</h1>
          
          <div className="space-y-6 bg-[var(--background-elevated)] p-6 rounded-2xl shadow-sm dark:shadow-none border border-[var(--border)] backdrop-blur-xl">
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