import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Minus,
  CheckCircle2,
  CreditCard,
  Banknote,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ChevronDown,
  X,
  ShoppingBag,
  Truck,
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

  const formattedDateStr = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

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

  const tableNumClean = selectedTable.replace(/[^0-9]/g, '') || '1';

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[28px] shadow-[0_8px_28px_rgba(20,25,45,0.04)] h-fit relative">
      {/* 1. Top Header: Title, Bill ID & Date Trigger */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#1a1f36] text-[17px] tracking-[-0.01em]">
            Generate bill
          </h3>
          <span className="text-xs font-semibold text-[#313b68] bg-[#e8ecf7] px-2.5 py-0.5 rounded-full tabular-nums">
            {currentBillId}
          </span>
        </div>

        {/* Interactive Date Picker Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsTablePickerOpen(false);
            }}
            className="flex items-center gap-1.5 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#6e768a] hover:text-[#1a1f36] px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#313b68]" />
            <span className="tabular-nums">{formattedDateStr}</span>
          </button>

          {isCalendarOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsCalendarOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-[26px] shadow-[0_16px_40px_rgba(20,25,45,0.14)] p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <select
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(Number(e.target.value))}
                      className="font-semibold text-xs text-[#1a1f36] bg-[#f7f8fa] rounded-lg px-2 py-1 outline-none cursor-pointer"
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
                      className="font-semibold text-xs text-[#1a1f36] bg-[#f7f8fa] rounded-lg px-1.5 py-1 outline-none cursor-pointer"
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
                      className="p-1 hover:bg-[#f7f8fa] rounded-lg text-[#6e768a] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-[#f7f8fa] rounded-lg text-[#6e768a] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#8c93a4] mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
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
                        className={`h-8 w-8 rounded-full font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#313b68] text-white shadow-xs'
                            : isToday
                            ? 'bg-[#e8ecf7] text-[#313b68]'
                            : 'text-[#1a1f36] hover:bg-[#f7f8fa]'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      const now = new Date();
                      setSelectedDate(now);
                      setCurrentMonth(now.getMonth());
                      setCurrentYear(now.getFullYear());
                      setIsCalendarOpen(false);
                    }}
                    className="font-semibold text-[#313b68] hover:underline cursor-pointer"
                  >
                    Select Today
                  </button>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-[#8c93a4] hover:text-[#1a1f36] font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Direct 1-Click Order Type Selector (Dine-in | Takeaway | Delivery) */}
      <div className="bg-[#f7f8fa] p-1 rounded-full grid grid-cols-3 gap-1 mb-3">
        {(
          [
            { id: 'Dine-in', label: 'Dine-in', icon: Utensils },
            { id: 'Takeaway', label: 'Takeaway', icon: ShoppingBag },
            { id: 'Delivery', label: 'Delivery', icon: Truck },
          ] as const
        ).map((mode) => {
          const Icon = mode.icon;
          const isSelected = orderType === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                setOrderType(mode.id);
                if (mode.id !== 'Dine-in') {
                  setIsTablePickerOpen(false);
                }
              }}
              className={`py-2 px-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#313b68] text-white font-semibold shadow-2xs'
                  : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Table Selection (Shown ONLY when Dine-in is selected) */}
      {orderType === 'Dine-in' && (
        <div className="relative mb-3.5 animate-in fade-in duration-150">
          <div
            onClick={() => {
              setIsTablePickerOpen(!isTablePickerOpen);
              setIsCalendarOpen(false);
            }}
            className="bg-[#f7f8fa] hover:bg-[#f1f3f8] rounded-[18px] px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f5ebe1] text-[#6e5641] font-semibold text-xs flex items-center justify-center shrink-0">
                T{tableNumClean}
              </div>
              <div>
                <span className="text-xs font-semibold text-[#1a1f36] block leading-tight">
                  Table {tableNumClean}
                </span>
                <span className="text-[11px] text-[#8c93a4] font-medium">
                  Tap to switch table
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-[#313b68]">
              <span>Change</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isTablePickerOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {isTablePickerOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsTablePickerOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-[0_16px_40px_rgba(20,25,45,0.14)] p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-[#1a1f36]">
                    Select Table (1 – {settings.numberOfTables})
                  </h4>
                  <button
                    onClick={() => setIsTablePickerOpen(false)}
                    className="w-6 h-6 rounded-full bg-[#f7f8fa] hover:bg-[#eceff5] flex items-center justify-center text-[#6e768a] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {TABLES.map((t) => {
                    const isSelected = selectedTable === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTable(t);
                          setIsTablePickerOpen(false);
                        }}
                        className={`py-2 px-1.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#313b68] text-white shadow-xs'
                            : 'bg-[#f7f8fa] hover:bg-[#e8ecf7] text-[#1a1f36]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. Selected Dishes List FIRST (Above Total Payable) */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold text-[#1a1f36]">
            Selected dishes ({orderItems.length})
          </span>
          {orderItems.length > 0 && (
            <span className="text-[11px] font-medium text-[#8c93a4] tabular-nums">
              {orderItems.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
          {orderItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8c93a4] bg-[#f7f8fa] rounded-[18px]">
              No dishes selected yet.
            </div>
          ) : (
            orderItems.map((item, idx) => {
              const badgeColors = [
                'bg-[#e8ecf7] text-[#313b68]',
                'bg-[#f5ebe1] text-[#6e5641]',
                'bg-[#e5f3eb] text-[#2f684e]',
                'bg-[#f9e6ea] text-[#7a3e48]',
              ];
              const badgeClass = badgeColors[idx % badgeColors.length];
              const initials = item.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('');

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-[#f7f8fa] rounded-[18px]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full ${badgeClass} font-semibold text-xs flex items-center justify-center shrink-0 overflow-hidden`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-semibold text-[#1a1f36] truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] font-medium text-[#8c93a4] tabular-nums">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white rounded-full px-1.5 py-1 shadow-2xs shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-full bg-[#f7f8fa] hover:bg-[#e8ecf7] text-[#1a1f36] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.2]" />
                    </button>
                    <span className="text-xs font-semibold tabular-nums px-1 min-w-[16px] text-center text-[#1a1f36]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-full bg-[#313b68] hover:bg-[#252e54] text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Total Payable & Breakdown Box BELOW Selected Dishes */}
      <div className="bg-[#f7f8fa] rounded-[20px] p-4 mb-3.5 space-y-2">
        <div className="flex justify-between items-center text-xs text-[#6e768a]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1a1f36] tabular-nums">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-[#6e768a]">
          <span>Discount (₹)</span>
          <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-0.5 shadow-2xs">
            <span className="text-xs font-medium text-[#8c93a4]">₹</span>
            <input
              type="number"
              min="0"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="0"
              className="w-12 text-right text-xs font-semibold text-[#1a1f36] outline-none bg-transparent tabular-nums"
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-[#6e768a]">
          <span>GST ({settings.taxPercentage}%)</span>
          <span className="font-semibold text-[#1a1f36] tabular-nums">₹{gstTax.toFixed(2)}</span>
        </div>

        <div className="pt-2.5 border-t border-slate-200/70 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-[#1a1f36]">Total payable</span>
          <span className="font-display text-2xl font-semibold text-[#1a1f36] tracking-[-0.02em] tabular-nums">
            ₹{totalPayable.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 6. Payment Method Selector */}
      <div className="mb-4">
        <span className="text-[11px] font-medium text-[#8c93a4] block mb-1.5 px-1">
          Payment method
        </span>
        <div className="bg-[#f7f8fa] p-1 rounded-full grid grid-cols-3 gap-1">
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
                onClick={() => setPaymentMethod(method.id as 'UPI' | 'Cash' | 'Card')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-full text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#1a1f36] font-semibold shadow-2xs'
                    : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#313b68]" />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Primary CTA Button */}
      <button
        onClick={() => setIsReceiptOpen(true)}
        disabled={orderItems.length === 0}
        className="w-full py-3.5 bg-[#313b68] hover:bg-[#252e54] active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-sm rounded-full transition-all shadow-[0_6px_20px_rgba(49,59,104,0.22)] flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Generate bill</span>
      </button>

      {/* Printable Receipt Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 bg-[#1a1f36]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsReceiptOpen(false)} />
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-[0_24px_60px_rgba(20,25,45,0.2)] text-[#1a1f36] animate-in zoom-in-95 duration-200 relative z-10 max-h-[92vh] overflow-y-auto">
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
                </div>
              </div>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f7f8fa] text-[#8c93a4] hover:text-[#1a1f36] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#f7f8fa] rounded-[20px] p-4 space-y-2 mb-5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Order No:</span>
                <span className="text-[#313b68] font-semibold tabular-nums">{currentBillId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Order Type:</span>
                <span className="text-[#1a1f36] font-semibold">
                  {orderType === 'Dine-in' ? `Dine-in · Table #${tableNumClean}` : orderType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Date & Time:</span>
                <span className="text-[#1a1f36] font-medium tabular-nums">{formattedDateStr}, 08:30 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Payment:</span>
                <span className="text-[#229a54] font-semibold">{paymentMethod} (Confirmed)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8c93a4] uppercase pb-2 px-1">
              <span>Item</span>
              <div className="flex items-center gap-12 pr-1">
                <span>Qty</span>
                <span>Price</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mb-4">
              {orderItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between px-1">
                  <div className="min-w-0 pr-3">
                    <h4 className="font-semibold text-[#1a1f36] text-sm leading-snug truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#8c93a4] mt-0.5">
                      Freshly Prepared
                    </p>
                  </div>
                  <div className="flex items-center gap-12 shrink-0">
                    <span className="text-xs font-medium text-[#8c93a4] w-6 text-center tabular-nums">
                      x{item.quantity}
                    </span>
                    <span className="font-semibold text-[#1a1f36] text-sm min-w-[50px] text-right tabular-nums">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 mb-5">
              <div className="flex justify-between items-center text-xs text-[#8c93a4]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#1a1f36] text-sm tabular-nums">₹{subtotal}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between items-center text-xs text-[#229a54] font-semibold">
                  <span>Discount:</span>
                  <span className="tabular-nums">-₹{discountVal}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-[#8c93a4]">
                <span>GST ({settings.taxPercentage}%):</span>
                <span className="font-semibold text-[#1a1f36] text-sm tabular-nums">₹{gstTax}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="font-semibold text-[#1a1f36] text-base">Grand Total:</span>
                <span className="font-display font-semibold text-[#313b68] text-2xl tabular-nums">
                  ₹{totalPayable.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8c93a4] text-center mb-2 italic">
              "{settings.receiptGreeting}"
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 py-3 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
