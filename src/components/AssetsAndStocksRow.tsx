import React, { useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const AssetsAndStocksRow: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {/* Left Side: Your Assets */}
      <div className="pr-0 sm:pr-4 pb-4 sm:pb-0 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-800 text-sm font-display">Your Assets</h3>
          <ArrowRight className="w-4 h-4 text-slate-700 stroke-[2] cursor-pointer hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Hexagonal Radar / Spider Chart with 3-Lobed Star Geometry */}
        <div className="relative w-full h-32 flex items-center justify-center my-1">
          <svg viewBox="0 0 160 140" className="w-32 h-32 overflow-visible">
            {/* Concentric Hexagonal Grids */}
            <polygon
              points="80,10 135,40 135,100 80,130 25,100 25,40"
              fill="none"
              stroke="#d9ebe7"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <polygon
              points="80,30 118,52 118,88 80,110 42,88 42,52"
              fill="none"
              stroke="#d9ebe7"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <polygon
              points="80,50 99,61 99,79 80,90 61,79 61,61"
              fill="none"
              stroke="#d9ebe7"
              strokeWidth="1"
            />

            {/* Radar Axes Lines */}
            <line x1="80" y1="10" x2="80" y2="130" stroke="#d9ebe7" strokeWidth="1" />
            <line x1="25" y1="40" x2="135" y2="100" stroke="#d9ebe7" strokeWidth="1" />
            <line x1="25" y1="100" x2="135" y2="40" stroke="#d9ebe7" strokeWidth="1" />

            {/* Shaded 3-Lobed Star Asset Polygon Shape (3 lobes pointing Top, Bottom-Right, Bottom-Left) */}
            <polygon
              points="80,20 125,42 108,82 80,118 52,82 35,42"
              fill="rgba(123, 178, 178, 0.22)"
              stroke="#7bb2b2"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Second inner dashed star outline matching reference image */}
            <polygon
              points="80,34 118,44 98,78 80,104 62,78 42,44"
              fill="none"
              stroke="#9ecfcf"
              strokeWidth="1"
              strokeDasharray="3 2"
            />

            {/* Lobe Vertex Dots */}
            <circle cx="80" cy="20" r="3" fill="#7bb2b2" className="cursor-pointer" onMouseEnter={() => setHoveredCategory('ETFs (45%)')} />
            <circle cx="125" cy="42" r="3" fill="#7bb2b2" className="cursor-pointer" onMouseEnter={() => setHoveredCategory('Stocks (35%)')} />
            <circle cx="52" cy="82" r="3" fill="#7bb2b2" className="cursor-pointer" onMouseEnter={() => setHoveredCategory('NFTs (20%)')} />
          </svg>

          {hoveredCategory && (
            <div className="absolute top-0 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none">
              {hoveredCategory}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Stocks Widget */}
      <div className="pl-0 sm:pl-4 pt-4 sm:pt-0 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-800 text-sm font-display">Stocks</h3>
        </div>

        <div className="flex flex-col justify-center items-start space-y-2 py-2">
          {/* Briefcase Dollar Icon in Light Pink Circle */}
          <div className="w-10 h-10 rounded-full bg-[#fdeaea] text-[#e5837f] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="bold">
                $
              </text>
            </svg>
          </div>

          {/* Large thin amount */}
          <div>
            <span className="text-3xl font-light font-display text-slate-800 tracking-tight">
              $12.5k
            </span>

            {/* Growth indicator */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#25a77b] mt-1">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+12.3% /month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
