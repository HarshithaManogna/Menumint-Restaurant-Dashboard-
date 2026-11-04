import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign, Calendar, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

export const InvestedValueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; date: string } | null>(null);

  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Nov 01 - Nov 30, 2026');
  const [currentMonth, setCurrentMonth] = useState('November 2026');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 30]);

  // Smooth curve dataset
  const chartPoints = [
    { x: 20, y: 220, val: '$12.4k', date: 'May 1' },
    { x: 70, y: 210, val: '$14.8k', date: 'May 5' },
    { x: 120, y: 150, val: '$21.5k', date: 'May 10' },
    { x: 170, y: 60, val: '$29.2k', date: 'May 15' },
    { x: 220, y: 95, val: '$26.0k', date: 'May 20' },
    { x: 270, y: 180, val: '$17.4k', date: 'May 25' },
    { x: 320, y: 170, val: '$18.2k', date: 'May 30' },
  ];

  // Smooth Cubic Bezier Path matching the exact wave
  const pathD = "M 20 220 C 50 220, 50 210, 70 210 C 95 210, 100 150, 120 150 C 145 150, 150 60, 170 60 C 195 60, 200 95, 220 95 C 245 95, 250 180, 270 180 C 295 180, 300 170, 320 170";
  
  // Area fill path string
  const fillD = `${pathD} L 320 260 L 20 260 Z`;

  const handleSelectDay = (day: number) => {
    if (selectedDays.length === 0 || selectedDays.length === 2) {
      setSelectedDays([day]);
      setSelectedDateRange(`Nov ${day < 10 ? '0' + day : day}, 2026`);
    } else {
      const start = Math.min(selectedDays[0], day);
      const end = Math.max(selectedDays[0], day);
      setSelectedDays([start, end]);
      setSelectedDateRange(`Nov ${start < 10 ? '0' + start : start} - Nov ${end < 10 ? '0' + end : end}, 2026`);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-100/80 shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header with Title and Time Range Filter + Calendar Date Picker */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight font-display flex items-center gap-2">
              Invested Value
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Asset growth & valuation trends</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Calendar Button */}
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-[#c4891e] rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5 text-[#52b788]" />
                <span>{selectedDateRange}</span>
              </button>

              {/* Calendar Dropdown Popover Modal */}
              {isCalendarOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsCalendarOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <Calendar className="w-4 h-4 text-[#52b788]" />
                        <span>Select Date Range</span>
                      </div>
                      <button
                        onClick={() => setIsCalendarOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Month Controls */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-extrabold text-slate-800">{currentMonth}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d} className="text-[10px] font-bold text-slate-400">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-3">
                      {Array.from({ length: 30 }).map((_, i) => {
                        const dayNum = i + 1;
                        const isStart = selectedDays[0] === dayNum;
                        const isEnd = selectedDays[1] === dayNum;
                        const inRange = selectedDays.length === 2 && dayNum >= selectedDays[0] && dayNum <= selectedDays[1];

                        return (
                          <button
                            key={dayNum}
                            onClick={() => handleSelectDay(dayNum)}
                            className={`text-xs h-7 w-7 rounded-lg font-medium flex items-center justify-center transition-colors ${
                              isStart || isEnd
                                ? 'bg-[#52b788] text-slate-900 font-extrabold shadow-2xs'
                                : inRange
                                ? 'bg-emerald-100/70 text-slate-800 font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Preset Range Pills */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 mb-3">
                      <button
                        onClick={() => {
                          setSelectedDays([1, 1]);
                          setSelectedDateRange('Nov 01, 2026');
                        }}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-center"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDays([1, 7]);
                          setSelectedDateRange('Nov 01 - Nov 07, 2026');
                        }}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-center"
                      >
                        Last 7 Days
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDays([1, 30]);
                          setSelectedDateRange('Nov 01 - Nov 30, 2026');
                        }}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-center"
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDays([15, 30]);
                          setSelectedDateRange('Nov 15 - Nov 30, 2026');
                        }}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-center"
                      >
                        Last 15 Days
                      </button>
                    </div>

                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Apply Date Filter
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Time Range Pills */}
            <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-0.5">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    timeRange === range
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlighted Value Card */}
        <div className="bg-[#fcfbf9] border border-emerald-100/80 p-4 rounded-2xl mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              CURRENT VALUATION
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-display">
                $182,450
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +14.8%
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#52b788] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Tall Responsive Chart SVG */}
        <div className="flex items-stretch min-h-[260px] sm:min-h-[300px] relative pt-2">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[11px] font-bold font-mono text-slate-400 pr-3 py-2 select-none">
            <span>$30k</span>
            <span>$20k</span>
            <span>$10k</span>
            <span>$0</span>
          </div>

          {/* Chart Canvas Area */}
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 340 260"
              className="w-full h-full overflow-visible"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="yellowGradientTall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52b788" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#52b788" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="180" x2="320" y2="180" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area Fill */}
              <path d={fillD} fill="url(#yellowGradientTall)" />

              {/* Continuous Smooth Gold Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#52b788"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Tooltip Event Targets */}
              {chartPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                />
              ))}

              {/* Active Hover Point Circle */}
              {hoveredPoint && (
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#52b788"
                  strokeWidth="3.5"
                />
              )}
            </svg>

            {/* Floating Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-20 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 whitespace-nowrap animate-in fade-in duration-150"
                style={{
                  left: `${(hoveredPoint.x / 340) * 100}%`,
                  top: `${(hoveredPoint.y / 260) * 100}%`,
                }}
              >
                <div className="font-extrabold">{hoveredPoint.val}</div>
                <div className="text-[10px] text-emerald-300 font-medium">{hoveredPoint.date}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Summary Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-[#52b788]" />
          <span>Last updated today at 09:30 AM</span>
        </div>
        <span className="font-mono text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
          All Systems Operational
        </span>
      </div>
    </div>
  );
};
