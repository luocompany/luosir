"use client";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from "next/image";
import { useState, type ChangeEvent, useEffect } from "react";
import { Copy, ChevronDown } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('mail');
  const [mailType, setMailType] = useState('formal');
  const [userInput, setUserInput] = useState({
    topic: '',
    language: 'both English and Chinese',
    mail: '',
    replyTo: '',
    reply: '',
    replyLanguage: 'both English and Chinese',
    replyType: 'formal'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const styles = [
    {
      icon: '📝',
      name: 'Formal',
      value: 'formal'
    },
    {
      icon: '💼',
      name: 'Professional',
      value: 'professional'
    },
    {
      icon: '👋',
      name: 'Friendly',
      value: 'friendly'
    },
    {
      icon: '⚡️',
      name: 'Concise',
      value: 'concise'
    },
    {
      icon: '📋',
      name: 'Detailed',
      value: 'detailed'
    },
    {
      icon: '😊',
      name: 'Informal',
      value: 'informal'
    },
    {
      icon: '✨',
      name: 'Inspirational',
      value: 'inspirational'
    }
  ];

  const handleGenerate = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      const requestData = {
        topic: activeTab === 'mail' ? userInput.topic : '',
        language: activeTab === 'mail' ? userInput.language : userInput.replyLanguage,
        type: activeTab === 'mail' ? mailType : userInput.replyType,
        content: activeTab === 'mail' ? userInput.mail : userInput.reply,
        originalMail: activeTab === 'mail' ? '' : userInput.replyTo,
        mode: activeTab
      };
      
      console.log('Request Data:', requestData);

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
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedContent) {
      const previewBox = document.querySelector('.preview-box') as HTMLElement;
      if (previewBox) {
        previewBox.style.height = 'auto'; // 先重置高度
        const contentHeight = previewBox.scrollHeight;
        previewBox.style.height = `${contentHeight}px`; // 设置为内容的高度
      }
    }
  }, [generatedContent, isLoading]);

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)]">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-6 py-10 mt-14 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 控制区 */}
          <div className="w-full md:w-1/2 order-1">
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
                      onChange={(e) => setUserInput({ ...userInput, mail: e.target.value })}
                      placeholder="请在这里输入邮件内容... / Type your email content here..."
                      className="w-full h-[200px] md:h-[300px] p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm font-['.SFNSText-Regular', 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Arial', sans-serif] placeholder:text-gray-400/80"
                    />
                  </div>

                  {/* 语言选择 */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Output language
                    </label>
                    <div className="relative">
                      <select
                        value={userInput.language}
                        onChange={(e) => setUserInput({ ...userInput, language: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all text-sm font-medium appearance-none"
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
                      Reply Tone
                    </label>
                    <div className="relative">
                      <button 
                        onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all text-sm"
                      >
                        <span className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="text-base">{styles.find(s => s.value === mailType)?.icon}</span>
                            <span className="font-medium">{styles.find(s => s.value === mailType)?.name}</span>
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isStyleMenuOpen ? 'rotate-180' : ''}`} />
                        </span>
                      </button>
                      
                      {isStyleMenuOpen && (
                        <div className="absolute z-10 w-full mt-1 py-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg backdrop-blur-xl backdrop-saturate-150 bg-opacity-90">
                          {styles.map((style) => (
                            <button
                              key={style.value}
                              onClick={() => {
                                setMailType(style.value);
                                setIsStyleMenuOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[var(--blue-accent)] hover:bg-opacity-10 transition-colors ${
                                mailType === style.value 
                                  ? 'text-[var(--blue-accent)]' 
                                  : 'text-[var(--foreground)]'
                              }`}
                            >
                              <span className="text-base">{style.icon}</span>
                              <span className="text-sm font-medium">{style.name}</span>
                              {mailType === style.value && (
                                <span className="ml-auto text-[var(--blue-accent)]">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
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
                    className="w-full py-3 rounded-xl bg-[var(--blue-accent)] text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Generating...</span>
                      </span>
                    ) : (
                      'Generate Optimized Mail'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea 
                    value={userInput.replyTo}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setUserInput({ ...userInput, replyTo: e.target.value })}
                    className="w-full h-[200px] p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm placeholder:text-gray-400 font-['.SFNSText-Regular', 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif]"
                    placeholder="请粘贴需要回复的邮件内容... / Paste the email content you need to reply to..."
                  />
                  <textarea 
                    value={userInput.reply}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
                      setUserInput({ ...userInput, reply: e.target.value })}
                    className="w-full h-[200px] p-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:ring-1 focus:ring-[var(--blue-accent)] focus:outline-none transition-all resize-y text-sm placeholder:text-gray-400 font-['.SFNSText-Regular', 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif]"
                    placeholder="请输入您的回复草稿... / Enter your reply draft..."
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

          {/* 预览区 */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6 min-h-[200px] max-h-[80vh] overflow-y-auto preview-box">
              <div className="flex justify-end mb-4">
                <button
                  aria-label="Copy content"
                  onClick={() => handleCopy(generatedContent)}
                  className="relative p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                  disabled={!generatedContent || isLoading}
                >
                  {copySuccess ? (
                    <span className="absolute -top-8 -left-2 bg-black/75 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  ) : null}
                  <Copy className={`w-4 h-4 ${
                    !generatedContent || isLoading 
                      ? 'text-gray-300 dark:text-gray-600' 
                      : 'text-[var(--foreground)]'
                  }`} />
                </button>
              </div>
              <div 
                className={`
                  h-[calc(100%-3rem)] 
                  overflow-y-auto 
                  font-['.SFNSText-Regular','SF Pro Text','Helvetica Neue','Arial',sans-serif]
                  text-[15px]
                  leading-7
                  tracking-[-0.003em]
                  text-gray-800 
                  dark:text-gray-200
                  selection:bg-blue-500/20
                  whitespace-pre-wrap
                  px-1
                `}
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                {!isLoading && generatedContent && (
                  <div className="space-y-4">
                    {generatedContent.split('\n\n').map((paragraph, index) => (
                      <div key={index} className={`
                        ${paragraph.startsWith('[Subject]') || paragraph.startsWith('[主题]') 
                          ? 'text-base font-medium text-gray-900 dark:text-white tracking-tight' 
                          : paragraph.startsWith('[English]') || paragraph.startsWith('[中文]')
                            ? 'text-sm font-medium text-blue-500 dark:text-blue-400 border-b border-gray-100 dark:border-gray-800'
                            : paragraph.trim().length === 0
                              ? 'hidden'
                              : 'text-[15px] leading-relaxed'
                        }
                        ${(paragraph.startsWith('[English]') || paragraph.startsWith('[中文]')) 
                          ? 'mt-4 first:mt-0' 
                          : ''
                        }
                        ${paragraph.includes('Dear') || paragraph.includes('尊敬的')
                          ? 'text-[15px] font-normal mt-2'
                          : ''
                        }
                      `}>
                        {paragraph.startsWith('[') && paragraph.endsWith(']') 
                          ? paragraph.slice(1, -1) // 移除方括号
                          : paragraph
                        }
                      </div>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating content...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
      <Footer />
      <style jsx>{`
        .preview-box {
          height: 710px;
        }

        @media (max-width: 768px) {
          .preview-box {
            height: auto;
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
