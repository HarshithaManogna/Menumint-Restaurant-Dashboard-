import React, { useState } from 'react';
import { Plus, Minus, Search, Check, Filter, ChevronDown, X } from 'lucide-react';
import { OrderItem } from './GenerateBillCard';

export interface DishItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  category: string;
}

export const DISHES_DATA: DishItem[] = [
  {
    id: 'dish-1',
    title: 'Yogurt Bowl',
    subtitle: 'Fresh & Healthy',
    price: 240.0,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    category: 'Bowls',
  },
  {
    id: 'dish-2',
    title: 'Fruit Bowl',
    subtitle: 'Juicy & Energizing',
    price: 210.0,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80',
    category: 'Bowls',
  },
  {
    id: 'dish-3',
    title: 'Quinoa Bowl',
    subtitle: 'Clean & Filling',
    price: 290.0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    category: 'Bowls',
  },
  {
    id: 'dish-4',
    title: 'Chia Pudding',
    subtitle: 'Light & Nutritious',
    price: 220.0,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
    category: 'Healthy',
  },
  {
    id: 'dish-5',
    title: 'French Crepes',
    subtitle: 'Classic Breakfast',
    price: 320.0,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80',
    category: 'Breakfast',
  },
  {
    id: 'dish-6',
    title: 'Pancake Stack',
    subtitle: 'Fluffy & Sweet',
    price: 280.0,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
    category: 'Breakfast',
  },
  {
    id: 'dish-7',
    title: 'Avocado Toast',
    subtitle: 'Sourdough & Seeds',
    price: 260.0,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    category: 'Breakfast',
  },
  {
    id: 'dish-8',
    title: 'Iced Matcha Latte',
    subtitle: 'Ceremonial Grade',
    price: 190.0,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
  },
  {
    id: 'dish-9',
    title: 'Artisanal Flat White',
    subtitle: 'Single-Origin Espresso',
    price: 180.0,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
  },
  {
    id: 'dish-10',
    title: 'Truffle Toastie',
    subtitle: 'Aged Cheddar & Truffle',
    price: 310.0,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    category: 'Healthy',
  },
  {
    id: 'dish-11',
    title: 'Almond Croissant',
    subtitle: 'Butter & Flaky',
    price: 170.0,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    category: 'Bakery',
  },
  {
    id: 'dish-12',
    title: 'Berry Smoothie',
    subtitle: 'Antioxidant Boost',
    price: 230.0,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
    category: 'Beverages',
  },
];

interface MenuDishCardsSectionProps {
  orderItems?: OrderItem[];
  onUpdateDishQuantity?: (dish: DishItem, delta: number) => void;
}

export const MenuDishCardsSection: React.FC<MenuDishCardsSectionProps> = ({
  orderItems = [],
  onUpdateDishQuantity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('');

  // Internal quantity state fallback if not managed externally
  const [internalQuantities, setInternalQuantities] = useState<Record<string, number>>({});

  const categories = ['All', 'Bowls', 'Breakfast', 'Healthy', 'Beverages', 'Bakery'];

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(catSearchQuery.toLowerCase())
  );

  const getDishQuantity = (dish: DishItem): number => {
    if (onUpdateDishQuantity) {
      const match = orderItems.find(
        (item) => item.id === dish.id || item.name.toLowerCase() === dish.title.toLowerCase()
      );
      return match ? match.quantity : 0;
    }
    return internalQuantities[dish.id] || 0;
  };

  const handleDelta = (dish: DishItem, delta: number) => {
    if (onUpdateDishQuantity) {
      onUpdateDishQuantity(dish, delta);
    } else {
      setInternalQuantities((prev) => {
        const current = prev[dish.id] || 0;
        const next = Math.max(0, current + delta);
        return { ...prev, [dish.id]: next };
      });
    }
  };

  const filteredDishes = DISHES_DATA.filter((dish) => {
    const matchesCat = activeCategory === 'All' || dish.category === activeCategory;
    const matchesQuery =
      dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-slate-100/90 shadow-lg shadow-slate-200/50">
      <div>
        {/* Header: Title, Category Dropdown (with search) & Main Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight font-display">
              Popular Dishes
            </h3>
          </div>

          {/* Controls: Category Dropdown & Improved Search Input */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Custom Category Dropdown with Internal Search */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="relative flex items-center bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl px-3 py-1.5 transition-all shadow-2xs text-xs font-bold text-slate-700 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#52b788] mr-1.5 shrink-0" />
                <span>{activeCategory === 'All' ? 'All Categories' : activeCategory}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 ml-2 transition-transform duration-200 ${
                    isCatDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Popover */}
              {isCatDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsCatDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                    {/* Small Search Bar inside Category Dropdown */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-2 focus-within:ring-2 focus-within:ring-emerald-400/30 focus-within:bg-white transition-all">
                      <Search className="w-3 h-3 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={catSearchQuery}
                        onChange={(e) => setCatSearchQuery(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 bg-transparent placeholder-slate-400 outline-none"
                        autoFocus
                      />
                      {catSearchQuery && (
                        <button
                          onClick={() => setCatSearchQuery('')}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Filtered Category Options */}
                    <div className="max-h-40 overflow-y-auto space-y-0.5 pr-0.5">
                      {filteredCategories.length === 0 ? (
                        <p className="text-[11px] text-slate-400 p-2 text-center font-medium">
                          No category found
                        </p>
                      ) : (
                        filteredCategories.map((cat) => {
                          const isSelected = activeCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setActiveCategory(cat);
                                setIsCatDropdownOpen(false);
                                setCatSearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-50 text-[#c4891e] border border-emerald-200/60'
                                  : 'text-slate-700 hover:bg-slate-100/80'
                              }`}
                            >
                              <span>{cat === 'All' ? 'All Categories' : cat}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#52b788]" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Improved Search Bar */}
            <div className="relative flex-1 sm:w-52">
              <div className="relative flex items-center bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 rounded-xl px-3 py-1.5 transition-all shadow-2xs">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Category Filter Pills Bar for Easy Picking */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3.5 mb-1 pt-0.5">
          {[
            { id: 'All', label: 'All Categories' },
            { id: 'Bowls', label: 'Bowls' },
            { id: 'Breakfast', label: 'Breakfast' },
            { id: 'Healthy', label: 'Healthy' },
            { id: 'Beverages', label: 'Beverages' },
            { id: 'Bakery', label: 'Bakery & Pastry' },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#52b788] text-white font-black shadow-2xs'
                    : 'bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dish Cards Container with internal vertical scrollbar so popular dishes section scrolls internally */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-[26px] p-3.5 sm:p-4 shadow-inner mt-1 max-h-[580px] overflow-y-auto pr-1.5">
          {filteredDishes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-sm">
              No dishes found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {filteredDishes.map((dish) => {
                const qty = getDishQuantity(dish);

                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-[22px] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group border border-slate-200/70 shadow-lg shadow-slate-200/70 hover:shadow-xl"
                  >
                    {/* Center Hero Dish Picture */}
                    <div className="my-1.5 py-1 flex items-center justify-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-300 relative border border-slate-100">
                        <img
                          src={dish.image}
                          alt={dish.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Centered Title */}
                    <div className="text-center mb-2.5">
                      <h4 className="font-black text-slate-900 text-base sm:text-lg tracking-tight font-display line-clamp-2">
                        {dish.title}
                      </h4>
                    </div>

                    {/* Bottom Row with Price & Curved Square Controls */}
                    <div className="flex items-center justify-between min-h-[38px] pt-1 px-1">
                      <span className="font-extrabold font-mono text-sm sm:text-base text-slate-900">
                        ₹{dish.price.toFixed(1)}
                      </span>

                      {qty === 0 ? (
                        /* Initial Single Plus Button */
                        <button
                          onClick={() => handleDelta(dish, 1)}
                          className="w-7 h-7 rounded-lg bg-[#52b788] hover:bg-[#409a71] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 hover:scale-105"
                          title="Add to Bill"
                        >
                          <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        </button>
                      ) : (
                        /* Expanded Controls */
                        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-90 duration-150">
                          <button
                            onClick={() => handleDelta(dish, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-slate-200/60"
                            title="Deduct"
                          >
                            <Minus className="w-3 h-3 text-slate-700 stroke-[2.5]" />
                          </button>

                          <span className="font-extrabold font-mono text-xs sm:text-sm text-slate-900 px-1 min-w-[16px] text-center">
                            {qty}
                          </span>

                          <button
                            onClick={() => handleDelta(dish, 1)}
                            className="w-7 h-7 rounded-lg bg-[#52b788] hover:bg-[#409a71] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                            title="Add More"
                          >
                            <Plus className="w-3 h-3 text-white stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
