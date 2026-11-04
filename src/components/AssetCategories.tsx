import React from 'react';
import { Plus } from 'lucide-react';

interface AssetCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export const AssetCategories: React.FC<AssetCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100/80 shadow-xs">
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
        {/* Category 1: EFTs */}
        <div
          onClick={() => onSelectCategory('EFTs')}
          className="flex flex-col items-center p-2 group cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors"
        >
          {/* Yellow Line Art Icon for EFTs (Two tilted cards) */}
          <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#52b788]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* Card 1 */}
              <rect x="5" y="10" width="18" height="13" rx="2" transform="rotate(-12 14 16.5)" />
              {/* Card 2 */}
              <rect x="10" y="8" width="18" height="13" rx="2" transform="rotate(12 19 14.5)" />
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-800 mb-3">EFTs</span>
          <button className="w-7 h-7 rounded-full bg-[#dff2ed] text-[#2ba38f] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Category 2: Bonds */}
        <div
          onClick={() => onSelectCategory('Bonds')}
          className="flex flex-col items-center p-2 group cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors"
        >
          {/* Yellow Line Art Icon for Bonds (Stacked cash bills) */}
          <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#52b788]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10 H26 V22 H6 Z" />
              <path d="M10 7 H22" />
              <path d="M12 4 H20" />
              <circle cx="16" cy="16" r="3" />
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-800 mb-3">Bonds</span>
          <button className="w-7 h-7 rounded-full bg-[#dff2ed] text-[#2ba38f] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Category 3: NFTs */}
        <div
          onClick={() => onSelectCategory('NFTs')}
          className="flex flex-col items-center p-2 group cursor-pointer hover:bg-slate-50/60 rounded-xl transition-colors"
        >
          {/* Yellow Line Art Icon for NFTs (Framed landscape) */}
          <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#52b788]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="6" width="22" height="20" rx="2" />
              <circle cx="11" cy="12" r="2.5" />
              <path d="M6 22 L13 15 L19 21 L22 18 L26 22" />
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-800 mb-3">NFTs</span>
          <button className="w-7 h-7 rounded-full bg-[#dff2ed] text-[#2ba38f] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
