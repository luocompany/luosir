"use client";

import { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, XCircleIcon } from 'lucide-react';
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
    if (!amount || /，/.test(amount)) {
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
    const chineseAmount = numberToChinese(amount.replace(/,/g, ''));
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/90 via-white/60 to-gray-100/90 
                    dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900/90">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8 sm:mb-12">
          <Link 
            href="/tools" 
            className="group inline-flex items-center px-4 py-2 rounded-full 
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                      border border-gray-200/50 dark:border-gray-700/50 
                      text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
                      transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">返回</span>
          </Link>
        </div>
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl p-6 sm:p-8 
                      rounded-[2rem] shadow-xl 
                      border border-gray-200/50 dark:border-gray-700/50 
                      hover:shadow-2xl transition-all duration-500">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">人民币大写金额转换</h1>
          <form className="space-y-6">
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
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 text-lg">
                  ￥
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-4 text-lg font-mono tracking-wider 
                    border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    rounded-xl
                    focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                    dark:focus:ring-blue-500 dark:focus:border-blue-500
                    hover:border-gray-400 dark:hover:border-gray-500
                    transition-all
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="0.00"
                  value={lowerAmount}
                  onChange={(e) => setLowerAmount(e.target.value)}
                  inputMode="decimal"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                {lowerAmount && (
                  <button
                    type="button"
                    onClick={() => setLowerAmount('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400
                      hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {!realtime && (
                <button
                  type="button"
                  className="px-8 py-3 bg-[var(--blue-accent)] text-white rounded-xl hover:opacity-90
                    transition-all duration-200 focus:outline-none focus:ring-2 
                    focus:ring-[var(--blue-accent)] focus:ring-offset-2"
                  onClick={() => convertToChinese(lowerAmount)}
                >
                  转换
                </button>
              )}
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">转换结果</h2>
            <div className="relative p-6 bg-[var(--input-bg)] rounded-xl min-h-[60px] backdrop-blur-sm border border-[var(--card-border)]">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60 transition-colors"
                title="复制结果"
              >
                {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5" />}
              </button>
              <p className="text-[var(--foreground)] leading-relaxed text-xs">
                {!lowerAmount ? (
                  <span className="text-[var(--foreground)]/60">等待输入...</span>
                ) : (
                  error ? (
                    <strong>{error}</strong>
                  ) : (
                    upperAmount ? (
                      <strong>{upperAmount}</strong>
                    ) : (
                      <span className="text-[var(--foreground)]/60">等待输入...</span>
                    )
                  )
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-sm text-[var(--foreground)]/60">
            <p className="flex items-center">
              <span className="mr-2">•</span>
              可接受的输入：数字、","(逗号分隔符)和"."(小数点)
            </p>
            <p className="flex items-center">
              <span className="mr-2">•</span>
              相关工具：
              <Link 
                href="/tools/number-to-english" 
                className="ml-1 text-[var(--blue-accent)] hover:opacity-80 transition-opacity"
              >
                数字金额翻译为英文
              </Link>
            </p>
          </div>

          <details className="mt-8 text-sm text-[var(--foreground)]/60">
            <summary className="cursor-pointer hover:text-[var(--foreground)] transition-colors font-medium mb-4">
              查看规范说明
            </summary>
            <div className="space-y-6 mt-4 bg-[var(--input-bg)]/50 rounded-2xl p-6 backdrop-blur-sm border border-[var(--card-border)]">
              <div>
                <h3 className="font-medium text-[var(--foreground)]/80 mb-2">人民币金额用到的中文大写汉字如下：</h3>
                <p>零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿。</p>
              </div>
              
              <div>
                <h3 className="font-medium text-[var(--foreground)]/80 mb-2">人民币大写规范详细介绍</h3>
                <div className="space-y-3">
                  <p>一、中文大写金额数字到"元"为止的，在"元"之后、应写"整"(或"正")字；在"角"和"分"之后，不写"整"(或"正")字。</p>
                  
                  <p>二、中文大写金额字前应标明"人民币"字样，大写金额数字应紧接"人民币"字样填写，不得留有空白。大写金额数字前未印"人民币"字样的，应加填"人民币"三字，在票据和结算凭证大写金额栏内不得预印固定的"仟、佰、拾、万、仟、佰、拾、元、角、分"字样。</p>
                  
                  <div>
                    <p>三、阿拉伯数字小写金额数字中有"0"时，中文大写应按照汉语语言规律、金额数字构成和防止涂改的要求进行书写。举例如下：</p>
                    <ul className="list-decimal pl-5 mt-2 space-y-1.5">
                      <li>阿拉伯数字中间有"0"时，中文大写要写"零"字，如￥1409.50应写成人民币壹仟肆佰零玖元伍角；</li>
                      <li>阿拉伯数字中间连续有几个"0"时、中文大写金额中可以只写一个"零"字，如￥6007.14应写成人民币陆仟零柒元壹角肆分。</li>
                      <li>阿拉伯金额数字万位和元位是"0"，或者数字中间连续有几个"0"，万位、元位也是"0"但千位、角位不是"0"时，中文大写金额中可以只写一个零字，也可以不写"零"字，如￥1680.32应写成人民币壹仟陆佰捌拾元零叁角贰分，或者写成人民币壹仟陆佰捌拾元叁角贰分。又如￥107000.53应写成人民币壹拾万柒仟元零伍角叁分，或者写成人民币壹拾万零柒仟元伍角叁分。</li>
                      <li>阿拉伯金额数字角位是"0"而分位不是"0"时，中文大写金额"元"后面应写"零"字，如￥16409.02应写成人民币壹万陆仟肆佰零玖元零贰分，又如￥325.04应写成人民币叁佰贰拾伍元零肆分。</li>
                    </ul>
                  </div>
                  
                  <p>四、拉伯小写金额数字前面均应填写人民币符号"￥"，阿拉伯小写金额数字要认真填写，不得连写分辨不清。</p>
                  
                  <p>、票据的出票日期必须使用中文大写，为防止变造票据的出票日期，在填写月、日时、月为壹、贰和壹拾的，日为壹至玖和壹拾、贰拾和叁拾的，应在其前加"零"日为拾壹至拾玖的应在其前加"壹"如1月15日应写成零壹月壹拾伍日，再如10月20日应写成零壹拾月零贰拾日。</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function numberToChinese(amount: string): string {
  const numChars = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  const bigUnits = ['', '万', '亿', '兆'];
  
  const [integerPart, decimalPart] = amount.replace(/,/g, '').split('.');

  // 添加数值上限检查（兆 = 10^16，所以我们限制到 9999 9999 9999 9999）
  if (integerPart.length > 16 || (integerPart.length === 16 && integerPart > "9999999999999999")) {
    return "数字太大";
  }
  
  let result = '人民币';
  
  // 处理整数部分
  if (integerPart) {
    // 按4位分组处理
    const groups = [];
    let temp = integerPart;
    while (temp.length > 0) {
      groups.unshift(temp.slice(-4));
      temp = temp.slice(0, -4);
    }
    
    // 处理每个分组
    const processGroup = (num: string): string => {
      let groupResult = '';
      const digits = num.split('');
      
      for (let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i]);
        
        if (digit === 0) {
          if (groupResult && !groupResult.endsWith('零') && 
              digits.slice(i + 1).some(d => d !== '0')) {
            groupResult += '零';
          }
        } else {
          groupResult += numChars[digit] + units[digits.length - 1 - i];
        }
      }
      
      return groupResult.replace(/零+$/, '');
    };
    
    // 组合所有分组
    let finalResult = '';
    let hasValue = false;
    
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const groupValue = processGroup(group);
      const bigUnit = bigUnits[groups.length - 1 - i];
      
      if (groupValue) {
        // 当前组有值
        if (hasValue && !groupValue.startsWith('零') && 
            !finalResult.endsWith('亿') && !finalResult.endsWith('万') && 
            !finalResult.endsWith('兆')) { // 添加兆的检查
          finalResult += '零';
        }
        finalResult += groupValue + bigUnit;
        hasValue = true;
      } else {
        // 当前组全为零
        if (bigUnit === '兆' && hasValue) {
          finalResult += bigUnit;
        } else if (bigUnit === '亿' && hasValue && 
                   groups.slice(i + 1).some(g => parseInt(g) !== 0)) {
          finalResult += bigUnit;
        } else if (bigUnit === '万' && hasValue && 
                   groups.slice(i + 1).some(g => parseInt(g) !== 0)) {
          finalResult += bigUnit;
        }
      }
    }
    
    result += finalResult + '元';
  } else {
    result += '零元';
  }
  
  // 处理小数部分
  if (decimalPart) {
    const jiao = parseInt(decimalPart[0] || '0', 10);
    const fen = parseInt(decimalPart[1] || '0', 10);
    
    if (jiao === 0 && fen === 0) {
      result += '整';
    } else {
      if (integerPart !== '0' && jiao === 0 && fen !== 0) {
        result += '零';
      }
      if (jiao !== 0) {
        result += numChars[jiao] + '角';
      }
      if (fen !== 0) {
        result += numChars[fen] + '分';
      }
    }
  } else {
    result += '整';
  }
  
  return result;
} 