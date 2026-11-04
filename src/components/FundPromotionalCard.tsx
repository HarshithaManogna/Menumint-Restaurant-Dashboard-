import React from 'react';

interface FundPromotionalCardProps {
  onAddFunds: () => void;
}

export const FundPromotionalCard: React.FC<FundPromotionalCardProps> = ({ onAddFunds }) => {
  return (
    <div className="bg-[#e5837f] text-white p-5 rounded-[24px] shadow-sm flex items-center gap-4 relative overflow-hidden">
      {/* Jar Illustration Container */}
      <div className="relative shrink-0">
        {/* Glass Coin Jar SVG */}
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center p-2 backdrop-blur-xs relative">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Jar Rim */}
            <path d="M 22 14 H 42 V 18 H 22 Z" fill="rgba(255, 255, 255, 0.4)" />
            {/* Jar Body */}
            <path
              d="M 18 20 C 18 18 46 18 46 20 L 48 48 C 48 54 16 54 16 48 Z"
              fill="rgba(255, 255, 255, 0.25)"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="2"
            />
            {/* Gold Coins inside */}
            <circle cx="28" cy="42" r="6" fill="#52b788" stroke="#ffffff" strokeWidth="1" />
            <text x="28" y="44.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
              $
            </text>
            <circle cx="36" cy="40" r="5" fill="#f5c242" stroke="#ffffff" strokeWidth="1" />
            <circle cx="32" cy="34" r="5" fill="#52b788" stroke="#ffffff" strokeWidth="1" />
          </svg>

          {/* Plus Badge on top right of jar */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#e5837f] font-bold text-xs flex items-center justify-center shadow-xs">
            +
          </div>
        </div>
      </div>

      {/* Text & Button Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-xs md:text-sm leading-snug mb-2">
          Load more funds and keep trading.
        </p>

        <button
          onClick={onAddFunds}
          className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-white hover:text-white/90 transition-opacity group cursor-pointer"
        >
          <span>ADD FUNDS</span>
          <span className="group-hover:translate-x-1 transition-transform">➔</span>
        </button>
      </div>
    </div>
  );
};
