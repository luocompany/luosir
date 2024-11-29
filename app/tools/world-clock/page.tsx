"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import WorldClock from '../../components/WorldClock';
import Footer from '../../components/Footer';

export default function WorldClockPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Link 
            href="/tools" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 
                     dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">返回</span>
          </Link>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl">
          <WorldClock />
        </div>
      </main>
      <Footer />
    </div>
  );
} 