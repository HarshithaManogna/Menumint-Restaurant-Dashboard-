import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, DollarSign, Utensils, CheckCircle2, ArrowUpRight, X, Receipt, ShoppingBag, CreditCard, Banknote, QrCode } from 'lucide-react';

interface DaySalesData {
  dayNum: number;
  sales: number;
  orders: number;
  hasPeak?: boolean;
}

export const SalesScheduleCalendar: React.FC = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = November
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculations for current month days
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  
  // Get 0-indexed day of week for the 1st of month (0 = Mon, 1 = Tue, ..., 6 = Sun)
  const getFirstDayOfWeek = (year: number, month: number) => {
    const rawDay = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...
    return rawDay === 0 ? 6 : rawDay - 1; // Convert to Mon = 0, Sun = 6
  };

  const startOffset = getFirstDayOfWeek(currentYear, currentMonthIndex);

  // Generate realistic deterministic sales data for days 1 to 31
  const getSalesDataForDay = (day: number): DaySalesData => {
    const baseSales = 2200 + ((day * 370 + currentMonthIndex * 500) % 3500);
    const baseOrders = 35 + ((day * 7 + currentMonthIndex * 3) % 55);
    const hasPeak = (day % 3 === 0) || day === 1 || day === 5 || day === 18;

    return {
      dayNum: day,
      sales: baseSales,
      orders: baseOrders,
      hasPeak,
    };
  };

  // Pre-generate data for all days in month
  const monthDaysData: DaySalesData[] = Array.from({ length: daysInMonth }, (_, i) => getSalesDataForDay(i + 1));

  // Calculate month grand totals
  const totalMonthRevenue = monthDaysData.reduce((sum, d) => sum + d.sales, 0);
  const totalMonthOrders = monthDaysData.reduce((sum, d) => sum + d.orders, 0);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleDayClick = (dayNum: number) => {
    setSelectedDayNum(dayNum);
    setIsModalOpen(true);
  };

  const activeDayData = selectedDayNum ? getSalesDataForDay(selectedDayNum) : null;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 select-none">
      {/* Outer Container with Soft Teal-Blue Header matching image_2478431c.png */}
      <div className="bg-[#74b3b2] p-4 sm:p-7 rounded-[32px] text-white shadow-xl shadow-teal-900/10 border border-teal-300/30">
        
        {/* Calendar Navigation Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                {monthNames[currentMonthIndex]} {currentYear}
              </h2>
              <p className="text-xs text-white/90 font-medium">
                Click on any date to view detailed sales report modal
              </p>
            </div>
          </div>

          {/* Controls: Month Summary Badges & Nav Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/30 flex items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-white/80 block uppercase font-bold">Month Total</span>
                <span className="font-black text-white font-mono">₹{totalMonthRevenue.toLocaleString()}</span>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <div>
                <span className="text-[10px] text-white/80 block uppercase font-bold">Orders</span>
                <span className="font-black text-white font-mono">{totalMonthOrders}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md p-1 rounded-2xl border border-white/30">
              <button
                onClick={() => {
                  setCurrentMonthIndex(10);
                  setCurrentYear(2026);
                  setSelectedDayNum(1);
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-white text-[#74b3b2] font-black text-xs rounded-xl shadow-2xs hover:bg-white/90 transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inner Month Calendar Card matching Screenshot__681__b10c68da.png */}
        <div className="bg-white rounded-[28px] p-4 sm:p-7 text-slate-900 shadow-lg border border-white/80">
          
          {/* Days of Week Header Row: Monday through Sunday */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center pb-4 mb-4 border-b border-slate-100 font-display">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName) => (
              <div key={dayName} className="font-black text-slate-800 text-xs sm:text-sm tracking-tight py-1">
                {dayName}
              </div>
            ))}
          </div>

          {/* Full Month Grid Layout (7 columns) */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* 1. Leading Empty Cells for Month Start Offset */}
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[84px] sm:min-h-[96px] rounded-2xl bg-slate-50/40 border border-slate-100/40 opacity-40 pointer-events-none" />
            ))}

            {/* 2. Days 1 through daysInMonth */}
            {monthDaysData.map((d) => {
              const isSelected = selectedDayNum === d.dayNum;

              return (
                <div
                  key={d.dayNum}
                  onClick={() => handleDayClick(d.dayNum)}
                  className={`min-h-[84px] sm:min-h-[96px] rounded-2xl p-2.5 sm:p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-[#e57e7c] text-white shadow-lg ring-2 ring-[#e57e7c]/60 scale-[1.03]'
                      : 'bg-[#fcf7f7] border border-[#f5e4e4] hover:border-[#e57e7c]/70 hover:bg-[#e57e7c]/15 text-slate-900 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Card Top Row: Day Number & Indicator Dot */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-black text-sm sm:text-base leading-none font-display ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {d.dayNum}
                    </span>

                    {/* Indicator Dot */}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : d.hasPeak
                          ? 'bg-emerald-500'
                          : 'bg-emerald-400/70'
                      }`}
                    />
                  </div>

                  {/* Card Middle & Bottom: Sales & Orders */}
                  <div className="mt-2 text-left">
                    <span
                      className={`block font-black font-mono text-xs sm:text-sm tracking-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      ₹{d.sales.toLocaleString()}
                    </span>
                    <span
                      className={`block text-[10px] sm:text-[11px] font-bold mt-0.5 ${
                        isSelected ? 'text-white/90' : 'text-slate-500'
                      }`}
                    >
                      {d.orders} orders
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Sales Report Modal for Selected Date */}
      {isModalOpen && activeDayData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Overlay click to close */}
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-100 z-10 text-slate-900 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e57e7c] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {activeDayData.dayNum}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#e57e7c] tracking-widest block">
                    Daily Sales Detailed Report
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-display text-slate-900">
                    {activeDayData.dayNum} {monthNames[currentMonthIndex]} {currentYear}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Daily Sales Summary Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-[#fcf7f7] p-4 rounded-2xl border border-[#f5e4e4]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Sales Revenue
                </span>
                <span className="text-2xl font-black font-mono text-[#e57e7c] mt-1 block">
                  ₹{activeDayData.sales.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Orders Settled
                </span>
                <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
                  {activeDayData.orders} Orders
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Avg Ticket Size
                </span>
                <span className="text-lg font-black font-mono text-emerald-600 mt-0.5 block">
                  ₹{Math.round(activeDayData.sales / (activeDayData.orders || 1))}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Peak Rush Hour
                </span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                  12:30 PM - 02:00 PM
                </span>
              </div>
            </div>

            {/* Payment Method Breakdown Section */}
            <div className="mt-5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2.5">
                Payment Channel Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-emerald-50/80 border border-emerald-100 p-3 rounded-2xl text-left">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>UPI / QR</span>
                  </div>
                  <span className="font-mono font-black text-emerald-800 text-sm block">
                    ₹{Math.round(activeDayData.sales * 0.6).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600">60% of total</span>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-100 p-3 rounded-2xl text-left">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash</span>
                  </div>
                  <span className="font-mono font-black text-emerald-800 text-sm block">
                    ₹{Math.round(activeDayData.sales * 0.25).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600">25% of total</span>
                </div>

                <div className="bg-indigo-50/80 border border-indigo-100 p-3 rounded-2xl text-left">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </div>
                  <span className="font-mono font-black text-indigo-800 text-sm block">
                    ₹{Math.round(activeDayData.sales * 0.15).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-medium text-indigo-600">15% of total</span>
                </div>
              </div>
            </div>

            {/* Top Selling Items on Date */}
            <div className="mt-5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2">
                Top Selling Menu Dishes
              </span>
              <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs">
                {[
                  { name: 'Yogurt Bowl', qty: Math.round(activeDayData.orders * 0.35), rev: Math.round(activeDayData.sales * 0.38) },
                  { name: 'Fruit Bowl', qty: Math.round(activeDayData.orders * 0.28), rev: Math.round(activeDayData.sales * 0.29) },
                  { name: 'Quinoa Bowl', qty: Math.round(activeDayData.orders * 0.22), rev: Math.round(activeDayData.sales * 0.21) },
                  { name: 'French Crepes', qty: Math.round(activeDayData.orders * 0.15), rev: Math.round(activeDayData.sales * 0.12) },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/50 last:border-none">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">{item.qty} sold</span>
                      <span className="font-mono font-black text-slate-900">₹{item.rev.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-[#74b3b2] hover:bg-[#639f9e] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Close Sales Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
