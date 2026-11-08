import React, { useState, useRef, useEffect } from 'react';
import { useRestaurantSettings } from '../context/RestaurantSettingsContext';
import {
  Store,
  X,
  LogOut,
  Search,
  ArrowUpRight,
} from 'lucide-react';

const MENUMINT_LOGO_URL =
  'https://res.cloudinary.com/txgmj1nv/image/upload/v1794135315/890548169_2090652644982121_7689979479869728740_n-removebg-preview.png';

interface HeaderBarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onlineOrdersCount?: number;
  waiterCallsCount?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeNav,
  setActiveNav,
  onlineOrdersCount = 6,
  waiterCallsCount = 4,
}) => {
  const { settings } = useRestaurantSettings();
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const logoMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'Billing', label: 'Billing' },
    { id: 'QR Orders', label: 'QR Orders', badge: onlineOrdersCount },
    { id: 'Waiter Calls', label: 'Waiter Calls', badge: waiterCallsCount },
    { id: 'Sales Report', label: 'Sales Report' },
    { id: 'Settings', label: 'Settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials =
    (settings.restaurantName || 'MenuMint')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'MM';

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 pt-3.5 pb-2.5 shrink-0 select-none z-40 bg-[#eff1f6]">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Brand Zone: Official MenuMint Logo + Clean Geometric Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveNav('Billing')}
            className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
            title="MenuMint POS Dashboard"
          >
            <img
              src={MENUMINT_LOGO_URL}
              alt="MenuMint Logo"
              className="h-9 sm:h-10 w-auto object-contain shrink-0 select-none"
            />
            <span className="font-display font-semibold text-xl sm:text-[22px] tracking-[-0.02em] text-[#1a1f36]">
              menumint
            </span>
          </button>
        </div>

        {/* Center Navigation Pills */}
        <nav className="flex items-center gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-full shadow-[0_2px_12px_rgba(20,25,45,0.04)] overflow-x-auto no-scrollbar max-w-full">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-[13px] transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#313b68] text-white font-semibold shadow-xs'
                    : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold leading-tight tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#e8ecf7] text-[#313b68]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Search Circle & Initials Avatar Circle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* 1. Search Button */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                setIsLogoMenuOpen(false);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#f7f8fa] text-[#1a1f36] shadow-[0_2px_10px_rgba(20,25,45,0.05)] flex items-center justify-center transition-all cursor-pointer"
              title="Quick Navigation"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-[24px] shadow-[0_16px_40px_rgba(20,25,45,0.12)] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 bg-[#f7f8fa] rounded-2xl px-3 py-2 mb-3">
                  <Search className="w-4 h-4 text-[#8c93a4] shrink-0" />
                  <input
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Jump to view..."
                    className="w-full bg-transparent text-xs font-medium text-[#1a1f36] placeholder-[#8c93a4] outline-none"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  {navItems
                    .filter((n) => n.label.toLowerCase().includes(quickQuery.toLowerCase()))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveNav(item.id);
                          setIsSearchOpen(false);
                          setQuickQuery('');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#1a1f36] hover:bg-[#f7f8fa] transition-colors cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#8c93a4]" />
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Avatar Initials Circle */}
          <div className="relative" ref={logoMenuRef}>
            <button
              onClick={() => {
                setIsLogoMenuOpen((prev) => !prev);
                setIsSearchOpen(false);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#dce1f0] hover:bg-[#cfd6ea] text-[#313b68] font-semibold text-xs tracking-tight flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_10px_rgba(20,25,45,0.04)]"
              title="Restaurant Profile"
            >
              {initials}
            </button>

            {isLogoMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-[28px] shadow-[0_16px_40px_rgba(20,25,45,0.12)] p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-[#1a1f36]">Store Profile</span>
                  <button
                    onClick={() => setIsLogoMenuOpen(false)}
                    className="text-[#8c93a4] hover:text-[#1a1f36] p-1 rounded-full hover:bg-[#f7f8fa] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 pb-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center font-semibold text-base mb-3 overflow-hidden">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt={settings.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="w-6 h-6 text-[#313b68]" />
                    )}
                  </div>
                  <h3 className="font-semibold text-base text-[#1a1f36] tracking-tight">
                    {settings.restaurantName || 'MenuMint Cafe'}
                  </h3>
                  <p className="text-xs text-[#8c93a4] mt-1">
                    {settings.branchLocation || 'Indiranagar 100ft Road, Bengaluru'}
                  </p>
                  <p className="text-xs text-[#6e768a] font-mono mt-0.5">
                    {settings.phoneNumber || '+91 98765 43210'}
                  </p>

                  <div className="w-full grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => {
                        setActiveNav('Settings');
                        setIsLogoMenuOpen(false);
                      }}
                      className="py-2.5 px-3 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36] font-semibold text-xs rounded-full transition-colors cursor-pointer"
                    >
                      Edit Store
                    </button>
                    <button
                      onClick={() => setIsLogoMenuOpen(false)}
                      className="py-2.5 px-3 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
