"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Quotation() {
  const [activeTab, setActiveTab] = useState('quotation'); // quotation 或 confirmation

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-6 py-10 mt-14 flex-grow">
        {/* 返回按钮 */}
        <div className="flex items-center mb-8">
          <Link 
            href="/" 
            className="group inline-flex items-center px-4 py-2 rounded-full 
                    bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                    border border-gray-200/50 dark:border-gray-700/50 
                    text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
                    transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>
        </div>

        {/* 标签切换 */}
        <div className="flex justify-center gap-3 mb-6">
          <button 
            onClick={() => setActiveTab('quotation')}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'quotation' 
                ? 'bg-[var(--blue-accent)] text-white' 
                : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            报价表
          </button>
          <button 
            onClick={() => setActiveTab('confirmation')}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'confirmation' 
                ? 'bg-[var(--blue-accent)] text-white' 
                : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            订单确认表
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6">
          {activeTab === 'quotation' ? (
            <div className="space-y-6">
              {/* 报价表表单 */}
              <h2 className="text-xl font-semibold text-[var(--foreground)]">生成报价表</h2>
              {/* TODO: 添加报价表表单内容 */}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 订单确认表表单 */}
              <h2 className="text-xl font-semibold text-[var(--foreground)]">生成订单确认表</h2>
              {/* TODO: 添加订单确认表表单内容 */}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 