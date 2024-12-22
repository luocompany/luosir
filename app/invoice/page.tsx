"use client";

import { useState, useEffect, useMemo } from 'react';
import Footer from '../components/Footer';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import Link from 'next/link';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface LineItem {
  lineNo: number;
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

interface AmountInWords {
  dollars: string;
  cents: string;
  hasDecimals: boolean;
}

interface InvoiceData {
  invoiceNo: string;
  date: string;
  to: string;
  from: string;
  inquiryNo: string;
  currency: string;
  items: LineItem[];
  bankInfo: string;
  paymentDate: string;
  amountInWords: AmountInWords;
  remarks?: string;
  showPaymentDate: boolean;
  showRemarks: boolean;
  showHsCode: boolean;
}

interface SettingsData {
  date: string;
  currency: string;
  showHsCode: boolean;
}

const inputClassName = `w-full px-4 py-2.5 rounded-2xl
  bg-white/95 dark:bg-[#1c1c1e]/95
  border border-[#007AFF]/10 dark:border-[#0A84FF]/10
  focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 dark:focus:ring-[#0A84FF]/30
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  text-[15px] leading-relaxed text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-out
  hover:border-[#007AFF]/20 dark:hover:border-[#0A84FF]/20
  shadow-sm hover:shadow-md`;

const tableInputClassName = `w-full px-3 py-2 rounded-xl
  bg-transparent backdrop-blur-sm
  border border-transparent
  focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 dark:focus:ring-[#0A84FF]/20
  text-[14px] leading-relaxed text-gray-800 dark:text-gray-100
  placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60
  transition-all duration-300 ease-out
  hover:bg-[#007AFF]/5 dark:hover:bg-[#0A84FF]/5
  text-center`;

const numberInputClassName = `${tableInputClassName}
  [appearance:textfield] 
  [&::-webkit-outer-spin-button]:appearance-none 
  [&::-webkit-inner-spin-button]:appearance-none
  text-center`;

const settingsPanelClassName = `bg-[#007AFF]/5 dark:bg-[#0A84FF]/5 backdrop-blur-xl
  border border-[#007AFF]/10 dark:border-[#0A84FF]/10
  rounded-2xl overflow-hidden
  shadow-lg shadow-[#007AFF]/5
  p-4`;

const radioGroupClassName = `flex p-0.5 gap-1
  bg-[#007AFF]/5 dark:bg-[#0A84FF]/5
  rounded-lg
  border border-[#007AFF]/10 dark:border-[#0A84FF]/10`;

const radioButtonClassName = `flex items-center justify-center px-3 py-1.5
  rounded-md
  text-xs font-medium
  transition-all duration-200
  cursor-pointer`;

const radioButtonActiveClassName = `bg-[#007AFF] dark:bg-[#0A84FF]
  text-white
  shadow-sm`;

export default function Invoice() {
  const getDefaultPaymentDate = (invoiceDate: string) => {
    const date = new Date(invoiceDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

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
    bankInfo: '',
    paymentDate: getDefaultPaymentDate(new Date().toISOString().split('T')[0]),
    amountInWords: {
      dollars: '',
      cents: '',
      hasDecimals: false
    },
    showPaymentDate: true,
    showRemarks: false,
    showHsCode: false,
  });

  const [editingUnitPriceIndex, setEditingUnitPriceIndex] = useState<number | null>(null);
  const [editingUnitPrice, setEditingUnitPrice] = useState<string>('');
  const [editingQuantityIndex, setEditingQuantityIndex] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>('');

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    showHsCode: false,
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

  const numberToWords = (num: number) => {
    const getCurrencyPrefix = () => {
      switch(invoiceData.currency) {
        case 'USD': return 'SAY TOTAL US DOLLARS ';
        case 'CNY': return 'SAY TOTAL CHINESE YUAN ';
        default: return 'SAY TOTAL ';
      }
    };

    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      
      if (n < 10) return ones[n];
      
      if (n < 20) return teens[n - 10];
      
      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
      }
      
      const hundred = ones[Math.floor(n / 100)] + ' HUNDRED';
      const remainder = n % 100;
      if (remainder === 0) return hundred;
      return hundred + ' AND ' + convertLessThanThousand(remainder);
    };

    const convert = (n: number): string => {
      if (n === 0) return 'ZERO';
      
      const billion = Math.floor(n / 1000000000);
      const million = Math.floor((n % 1000000000) / 1000000);
      const thousand = Math.floor((n % 1000000) / 1000);
      const remainder = n % 1000;
      
      let result = '';
      
      if (billion) result += convertLessThanThousand(billion) + ' BILLION ';
      if (million) result += convertLessThanThousand(million) + ' MILLION ';
      if (thousand) result += convertLessThanThousand(thousand) + ' THOUSAND, ';
      if (remainder) result += convertLessThanThousand(remainder);
      
      return result.trim();
    };

    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);
    
    let result = getCurrencyPrefix();
    result += convert(dollars);
    
    if (cents > 0) {
      return {
        dollars: result,
        cents: `${convert(cents)} CENT${cents === 1 ? '' : 'S'}`,
        hasDecimals: true
      };
    } else {
      return {
        dollars: result + ' ONLY',
        cents: '',
        hasDecimals: false
      };
    }
  };

  const total = useMemo(() => getTotalAmount(), [invoiceData.items]);

  useEffect(() => {
    setInvoiceData(prev => ({
      ...prev,
      amountInWords: numberToWords(total)
    }));
  }, [total, invoiceData.currency]);

  useEffect(() => {
    setInvoiceData(prev => ({
      ...prev,
      paymentDate: getDefaultPaymentDate(prev.date)
    }));
  }, [invoiceData.date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pdfData = {
        quotationNo: invoiceData.invoiceNo,
        date: invoiceData.date,
        to: invoiceData.to,
        from: invoiceData.from,
        inquiryNo: invoiceData.inquiryNo,
        currency: invoiceData.currency,
        items: invoiceData.items.map(item => ({
          lineNo: item.lineNo,
          partName: item.hsCode,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          amount: item.amount,
          remarks: ''
        })),
        notes: [
          `Bank Information:`,
          invoiceData.bankInfo,
          `Payment Date: ${invoiceData.paymentDate}`,
        ],
        paymentDate: invoiceData.paymentDate,
        amountInWords: invoiceData.amountInWords,
        showHsCode: settings.showHsCode,
        showPaymentTerms: invoiceData.showPaymentDate,
        showRemarks: invoiceData.showRemarks,
        remarks: invoiceData.remarks,
        bankInfo: invoiceData.bankInfo,
      };

      generateInvoicePDF(pdfData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
            <div className={settingsPanelClassName}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                
                  <input
                    type="date"
                    value={settings.date}
                    onChange={e => {
                      setSettings(prev => ({ ...prev, date: e.target.value }));
                      setInvoiceData(prev => ({ ...prev, date: e.target.value }));
                    }}
                    className={`${inputClassName} !py-1.5`}
                  />
                </div>

                <div className={`${radioGroupClassName} h-[38px]`}>
                  {['USD', 'CNY'].map((currency) => (
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
                        onChange={e => {
                          setSettings(prev => ({ ...prev, currency: e.target.value }));
                          setInvoiceData(prev => ({ ...prev, currency: e.target.value }));
                        }}
                        className="sr-only"
                      />
                      <span>{currency === 'USD' ? '$' : '¥'}</span>
                    </label>
                  ))}
                </div>

                <label
                  className={`px-4 py-1.5 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${settings.showHsCode 
                      ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-sm border-transparent' 
                      : 'bg-transparent text-gray-600 dark:text-gray-400 border-[#007AFF]/30 dark:border-[#0A84FF]/30'
                    }
                    border
                    hover:bg-[#007AFF] dark:hover:bg-[#0A84FF] hover:text-white hover:border-transparent
                    text-xs font-medium`}
                >
                  <input
                    type="checkbox"
                    checked={settings.showHsCode}
                    onChange={e => setSettings(prev => ({ 
                      ...prev, 
                      showHsCode: e.target.checked 
                    }))}
                    className="sr-only"
                  />
                  HS Code
                </label>
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
                  <tr className="border-b border-[#007AFF]/10 dark:border-[#0A84FF]/10
                       bg-[#007AFF]/5 dark:bg-[#0A84FF]/5">
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
                        className="border-b border-[#007AFF]/10 dark:border-[#0A84FF]/10 
                                  hover:bg-[#007AFF]/5 dark:hover:bg-[#0A84FF]/5">
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
                    {invoiceData.currency === 'USD' ? '$' : invoiceData.currency === 'CNY' ? '¥' : '¥'}
                    {getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">SAY</span>
                <span className="text-gray-600 dark:text-gray-400">TOTAL</span>
                <span className="text-blue-500">US</span>
                <span className="text-blue-500">DOLLARS</span>
                {invoiceData.amountInWords.dollars.split(' ').map((word, index) => (
                  word !== 'SAY' && word !== 'TOTAL' && word !== 'US' && word !== 'DOLLARS' && (
                    <span key={index} className="text-gray-600 dark:text-gray-400">
                      {word}
                    </span>
                  )
                ))}
                {invoiceData.amountInWords.hasDecimals && (
                  <>
                    <span className="text-red-500">AND</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {invoiceData.amountInWords.cents}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Bank Information:</label>
              <textarea
                value={invoiceData.bankInfo}
                onChange={e => setInvoiceData(prev => ({ ...prev, bankInfo: e.target.value }))}
                className={`${inputClassName} min-h-[60px]`}
                placeholder="Enter bank information"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/80 dark:bg-blue-900/10 
                              border border-blue-200/50 dark:border-blue-700/30
                              rounded-2xl p-4">
                <label className="block text-sm font-medium mb-3">Payment Terms:</label>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={invoiceData.showPaymentDate}
                      onChange={e => setInvoiceData(prev => ({ 
                        ...prev, 
                        showPaymentDate: e.target.checked 
                      }))}
                      className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-500 
                                focus:ring-blue-500/40"
                    />
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Full paid not later than
                        </span>
                        <input
                          type="date"
                          value={invoiceData.paymentDate}
                          onChange={e => setInvoiceData(prev => ({ 
                            ...prev, 
                            paymentDate: e.target.value 
                          }))}
                          className={`${inputClassName} !py-1 !px-2`}
                          style={{ 
                            colorScheme: 'light dark',
                            paddingRight: '8px',
                            width: '130px',
                            minWidth: '130px',
                            maxWidth: '130px',
                            flexShrink: 0,  // 防止在 flex 容器中被压缩
                            flexGrow: 0     // 防止在 flex 容器中被拉伸
                          }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          by telegraphic transfer.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={invoiceData.showRemarks}
                      onChange={e => setInvoiceData(prev => ({ 
                        ...prev, 
                        showRemarks: e.target.checked 
                      }))}
                      className="w-4 h-4 mt-2 rounded border-gray-300 text-blue-500 
                                focus:ring-blue-500/40"
                    />
                    <div className="flex-1">
                      <textarea
                        value={invoiceData.remarks || ''}
                        onChange={e => setInvoiceData(prev => ({ 
                          ...prev, 
                          remarks: e.target.value 
                        }))}
                        className={`${inputClassName} min-h-[32px]`}
                        placeholder="Enter additional remarks"
                        rows={1}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                    Please state our invoice no. "{invoiceData.invoiceNo}" on your payment documents.
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3.5 rounded-xl
                        bg-[#007AFF] hover:bg-[#0A84FF]
                        text-white font-medium text-sm
                        transition-all duration-300
                        shadow-lg shadow-[#007AFF]/25
                        hover:shadow-xl hover:shadow-[#0A84FF]/30
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