"use client";

import { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, XCircleIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from '../../components/Footer';

// 类型定义
type ConversionResult = {
  integer: string;
  decimal: string;
  hasDecimal: boolean;
} | string;

// 工具函数
const numberUtils = {
  units: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  teens: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
  tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],

  convertInteger(num: number): string {
    if (num === 0) return 'zero';
    
    const convert = (n: number): string => {
      if (n < 10) return this.units[n];
      if (n < 20) return this.teens[n - 10];
      if (n < 100) return this.tens[Math.floor(n / 10)] + (n % 10 ? '-' + this.units[n % 10] : '');
      if (n < 1000) return this.units[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
      if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        return convert(thousands) + ' thousand' + (remainder ? ' ' + convert(remainder) : '');
      }
      if (n < 1000000000) {
        const millions = Math.floor(n / 1000000);
        const remainder = n % 1000000;
        return convert(millions) + ' million' + (remainder ? ' ' + convert(remainder) : '');
      }
      const billions = Math.floor(n / 1000000000);
      const remainder = n % 1000000000;
      return convert(billions) + ' billion' + (remainder ? ' ' + convert(remainder) : '');
    };

    return convert(num);
  }
};

// 输入框组件
const NumberInput = ({ value, onChange, onClear }: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => (
  <div className="flex-1 relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40 text-lg">
      #
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-4 text-lg font-mono tracking-wider border-2 border-[var(--blue-accent)] 
        bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-[var(--blue-accent)] focus:outline-none 
        transition-all placeholder:text-[var(--foreground)]/30 text-[var(--foreground)]"
      placeholder="0.00"
      inputMode="decimal"
      style={{
        WebkitAppearance: 'none',
        MozAppearance: 'textfield'
      }}
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40 
          hover:text-[var(--foreground)]/60 transition-colors"
      >
        <XCircleIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

// 结果显示组件
const ResultDisplay = ({ result, onCopy, copied }: {
  result: ConversionResult;
  onCopy: () => void;
  copied: boolean;
}) => (
  <div className="relative p-6 bg-[var(--input-bg)] rounded-xl min-h-[60px] backdrop-blur-sm border border-[var(--card-border)]">
    <button
      onClick={onCopy}
      className="absolute top-3 right-3 p-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60 transition-colors"
      title="复制结果"
    >
      {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5" />}
    </button>
    
    <p className="text-[var(--foreground)] leading-relaxed">
      {!result ? '等待输入...' : (
        typeof result === 'string' ? result : (
          <span>
            {result.integer}
            {result.hasDecimal && (
              <>
                {' '}
                <span className="text-red-500">AND</span>
                {' '}
                {result.decimal}
              </>
            )}
          </span>
        )
      )}
    </p>
  </div>
);

export default function NumberToEnglish() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<ConversionResult>('');
  const [realtime, setRealtime] = useState(true);
  const [copied, setCopied] = useState(false);

  const convertToEnglish = (input: string): ConversionResult => {
    if (!input) return '';
    
    // 检查输入是否包含除数字、逗号和小数点以外的字符
    if (/[^0-9.,]/.test(input)) return '请输入有效数字';
    
    const parts = input.split('.');
    const integerPart = parseInt(parts[0].replace(/,/g, ''));
    
    if (isNaN(integerPart)) return '请输入有效数字';
    if (integerPart > 999999999999) return '数字太大';
    
    const integerResult = numberUtils.convertInteger(integerPart).toUpperCase();
    if (parts.length === 1) return integerResult;
    
    const decimalPart = parts[1];
    const decimalResult = [...decimalPart]
      .map(digit => {
        const num = parseInt(digit);
        return isNaN(num) ? '' : numberUtils.convertInteger(num).toUpperCase();
      })
      .filter(x => x)
      .join(' ');
    
    return {
      integer: integerResult,
      decimal: decimalResult,
      hasDecimal: decimalResult.length > 0
    };
  };

  useEffect(() => {
    if (realtime && number) {
      setResult(convertToEnglish(number));
    }
  }, [number, realtime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realtime) {
      setResult(convertToEnglish(number));
    }
  };

  const handleCopy = () => {
    const resultText = typeof result === 'string' ? result : 
      `${result.integer}${result.hasDecimal ? ` AND ${result.decimal}` : ''}`;
    
    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center mb-4">
          <Link 
            href="/tools" 
            className="inline-flex items-center text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
            style={{ fontSize: '16px', fontWeight: '500' }}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            返回
          </Link>
        </div>
        <div className="backdrop-blur-xl bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">数字转英文工具</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="realtime"
                  checked={realtime}
                  onChange={(e) => setRealtime(e.target.checked)}
                  className="w-4 h-4 rounded-full border-[var(--border)] text-[var(--blue-accent)] focus:ring-[var(--blue-accent)]"
                />
                <label htmlFor="realtime" className="text-sm text-[var(--foreground)]/70">
                  实时转换
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <NumberInput 
                value={number}
                onChange={setNumber}
                onClear={() => setNumber('')}
              />
              {!realtime && (
                <button
                  type="submit"
                  className="px-8 py-3 bg-[var(--blue-accent)] text-white rounded-xl hover:opacity-90
                    transition-all duration-200 focus:outline-none focus:ring-2 
                    focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                >
                  转换
                </button>
              )}
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">转换结果</h2>
            <ResultDisplay 
              result={result}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>

          <div className="mt-8 space-y-2 text-sm text-[var(--foreground)]/60">
            <p className="flex items-center">
              <span className="mr-2">•</span>
              可接受的输入：数字、","(逗号分隔符)和"."(小数点)
            </p>
            <p className="flex items-center">
              <span className="mr-2">•</span>
              相关工具：
              <a 
                href="/tools/number-to-chinese" 
                className="ml-1 text-[var(--blue-accent)] hover:opacity-80 transition-opacity"
              >
                数字金额转中文大写金额
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 