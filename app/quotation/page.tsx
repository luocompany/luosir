"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { generateQuotationPDF } from '../utils/pdfGenerator';

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
  yourRef: string;
  ourRef: string;
  currency: string;
  items: LineItem[];
  notes: string[];
}

export default function Quotation() {
  const [activeTab, setActiveTab] = useState('quotation');
  const [quotationData, setQuotationData] = useState<QuotationData>({
    to: '',
    date: new Date().toISOString().split('T')[0],
    from: 'Roger',
    yourRef: '',
    ourRef: '',
    currency: 'USD',
    items: [
      {
        lineNo: 1,
        partName: '',
        description: '',
        quantity: 0,
        unit: '',
        unitPrice: 0,
        amount: 0,
        remarks: ''
      }
    ],
    notes: [
      'Delivery time: 30 days',
      'Price based on EXW-Shanghai, Mill TC',
      'Delivery terms: as mentioned above, subj to unsold',
      'Payment term: 30% deposit, the balance paid before delivery',
      'Validity: 5 days'
    ]
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

      if (field === 'quantity') {
        const newQuantity = typeof value === 'string' ? parseFloat(value) : value;
        if (!currentItem.unit) {
          currentItem.unit = newQuantity <= 1 ? 'pc' : 'pcs';
        } else {
          if (newQuantity <= 1) {
            currentItem.unit = currentItem.unit.replace(/s$/, '');
          } else {
            if (!currentItem.unit.endsWith('s')) {
              currentItem.unit = currentItem.unit + 's';
            }
          }
        }
        currentItem.quantity = newQuantity;
      } else {
        (currentItem[field] as LineItem[keyof LineItem]) = value;
      }

      if (field === 'quantity' || field === 'unitPrice') {
        currentItem.amount = currentItem.quantity * currentItem.unitPrice;
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
      generateQuotationPDF(quotationData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // TODO: ��加错误提示
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-6 py-10 mt-14 flex-grow">
        {/* 返回按钮 */}
        <div className="flex items-center mb-8">
          <Link 
            href="/" 
            className="group inline-flex items-center px-4 py-2 rounded-full 
                    bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                    border border-gray-200/50 dark:border-gray-700/50 
                    text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
                    transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* 标签切换 */}
        <div className="flex justify-center gap-3 mb-6">
          <button 
            onClick={() => setActiveTab('quotation')}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'quotation' 
                ? 'bg-[var(--blue-accent)] text-white' 
                : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Quotation
          </button>
          <button 
            onClick={() => setActiveTab('confirmation')}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'confirmation' 
                ? 'bg-[var(--blue-accent)] text-white' 
                : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Order Confirmation
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6">
          {activeTab === 'quotation' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Generate Quotation</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-[var(--foreground)] opacity-70">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={quotationData.to}
                      onChange={e => setQuotationData(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--card-border)]
                                bg-[var(--background)] text-sm transition-all
                                focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-opacity-50
                                focus:border-[var(--blue-accent)] outline-none"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Quotation Date</label>
                    <input
                      type="date"
                      value={quotationData.date}
                      onChange={e => setQuotationData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-xs"
                      placeholder="Quotation Date"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Customer Reference</label>
                    <input
                      type="text"
                      value={quotationData.yourRef}
                      onChange={e => setQuotationData(prev => ({ ...prev, yourRef: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-xs"
                      placeholder="Customer Reference"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Sales Person</label>
                    <select
                      value={quotationData.from}
                      onChange={e => setQuotationData(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-xs"
                    >
                      <option value="Roger">Roger</option>
                      <option value="Sharon">Sharon</option>
                      <option value="Emily">Emily</option>
                      <option value="Summer">Summer</option>
                      <option value="Nina">Nina</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Our Reference</label>
                    <input
                      type="text"
                      value={quotationData.ourRef}
                      onChange={e => setQuotationData(prev => ({ ...prev, ourRef: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-xs"
                      placeholder="Our Reference"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Currency</label>
                    <select
                      value={quotationData.currency}
                      onChange={e => setQuotationData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] text-xs"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="CNY">CNY</option>
                      <option value="JPY">JPY</option>
                      {/* 可以根据需要添加更多币种 */}
                    </select>
                  </div>
                </div>

                {/* 商品列表 */}
                <div className="overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--background)]">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[var(--card-border)] bg-[var(--background)]">
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ width: '40px' }}>No.</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ width: '120px' }}>Part Name</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70">Description</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ width: '60px' }}>Q'TY</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ width: '60px' }}>Unit</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ minWidth: '80px' }}>U/Price</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70" style={{ minWidth: '80px', whiteSpace: 'nowrap' }}>Amount</th>
                        <th className="py-2 px-1 text-left text-xs font-medium opacity-70">Remarks</th>
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
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              value={item.partName}
                              onChange={e => updateLineItem(index, 'partName', e.target.value)}
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              value={item.description}
                              onChange={e => updateLineItem(index, 'description', e.target.value)}
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={item.quantity}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value) && value >= 0) { // 确保输入为数字且不为负数
                                  updateLineItem(index, 'quantity', value);
                                }
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
                            <select
                              value={item.unit}
                              onChange={e => updateLineItem(index, 'unit', e.target.value)}
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none"
                            >
                              <option value={item.quantity <= 1 ? "pc" : "pcs"}>
                                {item.quantity <= 1 ? "pc" : "pcs"}
                              </option>
                              <option value={item.quantity <= 1 ? "set" : "sets"}>
                                {item.quantity <= 1 ? "set" : "sets"}
                              </option>
                              <option value={item.quantity <= 1 ? "length" : "lengths"}>
                                {item.quantity <= 1 ? "length" : "lengths"}
                              </option>
                            </select>
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="number"
                              value={item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0) { // 确保单价不为负数
                                  updateLineItem(index, 'unitPrice', value);
                                }
                              }}
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none"
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
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={e => updateLineItem(index, 'remarks', e.target.value)}
                              className="w-full px-1 py-1 rounded-lg border border-transparent 
                                       bg-transparent text-sm transition-all
                                       hover:border-[var(--card-border)]
                                       focus:border-[var(--blue-accent)] focus:ring-1 
                                       focus:ring-[var(--blue-accent)] outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 添加行按钮 */}
                <button
                  type="button"
                  onClick={addLineItem}
                  className="px-5 py-2.5 rounded-xl border border-[var(--blue-accent)] 
                           text-[var(--blue-accent)] hover:bg-[var(--blue-accent)] 
                           hover:text-white transition-all text-sm font-medium
                           focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-opacity-50"
                >
                  + Add Line
                </button>

                {/* 总金额 */}
                <div className="flex justify-end space-x-4 items-center bg-[var(--background)] 
                                p-4 rounded-xl border border-[var(--card-border)]">
                  <span className="text-sm font-medium opacity-70">Total Amount</span>
                  <span className="text-xl font-semibold">
                    {getTotalAmount().toFixed(2)} {quotationData.currency}
                  </span>
                </div>

                {/* 注意事项 */}
                <div className="space-y-2">
                  <h3 className="font-medium">Notes:</h3>
                  {quotationData.notes.map((note, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-xs">{index + 1}.</span>
                      <input
                        type="text"
                        value={note}
                        onChange={e => {
                          const newNotes = [...quotationData.notes];
                          newNotes[index] = e.target.value;
                          setQuotationData(prev => ({ ...prev, notes: newNotes }));
                        }}
                        className="flex-1 px-2 py-1 rounded border border-[var(--card-border)] bg-[var(--background)] text-xs"
                      />
                    </div>
                  ))}
                </div>

                {/* 生成按钮 */}
                <button
                  type="submit"
                  className="w-full mt-8 px-6 py-3.5 rounded-xl bg-[var(--blue-accent)] 
                           text-white font-medium hover:opacity-90 transition-all
                           focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-opacity-50
                           flex items-center justify-center gap-2 text-sm shadow-lg
                           hover:shadow-xl active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  Generate Quotation
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Generate Order Confirmation</h2>
              {/* TODO: Add order confirmation form content */}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 