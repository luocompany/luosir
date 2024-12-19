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
  items: LineItem[];
  notes: string[];
}

interface SettingsData {
  date: string;
  from: string;
  currency: string;
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
    title: 'Generate Order Confirmation',
    customerLabel: 'Customer Name',
    numberLabel: 'Quotation No.',
    numberPlaceholder: 'Quotation No.',
    showContractNo: true
  }
};

// 修改主要输入框样式 - 更符合 Apple 风格
const inputClassName = `w-full px-4 py-2.5 rounded-2xl
  bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
  border border-gray-200/30 dark:border-gray-700/30
  focus:outline-none focus:ring-2 focus:ring-blue-500/40
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  text-[15px] leading-relaxed text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-out
  hover:border-gray-300/50 dark:hover:border-gray-600/50
  shadow-sm hover:shadow-md`;

// 修改表格内输入框基础样式
const tableInputClassName = `w-full px-3 py-2 rounded-xl
  bg-transparent backdrop-blur-sm
  border border-transparent
  focus:outline-none focus:ring-2 focus:ring-blue-500/30
  text-[14px] leading-relaxed text-gray-800 dark:text-gray-100
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  transition-all duration-300 ease-out
  hover:bg-gray-50/50 dark:hover:bg-gray-800/50
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
const selectClassName = `${inputClassName} 
  appearance-none 
  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
  bg-[length:1.25em_1.25em] 
  bg-[right_0.5rem_center] 
  bg-no-repeat
  pr-10`;

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
        ]
  });

  // 修改定义，使用索引来跟踪正在编辑的行
  const [editingUnitPriceIndex, setEditingUnitPriceIndex] = useState<number | null>(null);
  const [editingUnitPrice, setEditingUnitPrice] = useState<string>('');

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    date: new Date().toISOString().split('T')[0],
    from: 'Roger',
    currency: 'USD'
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
      
      // 如果更新的是数量，自动更新单位的单复数形式
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'quotation') {
        generateQuotationPDF(quotationData);
      } else {
        generateOrderConfirmationPDF(quotationData);
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
          className={`${inputClassName} min-h-[60px] resize
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
          className={inputClassName}
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
            className={inputClassName}
            placeholder="Contract No."
          />
        </div>
      )}
    </div>
  );

  // 提取生成按钮为独立组件
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

  // 检查是否有其他地方在输入过程中触发了状态更新
  // 比如移除或简化这些作用
  useEffect(() => {
    // 移除或简化不必要的副作用
  }, [quotationData]);

  // 在件加载时同步状态
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-6 py-8">
          {/* 返回按钮样式优化 */}
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
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* 标签切换样式优化 */}
          <div className="flex justify-center gap-3 mb-8 mt-6">
            <button 
              onClick={() => setActiveTab('quotation')}
              className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-300
                ${activeTab === 'quotation' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-md'
                }`}
            >
              Quotation
            </button>
            <button 
              onClick={() => setActiveTab('confirmation')}
              className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-300
                ${activeTab === 'confirmation' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-md'
                }`}
            >
              Order Confirmation
            </button>
          </div>

          {/* 主内容区域样式优化 */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl
                  shadow-2xl border border-gray-200/30 dark:border-gray-700/30
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
                  onClick={() => setShowSettings(true)}
                  title="Date, Sales Person, Currency"
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <DocumentHeaderForm type={activeTab as 'quotation' | 'confirmation'} />

                {/* 设置弹窗 */}
                {showSettings && (
                  <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl
                                    rounded-2xl p-6 w-full max-w-md m-4
                                    border border-gray-200/20 dark:border-gray-700/20
                                    shadow-xl">
                      <h3 className="text-lg font-semibold mb-4">Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Date</label>
                          <input
                            type="date"
                            value={settings.date}
                            onChange={e => setSettings(prev => ({ ...prev, date: e.target.value }))}
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Sales Person</label>
                          <select
                            value={settings.from}
                            onChange={e => setSettings(prev => ({ ...prev, from: e.target.value }))}
                            className={selectClassName}
                          >
                            <option value="Roger">Roger</option>
                            <option value="Sharon">Sharon</option>
                            <option value="Emily">Emily</option>
                            <option value="Summer">Summer</option>
                            <option value="Nina">Nina</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Currency</label>
                          <select
                            value={settings.currency}
                            onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                            className={selectClassName}
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="CNY">CNY</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          onClick={() => setShowSettings(false)}
                          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setQuotationData(prev => ({
                              ...prev,
                              date: settings.date,
                              from: settings.from,
                              currency: settings.currency
                            }));
                            setShowSettings(false);
                          }}
                          className="px-4 py-2 rounded-lg bg-[var(--blue-accent)] text-white text-sm font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 商品列表表格样式优化 */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200/30 dark:border-gray-700/30
                      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200/30 dark:border-gray-700/30
                           bg-gray-50/50 dark:bg-gray-800/50">
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '40px' }}>No.</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ minWidth: '80px' }}>Part Name</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ minWidth: '120px' }}>Description</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Q'TY</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Unit</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>U/Price</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Amount</th>
                        <th className="py-2 px-1 text-center text-xs font-bold opacity-90">Remarks</th>
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
                              className={tableInputClassName}
                              placeholder="Part name"
                            />
                          </td>
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
                          <td className="py-1.5 px-1" style={{ width: '100px' }}>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={e => {
                                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                  updateLineItem(index, 'quantity', value);
                                }
                              }}
                              className={numberInputClassName}
                              min="0"
                              step="1"
                            />
                          </td>
                          <td className="py-1.5 px-1" style={{ width: '100px' }}>
                            <select
                              value={item.unit ? item.unit.replace(/s$/, '') : 'pc'}
                              onChange={e => {
                                const baseUnit = e.target.value;
                                const unit = item.quantity <= 1 ? baseUnit : `${baseUnit}s`;
                                updateLineItem(index, 'unit', unit);
                              }}
                              className={`${tableInputClassName} pr-8 appearance-none 
                                bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
                                bg-[length:1em_1em] 
                                bg-[right_0.5rem_center] 
                                bg-no-repeat`}
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
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none
                                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="number"
                              value={item.amount ? item.amount.toFixed(2) : '0.00'}
                              readOnly
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none
                                       whitespace-nowrap"
                            />
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 表格下方区域重新设计 */}
                <div className="space-y-6 mt-4">
                  {/* 操作栏 - 合并添加行按钮和总金额 */}
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

                  {/* Notes 部分重新设计 */}
                  <div className="space-y-2.5 bg-gray-50/50 dark:bg-gray-900/50 
                                    rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Notes</h3>
                    <div className="space-y-2">
                      {quotationData.notes.map((note, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-4">{index + 1}.</span>
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
                    className="w-full px-6 py-3.5 rounded-xl
                              bg-blue-500 hover:bg-blue-600
                              text-white font-medium text-sm
                              transition-all duration-300
                              shadow-lg shadow-blue-500/25
                              hover:shadow-xl hover:shadow-blue-500/30
                              active:scale-[0.98]
                              flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Generate {activeTab === 'quotation' ? 'Quotation' : 'Order Confirmation'}
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