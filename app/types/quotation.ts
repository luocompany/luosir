export interface LineItem {
  lineNo: number;
  partName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

export interface QuotationData {
  to: string;
  date: string;
  from: string;
  yourRef: string;
  ourRef: string;
  currency: string;
  items: LineItem[];
  notes: string[];
} 