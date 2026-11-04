import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  X,
  Plus,
  Search,
  Filter,
  Check,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  ArrowUpRight,
  Printer,
  Sparkles,
} from 'lucide-react';

interface DailySalesData {
  day: number;
  revenue: number;
  orders: number;
  avgOrder: number;
  paymentBreakdown: {
    cash: number;
    upi: number;
    card: number;
  };
  transactions: {
    id: string;
    billNo: string;
    time: string;
    tableNo: string;
    items: string;
    amount: number;
    paymentMethod: 'Cash' | 'Credit Card' | 'UPI / QR';
  }[];
}

export const CalendarSalesReport: React.FC = () => {
  // Current selected month (0 = Jan, 1 = Feb, ..., 10 = Nov, 11 = Dec)
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // Default to January
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to 1st of month

  // Picker modal visibility
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  // New Transaction form state
  const [newBillNo, setNewBillNo] = useState('');
  const [newTableNo, setNewTableNo] = useState('T-04');
  const [newAmount, setNewAmount] = useState('');
  const [newMethod, setNewMethod] = useState<'Cash' | 'Credit Card' | 'UPI / QR'>('UPI / QR');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = [2024, 2025, 2026, 2027];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calculate days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the 1st of the month (0 = Mon, 1 = Tue, ..., 6 = Sun)
  const getFirstDayOfWeek = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // JS getDay(): 0 = Sun, 1 = Mon, 2 = Tue... convert so Monday is index 0
    return day === 0 ? 6 : day - 1;
  };

  const totalDays = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayIndex = getFirstDayOfWeek(selectedMonth, selectedYear);

  // Seed realistic daily sales data for each day of the month
  const generateDailySales = (dayNum: number): DailySalesData => {
    // Deterministic pseudo-random values based on day number and month
    const seed = (dayNum * 13 + (selectedMonth + 1) * 37 + selectedYear) % 100;
    const baseRevenue = 1400 + (seed % 35) * 80 + (dayNum % 7 === 5 || dayNum % 7 === 6 ? 900 : 0);
    const orders = 18 + Math.floor(baseRevenue / 75);
    const avgOrder = parseFloat((baseRevenue / orders).toFixed(2));

    const cash = Math.round(baseRevenue * (0.25 + (seed % 10) * 0.01));
    const upi = Math.round(baseRevenue * (0.50 + (seed % 15) * 0.01));
    const card = baseRevenue - cash - upi;

    return {
      day: dayNum,
      revenue: baseRevenue,
      orders,
      avgOrder,
      paymentBreakdown: { cash, upi, card },
      transactions: [
        {
          id: `tx-${dayNum}-1`,
          billNo: `INV-2026-${100 + dayNum * 3 + 1}`,
          time: '12:45 PM',
          tableNo: `T-0${(dayNum % 6) + 1}`,
          items: 'Truffle Mushroom Burger, Iced Matcha Latte',
          amount: Math.round(baseRevenue * 0.4),
          paymentMethod: 'UPI / QR',
        },
        {
          id: `tx-${dayNum}-2`,
          billNo: `INV-2026-${100 + dayNum * 3 + 2}`,
          time: '02:15 PM',
          tableNo: `T-0${((dayNum + 2) % 6) + 1}`,
          items: 'Avocado Toast & Poached Egg, Berry Smoothie',
          amount: Math.round(baseRevenue * 0.35),
          paymentMethod: 'Credit Card',
        },
        {
          id: `tx-${dayNum}-3`,
          billNo: `INV-2026-${100 + dayNum * 3 + 3}`,
          time: '07:30 PM',
          tableNo: `T-0${((dayNum + 4) % 6) + 1}`,
          items: 'Japanese Fluffy Pancakes, Cappuccino',
          amount: baseRevenue - Math.round(baseRevenue * 0.4) - Math.round(baseRevenue * 0.35),
          paymentMethod: 'Cash',
        },
      ],
    };
  };

  // Currently inspected day's sales ledger
  const activeDayData = generateDailySales(selectedDay);

  // Calculate monthly total revenue
  let monthlyTotalRevenue = 0;
  let monthlyTotalOrders = 0;
  for (let i = 1; i <= totalDays; i++) {
    const data = generateDailySales(i);
    monthlyTotalRevenue += data.revenue;
    monthlyTotalOrders += data.orders;
  }

  // Handle month/year navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleResetToToday = () => {
    setSelectedMonth(0); // January
    setSelectedYear(2026);
    setSelectedDay(1);
  };

  // Add transaction submit
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;

    const amt = parseFloat(newAmount);
    activeDayData.transactions.unshift({
      id: `tx-custom-${Date.now()}`,
      billNo: newBillNo || `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tableNo: newTableNo,
      items: 'Manual Sales Receipt Entry',
      amount: amt,
      paymentMethod: newMethod,
    });

    activeDayData.revenue += amt;
    activeDayData.orders += 1;

    setNewAmount('');
    setNewBillNo('');
    setIsAddTxOpen(false);
  };

  return (
    <div className="w-full bg-[#8c91c3] rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-2xl animate-in fade-in duration-300">
      {/* Top Banner Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Top Left Calendar Symbol & Month/Year Selector */}
          <div className="relative">
            <button
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
              className="flex items-center gap-2.5 bg-white/20 hover:bg-white/30 text-white font-extrabold px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all border border-white/20 active:scale-95 cursor-pointer shadow-sm group"
              title="Click to select Month & Year"
            >
              <CalendarIcon className="w-6 h-6 text-[#d7f75b] group-hover:scale-110 transition-transform" />
              <span className="text-xl sm:text-2xl tracking-tight">
                {months[selectedMonth]} {selectedYear}
              </span>
              <ChevronRight className="w-4 h-4 text-purple-200 rotate-90" />
            </button>

            {/* Month & Year Picker Popover Dropdown */}
            {isMonthPickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsMonthPickerOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Select Month & Year
                    </span>
                    <button
                      onClick={() => setIsMonthPickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Year selector */}
                  <div className="mb-3">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Year
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={`py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                            selectedYear === y
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Month selector */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Month
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {months.map((m, idx) => (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedMonth(idx);
                            setIsMonthPickerOpen(false);
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            selectedMonth === idx
                              ? 'bg-[#d7f75b] text-slate-900 font-extrabold shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {m.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="hidden sm:inline-block text-xs font-semibold text-purple-100 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            Monthly Full Sales View
          </span>
        </div>

        {/* Right Navigation & Control Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Jump Today Button */}
          <button
            onClick={handleResetToToday}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full text-xs transition-all backdrop-blur-md active:scale-95 shadow-xs"
          >
            Today
          </button>

          {/* Month Prev / Next Navigation Arrows */}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Monthly Sales Pill */}
          <div className="px-4 py-2 bg-[#d7f75b] text-slate-900 font-extrabold rounded-full text-xs shadow-md flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            <span>Monthly Total: ₹{monthlyTotalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Main White Calendar Grid Frame */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-xl p-4 sm:p-6 lg:p-7 border border-purple-100/50 mb-6">
        {/* Days of Week Row Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3 text-center border-b border-slate-100 pb-3">
          {weekDays.map((dayName) => (
            <div
              key={dayName}
              className="text-xs sm:text-sm font-extrabold text-slate-700 tracking-tight"
            >
              <span className="hidden md:inline">{dayName}</span>
              <span className="md:hidden">{dayName.substring(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Dates Grid (Monthly View) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* Preceding empty padding days for month offset */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div
              key={`prev-padding-${idx}`}
              className="min-h-[75px] sm:min-h-[90px] rounded-2xl bg-slate-50/50 border border-dashed border-slate-200/60 p-2 opacity-40 pointer-events-none"
            />
          ))}

          {/* Days of the Selected Month (1 to totalDays) */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const daySales = generateDailySales(dayNum);
            const isSelected = selectedDay === dayNum;
            const isHighSales = daySales.revenue > 2500;

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`min-h-[75px] sm:min-h-[92px] rounded-2xl p-2 sm:p-2.5 text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative group border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02] z-10'
                    : isHighSales
                    ? 'bg-[#f8fde8] border-[#d7f75b]/80 text-slate-900 hover:bg-[#effbc6] hover:border-[#c6eb41]'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-800'
                }`}
              >
                {/* Top Row: Date Number & Peak indicator */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-black text-sm sm:text-base leading-none ${
                      isSelected ? 'text-[#d7f75b]' : 'text-slate-900'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isHighSales && !isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#82b804] ring-2 ring-white" title="High Sales Day" />
                  )}
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#d7f75b] animate-ping" />
                  )}
                </div>

                {/* Bottom Row: Revenue & Orders count */}
                <div className="mt-1">
                  <div
                    className={`font-extrabold font-mono text-xs sm:text-sm tracking-tight truncate ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    ₹{daySales.revenue.toLocaleString('en-IN')}
                  </div>
                  <div
                    className={`text-[10px] font-semibold mt-0.5 ${
                      isSelected ? 'text-purple-200' : 'text-slate-500'
                    }`}
                  >
                    {daySales.orders} orders
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Sales Inspector & Detailed Ledger */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-xl p-5 sm:p-7 border border-purple-100/50 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-900 text-[#d7f75b] font-black rounded-full text-xs">
                Selected Day
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {months[selectedMonth]} {selectedDay}, {selectedYear} Sales Ledger
              </h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Detailed transaction ledger, shift revenue summary, and payment methods for {months[selectedMonth]} {selectedDay}.
            </p>
          </div>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Manual Sale</span>
          </button>
        </div>

        {/* Daily Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#d7f75b] text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Daily Revenue
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₹{activeDayData.revenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
              <Receipt className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Orders Settled
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {activeDayData.orders} Receipts
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg. Ticket Size
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₹{activeDayData.avgOrder.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Pills */}
        <div className="mb-6 p-4 rounded-2xl bg-[#fcfcfd] border border-slate-200/80">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            Payment Method Breakdown for {months[selectedMonth]} {selectedDay}:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold">Cash Payments</span>
              </div>
              <span className="text-xs font-black font-mono text-slate-900">
                ₹{activeDayData.paymentBreakdown.cash.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold">UPI / QR Scan</span>
              </div>
              <span className="text-xs font-black font-mono text-slate-900">
                ₹{activeDayData.paymentBreakdown.upi.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold">Credit Cards</span>
              </div>
              <span className="text-xs font-black font-mono text-slate-900">
                ₹{activeDayData.paymentBreakdown.card.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Day's Transactions List */}
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center justify-between">
            <span>Settled Receipts on {months[selectedMonth]} {selectedDay}</span>
            <span className="text-xs font-bold text-slate-400">
              {activeDayData.transactions.length} Transactions Recorded
            </span>
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4">Ordered Items</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {activeDayData.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900">{tx.billNo}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.time}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px]">
                        {tx.tableNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{tx.items}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black font-mono text-slate-900">
                      ₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Sale Entry Modal */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsAddTxOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c4891e]" /> Add Manual Sale Entry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Record a sale transaction for {months[selectedMonth]} {selectedDay}, {selectedYear}.
            </p>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receipt / Invoice #
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-999"
                  value={newBillNo}
                  onChange={(e) => setNewBillNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Table #
                  </label>
                  <input
                    type="text"
                    value={newTableNo}
                    onChange={(e) => setNewTableNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold font-mono text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="UPI / QR">UPI / QR Scan</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
