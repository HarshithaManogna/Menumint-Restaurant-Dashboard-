import React from 'react';
import { X, Utensils, Printer } from 'lucide-react';
import { useRestaurantSettings } from '../context/RestaurantSettingsContext';

export interface PastBill {
  id: string;
  billNo: string;
  tableNo: string;
  dateTime: string;
  itemsSummary: string;
  amount: number;
  paymentMethod: string;
  status: string;
  orderType?: 'Dine-in' | 'Takeaway' | 'Delivery' | 'QR Order';
  itemsDetails?: { name: string; qty: number; price: number; category?: string }[];
}

interface ReceiptModalProps {
  bill: PastBill | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bill, onClose }) => {
  const { settings } = useRestaurantSettings();

  if (!bill) return null;

  // Parse item summary if itemsDetails is not provided
  const items = bill.itemsDetails || bill.itemsSummary.split(', ').map((itemStr) => {
    const match = itemStr.match(/^(\d+)x\s+(.+)$/);
    if (match) {
      const qty = parseInt(match[1], 10);
      const name = match[2];
      const price = Math.round(bill.amount / (qty || 1));
      return { name, qty, price, category: 'Menu Special' };
    }
    return { name: itemStr, qty: 1, price: bill.amount, category: 'Menu Special' };
  });

  const taxRate = settings.taxPercentage / 100;
  const subtotal = Math.round(bill.amount / (1 + taxRate));
  const tax = bill.amount - subtotal;

  const cleanBillNo = bill.billNo.startsWith('#') ? bill.billNo : `#${bill.billNo}`;
  const tableDisplay = bill.tableNo.includes('#') ? bill.tableNo : `Table #${bill.tableNo.replace(/[^0-9]/g, '') || '4'} (Dine-In)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-10 p-6 sm:p-7 flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100/70 text-orange-500 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-extrabold tracking-widest uppercase mb-1">
                {settings.receiptTitle || 'TAX INVOICE'}
              </span>
              <h3 className="font-bold text-slate-900 text-base leading-tight font-display">
                {settings.restaurantName}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {settings.branchLocation} · GSTIN: {settings.gstin}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Tel: {settings.phoneNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Grey Box */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2 mb-5 text-xs font-medium">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Order No:</span>
            <span className="text-[#e05425] font-bold text-sm font-mono">{cleanBillNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Table:</span>
            <span className="text-slate-800 font-bold">{tableDisplay}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Date & Time:</span>
            <span className="text-slate-800 font-medium">{bill.dateTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Payment:</span>
            <span className="text-emerald-600 font-bold">{bill.paymentMethod} (Confirmed)</span>
          </div>
        </div>

        {/* Itemized Table Header */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase pb-2 px-1">
          <span>ITEM</span>
          <div className="flex items-center gap-12 pr-1">
            <span>QTY</span>
            <span>PRICE</span>
          </div>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-slate-100 mb-4">
          {items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between px-1">
              <div className="min-w-0 pr-3">
                <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {item.category || 'Special Dish'}
                </p>
              </div>
              <div className="flex items-center gap-12 shrink-0">
                <span className="text-xs font-medium text-slate-500 w-6 text-center">
                  x{item.qty}
                </span>
                <span className="font-bold text-slate-900 text-sm min-w-[50px] text-right font-mono">
                  ₹{item.price * item.qty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 mb-5">
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900 text-sm font-mono">₹{subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>GST ({settings.taxPercentage}%):</span>
            <span className="font-bold text-slate-900 text-sm font-mono">₹{tax}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="font-extrabold text-slate-900 text-base">Grand Total:</span>
            <span className="font-black text-[#e05425] text-xl font-mono">
              ₹{bill.amount}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs font-medium text-slate-400 text-center mb-2 italic">
          "{settings.receiptGreeting}"
        </p>

        {/* Print / Action Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
