"use client";
import Navbar from './components/Navbar';
import Card from './components/Card';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-semibold mb-8">AI 工具集</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                title="Email Assistant"
                description="AI驱动的邮件写作助手，让您的沟通更专业高效"
                href="/mail"
                iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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