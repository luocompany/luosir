import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Font } from 'jspdf';

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
  invoiceNo?: string;
  currency: string;
  items: LineItem[];
  notes: string[];
  contractNo?: string;
  paymentDate: string;
  amountInWords: {
    dollars: string;
    cents: string;
    hasDecimals: boolean;
  };
  showHsCode?: boolean;
  showPaymentTerms?: boolean;
  bankInfo: string;
  showRemarks?: boolean;
  remarks?: string;
  showDescription?: boolean;
  quotationNo?: string;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€', 
  CNY: '¥'
};

// 在文件开头添加字体加载函数
const loadFonts = async (doc: jsPDF) => {
  // 加载中文字体
  const regularFontBytes = await fetch('/fonts/NotoSansSC-Regular.ttf').then(res => res.arrayBuffer());
  const boldFontBytes = await fetch('/fonts/NotoSansSC-Bold.ttf').then(res => res.arrayBuffer());
  
  // 转换为 base64 字符串
  const regularBase64 = arrayBufferToBase64(regularFontBytes);
  const boldBase64 = arrayBufferToBase64(boldFontBytes);
  
  // 添加字体到 PDF 文档
  doc.addFileToVFS('NotoSansSC-Regular.ttf', regularBase64);
  doc.addFileToVFS('NotoSansSC-Bold.ttf', boldBase64);
  
  doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
  doc.addFont('NotoSansSC-Bold.ttf', 'NotoSansSC', 'bold');
};

// 添加辅助函数
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 添加文本自动换行的辅助函数
const wrapText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, index: number) => {
    doc.text(line, x, y + (index * lineHeight));
  });
  return lines.length; // 返回实际行数
};

// 在文件顶部声明全局变量
let currentY = 0;

// 定义统一的列宽配置
const columnStyles = {
  0: { halign: 'center' as const, cellWidth: 15 },
  1: { halign: 'center' as const, cellWidth: 40 },
  2: { halign: 'center' as const, cellWidth: 25 },
  3: { halign: 'center' as const, cellWidth: 25 },
  4: { halign: 'center' as const, cellWidth: 35 },
  5: { halign: 'center' as const, cellWidth: 35 }
};

export const generateQuotationPDF = async (data: QuotationData, activeTab: string) => {
  const doc = new jsPDF();
  
  // 加载中文字体
  await loadFonts(doc);
  
  // 设置默认字体为中文字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 添加公司Logo
  const logoWidth = 180; // Logo宽度(mm)
  const logoHeight = 24; // Logo高度(mm)
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2; // 居中位置
  
  // 添加图片
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 添加QUOTATION标题
  doc.setFontSize(14);
  doc.setFont('NotoSansSC', 'bold');
  doc.text('QUOTATION', pageWidth / 2, 45, { align: 'center' });
  
  // 设置回常规字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 由于添加了Logo和容的起始位置
  const contentStartY = 55; 
  
  // 添加基本信息 - 支持多行客户名称
  doc.setFontSize(10);
  const toLines = data.to.split('\n');
  currentY = contentStartY;
  
  // 绘制客户名称（支持多行）
  doc.text('To:', 15, currentY);
  toLines.forEach((line, index) => {
    doc.text(line.trim(), 25, currentY + (index * 5));
  });

  // 计算客户信息后的位置
  currentY += (toLines.length * 5) + 2; // ��小间距到2mm

  // Inquiry No. 放在客户信息下面
  doc.text(`Inquiry No.: ${data.inquiryNo}`, 15, currentY);

  // 调整后续内容的位置，减小间距
  const newContentStartY = currentY + 10; // 减小与后续内容的间距

  // 添加感谢信
  doc.text('Thanks for your inquiry, and our best offer is as follows:', 15, newContentStartY);
  
  // 调整右侧信息的位置对齐方式
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
  doc.text(data.quotationNo || '', valueX, 65);

  doc.text('Currency', labelX, newContentStartY, { align: 'right' });
  doc.text(':', colonX, newContentStartY);
  doc.text(data.currency, valueX, newContentStartY);
  
  // 调整后续内容的位置
  const customerNameHeight = (toLines.length - 1) * 5;
  currentY += Math.max(customerNameHeight, 10); // 确保至少有10的间距
  
  // 动态构建表头
  const headers = ['No.', 'Part Name'];
  if (data.showDescription) headers.push('Description');
  headers.push('Q\'TY', 'Unit', 'U/Price', 'Amount');
  if (data.showRemarks) headers.push('Remarks');

  // 动态构建表格数据
  const tableBody = data.items.map(item => {
    const row = [item.lineNo, item.partName];
    if (data.showDescription) row.push(item.description);
    row.push(
      item.quantity,
      item.unit,
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2)
    );
    if (data.showRemarks) row.push(item.remarks);
    return row;
  });

  // 修改表格配置
  autoTable(doc, {
    startY: newContentStartY + 5,
    head: [headers],
    body: tableBody,
    foot: [[
      { 
        content: '', // 空白占位
        colSpan: data.showDescription && data.showRemarks ? 4 : 
                 data.showDescription || data.showRemarks ? 3 : 2,
        styles: { 
          fillColor: [255, 255, 255] // 确保背景是白色
        } 
      },
      { 
        content: `TOTAL AMOUNT:    ${currencySymbols[data.currency]}${data.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`,
        colSpan: data.showDescription && data.showRemarks ? 3 : 
                 data.showDescription || data.showRemarks ? 3 : 4,
        styles: { 
          halign: 'right', 
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: { right: 15 },
          fillColor: [255, 255, 255]
        } 
      }
    ]],
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'middle',
      font: 'NotoSansSC'  // 添加中文字体
    },
    headStyles: {
      fillColor: [220, 235, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center', // 表头居中对齐
      font: 'NotoSansSC'  // 添加中文字体
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: columnStyles,
    margin: { left: 15, right: 15 },
  });
  
  // 添加注意事项
  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // 过滤掉空的 notes 并重新编号
  const validNotes = data.notes.filter(note => note.trim() !== '');

  // 只有在有有效条款时才显示标题和内容
  if (validNotes.length > 0) {
    doc.setFontSize(10);
    doc.text('Notes:', 15, finalY + 10);
    
    currentY = finalY + 15;
    const maxWidth = doc.internal.pageSize.width - 30;
    const lineHeight = 5;

    validNotes.forEach((note: string, index: number) => {
      // 添加序号
      doc.text(`${index + 1}.`, 15, currentY);
      
      // 计算文本内容的起始位置（序号后空2mm）
      const textX = 22;
      const availableWidth = maxWidth - (textX - 15);
      
      // 使用自动换行函数处理文本
      const lineCount = wrapText(doc, note, textX, currentY, availableWidth, lineHeight);
      
      // 更新下一条注意事项的Y坐标
      currentY += lineCount * lineHeight;
    });
  }
  
  // 保存PDF
  doc.save(`Quotation ${data.quotationNo}-${data.date}.pdf`);
};

// 添加生成销售确认单的函数
export const generateOrderConfirmationPDF = async (data: QuotationData) => {
  const doc = new jsPDF();
  
  // 加载中文字体
  await loadFonts(doc);
  
  // 设置默认字体为中文字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 添加公司Logo
  const logoWidth = 180; // Logo宽度(mm)
  const logoHeight = 24; // Logo高度(mm)
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2; // 居中位置
  
  // 添加图片
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 设置标题 - 调整Y轴位置到Logo下方
  doc.setFontSize(14);
  doc.setFont('NotoSansSC', 'bold');
  doc.text('Sales Confirmation', pageWidth / 2, 45, { align: 'center' });
  
  // 设置回常规字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 基本信息 - 修改为与报价单相同的对齐方式
  doc.setFontSize(10);
  
  // 添加基本信息 - 支持多行客户名称
  const toLines = data.to.split('\n');
  currentY = 55;
  
  // 先示 To 和客户信息
  doc.text('To:', 15, currentY);
  toLines.forEach((line, index) => {
    doc.text(line.trim(), 25, currentY + (index * 5));
  });

  // 计算客户信息后的位置，并添加较小的间距
  currentY += (toLines.length * 5) + 2; // 小距到2mm

  // Order No. 放在客户信息下面
  doc.text(`Order No.: ${data.inquiryNo}`, 15, currentY);

  // 调整后续内容的起始位置，减小间距
  const confirmationContentStartY = currentY + 10; // 减小与后续内容的间距

  // 添加确认信息
  doc.text('We hereby confirm your order with following details:', 15, confirmationContentStartY);
 
  // 调整右侧信息的位置和对齐方式
  const rightInfoX = doc.internal.pageSize.width - 15; // 右边界
  const colonX = rightInfoX - 20; // 将冒号位置调整到右边界50mm处
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

  // Currency右并保持对齐
  doc.text('Currency', labelX, confirmationContentStartY, { align: 'right' });
  doc.text(':', colonX, confirmationContentStartY);
  doc.text(data.currency, valueX, confirmationContentStartY);

  // 调整后续内容的位置
  const customerNameHeight = (toLines.length - 1) * 5;
  currentY += Math.max(customerNameHeight, 10); // 确保至少有10的间距
  
  
  // 添加商品表格 - 相应调整起始位置
  // 动构建表头
  const headers = ['No.', 'Part Name'];
  if (data.showDescription) headers.push('Description');
  headers.push('Q\'TY', 'Unit', 'U/Price', 'Amount');
  if (data.showRemarks) headers.push('Remarks');

  // 动态构建表格数据
  const tableBody = data.items.map(item => {
    const row = [item.lineNo, item.partName];
    if (data.showDescription) row.push(item.description);
    row.push(
      item.quantity,
      item.unit,
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2)
    );
    if (data.showRemarks) row.push(item.remarks);
    return row;
  });

  autoTable(doc, {
    startY: confirmationContentStartY + 5,
    head: [headers],
    body: tableBody,
    foot: [[
      { 
        content: '', // 空白占位
        colSpan: 4,
        styles: { 
          fillColor: [255, 255, 255]
        } 
      },
      { 
        content: `TOTAL AMOUNT:    ${currencySymbols[data.currency]}${data.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`,
        colSpan: data.showDescription && data.showRemarks ? 3 : 
                 data.showDescription || data.showRemarks ? 3 : 4,
        styles: { 
          halign: 'right', 
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: { right: 15 },
          fillColor: [255, 255, 255]
        } 
      }
    ]],
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'middle',
      font: 'NotoSansSC'  // 添加中文字体
    },
    headStyles: {
      fillColor: [220, 235, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center', // 表头居中对齐
      font: 'NotoSansSC'  // 添加中文字体
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: columnStyles,
    margin: { left: 15, right: 15 },
  });

  // 添加注意事项
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Terms & Conditions:', 15, finalY + 10);
  
  // 过滤掉空的 notes 并重新编号
  const validNotes = data.notes.filter(note => note.trim() !== '');
  
  // 只有在有有效条款时才显示题和内容
  if (validNotes.length > 0) {
    currentY = finalY + 15;
    const maxWidth = doc.internal.pageSize.width - 30;
    const lineHeight = 5;

    validNotes.forEach((note: string, index: number) => {
      // 添加序号
      doc.text(`${index + 1}.`, 15, currentY);
      
      // 计算文本内容的起始位置（序号后空2mm）
      const textX = 22;
      const availableWidth = maxWidth - (textX - 15); // 减去序号占用的宽度
      
      // 使用自动换行函数处理文本
      const lineCount = wrapText(doc, note, textX, currentY, availableWidth, lineHeight);
      
      // 更新下一条注意事项的Y坐标
      currentY += lineCount * lineHeight;
    });
  }

  // 添加签名区
  // const signatureY = finalY + 20 + (data.notes.length * 5);
  // doc.text('Authorized Signature:', 15, signatureY + 20);
  // doc.line(15, signatureY + 35, 80, signatureY + 35); // 签名线

  // 保存文件
  doc.save(`Sales Confirmation ${data.contractNo}-${data.date}.pdf`);
};

// 添加发票专用 PDF 生成函数
export const generateInvoicePDF = async (data: QuotationData) => {
  const doc = new jsPDF();
  
  // 加载字体
  await loadFonts(doc);
  
  // 设置默认字体为中文字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 添加公司Logo
  const logoWidth = 180;
  const logoHeight = 24;
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2;
  
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 修改标题大小为24pt（与报价单一致）
  doc.setFont('NotoSansSC', 'bold');
  doc.text('INVOICE', pageWidth / 2, 45, { align: 'center' });
  
  // 切换回常规字体
  doc.setFont('NotoSansSC', 'normal');
  
  // 设置字体
  doc.setFontSize(10);
  
  // 调整客户信息起始位置到更上方
  const customerInfoStartY = 55;
  
  // 绘制客户名称（支持多行）
  doc.text('To:', 15, customerInfoStartY);
  const toLines = data.to.split('\n');
  currentY = customerInfoStartY;
  toLines.forEach((line, index) => {
    doc.text(line.trim(), 25, currentY + (index * 5));
  });

  // 计算客户信息后的位置
  currentY += (toLines.length * 5) + 2;

  // 添加 P/O 客户下方
  doc.text(`Order No.: ${data.inquiryNo}`, 15, currentY);

  // 修右侧信息对齐方式
  const rightInfoX = doc.internal.pageSize.width - 15;
  const colonX = rightInfoX - 20;
  const valueX = colonX + 2;
  const labelX = colonX - 1;

  // 添加右信息
  doc.text('Invoice No.', labelX, 55, { align: 'right' });
  doc.text(':', colonX, 55);
  doc.text(data.invoiceNo || '', valueX, 55);

  doc.text('Date', labelX, 60, { align: 'right' });
  doc.text(':', colonX, 60);
  doc.text(data.date, valueX, 60);

  // 在日期下方添加货币信息
  doc.text('Currency', labelX, 65, { align: 'right' });
  doc.text(':', colonX, 65);
  doc.text(data.currency, valueX, 65);

  // 调整表格起始位置
  const tableStartY = currentY + 10;

  // 修改表格部分
  autoTable(doc, {
    startY: tableStartY,
    head: [data.showHsCode ? 
      ['No.', 'HS Code', 'Description', 'Q\'TY', 'Unit', 'Unit Price', 'Amount'] :
      ['No.', 'Description', 'Q\'TY', 'Unit', 'Unit Price', 'Amount']
    ],
    body: data.items.map(item => data.showHsCode ? 
      [
        item.lineNo,
        item.partName,  // HS Code
        item.description,
        item.quantity,
        item.unit,
        item.unitPrice.toFixed(2),
        item.amount.toFixed(2)
      ] : 
      [
        item.lineNo,
        item.description,
        item.quantity,
        item.unit,
        item.unitPrice.toFixed(2),
        item.amount.toFixed(2)
      ]
    ),
    foot: [[
      { 
        content: 'Total Amount:', 
        colSpan: data.showHsCode ? 6 : 5,
        styles: { 
          halign: 'right',
          fontStyle: 'bold',
          cellPadding: { right: 4 },
          valign: 'middle'
        } 
      },
      { 
        content: data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2),
        styles: { 
          fontStyle: 'bold',
          halign: 'center',  // 改为居中对齐
          valign: 'middle'
        } 
      }
    ]],
    theme: 'plain',           // 使用plain主题，移除默认样式
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [0, 0, 0],   // 黑边框
      lineWidth: 0.1,         // 细边框
      textColor: [0, 0, 0],    // 黑色文字
      font: 'NotoSansSC',  // 设置表格使用中文字体
      valign: 'middle'  // 添加垂直居中
    },
    headStyles: {
      fontStyle: 'bold',
      halign: 'center',
      font: 'NotoSansSC',
      valign: 'middle'  // 表头也垂直居中
    },
    columnStyles: data.showHsCode ? 
      {
        0: { halign: 'center', cellWidth: 15, valign: 'middle' },      // No.列
        1: { halign: 'center', cellWidth: 30, valign: 'middle' },      // HS Code列
        2: { halign: 'center', cellWidth: 'auto', valign: 'middle' },    // Description列
        3: { halign: 'center', cellWidth: 20, valign: 'middle' },      // Q'TY列
        4: { halign: 'center', cellWidth: 20, valign: 'middle' },      // Unit列
        5: { halign: 'center', cellWidth: 30, valign: 'middle' },       // Unit Price列
        6: { halign: 'center', cellWidth: 30, valign: 'middle' }        // Amount列
      } : 
      {
        0: { halign: 'center', cellWidth: 15 },      // No.列
        1: { halign: 'center', cellWidth: 'auto' },    // Description列
        2: { halign: 'center', cellWidth: 20 },      // Q'TY列
        3: { halign: 'center', cellWidth: 20 },      // Unit列
        4: { halign: 'center', cellWidth: 30 },       // Unit Price列
        5: { halign: 'center', cellWidth: 30 }        // Amount列
      },
    margin: { left: 15, right: 15 },
    tableWidth: 'auto',
    didDrawCell: (data) => {
      // 确保所有单元格都有边框
      if (data.cell.raw === '') {
        data.cell.styles.lineWidth = 0.1;
      }
    }
  });
  
  // 获取表格结束位置
  const finalY = (doc as any).lastAutoTable.finalY;
  
  // 设置字体和样式
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // 计算可用宽度（页面宽度去左右边距）
  const margin = 15;
  const maxWidth = doc.internal.pageSize.width - (margin * 2);
  
  // 构建完整的大写金额文本
  let amountText = data.amountInWords.dollars;
  if (data.amountInWords.hasDecimals) {
    amountText += ` AND ${data.amountInWords.cents}`;
  }
  
  // 分割本为单数组
  const words = amountText.split(' ');
  let currentLine = '';
  let lines = [];
  
  // 根据宽度限制组织行
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);
    
    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // 绘制每一行
  lines.forEach((line, index) => {
    doc.text(line, margin, finalY + 10 + (index * 5));
  });

  // 修改银行信息显示部分
  const contentStartY = finalY + 10 + (lines.length * 5) + 5;

  // 只在银行信息不为空时显示标题和内容
  if (data.bankInfo && data.bankInfo.trim()) {
    doc.text('Bank Information:', margin, contentStartY);
    
    doc.setFont('NotoSansSC', 'normal');
    const bankInfoLines = data.bankInfo.split('\n').filter(line => line.trim());

    // 显示银行信息，每行间距5mm
    bankInfoLines.forEach((line, index) => {
      doc.setFont('NotoSansSC', 'normal');
      doc.text(line.trim(), 15, contentStartY + 5 + (index * 5));
    });

    // 获取银行信息结束位置
    currentY = contentStartY + 5 + (bankInfoLines.length * 5) + 2;
  } else {
    // 如果没有银行信息，直接使用contentStartY作为下一个内容的起始位置
    currentY = contentStartY;
  }

  // 修改付款条款显示逻辑
  const paymentY = currentY + 5;
  
  doc.setFont('NotoSansSC', 'normal');  // 保持正常字体
  
  currentY = paymentY + 5;  // 直接更新现有的 currentY 变量
  
  let termNumber = 1; // 初始化序号计数器
  const terms: { content: string; isDate?: boolean; isInvoiceNo?: boolean }[] = [];

  // 收集需要显示的条款
  if (data.showPaymentTerms) {
    terms.push({
      content: `Full paid not later than ${data.paymentDate} by telegraphic transfer.`,
      isDate: true
    });
  }

  if (data.showRemarks && data.remarks) {
    // 按换行符分割文本，过滤空行
    const remarkLines = data.remarks.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    remarkLines.forEach(line => {
      terms.push({ content: line });
    });
  }

  // 修改发票号提示的添加逻辑
  if (data.invoiceNo && data.invoiceNo.trim() !== '') {
    terms.push({
      content: `Please state our invoice no. "${data.invoiceNo}" on your payment documents.`,
      isInvoiceNo: true
    });
  } else {
    terms.push({
      content: `Please state our invoice no. on your payment documents.`,
      isInvoiceNo: false
    });
  }

  // 修改显示 payment terms 的部分
  if (terms.length > 0) {
    // 检查是否只有一条发票相关的提
    const isSingleInvoiceTerm = terms.length === 1 && terms[0].isInvoiceNo;
    
    if (isSingleInvoiceTerm) {
      const leftMargin = 15;  // 添加这行
      // 单行显示模式，不显示标题和序号
      const parts = terms[0].content.split(`"${data.invoiceNo}"`);
      const firstPart = 'Payment Term: Please state our invoice no. "';
      
      // 绘制第一部分
      doc.text(firstPart, 15, currentY);
      const firstPartWidth = doc.getTextWidth(firstPart);
      
      // 绘制发票号（红色）
      doc.setTextColor(255, 0, 0);
      doc.text(data.invoiceNo || '', 15 + firstPartWidth, currentY);
      
      // 恢复黑色并绘制最后部分
      doc.setTextColor(0, 0, 0);
      const invoiceNoWidth = doc.getTextWidth(data.invoiceNo || '');
      doc.text('" on your payment documents.', 15 + firstPartWidth + invoiceNoWidth, currentY);
      
      currentY += 5;
    } else {
      // 原有的多条款显示逻辑
      doc.text('Payment Terms:', 15, currentY);
      currentY += 5;
      
      const pageWidth = doc.internal.pageSize.width;
      const leftMargin = 25;
      const rightMargin = 15;
      const maxWidth = pageWidth - leftMargin - rightMargin;
      
      terms.forEach((term, index) => {
        doc.text(`${index + 1}.`, 20, currentY);
        
        if (term.isDate || term.isInvoiceNo) {
          const splitValue = term.isDate ? data.paymentDate : (data.invoiceNo || '');
          const parts = term.content.split(splitValue);
          const firstPartWidth = doc.getTextWidth(parts[0]);
          doc.text(parts[0], leftMargin, currentY);
          
          doc.setTextColor(255, 0, 0);
          const specialValue = (term.isDate ? data.paymentDate : data.invoiceNo) || '';
          doc.text(specialValue, leftMargin + firstPartWidth, currentY);
          
          doc.setTextColor(0, 0, 0);
          
          if (parts[1]) {
            const remainingText = parts[1];
            const textLines = doc.splitTextToSize(remainingText, maxWidth);
            textLines.forEach((line: string, lineIndex: number) => {
              if (lineIndex === 0) {
                doc.text(line, leftMargin + firstPartWidth + doc.getTextWidth(specialValue), currentY);
              } else {
                currentY += 5;
                doc.text(line, leftMargin, currentY);
              }
            });
          }
        } else {
          const textLines = doc.splitTextToSize(term.content, maxWidth);
          textLines.forEach((line: string, lineIndex: number) => {
            if (lineIndex === 0) {
              doc.text(line, leftMargin, currentY);
            } else {
              currentY += 5;
              doc.text(line, leftMargin, currentY);
            }
          });
        }
        
        currentY += 5;
      });
    }
  }

  // 保存文件
  doc.save(`Invoice_${data.invoiceNo}_${data.date}.pdf`);
};