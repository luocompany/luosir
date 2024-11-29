"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import WorldClock from '../../components/WorldClock';
import Footer from '../../components/Footer';

export default function WorldClockPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/tools" 
              className="inline-flex items-center text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              返回
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">世界时钟</h1>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <WorldClock />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 