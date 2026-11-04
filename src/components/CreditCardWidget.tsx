import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Copy, Check } from 'lucide-react';

export const CreditCardWidget: React.FC = () => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('4532890123455678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => setShowFullNumber(!showFullNumber)}
      className="bg-[#7bb2b2] text-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group select-none"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

      {/* Top Header: Chip & Wifi Contactless */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        {/* Chip Outline Symbol */}
        <div className="w-10 h-7 border border-white/60 rounded-md flex items-center justify-center relative overflow-hidden bg-white/10">
          <div className="w-full h-[1px] bg-white/40 absolute top-1/2 -translate-y-1/2" />
          <div className="h-full w-[1px] bg-white/40 absolute left-1/2 -translate-x-1/2" />
          <div className="w-4 h-3 rounded-xs border border-white/40 bg-white/20" />
        </div>

        {/* Contactless Signal Icon */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1 rounded-full bg-white/15 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy Card Number"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullNumber(!showFullNumber);
            }}
            className="p-1 rounded-full bg-white/15 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Toggle Card Number"
          >
            {showFullNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <Wifi className="w-5 h-5 text-white/90 rotate-90" />
        </div>
      </div>

      {/* Card Number */}
      <div className="font-mono text-lg md:text-xl tracking-widest text-white/95 mb-6 relative z-10 flex items-center justify-between">
        {showFullNumber ? (
          <span>4532 8901 2345 5678</span>
        ) : (
          <>
            <span className="text-xl">••••</span>
            <span className="text-xl">••••</span>
            <span className="text-xl">••••</span>
            <span className="font-sans font-medium text-lg">5678</span>
          </>
        )}
      </div>

      {/* Card Footer: Holder, Expiry & Mastercard Logo */}
      <div className="flex justify-between items-end relative z-10 text-xs tracking-wide">
        <div>
          <p className="text-white/80 font-medium text-[11px] mb-0.5">Joy Laroy</p>
          <p className="text-white/90 font-mono text-[11px]">12/24</p>
        </div>

        {/* Overlapping Circles Mastercard Logo */}
        <div className="flex items-center -space-x-2">
          <div className="w-7 h-7 rounded-full bg-white/40" />
          <div className="w-7 h-7 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
};
