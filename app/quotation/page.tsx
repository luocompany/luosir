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
  deliveryTime: string;
  remarks: string;
  customUnit?: string;
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
    from: '',
    yourRef: '',
    ourRef: '',
    currency: 'USD',
    items: [
      {
        lineNo: 1,
        partName: '',
        description: '',
        quantity: 0,
        unit: 'Lengths',
        unitPrice: 0,
        amount: 0,
        deliveryTime: '40 days',
        remarks: '',
        customUnit: ''
      }
    ],
    notes: [
      'Price based on EXW-Shanghai, Mill TC',
      'Delivery terms: as mentioned above,subj to unsold',
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
        unit: 'Lengths',
        unitPrice: 0,
        amount: 0,
        deliveryTime: '40 days',
        remarks: '',
        customUnit: ''
      }]
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    setQuotationData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      
      // 自动计算金额
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
      }
      
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
      // TODO: 添加错误提示
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
            <span className="text-sm font-medium">返回首页</span>
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
            报价表
          </button>
          <button 
            onClick={() => setActiveTab('confirmation')}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'confirmation' 
                ? 'bg-[var(--blue-accent)] text-white' 
                : 'text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            订单确认表
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-6">
          {activeTab === 'quotation' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">生成报价表</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">收件方</label>
                    <input
                      type="text"
                      value={quotationData.to}
                      onChange={e => setQuotationData(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)]"
                      placeholder="Indian Chain Pvt Ltd, Kolkata, India"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">日期</label>
                    <input
                      type="date"
                      value={quotationData.date}
                      onChange={e => setQuotationData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">客户询价号</label>
                    <input
                      type="text"
                      value={quotationData.yourRef}
                      onChange={e => setQuotationData(prev => ({ ...prev, yourRef: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)]"
                      placeholder="Stud Link Anchor Chain"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">报价号码</label>
                    <input
                      type="text"
                      value={quotationData.ourRef}
                      onChange={e => setQuotationData(prev => ({ ...prev, ourRef: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)]"
                      placeholder="C241111Hb"
                    />
                  </div>
                </div>

                {/* 商品列表 */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[var(--card-border)]">
                        <th className="py-1 px-2 text-left text-sm font-medium">序号</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">产品名称</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">描述</th>
                        <th className="py-1 px-2 text-left text-sm font-medium" style={{ width: '80px' }}>数量</th>
                        <th className="py-1 px-2 text-left text-sm font-medium" style={{ width: '80px' }}>单位</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">单价</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">金额</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">交期</th>
                        <th className="py-1 px-2 text-left text-sm font-medium">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationData.items.map((item, index) => (
                        <tr key={item.lineNo} className="border-b border-[var(--card-border)]">
                          <td className="py-1 px-2 text-sm">{item.lineNo}</td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={item.partName}
                              onChange={e => updateLineItem(index, 'partName', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={e => updateLineItem(index, 'description', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={e => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <select
                              value={item.unit || 'pcs'}
                              onChange={e => updateLineItem(index, 'unit', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            >
                              <option value="pc">pc</option>
                              <option value="pcs">pcs</option>
                              <option value="set">set</option>
                              <option value="sets">sets</option>
                              <option value="length">length</option>
                              <option value="lengths">lengths</option>
                            </select>
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={e => updateLineItem(index, 'unitPrice', parseFloat(e.target.value))}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="number"
                              value={item.amount}
                              readOnly
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={item.deliveryTime}
                              onChange={e => updateLineItem(index, 'deliveryTime', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                            />
                          </td>
                          <td className="py-1 px-2">
                            <input
                              type="text"
                              value={item.remarks}
                              onChange={e => updateLineItem(index, 'remarks', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
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
                  className="px-4 py-2 rounded-lg border border-[var(--card-border)] 
                           hover:bg-[var(--background)] transition-colors"
                >
                  添加行
                </button>

                {/* 总金额 */}
                <div className="flex justify-end space-x-4 items-center">
                  <span className="font-medium">总金额：</span>
                  <span className="text-xl font-bold">{getTotalAmount().toFixed(2)} {quotationData.currency}</span>
                </div>

                {/* 注意事项 */}
                <div className="space-y-2">
                  <h3 className="font-medium">注意事项：</h3>
                  {quotationData.notes.map((note, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>{index + 1}.</span>
                      <input
                        type="text"
                        value={note}
                        onChange={e => {
                          const newNotes = [...quotationData.notes];
                          newNotes[index] = e.target.value;
                          setQuotationData(prev => ({ ...prev, notes: newNotes }));
                        }}
                        className="flex-1 px-2 py-1 rounded border border-[var(--card-border)] bg-[var(--background)]"
                      />
                    </div>
                  ))}
                </div>

                {/* 生成按钮 */}
                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--blue-accent)] 
                           text-white font-medium hover:opacity-90 transition-opacity
                           flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  生成报价表
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">生成订单确认表</h2>
              {/* TODO: 添加订单确认表表单内容 */}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 