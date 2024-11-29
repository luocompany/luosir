"use client";

import Link from 'next/link';
import Footer from '../../components/Footer';
import WorldClock from '../../components/WorldClock';
import { ArrowLeft } from 'lucide-react';

export default function WorldClockPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <div className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center mb-4">
              <Link 
                href="/tools" 
                className="inline-flex items-center text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                style={{ fontSize: '16px', fontWeight: '500' }}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                返回
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WorldClock />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 