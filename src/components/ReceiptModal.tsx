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

  const items =
    bill.itemsDetails ||
    bill.itemsSummary.split(', ').map((itemStr) => {
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
  const tableDisplay = bill.tableNo.includes('#')
    ? bill.tableNo
    : `Table #${bill.tableNo.replace(/[^0-9]/g, '') || '4'} (Dine-In)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1f36]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_60px_rgba(20,25,45,0.2)] overflow-hidden z-10 p-6 sm:p-7 flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto text-[#1a1f36]">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-[#313b68] text-white rounded-full text-[10px] font-semibold tracking-wider uppercase mb-1">
                {settings.receiptTitle || 'TAX INVOICE'}
              </span>
              <h3 className="font-semibold text-[#1a1f36] text-base leading-tight">
                {settings.restaurantName}
              </h3>
              <p className="text-xs text-[#8c93a4] mt-0.5">
                {settings.branchLocation} · GSTIN: {settings.gstin}
              </p>
              <p className="text-[11px] text-[#8c93a4]">
                Tel: {settings.phoneNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f7f8fa] text-[#8c93a4] hover:text-[#1a1f36] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Grey Box */}
        <div className="bg-[#f7f8fa] rounded-[20px] p-4 space-y-2 mb-5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#8c93a4]">Order No:</span>
            <span className="text-[#313b68] font-semibold text-sm tabular-nums">{cleanBillNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8c93a4]">Table:</span>
            <span className="text-[#1a1f36] font-semibold">{tableDisplay}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8c93a4]">Date & Time:</span>
            <span className="text-[#1a1f36] font-medium tabular-nums">{bill.dateTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8c93a4]">Payment:</span>
            <span className="text-[#229a54] font-semibold">{bill.paymentMethod} (Confirmed)</span>
          </div>
        </div>

        {/* Itemized Table Header */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#8c93a4] uppercase pb-2 px-1">
          <span>Item</span>
          <div className="flex items-center gap-12 pr-1">
            <span>Qty</span>
            <span>Price</span>
          </div>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-slate-100 mb-4">
          {items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between px-1">
              <div className="min-w-0 pr-3">
                <h4 className="font-semibold text-[#1a1f36] text-sm leading-snug truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-[#8c93a4] mt-0.5">
                  {item.category || 'Special Dish'}
                </p>
              </div>
              <div className="flex items-center gap-12 shrink-0">
                <span className="text-xs font-medium text-[#8c93a4] w-6 text-center tabular-nums">
                  x{item.qty}
                </span>
                <span className="font-semibold text-[#1a1f36] text-sm min-w-[50px] text-right tabular-nums">
                  ₹{item.price * item.qty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 mb-5">
          <div className="flex justify-between items-center text-xs text-[#8c93a4]">
            <span>Subtotal:</span>
            <span className="font-semibold text-[#1a1f36] text-sm tabular-nums">₹{subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#8c93a4]">
            <span>GST ({settings.taxPercentage}%):</span>
            <span className="font-semibold text-[#1a1f36] text-sm tabular-nums">₹{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="font-semibold text-[#1a1f36] text-base">Grand Total:</span>
            <span className="font-display font-semibold text-[#313b68] text-2xl tabular-nums">
              ₹{bill.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-[#8c93a4] text-center mb-2 italic">
          "{settings.receiptGreeting}"
        </p>

        {/* Print / Action Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36] font-semibold text-xs rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
