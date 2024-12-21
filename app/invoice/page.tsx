"use client";

import { useState } from 'react';
import Footer from '../components/Footer';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import Link from 'next/link';

interface LineItem {
  lineNo: number;
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  invoiceNo: string;
  date: string;
  to: string;
  from: string;
  inquiryNo: string;
  currency: string;
  items: LineItem[];
  paymentTerms: string;
  shippingTerms: string;
  portOfLoading: string;
  portOfDischarge: string;
}

interface SettingsData {
  date: string;
  currency: string;
  showHsCode: boolean;
}

const inputClassName = `w-full px-4 py-2.5 rounded-2xl
  bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
  border border-gray-200/30 dark:border-gray-700/30
  focus:outline-none focus:ring-2 focus:ring-blue-500/40
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  text-[15px] leading-relaxed text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-out
  hover:border-gray-300/50 dark:hover:border-gray-600/50
  shadow-sm hover:shadow-md`;

const tableInputClassName = `w-full px-3 py-2 rounded-xl
  bg-transparent backdrop-blur-sm
  border border-transparent
  focus:outline-none focus:ring-2 focus:ring-blue-500/30
  text-[14px] leading-relaxed text-gray-800 dark:text-gray-100
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  transition-all duration-300 ease-out
  hover:bg-gray-50/50 dark:hover:bg-gray-800/50
  text-center`;

const numberInputClassName = `${tableInputClassName}
  [appearance:textfield] 
  [&::-webkit-outer-spin-button]:appearance-none 
  [&::-webkit-inner-spin-button]:appearance-none
  text-center`;

export default function Invoice() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    to: '',
    from: '',
    inquiryNo: '',
    currency: 'USD',
    items: [{
      lineNo: 1,
      hsCode: '',
      description: '',
      quantity: 0,
      unit: 'pc',
      unitPrice: 0,
      amount: 0,
    }],
    paymentTerms: 'T/T IN ADVANCE',
    shippingTerms: 'FOB SHANGHAI',
    portOfLoading: 'SHANGHAI, CHINA',
    portOfDischarge: ''
  });

  const [editingUnitPriceIndex, setEditingUnitPriceIndex] = useState<number | null>(null);
  const [editingUnitPrice, setEditingUnitPrice] = useState<string>('');
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>('');

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    showHsCode: true
  });

  const addLineItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, {
        lineNo: prev.items.length + 1,
        hsCode: '',
        description: '',
        quantity: 0,
        unit: 'pc',
        unitPrice: 0,
        amount: 0,
      }]
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: LineItem[keyof LineItem]) => {
    setInvoiceData(prev => {
      const newItems = [...prev.items];
      const currentItem = { ...newItems[index] };
      
      (currentItem[field] as LineItem[keyof LineItem]) = value;
      
      if (field === 'quantity') {
        const quantity = Number(value);
        if (!currentItem.unit) {
          currentItem.unit = quantity <= 1 ? 'pc' : 'pcs';
        } else {
          const unitBase = currentItem.unit.replace(/s$/, '');
          currentItem.unit = quantity <= 1 ? unitBase : `${unitBase}s`;
        }
      }
      
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
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现生成PDF的功能
    console.log('Generating invoice PDF...', invoiceData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50/90 via-white/60 to-gray-100/90 
                    dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900/90">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <Link 
            href="/tools" 
            className="group inline-flex items-center px-4 py-2 rounded-full 
                      bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg 
                      border border-gray-200/50 dark:border-gray-700/50 
                      text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 
                      transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl 
                      rounded-[2rem] shadow-xl p-8
                      border border-gray-200/50 dark:border-gray-700/50 
                      hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
            <div className="flex items-center gap-4">
              <div className="space-y-0">
                <input
                  type="text"
                  value={invoiceData.invoiceNo}
                  onChange={e => setInvoiceData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  className={`${inputClassName} !py-2`}
                  placeholder="Invoice No."
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
          </div>

          <div className={`mb-4 overflow-hidden transition-all duration-300 ease-in-out
                          ${showSettings ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gray-50/50 dark:bg-gray-900/50 
                          rounded-2xl p-6 
                          border border-gray-200/30 dark:border-gray-700/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={settings.date}
                    onChange={e => {
                      setSettings(prev => ({ ...prev, date: e.target.value }));
                      setInvoiceData(prev => ({ ...prev, date: e.target.value }));
                    }}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={e => {
                      setSettings(prev => ({ ...prev, currency: e.target.value }));
                      setInvoiceData(prev => ({ ...prev, currency: e.target.value }));
                    }}
                    className={`${inputClassName} pr-8 appearance-none 
                      bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')] 
                      bg-[length:1.25em_1.25em] 
                      bg-[right_0.5rem_center] 
                      bg-no-repeat`}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Display Options</label>
                  <div className="flex items-center h-[42px] px-4">
                    <input
                      type="checkbox"
                      checked={settings.showHsCode}
                      onChange={e => setSettings(prev => ({ ...prev, showHsCode: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 
                                focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      HS Code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <textarea
                  value={invoiceData.to}
                  onChange={e => setInvoiceData(prev => ({ ...prev, to: e.target.value }))}
                  className={`${inputClassName} min-h-[60px] resize
                    hover:border-gray-300 dark:hover:border-gray-600
                    focus:border-blue-500 dark:focus:border-blue-500`}
                  placeholder="Enter customer name and address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Customer P/O No.</label>
                <input
                  type="text"
                  value={invoiceData.inquiryNo}
                  onChange={e => setInvoiceData(prev => ({ ...prev, inquiryNo: e.target.value }))}
                  className={inputClassName}
                  placeholder="Enter customer P/O number"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200/30 dark:border-gray-700/30
                  bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200/30 dark:border-gray-700/30
                       bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '40px' }}>No.</th>
                    <th className={`py-2 px-1 text-center text-xs font-bold opacity-90 ${
                      !settings.showHsCode && 'hidden'
                    }`} style={{ width: '120px' }}>
                      HS Code
                    </th>
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90">Description</th>
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Q'TY</th>
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Unit</th>
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>U/Price</th>
                    <th className="py-2 px-1 text-center text-xs font-bold opacity-90" style={{ width: '100px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={item.lineNo} 
                        className="border-b border-gray-200/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-1 px-1 text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full 
                                       hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors"
                              onClick={() => {
                                setInvoiceData(prev => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                }));
                              }}>
                                {index + 1}
                              </span>
                      </td>
                      <td className={`py-1.5 px-1 ${!settings.showHsCode && 'hidden'}`}>
                        <input
                          type="text"
                          value={item.hsCode}
                          onChange={e => updateLineItem(index, 'hsCode', e.target.value)}
                          className={tableInputClassName}
                          placeholder="HS Code"
                        />
                      </td>
                      <td className="py-1 px-1">
                        <textarea
                          value={item.description}
                          onChange={e => updateLineItem(index, 'description', e.target.value)}
                          rows={1}
                          className={`${tableInputClassName} resize min-h-[28px]`}
                          placeholder="Enter description"
                        />
                      </td>
                      <td className="py-1.5 px-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editingQuantityIndex === index ? editingQuantity : (item.quantity || '')}
                          onChange={e => {
                            const inputValue = e.target.value;
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
                          className={`${tableInputClassName} pr-8`}
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
                                updateLineItem(index, 'unitPrice', value);
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
                          value={item.amount.toFixed(2)}
                          readOnly
                          className={numberInputClassName}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                    {invoiceData.currency === 'USD' ? '$' : invoiceData.currency === 'EUR' ? '€' : '¥'}
                    {getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

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
              Generate Invoice
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 