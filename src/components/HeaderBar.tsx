import React, { useState, useRef, useEffect } from 'react';
import { useRestaurantSettings } from '../context/RestaurantSettingsContext';
import { Store, X, LogOut } from 'lucide-react';

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
  const logoMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'Billing', label: 'Billing' },
    { id: 'QR Orders', label: 'QR Orders', badge: onlineOrdersCount },
    { id: 'Waiter Calls', label: 'Waiter Calls', badge: waiterCallsCount },
    { id: 'Sales Report', label: 'Sales Report' },
    { id: 'Settings', label: 'Settings' },
  ];

  // Close logo popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cafeLogo = settings.logoUrl;

  return (
    <header className="relative mx-2 sm:mx-5 lg:mx-6 mt-2.5 sm:mt-3.5 mb-2.5 sm:mb-3 select-none z-40">
      {/* Solid Mint Green Floating Pill Header */}
      <div className="w-full bg-[#52b788] rounded-full px-3.5 sm:px-8 lg:px-10 py-1.5 sm:py-2.5 shadow-md shadow-[#52b788]/20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand: · MenuMint · in crisp white */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveNav('Billing')}
            className="text-white font-black text-sm sm:text-lg tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
            title="MenuMint Dashboard"
          >
            <span className="text-white/80 text-sm sm:text-base font-black leading-none">·</span>
            <span className="font-extrabold tracking-tight">MenuMint</span>
            <span className="text-white/80 text-sm sm:text-base font-black leading-none">·</span>
          </button>
        </div>

        {/* Navigation Links & Cafe Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-4 lg:gap-6 justify-end flex-1 max-w-4xl min-w-0">
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative py-1 sm:py-1.5 px-2.5 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#2d8f63] font-black shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full text-[10px] font-black inline-flex items-center justify-center leading-none bg-rose-500 text-white border-0 outline-none ring-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right End: Cafe Logo Avatar beside Settings */}
          <div className="relative shrink-0 pl-0.5 sm:pl-2" ref={logoMenuRef}>
            <button
              onClick={() => setIsLogoMenuOpen((prev) => !prev)}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full ring-2 ring-white/70 hover:ring-white transition-all overflow-hidden relative cursor-pointer group shadow-2xs shrink-0 bg-white/20 flex items-center justify-center"
              title="Cafe Logo - Click to view cafe branding details"
            >
              {cafeLogo ? (
                <img
                  src={cafeLogo}
                  alt="Cafe Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              )}
            </button>

            {/* Read-Only Cafe Branding Popover */}
            {isLogoMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] max-w-xs sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#52b788]" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Cafe Details
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsLogoMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cafe Avatar, Name, Address & Phone Number */}
                <div className="pt-4 pb-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-4 ring-[#52b788]/20 overflow-hidden shadow-sm bg-emerald-50 flex items-center justify-center mb-3 shrink-0">
                    {cafeLogo ? (
                      <img src={cafeLogo} alt="Cafe Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-7 h-7 sm:w-8 sm:h-8 text-[#52b788]" />
                    )}
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight font-display break-words max-w-full">
                    {settings.restaurantName || 'MenuMint Cafe'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 break-words max-w-full">
                    {settings.branchLocation || '123 Gourmet St, Foodville'}
                  </p>
                  <p className="text-xs text-slate-500 font-mono font-medium mt-1">
                    {settings.phoneNumber || '+1 (555) 019-2834'}
                  </p>

                  {/* Mint Green Logout Button */}
                  <button
                    onClick={() => setIsLogoMenuOpen(false)}
                    className="mt-4 w-full bg-[#52b788] hover:bg-[#449e75] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
