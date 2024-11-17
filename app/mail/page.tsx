"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { Copy, ChevronDown } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('mail');
  const [mailType, setMailType] = useState('formal');
  const [userInput, setUserInput] = useState({
    topic: '',
    language: 'both English and Chinese',
    mail: '',
    replyTo: '',
    reply: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);

  const styles = [
    {
      icon: '🎩',
      name: 'Formal',
      description: 'For official or business correspondence.',
      value: 'formal'
    },
    {
      icon: '📚',
      name: 'Professional',
      description: 'Showcasing expertise or technical discussions.',
      value: 'professional'
    },
    {
      icon: '😊',
      name: 'Friendly',
      description: 'Warm and amicable for known contacts.',
      value: 'friendly'
    },
    {
      icon: '✓',
      name: 'Concise',
      description: 'Direct and to the point for quick replies.',
      value: 'concise'
    },
    {
      icon: '📋',
      name: 'Detailed',
      description: 'Providing thorough information or explanations.',
      value: 'detailed'
    },
    {
      icon: '😎',
      name: 'Informal',
      description: 'Relaxed and casual for personal communication.',
      value: 'informal'
    },
    {
      icon: '💪',
      name: 'Inspirational',
      description: 'Encouraging and positive for motivation.',
      value: 'inspirational'
    }
  ];

  const handleGenerate = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      const requestData = activeTab === 'mail' 
        ? {
            topic: userInput.topic,
            language: userInput.language,
            type: mailType,
            content: userInput.mail,
            mode: 'mail'
          }
        : {
            originalMail: userInput.replyTo,
            replyDraft: userInput.reply,
            mode: 'reply'
          };
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成失败');
      }

      const data = await response.json();
      setGeneratedContent(data.result);

    } catch (error: any) {
      console.error('Generate Error:', error);
      setError(error.message || '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-1 bg-[var(--background)]">
      <div className="w-full max-w-6xl mx-auto px-6 py-10 mt-14">
        <div className="flex gap-6">
          {/* 左侧预览区 */}
          <div className="w-1/2">
            <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6 h-[calc(100vh-12rem)]">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => handleCopy(activeTab === 'mail' ? userInput.mail : userInput.reply)}
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4 text-[var(--foreground)]" />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap h-[calc(100%-3rem)] overflow-y-auto">
                {!isLoading && generatedContent}
              </div>
            </div>
          </div>

          {/* 右侧控制区 */}
          <div className="w-1/2">
            <div className="flex justify-center gap-3 mb-6">
              <button 
                onClick={() => setActiveTab('mail')}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'mail' 
                    ? 'bg-[var(--blue-accent)] text-white' 
                    : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Mail
              </button>
              <button 
                onClick={() => setActiveTab('reply')}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'reply' 
                    ? 'bg-[var(--blue-accent)] text-white' 
                    : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Reply
              </button>
            </div>

            <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6">
              {activeTab === 'mail' ? (
                <div className="space-y-6">
                  {/* 主题输入框 */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-red-500 mr-1">*</span>
                      Write your email content
                    </label>
                    <textarea 
                      value={userInput.mail}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                        setUserInput({ ...userInput, mail: e.target.value })}
                      placeholder="Type your email content here..."
                      className="w-full h-[300px] p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* 语言选择 */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Output language
                    </label>
                    <div className="relative">
                      <select
                        aria-label="Select output language"
                        value={userInput.language || 'English'}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setUserInput({ ...userInput, language: e.target.value })}
                        className="w-full px-3 py-2 appearance-none rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all text-sm"
                      >
                        <option value="both English and Chinese">Both EN & CN</option>
                        <option value="English">English</option>
                        <option value="Chinese">Chinese</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 风格选择 */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Choose a Reply Tone
                    </label>
                    <div className="relative">
                      <button 
                        onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                        className="w-full px-3 py-2 text-left rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all text-sm"
                      >
                        <span className="flex items-center justify-between">
                          <span>{styles.find(s => s.value === mailType)?.name}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStyleMenuOpen ? 'rotate-180' : ''}`} />
                        </span>
                      </button>
                      {isStyleMenuOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg divide-y divide-[var(--card-border)]">
                          {styles.map((style) => (
                            <button
                              key={style.value}
                              onClick={() => {
                                setMailType(style.value);
                                setIsStyleMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-black/5 dark:hover:bg-white/5 text-left"
                            >
                              <span className="text-xl">{style.icon}</span>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{style.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{style.description}</div>
                              </div>
                              {mailType === style.value && (
                                <span className="text-[var(--blue-accent)]">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 生成按钮 */}
                  <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !userInput.mail?.trim()}
                    className="w-full py-2.5 rounded-lg bg-[var(--blue-accent)] text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isLoading ? 'Generating...' : 'Generate Optimized Mail'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea 
                    value={userInput.replyTo}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setUserInput({ ...userInput, replyTo: e.target.value })}
                    className="w-full h-[200px] p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm placeholder:text-gray-400"
                    placeholder="Paste the email content you need to reply to..."
                  />
                  <textarea 
                    value={userInput.reply}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setUserInput({ ...userInput, reply: e.target.value })}
                    className="w-full h-[200px] p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm placeholder:text-gray-400"
                    placeholder="Enter your reply draft..."
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !userInput.replyTo.trim() || !userInput.reply.trim()}
                    className="w-full py-2.5 rounded-lg bg-[var(--blue-accent)] text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isLoading ? 'Generating...' : 'Generate Optimized Reply'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
