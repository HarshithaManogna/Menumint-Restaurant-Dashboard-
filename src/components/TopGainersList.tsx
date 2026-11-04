import React, { useState } from 'react';
import { ArrowRight, TrendingUp, DollarSign, Award, Zap } from 'lucide-react';

export interface StockGainer {
  symbol: string;
  name: string;
  changePercent: string;
  price: string;
  volume: string;
  iconBg: string;
  iconType: 'spotify' | 'airbnb' | 'dropbox' | 'nvidia' | 'apple';
}

interface TopGainersListProps {
  onSelectStock?: (stock: StockGainer) => void;
}

export const TopGainersList: React.FC<TopGainersListProps> = ({ onSelectStock }) => {
  const [gainers] = useState<StockGainer[]>([
    {
      symbol: 'SPOT',
      name: 'Spotify',
      changePercent: '+1,2%',
      price: '$75.30',
      volume: '2.4M',
      iconBg: '#1db954',
      iconType: 'spotify',
    },
    {
      symbol: 'ABNB',
      name: 'Airbnb',
      changePercent: '+1,1%',
      price: '$95.58',
      volume: '1.8M',
      iconBg: '#ff5a5f',
      iconType: 'airbnb',
    },
    {
      symbol: 'DBX',
      name: 'Dropbox Inc.',
      changePercent: '+0,8%',
      price: '$310.00',
      volume: '950K',
      iconBg: '#0061ff',
      iconType: 'dropbox',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      changePercent: '+2,4%',
      price: '$128.50',
      volume: '14.2M',
      iconBg: '#76b900',
      iconType: 'nvidia',
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      changePercent: '+0,9%',
      price: '$224.30',
      volume: '8.7M',
      iconBg: '#1c1c1e',
      iconType: 'apple',
    },
  ]);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-100/80 shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base sm:text-lg font-display flex items-center gap-2">
              Top Gainers
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Live Market
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Top performing assets in real-time</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Stock Items List */}
        <div className="space-y-4">
          {gainers.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock && onSelectStock(stock)}
              className="flex items-center justify-between p-3 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 group"
            >
              {/* Left: Icon & Ticker */}
              <div className="flex items-center gap-3.5">
                {/* Brand Logo Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: stock.iconBg }}
                >
                  {stock.iconType === 'spotify' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="#1DB954" />
                      <path
                        d="M16.8 14.8c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 6.9-.5 9.5 1.1.3.2.4.5.3.8zm1.2-2.7c-.2.3-.6.5-1 .2-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.5-1.1 7.9-.5 10.9 1.3.3.2.4.7.2 1zm.1-2.8C14.9 7.4 9.6 7.2 6.5 8.1c-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1C9.5 5.5 15.3 5.7 19 7.9c.4.2.5.8.3 1.2-.2.3-.7.5-1.2.2z"
                        fill="#ffffff"
                      />
                    </svg>
                  )}
                  {stock.iconType === 'airbnb' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8 2 5.5 5 5.5 8.5c0 3.8 4 8.5 6.5 11.5 2.5-3 6.5-7.7 6.5-11.5C18.5 5 16 2 12 2zm0 9c-1.4 0-2.5-1.1-2.5-2.5S10.6 6 12 6s2.5 1.1 2.5 2.5S13.4 11 12 11z" />
                    </svg>
                  )}
                  {stock.iconType === 'dropbox' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 3l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 11l6 4 6-4-6-4-6 4zm18-4l-6 4 6 4 6-4-6-4zM6 16l6 4 6-4-6-3.9-6 3.9z" />
                    </svg>
                  )}
                  {stock.iconType === 'nvidia' && (
                    <Zap className="w-5 h-5 text-white" />
                  )}
                  {stock.iconType === 'apple' && (
                    <Award className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Ticker & Name */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">
                    {stock.symbol}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 leading-tight">
                    {stock.name}
                  </p>
                </div>
              </div>

              {/* Middle: Sparkline Chart */}
              <div className="w-16 h-8 hidden sm:block">
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <path
                    d="M 2 25 Q 15 22, 25 15 T 45 12 T 58 4"
                    fill="none"
                    stroke="#25a77b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Right: Percent & Price */}
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#25a77b] block">
                  {stock.changePercent}
                </span>
                <span className="text-xs font-semibold text-slate-700 font-mono block mt-0.5">
                  {stock.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Market Digest Banner */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-slate-700">Market Mood: High Bullish</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Updated 1m ago</span>
      </div>
    </div>
  );
};
