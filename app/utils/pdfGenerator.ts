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
  yourRef: string;
  ourRef: string;
  currency: string;
  items: LineItem[];
  notes: string[];
}

export const generateQuotationPDF = (data: QuotationData) => {
  const doc = new jsPDF();
  
  // 添加公司Logo
  const logoWidth = 180; // Logo宽度(mm)
  const logoHeight = 24; // Logo高度(mm)
  const pageWidth = doc.internal.pageSize.width;
  const x = (pageWidth - logoWidth) / 2; // 居中位置
  
  // 添加图片
  doc.addImage('/dochead.jpg', 'JPEG', x, 10, logoWidth, logoHeight);
  
  // 设置字体
  doc.setFont('helvetica');
  
  // 由于添加了Logo，调整后续内容的起始位置
  const contentStartY = 50; // Logo下方的起始位置
  
  // 添加基本信息
  doc.setFontSize(10);
  doc.text(`To: ${data.to}`, 15, contentStartY);
  doc.text(`Date: ${data.date}`, doc.internal.pageSize.width - 15, contentStartY, { align: 'right' });
  doc.text(`Your ref: ${data.yourRef}`, 15, contentStartY + 5);
  doc.text(`From: ${data.from}`, doc.internal.pageSize.width - 15, contentStartY + 5, { align: 'right' });
  doc.text(`Our ref: ${data.ourRef}`, 15, contentStartY + 10);
  
  // 添加感谢语和币种
  doc.setFontSize(10);
  doc.text('Thanks for your inquiry, and our best offer is as follows:', 15, contentStartY + 20);
  doc.text(`Currency: ${data.currency}`, doc.internal.pageSize.width - 15, contentStartY + 20, { align: 'right' });
  
  // 添加品表格
  autoTable(doc, {
    startY: contentStartY + 23,
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
      { content: 'TOTAL AMOUNT :', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: `${data.items.reduce((sum: number, item: LineItem) => sum + item.amount, 0).toFixed(2)} (${data.currency})`, colSpan: 3, styles: { fontStyle: 'bold' } }
    ]],
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      4: { halign: 'left' },
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
  doc.save(`Quotation-${data.ourRef}-${data.date}.pdf`);
};