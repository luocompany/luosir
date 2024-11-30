"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Footer from '../../components/Footer';

// 动态导入 WorldClock 组件
const WorldClock = dynamic(() => import('../../components/WorldClock'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  )
});

export default function WorldClockPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/90 via-white/60 to-gray-100/90 
                    dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900/90">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8 sm:mb-12">
          <Link 
            href="/tools" 
            className="group inline-flex items-center px-4 py-2 rounded-full 
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                      border border-gray-200/50 dark:border-gray-700/50 
                      text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
                      transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">返回</span>
          </Link>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl 
                      rounded-[2rem] shadow-xl 
                      border border-gray-200/50 dark:border-gray-700/50 
                      hover:shadow-2xl transition-all duration-500">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 
                            border-gray-900 dark:border-gray-100"></div>
            </div>
          }>
            <WorldClock />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
} 