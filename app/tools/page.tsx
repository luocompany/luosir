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
                <Link href="/tools/number-to-english" 
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 
                    transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-xl">🔢</span>
                  <div>
                    <h3 className="font-medium">数字转英文</h3>
                    <p className="text-sm text-gray-500">将数字转换为英文表达</p>
                  </div>
                </Link>
                <Link href="/tools/number-to-chinese" 
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 
                    transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-xl">🔢</span>
                  <div>
                    <h3 className="font-medium">数字转中文</h3>
                    <p className="text-sm text-gray-500">将数字转换为中文表达</p>
                  </div>
                </Link>
                <Link href="/tools/world-clock" 
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 
                    transition-colors duration-200 flex items-center space-x-3">
                  <span className="text-xl">🕒</span>
                  <div>
                    <h3 className="font-medium">世界时钟</h3>
                    <p className="text-sm text-gray-500">查看世界各地的时间</p>
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