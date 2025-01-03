"use client";

import { useState, useEffect, memo } from 'react';
import Footer from '../components/Footer';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import Link from 'next/link';
import { generateQuotationPDF, generateOrderConfirmationPDF } from '../utils/pdfGenerator';

interface LineItem {
  lineNo: number;
  partName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

interface QuotationData {
  to: string;
  date: string;
  from: string;
  inquiryNo: string;
  quotationNo: string;
  contractNo: string;
  currency: string;
  paymentDate: string;
  items: LineItem[];
  notes: string[];
  amountInWords: {
    dollars: string;
    cents: string;
    hasDecimals: boolean;
  };
  bankInfo: string;
  showDescription: boolean;
  showRemarks: boolean;
}

interface SettingsData {
  date: string;
  from: string;
  currency: string;
  showDescription: boolean;
  showRemarks: boolean;
}

// 添加新的接口定义
interface DocumentHeader {
  title: string;
  customerLabel: string;
  numberLabel: string;
  numberPlaceholder: string;
  showContractNo?: boolean;
}

const documentTypes: { [key: string]: DocumentHeader } = {
  quotation: {
    title: 'Generate Quotation',
    customerLabel: 'Customer Name',
    numberLabel: 'Quotation No.',
    numberPlaceholder: 'Quotation No.',
    showContractNo: false
  },
  confirmation: {
    title: 'Generate Order',
    customerLabel: 'Customer Name',
    numberLabel: 'Quotation No.',
    numberPlaceholder: 'Quotation No.',
    showContractNo: true
  }
};

// 更新 Apple 标准蓝色
const appleColors = {
  light: {
    primary: '#007AFF',
    primaryHover: '#0063CC',
    background: 'rgba(0, 122, 255, 0.1)',
    backgroundHover: 'rgba(0, 122, 255, 0.15)',
    border: 'rgba(0, 122, 255, 0.2)',
    borderHover: 'rgba(0, 122, 255, 0.3)',
  },
  dark: {
    primary: '#0A84FF',
    primaryHover: '#0070E0',
    background: 'rgba(10, 132, 255, 0.1)',
    backgroundHover: 'rgba(10, 132, 255, 0.15)', 
    border: 'rgba(10, 132, 255, 0.2)',
    borderHover: 'rgba(10, 132, 255, 0.3)',
  }
};

// 更新主要按钮样式
const primaryButtonClassName = `px-6 py-3.5 rounded-xl
  bg-[#007AFF] hover:bg-[#0063CC] dark:bg-[#0A84FF] dark:hover:bg-[#0070E0]
  text-white font-medium text-sm
  transition-all duration-300
  shadow-lg shadow-[#007AFF]/25 dark:shadow-[#0A84FF]/25
  hover:shadow-xl hover:shadow-[#007AFF]/30 dark:hover:shadow-[#0A84FF]/30
  active:scale-[0.98]
  flex items-center justify-center gap-2`;

// 更新输入框样式
const appleInputClassName = `w-full px-4 py-2.5 rounded-xl
  bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-lg
  border border-gray-200/30 dark:border-[#2c2c2e]/50
  focus:outline-none focus:ring-2 
  focus:ring-[#007AFF]/40 dark:focus:ring-[#0A84FF]/40
  hover:border-[#007AFF]/30 dark:hover:border-[#0A84FF]/30
  text-[15px] leading-relaxed
  text-gray-800 dark:text-gray-200
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/40
  transition-all duration-300`;

// 更新表格样式
const tableClassName = `overflow-x-auto rounded-2xl 
  border border-gray-200/30 dark:border-gray-700/30
  bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
  shadow-lg`;

const tableHeaderClassName = `border-b 
  border-[#007AFF]/10 dark:border-[#0A84FF]/10
  bg-[#007AFF]/5 dark:bg-[#0A84FF]/5`;

// 修改表格内输入框基础样式
const tableInputClassName = `w-full px-3 py-2 rounded-xl
  bg-transparent backdrop-blur-sm
  border border-transparent
  focus:outline-none focus:ring-2 
  focus:ring-blue-500/30 dark:focus:ring-blue-400/30
  text-[14px] leading-relaxed 
  text-gray-800 dark:text-gray-200
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/40
  transition-all duration-300 ease-out
  hover:bg-gray-50/50 dark:hover:bg-[#1c1c1e]/50
  text-center`;

// Notes 输入框样式 - 统一更小的高度
const notesInputClassName = `w-full px-4 py-1 rounded-lg
  bg-white/60 dark:bg-gray-800/60
  border border-transparent
  focus:outline-none focus:ring-2 focus:ring-blue-500
  text-[14px] leading-relaxed text-gray-800 dark:text-gray-100
  placeholder:text-gray-400/70 dark:placeholder:text-gray-500/70
  transition-all duration-200 ease-out`;

// 数字输入框样式
const numberInputClassName = `${tableInputClassName}
  [appearance:textfield] 
  [&::-webkit-outer-spin-button]:appearance-none 
  [&::-webkit-inner-spin-button]:appearance-none
  text-center`;

// 下拉选择框样式 - 统一更小的高度
const selectClassName = `${appleInputClassName} 
  appearance-none 
  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
  bg-[length:1.25em_1.25em] 
  bg-[right_0.5rem_center] 
  bg-no-repeat
  pr-10`;

// 修改日期输入框样式，使其更紧凑
const dateInputClassName = `px-3 py-1.5 rounded-xl
  bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
  border border-gray-200/30 dark:border-gray-700/30
  focus:outline-none focus:ring-2 focus:ring-blue-500/40
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  text-sm leading-relaxed text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-out
  hover:border-gray-300/50 dark:hover:border-gray-600/50
  shadow-sm hover:shadow-md
  w-[140px]`; // 固定宽度

// 修改销售人员选择框样式，使其更紧凑
const salesSelectClassName = `px-3 py-1.5 rounded-xl
  bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
  border border-gray-200/30 dark:border-gray-700/30
  focus:outline-none focus:ring-2 focus:ring-blue-500/40
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  text-sm leading-relaxed text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-out
  hover:border-gray-300/50 dark:hover:border-gray-600/50
  shadow-sm hover:shadow-md
  appearance-none 
  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
  bg-[length:1em_1em] 
  bg-[right_0.5rem_center] 
  bg-no-repeat
  pr-8
  w-[140px]`; // 固定宽度

// 修改单位输入框样式，添加文本居中对齐
const unitInputClassName = `${tableInputClassName}
  text-center`;  // 添加文本居中

// 修改设置面板的基础样式，添加淡蓝色背景
const settingsPanelClassName = `bg-blue-50/80 dark:bg-blue-900/10 backdrop-blur-xl
  border border-blue-200/50 dark:border-blue-700/30
  rounded-2xl overflow-hidden
  shadow-lg shadow-blue-500/5
  p-4`;

// 单选按钮相关样式只保留这三个
const radioGroupClassName = `flex p-0.5 gap-1
  bg-gray-100/50 dark:bg-gray-900/50 
  rounded-lg
  border border-gray-200/50 dark:border-gray-700/50`;

const radioButtonClassName = `flex items-center justify-center px-3 py-1.5
  rounded-md
  text-xs font-medium
  transition-all duration-200
  cursor-pointer`;

const radioButtonActiveClassName = `bg-white dark:bg-gray-800 
  text-blue-500 dark:text-blue-400
  shadow-sm`;

// 修改复选框组样式
const checkboxGroupClassName = `flex gap-4 px-4 py-2.5
  bg-gray-50/50 dark:bg-gray-900/50
  border border-gray-200/50 dark:border-gray-700/50
  rounded-xl`;

export default function Quotation() {
  const [activeTab, setActiveTab] = useState('quotation');
  const [quotationData, setQuotationData] = useState<QuotationData>({
    to: '',
    date: new Date().toISOString().split('T')[0],
    from: 'Roger',
    inquiryNo: '',
    quotationNo: '',
    contractNo: 'FL25',
    currency: 'USD',
    paymentDate: new Date().toISOString().split('T')[0],
    items: [
      {
        lineNo: 1,
        partName: '',
        description: '',
        quantity: 0,
        unit: 'pc',
        unitPrice: 0,
        amount: 0,
        remarks: ''
      }
    ],
    notes: activeTab === 'quotation' 
      ? [
          'Delivery time: 30 days',
          'Price based on EXW-Shanghai, Mill TC',
          'Delivery terms: as mentioned above, subj to unsold',
          'Payment term: 50% deposit, the balance paid before delivery',
          'Validity: 5 days'
        ]
      : [
          'Order confirmed',
          'Delivery time: 30 days after payment received',
          'Payment term: 50% deposit, the balance paid before delivery',
          'Shipping term: EXW-Shanghai'
        ],
    amountInWords: {
      dollars: 'ZERO',
      cents: '',
      hasDecimals: false
    },
    bankInfo: '',
    showDescription: false,
    showRemarks: false
  });

  // 修改定义，使用索引来跟踪正在编辑的
  const [editingUnitPriceIndex, setEditingUnitPriceIndex] = useState<number | null>(null);
  const [editingUnitPrice, setEditingUnitPrice] = useState<string>('');

  // 添加新的状态来跟踪正在编辑的数量
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>('');

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    date: new Date().toISOString().split('T')[0],
    from: 'Roger',
    currency: 'USD',
    showDescription: false,
    showRemarks: false
  });

  const addLineItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        lineNo: prev.items.length + 1,
        partName: '',
        description: '',
        quantity: 0,
        unit: '',
        unitPrice: 0,
        amount: 0,
        remarks: ''
      }]
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: LineItem[keyof LineItem]) => {
    setQuotationData(prev => {
      const newItems = [...prev.items];
      const currentItem = { ...newItems[index] };
      
      // 更新当前字段
      (currentItem[field] as LineItem[keyof LineItem]) = value;
      
      // 如果新的是数量，自动更新单位的单复数形式
      if (field === 'quantity') {
        const quantity = Number(value);
        if (!currentItem.unit) {
          currentItem.unit = quantity <= 1 ? 'pc' : 'pcs';
        } else {
          const unitBase = currentItem.unit.replace(/s$/, '');
          currentItem.unit = quantity <= 1 ? unitBase : `${unitBase}s`;
        }
      }
      
      // 如果直接更新单位，也需要根据当前数量决定单复数
      if (field === 'unit') {
        const unitBase = (value as string).replace(/s$/, '');
        currentItem.unit = currentItem.quantity <= 1 ? unitBase : `${unitBase}s`;
      }
      
      // 如果更新的是数量或单价，重新计算金额
      if (field === 'quantity' || field === 'unitPrice') {
        currentItem.amount = Number(currentItem.quantity) * Number(currentItem.unitPrice);
      }
      
      newItems[index] = currentItem;
      return {
        ...prev,
        items: newItems
      };
    });
  };

  const getTotalAmount = () => {
    return quotationData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (activeTab) {
        case 'quotation':
          await generateQuotationPDF(quotationData, activeTab);
          break;
        case 'confirmation':
          await generateOrderConfirmationPDF(quotationData);
          break;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // TODO: 添加错误提示
    }
  };

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    CNY: '¥'
  };

  // 修改 setQuotationData 的调用方式
  const handleInputChange = (field: string, value: string) => {
    setQuotationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 移除 memo，简化组件实现
  const DocumentHeaderForm = ({ type }: { type: 'quotation' | 'confirmation' }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <textarea
          defaultValue={quotationData.to}
          onBlur={e => handleInputChange('to', e.target.value)}
          className={`${appleInputClassName} min-h-[60px] resize
            hover:border-gray-300 dark:hover:border-gray-600
            focus:border-blue-500 dark:focus:border-blue-500`}
          placeholder="Enter customer name and address"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Inquiry No.</label>
        <input
          type="text"
          defaultValue={quotationData.inquiryNo}
          onBlur={e => handleInputChange('inquiryNo', e.target.value)}
          className={appleInputClassName}
          placeholder="Inquiry No."
        />
      </div>
      {type === 'confirmation' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Contract No.</label>
          <input
            type="text"
            defaultValue={quotationData.contractNo}
            onBlur={e => handleInputChange('contractNo', e.target.value)}
            className={appleInputClassName}
            placeholder="Contract No."
          />
        </div>
      )}
    </div>
  );

  // 提取生成按钮为独组件
  const GenerateButton = ({ type }: { type: 'quotation' | 'confirmation' }) => (
    <button
      type="submit"
      className="w-full px-6 py-4 rounded-2xl
                bg-blue-500 hover:bg-blue-600
                text-white font-medium
                transition-all duration-300
                shadow-lg shadow-blue-500/25
                hover:shadow-xl hover:shadow-blue-500/30
                hover:-translate-y-0.5
                active:scale-[0.98]
                flex items-center justify-center gap-2"
    >
      <Download className="h-5 w-5" />
      Generate {type === 'quotation' ? 'Quotation' : 'Order Confirmation'}
    </button>
  );

  // 比如移除或简化些作用
  useEffect(() => {
    // 移除或简化不必要副作用
  }, [quotationData]);

  // 在件加载时同时状态
  useEffect(() => {
    setQuotationData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0],
      from: 'Roger',
      currency: 'USD'
    }));
  }, []);

  // 当 quotationData 变化时更新 headerData
  useEffect(() => {
    setQuotationData(prev => ({
      ...prev,
      to: quotationData.to,
      inquiryNo: quotationData.inquiryNo,
      quotationNo: quotationData.quotationNo,
      contractNo: quotationData.contractNo
    }));
  }, [quotationData.to, quotationData.inquiryNo, quotationData.quotationNo, quotationData.contractNo]);

  // 添加获取销售人员特定notes的函数
  const getSalesPersonNotes = (salesPerson: string, type: string) => {
    if (salesPerson === 'Sharon' && type === 'quotation') {
      return [
        'Price based on EXW-JIANG SU, CHINA.',
        'Delivery terms: as mentioned above,subj to unsold',
        'Excluding handling & packing charge and freight cost',
        'Payment term: 30 days',
        'Validity: 20 days',
      ];
    }
    
    // 默认值
    return type === 'quotation'
      ? [
          'Delivery time: 30 days',
          'Price based on EXW-Shanghai, Mill TC',
          'Delivery terms: as mentioned above, subj to unsold',
          'Payment term: 50% deposit, the balance paid before delivery',
          'Validity: 5 days',
        ]
      : [
          'Delivery time: 30 days after payment received',
          'Payment term: 50% deposit, the balance paid before delivery',
          'Shipping term: EXW-Shanghai',
        ];
  };

  // 在设置面板中，当销售人员变化时更新 notes
  const handleSalesPersonChange = (newSalesPerson: string) => {
    setSettings(prev => ({ ...prev, from: newSalesPerson }));
    setQuotationData(prev => ({
      ...prev,
      from: newSalesPerson,
      notes: getSalesPersonNotes(newSalesPerson, activeTab)
    }));
  };

  // 在设置面板中修改币种时，需要同步更新到 quotationData
  const handleCurrencyChange = (newCurrency: string) => {
    setSettings(prev => ({ ...prev, currency: newCurrency }));
    setQuotationData(prev => ({ ...prev, currency: newCurrency }));
  };

  // 在 settings 变化时同步更新 quotationData
  useEffect(() => {
    setQuotationData(prev => ({
      ...prev,
      showDescription: settings.showDescription,
      showRemarks: settings.showRemarks
    }));
  }, [settings.showDescription, settings.showRemarks]);

  // 修改 useEffect，同时考��� activeTab 变化时的更新
  useEffect(() => {
    setQuotationData(prev => ({
      ...prev,
      notes: getSalesPersonNotes(prev.from, activeTab)
    }));
  }, [activeTab]); // 依赖于 activeTab

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#000000]">
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-6 py-8">
          {/* 回按钮样式优化 */}
          <Link 
            href="/" 
            className="group inline-flex items-center px-5 py-2.5 rounded-2xl
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
                      border border-gray-200/30 dark:border-gray-700/30
                      text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
                      transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                      hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          {/* 标题切换样式优化 */}
          <div className="flex justify-center gap-3 mb-6 mt-6">
            {['quotation', 'confirmation'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-300
                  ${activeTab === tab 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-md'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* 主内区域样式优化 */}
          <div className="bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl
                  shadow-2xl border border-gray-200/30 dark:border-[#2c2c2e]/50
                  rounded-[2.5rem] p-8
                  hover:shadow-3xl transition-all duration-500">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)] flex-1">
                  {documentTypes[activeTab].title}
                </h2>
                
                <div className="w-48">
                  <input
                    type="text"
                    defaultValue={quotationData.quotationNo}
                    onBlur={e => handleInputChange('quotationNo', e.target.value)}
                    placeholder={documentTypes[activeTab].numberPlaceholder}
                    className="w-full px-4 py-2 rounded-xl 
                              bg-white/50 dark:bg-gray-900/50
                              border border-gray-200/50 dark:border-gray-700/50
                              hover:border-gray-300 dark:hover:border-gray-600
                              focus:ring-2 focus:ring-blue-500/30
                              text-sm"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowSettings(prev => !prev)}
                  className="inline-flex items-center justify-center p-2 
                            rounded-xl border border-gray-200/50 dark:border-gray-700/50
                            bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg
                            text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
                            transition-all hover:shadow-lg hover:scale-[1.02]
                            group"
                  title="Settings"
                >
                  <Settings className="h-5 w-5 transition-transform group-hover:rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${showSettings ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className={`${settingsPanelClassName}
                    dark:bg-[#1c1c1e]/80 
                    dark:border-[#2c2c2e]/50`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 日期选择 - 移除标题 */}
                      <input
                        type="date"
                        value={settings.date}
                        onChange={e => setSettings(prev => ({ ...prev, date: e.target.value }))}
                        className={appleInputClassName}
                      />
                      
                      {/* 销售人员选择 - 移除标题 */}
                      <select
                        value={settings.from}
                        onChange={e => handleSalesPersonChange(e.target.value)}
                        className={`${appleInputClassName} appearance-none 
                          bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
                          bg-[length:1em_1em] 
                          bg-[right_1rem_center] 
                          bg-no-repeat
                          pr-10`}
                      >
                        <option value="Roger">Roger</option>
                        <option value="Sharon">Sharon</option>
                        <option value="Emily">Emily</option>
                        <option value="Summer">Summer</option>
                        <option value="Nina">Nina</option>
                      </select>

                      {/* 币种选择 - 移除标题 */}
                      <div className={`${radioGroupClassName} h-[38px]`}>
                        {Object.entries(currencySymbols).map(([currency, symbol]) => (
                          <label
                            key={currency}
                            className={`${radioButtonClassName} flex-1 ${
                              settings.currency === currency ? radioButtonActiveClassName : 
                              'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="currency"
                              value={currency}
                              checked={settings.currency === currency}
                              onChange={e => handleCurrencyChange(e.target.value)}
                              className="sr-only"
                            />
                            <span>{symbol}</span>
                          </label>
                        ))}
                      </div>

                      {/* 显示选项 - 移除标题 */}
                      <div className={`${checkboxGroupClassName} h-[38px]`}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.showDescription}
                            onChange={e => setSettings(prev => ({ 
                              ...prev, 
                              showDescription: e.target.checked 
                            }))}
                            className="w-3.5 h-3.5 rounded 
                              border-gray-300 dark:border-gray-600
                              text-blue-500 
                              focus:ring-blue-500/40
                              cursor-pointer"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Description
                          </span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.showRemarks}
                            onChange={e => setSettings(prev => ({ 
                              ...prev, 
                              showRemarks: e.target.checked 
                            }))}
                            className="w-3.5 h-3.5 rounded 
                              border-gray-300 dark:border-gray-600
                              text-blue-500 
                              focus:ring-blue-500/40
                              cursor-pointer"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Remarks
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <DocumentHeaderForm type={activeTab as 'quotation' | 'confirmation'} />

                {/* 商品表表格样式优化 */}
                <div className={`${tableClassName}
                  dark:bg-[#1c1c1e]/90`}>
                  <table className="w-full min-w-[800px]">
                    <thead className={`${tableHeaderClassName}
                      dark:bg-[#1c1c1e]/90`}>
                      <tr className="border-b border-gray-200/30 dark:border-[#2c2c2e]/50
                           bg-gray-50/50 dark:bg-[#1c1c1e]/50">
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '40px' }}>No.</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ minWidth: '80px' }}>Part Name</th>
                        {settings.showDescription && (
                          <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ minWidth: '120px' }}>Description</th>
                        )}
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Q'TY</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '80px' }}>Unit</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>U/Price</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Amount</th>
                        {settings.showRemarks && (
                          <th className="py-2 px-1 text-center text-xs font-bold opacity-90">Remarks</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {quotationData.items.map((item, index) => (
                        <tr key={item.lineNo} 
                            className="border-b border-[var(--card-border)] hover:bg-[var(--background)] transition-colors">
                          <td className="py-1 px-1 text-sm">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full 
                                           hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setQuotationData(prev => ({
                                      ...prev,
                                      items: prev.items.filter((_, i) => i !== index) // 删除对应行
                                    }));
                                  }}>
                                {index + 1}
                              </span>
                          </td>
                          <td className="py-1.5 px-1">
                            <input
                              type="text"
                              value={item.partName}
                              onChange={e => updateLineItem(index, 'partName', e.target.value)}
                              className={`${tableInputClassName} 
                                dark:bg-[#1c1c1e]/50 
                                dark:border-[#2c2c2e]/50
                                dark:placeholder-gray-500/40
                                dark:text-gray-300`}
                              placeholder="Part name"
                            />
                          </td>
                          {settings.showDescription && (
                            <td className="py-1 px-1">
                              <textarea
                                value={item.description}
                                onChange={e => updateLineItem(index, 'description', e.target.value)}
                                rows={1}
                                className={`${tableInputClassName} resize min-h-[28px]
                                  hover:border-gray-300 dark:hover:border-gray-600
                                  focus:border-blue-500 dark:focus:border-blue-500`}
                                placeholder="Enter description"
                              />
                            </td>
                          )}
                          <td className="py-1.5 px-1" style={{ width: '100px' }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editingQuantityIndex === index ? editingQuantity : (item.quantity || '')}
                              onChange={e => {
                                const inputValue = e.target.value;
                                // 允许空值和数字输入
                                if (/^\d*$/.test(inputValue)) {
                                  setEditingQuantity(inputValue);
                                  const value = parseInt(inputValue);
                                  if (!isNaN(value) || inputValue === '') {
                                    updateLineItem(index, 'quantity', value || 0);
                                  }
                                }
                              }}
                              onFocus={(e) => {
                                setEditingQuantityIndex(index);
                                setEditingQuantity(item.quantity === 0 ? '' : item.quantity.toString());
                                e.target.select();
                              }}
                              onBlur={() => {
                                setEditingQuantityIndex(null);
                                setEditingQuantity('');
                              }}
                              className={numberInputClassName}
                            />
                          </td>
                          <td className="py-1.5 px-1">
                            <select
                              value={item.unit ? item.unit.replace(/s$/, '') : 'pc'}
                              onChange={e => {
                                const baseUnit = e.target.value;
                                const unit = item.quantity <= 1 ? baseUnit : `${baseUnit}s`;
                                updateLineItem(index, 'unit', unit);
                              }}
                              className={`${tableInputClassName} 
                                appearance-none 
                                bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
                                bg-[length:1em_1em] 
                                bg-[right_0.5rem_center] 
                                bg-no-repeat
                                pr-8
                                w-full
                                text-center
                                hover:bg-gray-50/50 dark:hover:bg-gray-800/50
                                focus:ring-2 focus:ring-blue-500/30
                                transition-all duration-200`}
                            >
                              <option value="pc">pc{item.quantity > 1 ? 's' : ''}</option>
                              <option value="set">set{item.quantity > 1 ? 's' : ''}</option>
                              <option value="length">length{item.quantity > 1 ? 's' : ''}</option>
                            </select>
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editingUnitPriceIndex === index ? editingUnitPrice : (item.unitPrice ? item.unitPrice.toFixed(2) : '')}
                              onChange={e => {
                                const inputValue = e.target.value;
                                if (/^\d*\.?\d{0,2}$/.test(inputValue) || inputValue === '') {
                                  setEditingUnitPrice(inputValue);
                                  const value = parseFloat(inputValue);
                                  if (!isNaN(value)) {
                                    const roundedValue = Math.round(value * 100) / 100;
                                    updateLineItem(index, 'unitPrice', roundedValue);
                                  } else if (inputValue === '') {
                                    updateLineItem(index, 'unitPrice', 0);
                                  }
                                }
                              }}
                              onFocus={(e) => {
                                setEditingUnitPriceIndex(index);
                                setEditingUnitPrice(item.unitPrice === 0 ? '' : item.unitPrice.toString());
                                e.target.select();
                              }}
                              onBlur={() => {
                                setEditingUnitPriceIndex(null);
                                setEditingUnitPrice('');
                              }}
                              className={numberInputClassName}
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              value={item.amount ? item.amount.toFixed(2) : '0.00'}
                              readOnly
                              className={numberInputClassName}
                            />
                          </td>
                          {settings.showRemarks && (
                            <td className="py-1 px-1">
                              <textarea
                                value={item.remarks}
                                onChange={e => updateLineItem(index, 'remarks', e.target.value)}
                                rows={1}
                                className={`${tableInputClassName} resize min-h-[28px]
                                  hover:border-gray-300 dark:hover:border-gray-600
                                  focus:border-blue-500 dark:focus:border-blue-500`}
                                placeholder="Enter remarks"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 表格下方区域重新设计 */}
                <div className="space-y-6 mt-4">
                  {/* 作 - 合并添加行按钮和金额 */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="px-5 py-2.5 rounded-xl
                                bg-blue-500/10 text-blue-600 dark:text-blue-400
                                hover:bg-blue-500/15 transition-all duration-300
                                text-sm font-medium flex items-center gap-2"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add Line
                    </button>
                    
                    <div className="flex items-center gap-3" style={{ marginRight: '8.33%' }}>
                      <span className="text-sm font-medium text-gray-500">Total Amount</span>
                      <div className="w-[100px] text-right">
                        <span className="text-xl font-semibold tracking-tight">
                          {currencySymbols[quotationData.currency]}{getTotalAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 银行信息区域 - 只在 confirmation 选项卡显示 */}
                  {activeTab === 'confirmation' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Bank Information:</label>
                      <textarea
                        value={quotationData.bankInfo}
                        onChange={e => setQuotationData(prev => ({ ...prev, bankInfo: e.target.value }))}
                        className={`${appleInputClassName} min-h-[60px]`}
                        placeholder="Enter bank information"
                        rows={2}
                      />
                    </div>
                  )}
                  {/* Notes 部分重新设计 */}
                  <div className="space-y-2.5 
                    bg-gray-50/50 dark:bg-[#1c1c1e]/50
                    rounded-xl p-4 
                    border border-gray-200/30 dark:border-[#2c2c2e]/50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {activeTab === 'quotation' ? 'Notes:' : 'Terms & Conditions:'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setQuotationData(prev => ({
                            ...prev,
                            notes: [...prev.notes, '']
                          }));
                        }}
                        className="px-2 py-1 rounded-lg
                                  text-blue-600 dark:text-blue-400
                                  hover:bg-blue-500/10 
                                  transition-all duration-300
                                  text-sm font-medium 
                                  flex items-center gap-1"
                      >
                        <span className="text-lg leading-none">+</span>
                        <span className="text-xs">Add Note</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {quotationData.notes.map((note, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span 
                            className="flex items-center justify-center w-6 h-6 rounded-full 
                                      text-xs text-gray-400
                                      hover:bg-red-100 hover:text-red-600 
                                      cursor-pointer transition-colors"
                            onClick={() => {
                              setQuotationData(prev => ({
                                ...prev,
                                notes: prev.notes.filter((_, i) => i !== index)
                              }));
                            }}
                            title="Click to delete"
                          >
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={note}
                            onChange={e => {
                              const newNotes = [...quotationData.notes];
                              newNotes[index] = e.target.value;
                              setQuotationData(prev => ({ ...prev, notes: newNotes }));
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg
                                      bg-white/60 dark:bg-gray-800/60
                                      border border-transparent
                                      focus:outline-none focus:ring-1 focus:ring-blue-500/30
                                      text-sm text-gray-700 dark:text-gray-300
                                      placeholder:text-gray-400/70 dark:placeholder:text-gray-500/70"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 生成按钮样式优化 */}
                  <button
                    type="submit"
                    className={primaryButtonClassName}
                  >
                    <Download className="h-4 w-4" />
                    Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 