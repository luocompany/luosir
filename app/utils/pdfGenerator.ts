import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  currency: string;
  items: LineItem[];
  notes: string[];
  contractNo?: string;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€', 
  CNY: '¥'
};

export const generateQuotationPDF = (data: QuotationData) => {
  const doc = new jsPDF();
  
  // 添加公司Logo
  const logoWidth = 180; // Logo宽度(mm)
  const logoHeight = 24; // Logo高度(mm)
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2; // 居中位置
  
  // 添加图片
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 添加QUOTATION标题
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth / 2, 45, { align: 'center' });
  
  // 设置字体
  doc.setFont('helvetica', 'normal');
  
  // 由于添加了Logo和标题，调整后续内容的起始位置
  const contentStartY = 55; 
  
  // 添加基本信息
  doc.setFontSize(10);
  doc.text(`To: ${data.to}`, 15, contentStartY);
  doc.text(`Date: ${data.date}`, doc.internal.pageSize.width - 15, contentStartY, { align: 'right' });
  doc.text(`Inquiry No.: ${data.inquiryNo}`, 15, contentStartY + 5);
  doc.text(`From: ${data.from}`, doc.internal.pageSize.width - 15, contentStartY + 5, { align: 'right' });
  doc.text(`Quotation No.: ${data.quotationNo}`, 15, contentStartY + 10);
  
  // 添加感谢和币种
  doc.setFontSize(10);
  doc.text('Thanks for your inquiry, and our best offer is as follows:', 15, contentStartY + 20);
  doc.text(`Currency: ${data.currency}`, doc.internal.pageSize.width - 15, contentStartY + 20, { align: 'right' });
  
  // 添加品表格
  autoTable(doc, {
    startY: contentStartY + 25,
    head: [['No.', 'Part Name', 'Description', 'Q\'TY', 'Unit', 'U/Price', 'Amount', 'Remarks']],
    body: data.items.map(item => [
      item.lineNo,
      item.partName,
      item.description,
      item.quantity,
      item.unit,
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2),
      item.remarks
    ]),
    foot: [[
      { content: 'TOTAL AMOUNT:', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${currencySymbols[data.currency]}${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}`, styles: { fontStyle: 'bold' } }
    ]],
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [220, 235, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      3: { halign: 'center' },  // Q'TY列居中对齐
      5: { halign: 'right' },   // U/Price列右对齐
      6: { halign: 'right' },   // Amount列右对齐
      4: { halign: 'left' },    // Unit列保持左对齐
    },
  });
  
  // 添加注意事项
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Notes:', 15, finalY + 10);
  
  data.notes.forEach((note: string, index: number) => {
    doc.text(`${index + 1}. ${note}`, 15, finalY + 15 + (index * 5));
  });
  
  // 保存PDF
  doc.save(`Quotation-${data.quotationNo}-${data.date}.pdf`);
};

// 添加生成销售确认单的函数
export const generateOrderConfirmationPDF = (data: QuotationData) => {
  const doc = new jsPDF();
  
  // 添加公司Logo
  const logoWidth = 180; // Logo宽度(mm)
  const logoHeight = 24; // Logo高度(mm)
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2; // 居中位置
  
  // 添加图片
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 设置标题 - 调整Y轴位置到Logo下方
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Sales Confirmation', pageWidth / 2, 45, { align: 'center' });
  
  // 基本信息 - 修改为与报价单相同的对齐方式
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`To: ${data.to}`, 15, 55);
  doc.text(`Order No.: ${data.quotationNo}`, 15, 60);

  // 右对齐的信息
  // Contract No 移到右边并设置红色粗体
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);  // 设置黑色
  doc.text(`Contract No.: ${data.contractNo || ''}`, doc.internal.pageSize.width - 15, 55, { align: 'right' });
  
  // 恢复正常颜色和字体
  doc.setTextColor(0, 0, 0);  // 恢复黑色
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${data.date}`, doc.internal.pageSize.width - 15, 60, { align: 'right' });
  doc.text(`From: ${data.from}`, doc.internal.pageSize.width - 15, 65, { align: 'right' });

  // 添加确认信息 - 调整Y轴位置，使间距与报价单一致
  doc.text('We hereby confirm your order with following details:', 15, 75);  // 从85改为75
  doc.text(`Currency: ${data.currency}`, doc.internal.pageSize.width - 15, 75, { align: 'right' });  // 从85改为75

  // 添加商品表格 - 相应调整起始位置
  autoTable(doc, {
    startY: 80,  // 从90改为80
    head: [['No.', 'Part Name', 'Description', 'Q\'TY', 'Unit', 'U/Price', 'Amount', 'Remarks']],
    body: data.items.map(item => [
      item.lineNo,
      item.partName,
      item.description,
      item.quantity,
      item.unit,
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2),
      item.remarks
    ]),
    foot: [[
      { content: 'TOTAL AMOUNT:', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${currencySymbols[data.currency]}${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}`, styles: { fontStyle: 'bold' } },
      { content: '' } // 为remarks列添加空单元格
    ]],
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [220, 235, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      3: { halign: 'center' },  // Q'TY列居中对齐
      5: { halign: 'right' },   // U/Price列右对齐
      6: { halign: 'right' },   // Amount列右对齐
      4: { halign: 'left' },    // Unit列保持左对齐
    },
  });

  // 添加注意项
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Terms & Conditions:', 15, finalY + 10);
  
  data.notes.forEach((note: string, index: number) => {
    doc.text(`${index + 1}. ${note}`, 15, finalY + 15 + (index * 5));
  });

  // 添加签名区域
  const signatureY = finalY + 20 + (data.notes.length * 5);
  doc.text('Authorized Signature:', 15, signatureY + 20);
  doc.line(15, signatureY + 35, 80, signatureY + 35); // 签名线

  // 保存文件
  doc.save(`Order_Confirmation_${data.quotationNo || 'draft'}.pdf`);
};