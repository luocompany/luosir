"use client";

import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-semibold mb-8">AI 工具集</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Assistant Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 hover:scale-[1.02] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="text-[var(--blue-accent)] mb-6">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">Email Assistant</h3>
                <p className="text-[var(--foreground)]/60 mb-6">
                  AI驱动的邮件写作助手，让您的沟通更专业高效
                </p>
                <a 
                  href="/mail" 
                  className="inline-flex items-center px-6 py-3 bg-[var(--blue-accent)] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  立即使用
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Coming Soon Card */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
                <div className="text-[var(--foreground)]/40 mb-6">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3">敬请期待</h3>
                <p className="text-[var(--foreground)]/60">
                  更多AI工具正在开发中...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 