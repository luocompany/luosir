"use client";

import Navbar from '../components/Navbar';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Tools() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 工具链接区域 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">实用工具</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/tools/date-tools" 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 
                    hover:border-gray-300 dark:hover:border-gray-600
                    transition-colors duration-200 flex items-center space-x-3
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
                  <span className="text-xl">📅</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">交货期计算器</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">日期差值推算与计算</p>
                  </div>
                </Link>
                <Link href="/tools/number-to-english" 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 
                    hover:border-gray-300 dark:hover:border-gray-600
                    transition-colors duration-200 flex items-center space-x-3
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
                  <span className="text-xl">💰</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">美金大写金额</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">将数字转换为英文表达</p>
                  </div>
                </Link>
                <Link href="/tools/number-to-chinese" 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 
                    hover:border-gray-300 dark:hover:border-gray-600
                    transition-colors duration-200 flex items-center space-x-3
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
                  <span className="text-xl">💴</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">人民币大写金额</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">将数字转换为中文表达</p>
                  </div>
                </Link>
                <Link href="/tools/world-clock" 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 
                    hover:border-gray-300 dark:hover:border-gray-600
                    transition-colors duration-200 flex items-center space-x-3
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
                  <span className="text-xl">🕒</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">世界时钟</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">查看世界各地的时间</p>
                  </div>
                </Link>
                <Link href="/go" 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 
                    hover:border-gray-300 dark:hover:border-gray-600
                    transition-colors duration-200 flex items-center space-x-3
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
                  <span className="text-xl">🔗</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">LC 网址导航</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">超实用网站导航</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 