"use client";

import { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function NumberToChinese() {
  const [lowerAmount, setLowerAmount] = useState('');
  const [upperAmount, setUpperAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [realtime, setRealtime] = useState(true);
  const [error, setError] = useState('');

  const convertToChinese = (amount: string) => {
    if (!amount) {
      setError('请输入有效数字');
      setUpperAmount('');
      return;
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsedAmount) || /[a-zA-Z]/.test(amount)) {
      setError('请输入有效数字');
      setUpperAmount('');
      return;
    }

    setError('');
    const chineseAmount = numberToChinese(amount);
    setUpperAmount(chineseAmount);
  };

  useEffect(() => {
    if (realtime && lowerAmount) {
      convertToChinese(lowerAmount);
    }
  }, [lowerAmount, realtime]);

  const handleCopy = () => {
    navigator.clipboard.writeText(upperAmount).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
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
        <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold mb-6">人民币大写在线转换</h1>
          <p className="mb-4 text-[var(--foreground)]/70">
            可以将人民币小写金额转换为大写金额。在下面的小写金额框中填入人民币金额的小写阿拉伯数字，例如1688.99，然后点击“转换为大写金额”按钮即可转换成汉字。
          </p>
          <p className="mb-4 text-[var(--foreground)]/70">
            在输入数字的时候，可以包含小数点，也可以写成千进制，例如1,688.99（注意是英文逗号，而不是中文逗号）。
          </p>
          <div className="mb-4">
            <label className="block mb-2 text-[var(--foreground)]/70">小写金额：</label>
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40 text-lg">
                #
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-4 text-lg font-mono tracking-wider border-2 border-[var(--blue-accent)] 
                  bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-[var(--blue-accent)] focus:outline-none 
                  transition-all placeholder:text-[var(--foreground)]/30 text-[var(--foreground)]"
                placeholder="1688.99"
                value={lowerAmount}
                onChange={(e) => setLowerAmount(e.target.value)}
                inputMode="decimal"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
            </div>
          </div>
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
          <div className="mb-4 relative">
            <label className="block mb-2 text-[var(--foreground)]/70">转换为大写金额：</label>
            <div className="relative p-6 bg-[var(--input-bg)] rounded-xl min-h-[60px] backdrop-blur-sm border border-[var(--card-border)]">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60 transition-colors"
                title="复制结果"
              >
                {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5" />}
              </button>
              <p className="text-[var(--foreground)] leading-relaxed">
                {error || upperAmount || '等待输入...'}
              </p>
            </div>
          </div>
          {!realtime && (
            <button
              className="w-full px-8 py-3 bg-[var(--blue-accent)] text-white rounded-xl hover:opacity-90
                transition-all duration-200 focus:outline-none focus:ring-2 
                focus:ring-[var(--blue-accent)] focus:ring-offset-2"
              onClick={() => convertToChinese(lowerAmount)}
            >
              转换为大写金额
            </button>
          )}
          <Link href="/tools/number-to-english" className="block mt-4 text-center text-[var(--blue-accent)] hover:opacity-80 transition-opacity">
            数字金额翻译为英文
          </Link>
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">人民币金额用到的中文大写汉字如下：</h2>
            <p className="text-[var(--foreground)]/70">零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿。</p>
            <h2 className="text-lg font-medium mt-6 mb-4">人民币大写规范详细介绍</h2>
            <ol className="list-decimal pl-6 space-y-2 text-[var(--foreground)]/70">
              <li>中文大写金额数字到“元”为止的，“元”之后，应写“整”（或“正”）字；在“角”和“分”之后，不写“整”（或“正”）字。</li>
              <li>中文大写金额数字前应标明“人民币”字样，大写金额数字应紧接人民币字样填写，不得留有空白。</li>
              <li>阿拉伯数字中间有“0”时，中文大写应按汉语读法，金额数字构成的要素按要求进行书写。</li>
              <li>阿拉伯数字前面有“0”时，中文大写金额前应写“零”字。</li>
              <li>阿拉伯数字中间连续有几个“0”时，中文大写金额中间只写一个“零”字。</li>
              <li>阿拉伯数字小数点后有“0”而整数部分不为“0”时，中文大写金额“元”后面应写“零”字。</li>
              <li>阿拉伯数字小数点后有“0”而整数部分为“0”时，中文大写金额“元”后面不写“零”字。</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function numberToChinese(amount: string): string {
  const units = ['', '拾', '佰', '仟', '万', '亿'];
  const numChars = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '', '玖'];
  const [integerPart, decimalPart] = amount.split('.');

  let result = '人民币';

  // 处理整数部分
  if (integerPart) {
    const integerDigits = integerPart.split('').reverse();
    let integerChinese = '';
    for (let i = 0; i < integerDigits.length; i++) {
      const num = parseInt(integerDigits[i], 10);
      if (num !== 0) {
        integerChinese = numChars[num] + units[i % 4] + integerChinese;
      } else if (!integerChinese.startsWith('零')) {
        integerChinese = '零' + integerChinese;
      }
      if (i % 4 === 3 && integerChinese.charAt(0) !== '万' && integerChinese.charAt(0) !== '亿') {
        integerChinese = units[Math.floor(i / 4) + 4] + integerChinese;
      }
    }
    result += integerChinese.replace(/零+$/, '') + '元';
  }

  // 处理小数部分
  if (decimalPart) {
    const jiao = parseInt(decimalPart[0], 10);
    const fen = parseInt(decimalPart[1], 10);
    if (jiao) result += numChars[jiao] + '角';
    if (fen) result += numChars[fen] + '分';
    if (!jiao && !fen) result += '整';
  } else {
    result += '整';
  }

  return result;
} 