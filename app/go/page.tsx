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
  const [baiduTab, setBaiduTab] = useState('网页');
  const [googleTab, setGoogleTab] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [isBaiduListening, setIsBaiduListening] = useState(false);

  const handleBaiduSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('baidu') as HTMLInputElement).value;
    let searchUrl = 'https://www.baidu.com/s?wd=';
    
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
    }
    
    window.open(searchUrl + encodeURIComponent(query), '_blank');
  };

  const handleGoogleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('google') as HTMLInputElement).value;
    let searchUrl = 'https://www.google.com/search?q=';
    
    switch(googleTab) {
      case 'Search':
        searchUrl = 'https://www.google.com/search?q=';
        break;
      case 'Images':
        searchUrl = 'https://www.google.com/search?tbm=isch&q=';
        break;
      case 'Maps':
        searchUrl = 'https://www.google.com/maps/search/';
        break;
      case 'News':
        searchUrl = 'https://news.google.com/search?q=';
        break;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/80 via-white to-gray-50/80 
                    dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
      {/* Logo区域 - 改为absolute定位 */}
      <div className="absolute top-0 left-0 p-4 z-50">
        <Link href="/tools" className="flex items-center space-x-3 group">
          <Image 
            src="/logo.png" 
            alt="LC Logo" 
            width={36} 
            height={36} 
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg font-medium bg-clip-text text-transparent 
            bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            LC网址导航
          </span>
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 搜索框区域 - 减小上边距 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8 mb-12">
          {/* 百度搜索 */}
          <div className="search-box backdrop-blur-xl bg-white/80 dark:bg-gray-800/50 rounded-2xl p-5">
            <div className="flex items-center mb-4">
              <Link href="https://www.baidu.com" target="_blank" className="mr-4">
                <Image 
                  src="/baidu-logo.png" 
                  alt="百度" 
                  width={92} 
                  height={30} 
                  className="h-7 object-contain"
                />
              </Link>
            </div>
            
            <div className="search-tabs mb-4 flex flex-wrap gap-1 text-sm">
              {[
                { name: '网页', url: 'https://www.baidu.com' },
                { name: '图片', url: 'https://image.baidu.com' },
                { name: '地图', url: 'https://map.baidu.com' },
                { name: '新闻', url: 'http://news.baidu.com' },
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setBaiduTab(tab.name)}
                  className={`px-3 py-2 text-[14px] transition-colors
                    ${baiduTab === tab.name
                      ? 'text-[#4e6ef2] border-b-2 border-[#4e6ef2]'
                      : 'text-[#5f6368] dark:text-gray-300 hover:text-[#202124] dark:hover:text-white'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleBaiduSearch} className="relative">
              <div className="relative flex items-center w-full">
                <div className="absolute left-4 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="baidu"
                  placeholder="百度一下，你就知道"
                  className="w-full px-12 py-3 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-600/30 
                    rounded-full
                    hover:shadow-[0_1px_6px_rgba(32,33,36,.28)]
                    focus:shadow-[0_1px_6px_rgba(32,33,36,.28)]
                    focus:border-transparent
                    outline-none transition-all duration-300
                    placeholder:text-gray-500"
                />
                <div className="absolute right-4 flex items-center space-x-2">
                  <button
                    type="button"
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors 
                      group relative ${isBaiduListening ? 'bg-red-50 dark:bg-red-900/30' : ''}`}
                    aria-label="语音搜索"
                    onClick={startBaiduSpeechRecognition}
                  >
                    <svg className={`w-6 h-6 transition-colors ${isBaiduListening ? 'animate-pulse' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" 
                        fill={isBaiduListening ? '#ea4335' : '#4e6ef2'}/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" 
                        fill={isBaiduListening ? '#ea4335' : '#4e6ef2'}/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isBaiduListening ? '正在聆听...' : '语音搜索'}
                    </span>
                  </button>
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-1"></div>
                  <button
                    type="submit"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group relative"
                    aria-label="百度搜索"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" 
                        fill="#4e6ef2"/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      搜索
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Google搜索 - 样式类似百度搜索框 */}
          <div className="search-box backdrop-blur-xl bg-white/80 dark:bg-gray-800/50 rounded-2xl p-5">
            <div className="flex items-center mb-4">
              <Link href="https://www.google.com" target="_blank" className="mr-4">
                <Image 
                  src="/google-logo.png" 
                  alt="Google" 
                  width={92} 
                  height={30} 
                  className="h-7 object-contain"
                />
              </Link>
            </div>
            
            <div className="search-tabs mb-4 flex flex-wrap gap-1 text-sm">
              {[
                { name: 'Search', url: 'https://www.google.com' },
                { name: 'Images', url: 'https://www.google.com/imghp' },
                { name: 'Maps', url: 'https://maps.google.com' },
                { name: 'News', url: 'https://news.google.com' },
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setGoogleTab(tab.name)}
                  className={`px-3 py-2 text-[14px] transition-colors
                    ${googleTab === tab.name
                      ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
                      : 'text-[#5f6368] dark:text-gray-300 hover:text-[#202124] dark:hover:text-white'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleGoogleSearch} className="relative">
              <div className="relative flex items-center w-full">
                <div className="absolute left-4 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="google"
                  placeholder="Search Google or type a URL"
                  className="w-full px-12 py-3 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-600/30 
                    rounded-full
                    hover:shadow-[0_1px_6px_rgba(32,33,36,.28)]
                    focus:shadow-[0_1px_6px_rgba(32,33,36,.28)]
                    focus:border-transparent
                    outline-none transition-all duration-300
                    placeholder:text-gray-500"
                />
                <div className="absolute right-4 flex items-center space-x-2">
                  <button
                    type="button"
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors 
                      group relative ${isListening ? 'bg-red-50 dark:bg-red-900/30' : ''}`}
                    aria-label="Voice search"
                    onClick={startSpeechRecognition}
                  >
                    <svg className={`w-6 h-6 transition-colors ${isListening ? 'animate-pulse' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" 
                        fill={isListening ? '#ea4335' : '#4285f4'}/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" 
                        fill={isListening ? '#ea4335' : '#34a853'}/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isListening ? 'Listening...' : 'Search by voice'}
                    </span>
                  </button>
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-1"></div>
                  <button
                    type="submit"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group relative"
                    aria-label="Google Search"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" 
                        fill="#4285f4"/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </form>
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

          {/* 常用搜索 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
              pb-1.5 border-b border-gray-100 dark:border-gray-800">
              常用搜索
            </h2>
            <div className="site-grid">
              {[
                { name: 'Google', url: 'https://www.google.com' },
                { name: 'Bing', url: 'https://www.bing.com' },
                { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
                { name: '谷歌翻译', url: 'https://translate.google.com' },
                { name: 'Bing翻译', url: 'https://www.bing.com/translator' },
                { name: 'DeepL翻译', url: 'https://www.deepl.com' },
                { name: 'Linguee', url: 'https://www.linguee.com' },
                { name: '有道翻译', url: 'https://fanyi.youdao.com' },
                { name: 'CNKI翻译', url: 'https://dict.cnki.net' },
                { name: 'Yandex', url: 'https://yandex.com' },
                { name: 'YouTube', url: 'https://www.youtube.com' }
              ].map(site => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-gray-800/30
                    border border-gray-100 dark:border-gray-700/30
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors duration-300">
                    {site.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 社交媒体 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
              pb-1.5 border-b border-gray-100 dark:border-gray-800">
              社交媒体
            </h2>
            <div className="site-grid">
              {[
                { name: 'Facebook', url: 'https://www.facebook.com' },
                { name: 'Twitter', url: 'https://twitter.com' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com' },
                { name: 'Pinterest', url: 'https://www.pinterest.com' },
                { name: 'Yahoo!', url: 'https://www.yahoo.com' },
                { name: 'Instagram', url: 'https://www.instagram.com' },
                { name: 'Tumblr', url: 'https://www.tumblr.com' }
              ].map(site => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-gray-800/30
                    border border-gray-100 dark:border-gray-700/30
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors duration-300">
                    {site.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 购物网站 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
              pb-1.5 border-b border-gray-100 dark:border-gray-800">
              购物网站
            </h2>
            <div className="site-grid">
              {[
                { name: 'Amazon', url: 'https://www.amazon.com' },
                { name: 'Ebay', url: 'https://www.ebay.com' },
                { name: '淘宝', url: 'https://www.taobao.com' },
                { name: '天猫', url: 'https://www.tmall.com' },
                { name: '京东', url: 'https://www.jd.com' },
                { name: '亚马逊', url: 'https://www.amazon.cn' }
              ].map(site => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-gray-800/30
                    border border-gray-100 dark:border-gray-700/30
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                    transition-colors duration-300">
                    {site.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 视频娱乐 */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
              pb-1.5 border-b border-gray-100 dark:border-gray-800">
              视频娱乐
            </h2>
            <div className="site-grid">
              {[
                { name: '爱奇艺', url: 'https://www.iqiyi.com' },
                { name: '优酷', url: 'https://www.youku.com' },
                { name: '腾讯视频', url: 'https://v.qq.com' },
                { name: '搜狐视频', url: 'https://tv.sohu.com' },
                { name: '芒果TV', url: 'https://www.mgtv.com' },
                { name: '在线美剧', url: 'https://www.meijutt.tv' }
              ].map(site => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-3 py-2.5 text-center rounded-lg
                    backdrop-blur-xl bg-white/60 dark:bg-gray-800/30
                    border border-gray-100 dark:border-gray-700/30
                    hover:border-blue-500/30 dark:hover:border-blue-500/30
                    hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] 
                    dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]
                    transition-all duration-300"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm
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

