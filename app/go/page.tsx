"use client";

import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import { Search } from 'lucide-react';
import { useState } from 'react';

// 修改文件顶部的类型定义
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function Go() {
  // 将 searchEngine 状态移到组件内部
  const [searchEngine, setSearchEngine] = useState<'baidu' | 'google'>('baidu');
  const [baiduTab, setBaiduTab] = useState('网页');
  const [googleTab, setGoogleTab] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [isBaiduListening, setIsBaiduListening] = useState(false);

  // 修改搜索处理函数
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('search') as HTMLInputElement).value;
    let searchUrl = '';
    
    if (searchEngine === 'baidu') {
      switch(baiduTab) {
        case '视频':
          searchUrl = 'https://video.baidu.com/v?word=';
          break;
        case '图片':
          searchUrl = 'https://image.baidu.com/search/index?tn=baiduimage&word=';
          break;
        case '贴吧':
          searchUrl = 'https://tieba.baidu.com/f?kw=';
          break;
        case '知道':
          searchUrl = 'https://zhidao.baidu.com/search?word=';
          break;
        case '地图':
          searchUrl = 'https://map.baidu.com/search?querytype=s&wd=';
          break;
        case '新闻':
          searchUrl = 'https://news.baidu.com/ns?word=';
          break;
        case '文库':
          searchUrl = 'https://wenku.baidu.com/search?word=';
          break;
        case '百科':
          searchUrl = 'https://baike.baidu.com/search?word=';
          break;
        default:
          searchUrl = 'https://www.baidu.com/s?wd=';
      }
    } else {
      switch(googleTab) {
        case 'Images':
          searchUrl = 'https://www.google.com/search?tbm=isch&q=';
          break;
        case 'Videos':
          searchUrl = 'https://www.google.com/search?tbm=vid&q=';
          break;
        case 'Maps':
          searchUrl = 'https://www.google.com/maps/search/';
          break;
        case 'News':
          searchUrl = 'https://news.google.com/search?q=';
          break;
        case 'Shopping':
          searchUrl = 'https://www.google.com/search?tbm=shop&q=';
          break;
        case 'Books':
          searchUrl = 'https://www.google.com/search?tbm=bks&q=';
          break;
        case 'Scholar':
          searchUrl = 'https://scholar.google.com/scholar?q=';
          break;
        default:
          searchUrl = 'https://www.google.com/search?q=';
      }
    }
    
    window.open(searchUrl + encodeURIComponent(query), '_blank');
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const googleInput = document.querySelector('input[name="google"]') as HTMLInputElement;
        if (googleInput) {
          googleInput.value = transcript;
          // 可选：自动触发搜索
          // googleInput.form?.requestSubmit();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
    }
  };

  const startBaiduSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN'; // 设置为中文识别
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsBaiduListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const baiduInput = document.querySelector('input[name="baidu"]') as HTMLInputElement;
        if (baiduInput) {
          baiduInput.value = transcript;
          // 可选：自动触发搜索
          // baiduInput.form?.requestSubmit();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsBaiduListening(false);
      };

      recognition.onend = () => {
        setIsBaiduListening(false);
      };

      recognition.start();
    } else {
      alert('语音识别在此浏览器中不受支持。请使用 Chrome 浏览器。');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Logo区域 */}
      <div className="absolute top-0 left-0 p-4 z-50">
        <Link href="/tools" className="flex items-center space-x-3 group">
          <Image 
            src="/logo.png" 
            alt="LC Logo" 
            width={36} 
            height={36} 
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg font-medium text-[var(--foreground)]">
            LC网址导航
          </span>
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 搜索框区域 */}
        <div className="max-w-3xl mx-auto mt-8 mb-12">
          <div className="search-box backdrop-blur-xl bg-white/90 dark:bg-[var(--card-bg)] 
            rounded-2xl p-6 
            shadow-lg shadow-gray-200/50 dark:shadow-none
            border border-[var(--card-border)]
            hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none
            transition-all duration-300">
            
            {/* 搜索类型标签 */}
            <div className="search-tabs mb-4 flex flex-wrap gap-2 text-xs justify-center">
              {searchEngine === 'baidu' ? (
                // 百度搜索标签
                [
                  { name: '网页', url: 'https://www.baidu.com' },
                  { name: '图片', url: 'https://image.baidu.com' },
                  { name: '地图', url: 'https://map.baidu.com' },
                  { name: '新闻', url: 'https://news.baidu.com' },
                  // 在大屏幕上显示的额外选项
                  { name: '视频', url: 'https://video.baidu.com', desktopOnly: true },
                  { name: '贴吧', url: 'https://tieba.baidu.com', desktopOnly: true },
                  { name: '知道', url: 'https://zhidao.baidu.com', desktopOnly: true },
                  { name: '文库', url: 'https://wenku.baidu.com', desktopOnly: true },
                  { name: '百科', url: 'https://baike.baidu.com', desktopOnly: true },
                ].map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setBaiduTab(tab.name)}
                    className={`px-3 py-1.5 text-[12px] transition-all duration-300
                      ${tab.desktopOnly ? 'hidden md:block' : ''} 
                      ${baiduTab === tab.name
                        ? 'text-blue-500 dark:text-blue-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.name}
                  </button>
                ))
              ) : (
                // Google搜索标签
                [
                  { name: 'All', url: 'https://www.google.com' },
                  { name: 'Images', url: 'https://www.google.com/imghp' },
                  { name: 'Maps', url: 'https://maps.google.com' },
                  { name: 'News', url: 'https://news.google.com' },
                  // 在大屏幕上显示的额外选项
                  { name: 'Videos', url: 'https://www.google.com/video', desktopOnly: true },
                  { name: 'Shopping', url: 'https://shopping.google.com', desktopOnly: true },
                  { name: 'Books', url: 'https://books.google.com', desktopOnly: true },
                  { name: 'Scholar', url: 'https://scholar.google.com', desktopOnly: true },
                ].map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setGoogleTab(tab.name)}
                    className={`px-3 py-1.5 text-[12px] transition-all duration-300
                      ${tab.desktopOnly ? 'hidden md:block' : ''} 
                      ${googleTab === tab.name
                        ? 'text-blue-500 dark:text-blue-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.name}
                  </button>
                ))
              )}
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder={searchEngine === 'baidu' ? "百度一下，你就知道" : "Search Google or type a URL"}
                  className="w-full px-10 py-2.5 text-sm
                    bg-white dark:bg-[var(--card-bg)]
                    border border-[var(--card-border)]
                    rounded-full
                    hover:shadow-[0_1px_6px_rgba(32,33,36,.28)] dark:hover:shadow-[0_1px_6px_rgba(0,0,0,.28)]
                    focus:shadow-[0_1px_6px_rgba(32,33,36,.28)] dark:focus:shadow-[0_1px_6px_rgba(0,0,0,.28)]
                    focus:border-blue-500/30 dark:focus:border-blue-500/30
                    outline-none transition-all duration-300
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    text-[var(--foreground)]"
                />
                <div className="absolute right-4 flex items-center space-x-2">
                  <button
                    type="button"
                    className={`p-1.5 rounded-full transition-colors group relative
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      ${isListening ? 'bg-red-50 dark:bg-red-900/30' : ''}`}
                    onClick={startSpeechRecognition}
                  >
                    <svg className={`w-5 h-5 transition-colors ${searchEngine === 'baidu' ? 
                      (isBaiduListening ? 'animate-pulse' : '') : (isListening ? 'animate-pulse' : '')}`} 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" 
                        fill={searchEngine === 'baidu' ? 
                          (isBaiduListening ? '#ea4335' : '#4e6ef2') : 
                          (isListening ? '#ea4335' : '#4285f4')}/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" 
                        fill={searchEngine === 'baidu' ? 
                          (isBaiduListening ? '#ea4335' : '#4e6ef2') : 
                          (isListening ? '#ea4335' : '#34a853')}/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {searchEngine === 'baidu' ? 
                        (isBaiduListening ? '正在聆听...' : '语音搜索') : 
                        (isListening ? 'Listening...' : 'Search by voice')}
                    </span>
                  </button>
                  <div className="h-5 w-px bg-gray-200 dark:bg-gray-600/50 mx-1"></div>
                  <button
                    type="submit"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group relative"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" 
                        fill={searchEngine === 'baidu' ? '#4e6ef2' : '#4285f4'}/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {searchEngine === 'baidu' ? '索' : 'Search'}
                    </span>
                  </button>
                </div>
              </div>
            </form>

            {/* 搜索引擎选择 - 移到搜索框下方 */}
            <div className="flex items-center justify-center space-x-8">
              <button
                onClick={() => setSearchEngine('baidu')}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-300
                  ${searchEngine === 'baidu' 
                    ? 'opacity-100' 
                    : 'opacity-60 hover:opacity-80'}`}
              >
                <Image 
                  src="/baidu-logo.png"
                  alt="百度" 
                  width={92} 
                  height={30} 
                  className={`h-5 w-auto transition-all duration-300
                    ${searchEngine === 'baidu' 
                      ? '' 
                      : 'grayscale hover:grayscale-0'
                    }`}
                />
              </button>
              <button
                onClick={() => setSearchEngine('google')}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-300
                  ${searchEngine === 'google' 
                    ? 'opacity-100' 
                    : 'opacity-60 hover:opacity-80'}`}
              >
                <Image 
                  src="/google-logo.png"
                  alt="Google" 
                  width={92} 
                  height={30} 
                  className={`h-5 w-auto transition-all duration-300
                    ${searchEngine === 'google' 
                      ? '' 
                      : 'grayscale hover:grayscale-0'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 网址导航区域 */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 分类标题和链接的通用样式 */}
          <style jsx>{`
            .site-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              gap: 8px;
            }
          `}</style>

          {/* 常用工具区域 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[var(--foreground)]
              pb-1.5 border-b border-[var(--card-border)]">
              常用工具
            </h2>
            <div className="site-grid">
              {[
                { name: '数字转英文', url: 'https://mail.luosir.top/tools/number-to-english' },
                { name: '数字转中文', url: 'https://mail.luosir.top/tools/number-to-chinese' },
                { name: '日期工具', url: 'https://mail.luosir.top/tools/date-tools' },
                { name: 'PDF转换', url: 'https://www.ilovepdf.com/zh-cn' },
                { name: 'YouTube', url: 'https://www.youtube.com' },
                { name: '世界港口查询', url: 'https://cn.jctrans.com' },
                { name: '绿色破解软件', url: 'https://www.azhongruanjian.com/'},
                { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
              ].map(tool => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-[var(--card-bg)]
                    border border-[var(--card-border)]
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-[var(--foreground)] text-sm
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors duration-300">
                    {tool.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 翻译网址 - 原有区域 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[var(--foreground)]
              pb-1.5 border-b border-[var(--card-border)]">
              翻译网址
            </h2>
            <div className="site-grid">
              {[
                { name: '谷歌翻译', url: 'https://translate.google.com' },
                { name: 'Bing翻译', url: 'https://www.bing.com/translator' },
                { name: 'DeepL翻译', url: 'https://www.deepl.com' },
                { name: 'Linguee', url: 'https://www.linguee.com' },
                { name: '有道翻译', url: 'https://fanyi.youdao.com' },
                { name: 'CNKI翻译', url: 'https://dict.cnki.net' },
              ].map(site => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-[var(--card-bg)]
                    border border-[var(--card-border)]
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-[var(--foreground)] text-sm
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors duration-300">
                    {site.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

