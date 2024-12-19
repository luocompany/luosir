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
  
  // 添加基本信息 - 支持多行客户名称
  doc.setFontSize(10);
  const toLines = data.to.split('\n');
  let currentY = contentStartY;
  
  // 绘制客户名称（支持多行）
  doc.text('To:', 15, currentY);
  toLines.forEach((line, index) => {
    doc.text(line.trim(), 25, currentY + (index * 5));
  });

  // 计算客户信息后的位置
  currentY += (toLines.length * 5) + 2; // 减小间距到2mm

  // Inquiry No. 放在客户信息下面
  doc.text(`Inquiry No.: ${data.inquiryNo}`, 15, currentY);

  // 调整后续内容的起始位置，减小间距
  const newContentStartY = currentY + 10; // 减小与后续内容的间距

  // 添加感谢信息
  doc.text('Thanks for your inquiry, and our best offer is as follows:', 15, newContentStartY);
  
  // 调整右侧信息的位置和对齐方式
  const rightInfoX = doc.internal.pageSize.width - 15; // 右边界
  const colonX = rightInfoX - 20; // 将冒号位置调整到距离右边界20mm处
  const valueX = colonX + 2; // 值的位置在冒号右侧1mm处
  const labelX = colonX - 1; // 标签文本位置在冒号左侧1mm处

  // 添加右侧信息，确保值靠紧冒号对齐
  doc.text('Date', labelX, 55, { align: 'right' });
  doc.text(':', colonX, 55);
  doc.text(data.date, valueX, 55);

  doc.text('From', labelX, 60, { align: 'right' });
  doc.text(':', colonX, 60);
  doc.text(data.from, valueX, 60);

  doc.text('Quotation No.', labelX, 65, { align: 'right' });
  doc.text(':', colonX, 65);
  doc.text(data.quotationNo, valueX, 65);

  doc.text('Currency', labelX, newContentStartY, { align: 'right' });
  doc.text(':', colonX, newContentStartY);
  doc.text(data.currency, valueX, newContentStartY);
  
  // 调整后续内容的位置
  const customerNameHeight = (toLines.length - 1) * 5;
  currentY += Math.max(customerNameHeight, 10); // 确保至少有10的间距
  
  // 添加商品表格
  autoTable(doc, {
    startY: newContentStartY + 5,
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
      { 
        content: 'TOTAL AMOUNT: ', 
        colSpan: 6, 
        styles: { 
          halign: 'right', 
          fontStyle: 'bold',
          cellPadding: { top: 8 }  // 为总金额行添加上边距
        } 
      },
      { 
        content: `${currencySymbols[data.currency]}${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}`, 
        styles: { 
          fontStyle: 'bold',
          cellPadding: { top: 8 }  // 为总金额单元格添加上边距
        } 
      },
      { 
        content: '',
        styles: { 
          cellPadding: { top: 8 }  // 为最后一个单元格添加上边距
        } 
      }
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
      halign: 'center', // 表头居中对齐
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: 'center' },  // No.列居中对齐
      3: { halign: 'center' },  // Q'TY列居中对齐
      4: { halign: 'center' },  // Unit列居中对齐
      5: { halign: 'right' },   // U/Price列右对齐
      6: { halign: 'right' },   // Amount列右对齐
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
  
  // 添加基本信息 - 支持多行客户名称
  const toLines = data.to.split('\n');
  let currentY = 55;
  
  // 先示 To 和客户信息
  doc.text('To:', 15, currentY);
  toLines.forEach((line, index) => {
    doc.text(line.trim(), 25, currentY + (index * 5));
  });

  // 计算客户信息后的位置，并添加较小的间距
  currentY += (toLines.length * 5) + 2; // 减小间距到2mm

  // Order No. 放在客户信息下面
  doc.text(`Order No.: ${data.inquiryNo}`, 15, currentY);

  // 调整后续内容的起始位置，减小间距
  const confirmationContentStartY = currentY + 10; // 减小与后续内容的间距

  // 添加确认信息
  doc.text('We hereby confirm your order with following details:', 15, confirmationContentStartY);
 
  // 调整右侧信息的位置和对齐方式
  const rightInfoX = doc.internal.pageSize.width - 15; // 右边界
  const colonX = rightInfoX - 20; // 将冒号位置调整到距离右边界50mm处
  const valueX = colonX + 2; // 值的位置在冒号右侧2mm处
  const labelX = colonX - 1; // 标签文本位置在冒号左侧1mm处

  // 右侧信息保持对齐
  doc.text('Contract No.', labelX, 55, { align: 'right' });
  doc.text(':', colonX, 55);
  doc.text(data.contractNo || '', valueX, 55);

  doc.text('Date', labelX, 60, { align: 'right' });
  doc.text(':', colonX, 60);
  doc.text(data.date, valueX, 60);

  doc.text('From', labelX, 65, { align: 'right' });
  doc.text(':', colonX, 65);
  doc.text(data.from, valueX, 65);

  // Currency信息移到右上角并保持对齐
  doc.text('Currency', labelX, confirmationContentStartY, { align: 'right' });
  doc.text(':', colonX, confirmationContentStartY);
  doc.text(data.currency, valueX, confirmationContentStartY);

  // 调整后续内容的位置
  const customerNameHeight = (toLines.length - 1) * 5;
  currentY += Math.max(customerNameHeight, 10); // 确保至少有10的间距
  
  
  // 添加商品表格 - 相应调整起始位置
  autoTable(doc, {
    startY: confirmationContentStartY + 5,
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
      { 
        content: 'TOTAL AMOUNT: ', 
        colSpan: 6, 
        styles: { 
          halign: 'right', 
          fontStyle: 'bold',
          cellPadding: { top: 8 }  // 为总金额行添加上边距
        } 
      },
      { 
        content: `${currencySymbols[data.currency]}${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)}`, 
        styles: { 
          fontStyle: 'bold',
          cellPadding: { top: 8 }  // 为总金额单元格添加上边距
        } 
      },
      { 
        content: '',
        styles: { 
          cellPadding: { top: 8 }  // 为最后一个单元格添加上边距
        } 
      }
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
      halign: 'center', // 表头居中对齐
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: 'center' },  // No.列居中对齐
      3: { halign: 'center' },  // Q'TY列居中对齐
      4: { halign: 'center' },  // Unit列居中对齐
      5: { halign: 'right' },   // U/Price列右对齐
      6: { halign: 'right' },   // Amount列右对齐
    },
  });

  // 添加注意
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Terms & Conditions:', 15, finalY + 10);
  
  data.notes.forEach((note: string, index: number) => {
    doc.text(`${index + 1}. ${note}`, 15, finalY + 15 + (index * 5));
  });

  // 添加签名区域
  // const signatureY = finalY + 20 + (data.notes.length * 5);
  // doc.text('Authorized Signature:', 15, signatureY + 20);
  // doc.line(15, signatureY + 35, 80, signatureY + 35); // 签名线

  // 保存文件
  doc.save(`Order_Confirmation_${data.inquiryNo || 'draft'}.pdf`);
};