"use client";
import Navbar from './components/Navbar';
import Card from './components/Card';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-12">
        <section className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-semibold mb-4">AI 工具集</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Card
                title="Email Assistant"
                description="AI驱动的邮件写作助手，让您的沟通更专业高效"
                href="/mail"
                iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                buttonText="立即使用"
              />

              <Card
                title="实用工具集"
                description="数字转换、世界时钟等多个便捷工具"
                href="/tools"
                iconPath="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                buttonText="立即使用"
              />

              <Card
                title="来单助手"
                description="自动生成报价表和订单确认表，提升工作效率"
                href="/quotation"
                iconPath="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                buttonText="立即使用"
              />

              <Card
                title="发票助手"
                description="智能化发票管理与生成工具，轻松处理发票相关事务"
                href="/invoice"
                iconPath="M9 14V5a2 2 0 012-2h6a2 2 0 012 2v9m-9 0l-5 5v-9a2 2 0 012-2h3m11 0v9l-5-5m5 5v-9a2 2 0 00-2-2h-3"
                buttonText="立即使用"
              />

              <Card
                title="敬请期待"
                description="更多AI工具正在开发中..."
                iconPath="M12 6v6m0 0v6m0-6h6m-6 0H6"
                isComingSoon
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 