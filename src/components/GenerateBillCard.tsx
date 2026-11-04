import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Minus,
  CheckCircle2,
  Receipt,
  CreditCard,
  Banknote,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ChevronDown,
  X,
} from 'lucide-react';

import { useRestaurantSettings } from '../context/RestaurantSettingsContext';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  emoji?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface GenerateBillCardProps {
  orderItems?: OrderItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
}

export const GenerateBillCard: React.FC<GenerateBillCardProps> = ({
  orderItems: externalOrderItems,
  onUpdateQuantity: externalOnUpdateQuantity,
}) => {
  const { settings } = useRestaurantSettings();
  const TABLES = Array.from({ length: settings.numberOfTables }, (_, i) => `T–${i + 1}`);

  const [currentBillId] = useState('#70965');
  const [selectedTable, setSelectedTable] = useState('T–1');
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false);
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in');

  // Custom Calendar State defaulting to today's date
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [discountInput, setDiscountInput] = useState<string>('0');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [internalOrderItems, setInternalOrderItems] = useState<OrderItem[]>([
    {
      id: 'dish-1',
      name: 'Yogurt Bowl',
      price: 240,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'dish-2',
      name: 'Fruit Bowl',
      price: 210,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const orderItems = externalOrderItems !== undefined ? externalOrderItems : internalOrderItems;

  const updateQuantity = (id: string, delta: number) => {
    if (externalOnUpdateQuantity) {
      externalOnUpdateQuantity(id, delta);
    } else {
      setInternalOrderItems((prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter((item): item is OrderItem => item !== null)
      );
    }
  };

  // Date Formatting helper e.g. "19 Oct 2026" or "01 Nov 2026"
  const formattedDateStr = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(currentYear, currentMonth, dayNum);
    setSelectedDate(newDate);
    setIsCalendarOpen(false);
  };

  // Financial calculations
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountVal = Math.max(0, parseFloat(discountInput) || 0);
  const taxableAmount = Math.max(0, subtotal - discountVal);
  const gstTax = Math.round(taxableAmount * (settings.taxPercentage / 100));
  const totalPayable = taxableAmount + gstTax;

  const handleGenerateBill = () => {
    setIsReceiptOpen(true);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-100/90 shadow-lg shadow-slate-200/50 flex flex-col justify-between relative">
      <div>
        {/* Top Header: Title & Interactive Custom Calendar Trigger */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight font-display">
              Generate Bill
            </h3>
          </div>

          {/* Interactive Custom Calendar Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsTablePickerOpen(false);
              }}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 text-[#c4891e] px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-2xs group cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-[#52b788] group-hover:scale-110 transition-transform" />
              <span className="font-mono">{formattedDateStr}</span>
            </button>

            {/* Custom Interactive Calendar Popup */}
            {isCalendarOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsCalendarOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                  {/* Calendar Header with Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <select
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(Number(e.target.value))}
                        className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 outline-none cursor-pointer"
                      >
                        {MONTH_NAMES.map((name, idx) => (
                          <option key={name} value={idx}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 outline-none cursor-pointer"
                      >
                        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {/* Empty padding for first day offset */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const isSelected =
                        selectedDate.getDate() === dayNum &&
                        selectedDate.getMonth() === currentMonth &&
                        selectedDate.getFullYear() === currentYear;

                      const isToday =
                        today.getDate() === dayNum &&
                        today.getMonth() === currentMonth &&
                        today.getFullYear() === currentYear;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => handleSelectDay(dayNum)}
                          className={`h-8 w-8 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#e57e7c] text-white shadow-xs scale-105'
                              : isToday
                              ? 'bg-emerald-100 text-[#52b788] border border-emerald-300 font-black'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom "Select Today" Shortcut */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        const now = new Date();
                        setSelectedDate(now);
                        setCurrentMonth(now.getMonth());
                        setCurrentYear(now.getFullYear());
                        setIsCalendarOpen(false);
                      }}
                      className="font-bold text-[#e57e7c] hover:underline cursor-pointer"
                    >
                      Select Today
                    </button>
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Current Bill & Table Selection Grid (Matching User Screenshot UI) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Current Bill Card */}
          <div className="bg-slate-50/90 border border-slate-100 p-3 rounded-2xl text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              CURRENT BILL
            </span>
            <span className="text-base font-extrabold text-[#f96b35] font-mono">
              {currentBillId}
            </span>
          </div>

            {/* Table Selection Trigger & Custom Horizontal Pill Grid Popover */}
          <div className="relative">
            <div
              onClick={() => {
                setIsTablePickerOpen(!isTablePickerOpen);
                setIsCalendarOpen(false);
              }}
              className={`bg-slate-50/90 border ${
                isTablePickerOpen ? 'border-[#52b788] ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-slate-300'
              } p-2.5 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center group`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Table No.
              </span>
              <div className="flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-[#52b788]" />
                <span className="font-black text-slate-800 text-sm font-display">
                  {`Table - ${selectedTable.replace(/[^0-9]/g, '') || '7'}`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${isTablePickerOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Table Selector Popover matching the exact attached screenshot UI (T-1 to T-12 pill grid) */}
            {isTablePickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsTablePickerOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200/90 rounded-[28px] shadow-2xl p-5 z-40 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-display">
                      SELECT TABLE (1 – 12)
                    </h4>
                    <button
                      onClick={() => setIsTablePickerOpen(false)}
                      className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Horizontal Rows Pill Grid (4 columns x 3 rows: T-1 to T-12) */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {TABLES.map((t) => {
                      const isSelected = selectedTable === t;
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            setSelectedTable(t);
                            setIsTablePickerOpen(false);
                          }}
                          className={`py-3 px-1.5 rounded-full font-black text-xs tracking-tight transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-[#52b788] text-white shadow-md scale-105 ring-2 ring-[#52b788]/30'
                              : 'bg-slate-100/90 hover:bg-emerald-50 hover:text-[#52b788] text-slate-800'
                          }`}
                        >
                          <span>{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Type Segmented Tabs (Dine-in, Takeaway, Delivery) */}
        <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center justify-between mb-4">
          {(['Dine-in', 'Takeaway', 'Delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                orderType === type
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Order Items Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            Order Items ({orderItems.length})
          </span>
        </div>

        {/* Order Items List */}
        <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1 mb-4">
          {orderItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No items in order.
            </div>
          ) : (
            orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-slate-50/80 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/60 overflow-hidden flex items-center justify-center text-base shrink-0 border border-slate-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.emoji || '🍹'
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls (- / qty / +) */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-1.5 py-1 shadow-2xs shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-5 h-5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                  <span className="text-xs font-bold font-mono px-1 min-w-[16px] text-center text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-5 h-5 rounded-lg bg-[#e57e7c] hover:bg-[#d9706e] text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Summary Block */}
        <div className="bg-[#fcfbf9] border border-emerald-100 p-3.5 rounded-2xl space-y-2 mb-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono text-slate-800 font-bold">₹{subtotal}</span>
          </div>

          {/* Editable Discount Input Field */}
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              Discount (₹)
            </span>
            <div className="flex items-center gap-1 bg-white border border-[#74b3b2]/60 rounded-xl px-2 py-0.5 focus-within:ring-2 focus-within:ring-[#74b3b2]/30">
              <span className="text-xs font-bold text-[#548b8a]">₹</span>
              <input
                type="number"
                min="0"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="0"
                className="w-14 text-right text-xs font-extrabold text-[#548b8a] outline-none bg-transparent"
              />
            </div>
          </div>

          {/* GST Tax */}
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>GST Tax ({settings.taxPercentage}%)</span>
            <span className="font-mono text-slate-800 font-bold">₹{gstTax}</span>
          </div>

          <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-900">Total Payable</span>
            <span className="text-base font-extrabold text-[#e57e7c] font-mono">
              ₹{totalPayable}
            </span>
          </div>
        </div>

        {/* Payment Method Selector (UPI, Cash, Card) */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            PAYMENT METHOD
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'UPI', label: 'UPI', icon: QrCode },
              { id: 'Cash', label: 'Cash', icon: Banknote },
              { id: 'Card', label: 'Card', icon: CreditCard },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#52b788] text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary CTA: GENERATE BILL */}
      <button
        onClick={handleGenerateBill}
        disabled={orderItems.length === 0}
        className="w-full py-3 bg-[#e57e7c] hover:bg-[#d9706e] active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <Receipt className="w-4 h-4" />
        <span>GENERATE BILL</span>
      </button>

      {/* Printable Receipt Modal matching image_826c6d5f.png */}
      {isReceiptOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsReceiptOpen(false)} />
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-800 animate-in zoom-in-95 duration-200 relative z-10 max-h-[92vh] overflow-y-auto">
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
                onClick={() => setIsReceiptOpen(false)}
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
                <span className="text-[#e05425] font-bold text-sm font-mono">{currentBillId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Table:</span>
                <span className="text-slate-800 font-bold">
                  Table #{selectedTable.replace(/[^0-9]/g, '') || '4'} ({orderType})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Date & Time:</span>
                <span className="text-slate-800 font-medium">{formattedDateStr}, 08:30 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Payment:</span>
                <span className="text-emerald-600 font-bold">{paymentMethod} (Confirmed)</span>
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
              {orderItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between px-1">
                  <div className="min-w-0 pr-3">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Healthy Bowls & Bites
                    </p>
                  </div>
                  <div className="flex items-center gap-12 shrink-0">
                    <span className="text-xs font-medium text-slate-500 w-6 text-center">
                      x{item.quantity}
                    </span>
                    <span className="font-bold text-slate-900 text-sm min-w-[50px] text-right font-mono">
                      ₹{item.price * item.quantity}
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
              {discountVal > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discountVal}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>GST ({settings.taxPercentage}%):</span>
                <span className="font-bold text-slate-900 text-sm font-mono">₹{gstTax}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 text-base">Grand Total:</span>
                <span className="font-black text-[#e05425] text-xl font-mono">
                  ₹{totalPayable}
                </span>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs font-medium text-slate-400 text-center mb-2 italic">
              "{settings.receiptGreeting}"
            </p>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
