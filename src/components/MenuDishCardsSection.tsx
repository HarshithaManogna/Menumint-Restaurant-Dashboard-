import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Search,
  Check,
  Filter,
  ChevronDown,
  X,
  LayoutGrid,
  Soup,
  Coffee,
  Leaf,
  CupSoda,
  Croissant,
} from 'lucide-react';
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
  onNavigate?: (nav: string) => void;
}

export const MenuDishCardsSection: React.FC<MenuDishCardsSectionProps> = ({
  orderItems = [],
  onUpdateDishQuantity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('');

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
    <div className="bg-white p-5 sm:p-6 rounded-[28px] shadow-[0_8px_28px_rgba(20,25,45,0.04)] h-full min-h-0 flex flex-col overflow-hidden">
      {/* Fixed Top Controls inside Popular Dishes Card */}
      <div className="shrink-0">
        {/* Header: Title, Category Dropdown & Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-[#1a1f36] text-lg sm:text-[19px] tracking-[-0.015em]">
              Popular Dishes
            </h3>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="flex items-center bg-[#f7f8fa] hover:bg-[#eef0f6] rounded-full px-3.5 py-2 transition-colors text-xs font-semibold text-[#1a1f36] cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#313b68] mr-1.5 shrink-0" />
                <span>{activeCategory === 'All' ? 'All Categories' : activeCategory}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#8c93a4] ml-1.5 transition-transform duration-200 ${
                    isCatDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCatDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsCatDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-[22px] shadow-[0_16px_40px_rgba(20,25,45,0.12)] p-2.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f8fa] rounded-full mb-2">
                      <Search className="w-3 h-3 text-[#8c93a4] shrink-0" />
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={catSearchQuery}
                        onChange={(e) => setCatSearchQuery(e.target.value)}
                        className="w-full text-xs font-medium text-[#1a1f36] bg-transparent placeholder-[#8c93a4] outline-none"
                        autoFocus
                      />
                      {catSearchQuery && (
                        <button
                          onClick={() => setCatSearchQuery('')}
                          className="text-[#8c93a4] hover:text-[#1a1f36] p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="max-h-44 overflow-y-auto space-y-0.5">
                      {filteredCategories.length === 0 ? (
                        <p className="text-[11px] text-[#8c93a4] p-2 text-center font-medium">
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
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-[#e8ecf7] text-[#313b68] font-semibold'
                                  : 'text-[#1a1f36] hover:bg-[#f7f8fa]'
                              }`}
                            >
                              <span>{cat === 'All' ? 'All Categories' : cat}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#313b68]" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <div className="flex items-center bg-[#f7f8fa] focus-within:bg-[#eef0f6] rounded-full px-3.5 py-2 transition-colors">
                <Search className="w-3.5 h-3.5 text-[#8c93a4] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-[#1a1f36] placeholder-[#8c93a4] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-[#8c93a4] hover:text-[#1a1f36] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3.5">
          {[
            { id: 'All', label: 'All Categories', icon: LayoutGrid },
            { id: 'Bowls', label: 'Bowls', icon: Soup },
            { id: 'Breakfast', label: 'Breakfast', icon: Coffee },
            { id: 'Healthy', label: 'Healthy', icon: Leaf },
            { id: 'Beverages', label: 'Beverages', icon: CupSoda },
            { id: 'Bakery', label: 'Bakery & Pastry', icon: Croissant },
          ].map((cat) => {
            const isSelected = activeCategory === cat.id;
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#313b68] text-white font-semibold shadow-2xs'
                    : 'bg-[#f7f8fa] hover:bg-[#eceff5] text-[#6e768a] hover:text-[#1a1f36] font-medium'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Dishes Container (ONLY this inner area scrolls when scrolling dishes) */}
      <div className="flex-1 min-h-0 bg-[#f7f8fa] rounded-[24px] p-3.5 sm:p-4 overflow-y-auto">
        {filteredDishes.length === 0 ? (
          <div className="py-12 text-center text-[#8c93a4] font-medium text-sm">
            No dishes found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredDishes.map((dish) => {
              const qty = getDishQuantity(dish);

              return (
                <div
                  key={dish.id}
                  className={`bg-white rounded-[20px] p-3.5 transition-all duration-200 flex flex-col justify-between relative group border ${
                    qty > 0
                      ? 'border-[#313b68]/30 shadow-[0_6px_18px_rgba(49,59,104,0.08)]'
                      : 'border-slate-100 shadow-[0_4px_14px_rgba(20,25,45,0.03)] hover:shadow-[0_8px_20px_rgba(20,25,45,0.06)]'
                  }`}
                >
                  {/* Wide Dish Image Container (wider horizontal span, consistent height) */}
                  <div className="w-full h-22 sm:h-24 rounded-2xl overflow-hidden bg-[#f7f8fa] relative border border-slate-100">
                    <img
                      src={dish.image}
                      alt={dish.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Centered Dish Title & Subtitle */}
                  <div className="text-center my-2">
                    <h4 className="font-semibold text-[#1a1f36] text-sm tracking-tight truncate">
                      {dish.title}
                    </h4>
                    <p className="text-[11px] text-[#8c93a4] font-medium truncate mt-0.5">
                      {dish.subtitle}
                    </p>
                  </div>

                  {/* Bottom Row with Price & Compact Stepper Controls */}
                  <div className="flex items-center justify-between min-h-[32px] pt-1.5 border-t border-slate-100">
                    <span className="font-display font-semibold tabular-nums text-sm text-[#1a1f36]">
                      ₹{dish.price.toFixed(1)}
                    </span>

                    {qty === 0 ? (
                      <button
                        onClick={() => handleDelta(dish, 1)}
                        className="w-7 h-7 rounded-lg bg-[#313b68] hover:bg-[#252e54] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Add to Bill"
                      >
                        <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelta(dish, -1)}
                          className="w-6 h-6 rounded-lg bg-[#f7f8fa] hover:bg-[#e8ecf7] text-[#1a1f36] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Deduct"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>

                        <span className="font-semibold tabular-nums text-xs text-[#1a1f36] min-w-[14px] text-center">
                          {qty}
                        </span>

                        <button
                          onClick={() => handleDelta(dish, 1)}
                          className="w-6 h-6 rounded-lg bg-[#313b68] hover:bg-[#252e54] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
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
  );
};
