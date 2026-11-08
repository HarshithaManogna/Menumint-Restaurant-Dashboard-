import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Download,
  ShoppingBag,
  DollarSign,
  Calendar as CalendarIcon,
  CreditCard,
  Banknote,
  QrCode,
  Clock,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Package,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { PastBill, ReceiptModal } from './ReceiptModal';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export interface DishCatalogItem {
  name: string;
  price: number;
  category: string;
  image: string;
}

export const DISH_CATALOG: Record<string, DishCatalogItem> = {
  'Yogurt Bowl': {
    name: 'Yogurt Bowl',
    price: 240,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
  },
  'Fruit Bowl': {
    name: 'Fruit Bowl',
    price: 210,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80',
  },
  'Quinoa Bowl': {
    name: 'Quinoa Bowl',
    price: 290,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  },
  'French Crepes': {
    name: 'French Crepes',
    price: 320,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80',
  },
  'Pancake Stack': {
    name: 'Pancake Stack',
    price: 280,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
  },
  'Chia Pudding': {
    name: 'Chia Pudding',
    price: 220,
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
  },
  'Avocado Toast': {
    name: 'Avocado Toast',
    price: 260,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
  },
  Waffles: {
    name: 'Waffles',
    price: 250,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
  },
  'Smoked Salmon Bagel': {
    name: 'Smoked Salmon Bagel',
    price: 340,
    category: 'Bowls',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
  },
  'Margherita Pizza': {
    name: 'Margherita Pizza',
    price: 380,
    category: 'Special',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
  },
  'Iced Matcha Latte': {
    name: 'Iced Matcha Latte',
    price: 190,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
  },
  'Artisanal Flat White': {
    name: 'Artisanal Flat White',
    price: 180,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
  },
  'Truffle Toastie': {
    name: 'Truffle Toastie',
    price: 310,
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  },
  'Almond Croissant': {
    name: 'Almond Croissant',
    price: 170,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
  },
  'Berry Smoothie': {
    name: 'Berry Smoothie',
    price: 230,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
  },
};

interface SalesReportViewProps {
  onNewSaleClick?: () => void;
  customBills?: PastBill[];
}

const generateDayBills = (year: number, month: number, day: number): PastBill[] => {
  const dateObj = new Date(year, month, day);
  const dateStr = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const baseTemplates: {
    time: string;
    table: string;
    orderType: 'Dine-in' | 'Takeaway' | 'Delivery' | 'QR Order';
    method: string;
    status: string;
    rawItems: { name: string; qty: number }[];
  }[] = [
    {
      time: '08:45 PM',
      table: 'Maya Chen (Table T-4)',
      orderType: 'Dine-in',
      method: 'Credit Card',
      status: 'Paid',
      rawItems: [
        { name: 'Yogurt Bowl', qty: 2 + ((day + 1) % 2) },
        { name: 'Fruit Bowl', qty: 1 },
      ],
    },
    {
      time: '07:20 PM',
      table: 'Omar Haddad (Table T-2)',
      orderType: 'QR Order',
      method: 'UPI / QR',
      status: 'Paid',
      rawItems: [
        { name: 'Quinoa Bowl', qty: 1 },
        { name: 'French Crepes', qty: 2 + ((day + 2) % 2) },
      ],
    },
    {
      time: '06:05 PM',
      table: 'Lena Ortiz (Table T-9)',
      orderType: 'Dine-in',
      method: 'Cash',
      status: 'Paid',
      rawItems: [
        { name: 'Pancake Stack', qty: 3 },
        { name: 'Chia Pudding', qty: 2 },
      ],
    },
    {
      time: '04:30 PM',
      table: 'Sam Park (Takeaway #1)',
      orderType: 'Takeaway',
      method: 'Cash',
      status: 'Paid',
      rawItems: [
        { name: 'Fruit Bowl', qty: 2 },
        { name: 'Yogurt Bowl', qty: 1 },
      ],
    },
    {
      time: '03:15 PM',
      table: 'Ava Brooks (Delivery #412)',
      orderType: 'Delivery',
      method: 'UPI / QR',
      status: 'Paid',
      rawItems: [
        { name: 'Waffles', qty: 2 },
        { name: 'French Crepes', qty: 1 + (day % 2) },
      ],
    },
    {
      time: '01:40 PM',
      table: 'Morgan Cox (Table T-3)',
      orderType: 'QR Order',
      method: 'Credit Card',
      status: 'Paid',
      rawItems: [
        { name: 'Smoked Salmon Bagel', qty: 1 },
        { name: 'Chia Pudding', qty: 1 },
      ],
    },
    {
      time: '12:10 PM',
      table: 'Takeaway Counter #2',
      orderType: 'Takeaway',
      method: 'Cash',
      status: 'Pending',
      rawItems: [
        { name: 'Margherita Pizza', qty: 2 },
        { name: 'Fruit Bowl', qty: 1 },
      ],
    },
    {
      time: '11:00 AM',
      table: 'Delivery #308 (Office Express)',
      orderType: 'Delivery',
      method: 'UPI / QR',
      status: 'Paid',
      rawItems: [
        { name: 'Avocado Toast', qty: 2 + (day % 3 === 0 ? 1 : 0) },
        { name: 'Yogurt Bowl', qty: 1 },
      ],
    },
    {
      time: '09:30 AM',
      table: 'Table T-7',
      orderType: 'Dine-in',
      method: 'Credit Card',
      status: 'Paid',
      rawItems: [
        { name: 'Pancake Stack', qty: 1 },
        { name: 'Fruit Bowl', qty: 1 },
      ],
    },
  ];

  const daySeed = (day * 11 + month * 17) % 3;
  const count = 7 + daySeed;

  return baseTemplates.slice(0, count).map((t, idx) => {
    const invNum = 70000 + (year % 100) * 1000 + (month + 1) * 100 + day * 10 + idx;

    const itemsDetails = t.rawItems.map((ri) => {
      const dishInfo = DISH_CATALOG[ri.name] || {
        name: ri.name,
        price: 250,
        category: 'Bowls',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      };
      return {
        name: ri.name,
        qty: ri.qty,
        price: dishInfo.price,
        category: dishInfo.category,
      };
    });

    const totalAmount = itemsDetails.reduce((sum, item) => sum + item.qty * item.price, 0);
    const itemsSummary = itemsDetails.map((i) => `${i.qty}x ${i.name}`).join(', ');

    return {
      id: `pb-${year}-${month + 1}-${day}-${idx + 1}`,
      billNo: `#INV-${invNum}`,
      tableNo: t.table,
      dateTime: `${dateStr}, ${t.time}`,
      itemsSummary,
      amount: totalAmount,
      paymentMethod: t.method,
      status: idx === 6 && day % 2 === 1 ? 'Pending' : t.status,
      orderType: t.orderType,
      itemsDetails,
    };
  });
};

const PulseMiniPillChart: React.FC<{ activeIndex?: number }> = ({ activeIndex = 2 }) => {
  const heights = [20, 32, 44, 28, 38, 24, 18];
  return (
    <div className="flex items-end gap-1.5 h-12 shrink-0">
      {heights.map((h, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            style={{ height: `${h}px` }}
            className={`w-2.5 rounded-full transition-colors flex justify-center ${
              isActive ? 'bg-[#313b68]' : 'bg-[#e4e7f0]'
            }`}
          >
            {isActive && <span className="w-1 h-1 rounded-full bg-white mt-1" />}
          </div>
        );
      })}
    </div>
  );
};

interface MetricCardRefProps {
  title: string;
  value: string;
  subtext: string;
  badgeText: string;
  isPositive?: boolean;
  isSelected?: boolean;
  onClick: () => void;
  isDish?: boolean;
  activeBarIndex?: number;
}

const RefStyleMetricCard: React.FC<MetricCardRefProps> = ({
  title,
  value,
  subtext,
  badgeText,
  isPositive = true,
  isSelected,
  onClick,
  isDish = false,
  activeBarIndex = 1,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-[28px] p-6 border-2 transition-all duration-200 cursor-pointer select-none flex flex-col justify-between group ${
        isSelected
          ? 'border-[#313b68] shadow-[0_12px_32px_rgba(49,59,104,0.12)]'
          : 'border-transparent shadow-[0_8px_28px_rgba(20,25,45,0.04)] hover:shadow-[0_12px_32px_rgba(20,25,45,0.08)]'
      }`}
    >
      {/* Top Header Row: Title on Left, Deep Navy Circle Arrow on Right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[#8c93a4] text-sm font-medium">{title}</span>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full tabular-nums ${
              isPositive
                ? 'bg-[#e6f6ec] text-[#229a54]'
                : 'bg-[#fdecec] text-[#d94646]'
            }`}
          >
            {badgeText}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#313b68] group-hover:bg-[#252e54] text-white flex items-center justify-center transition-all shrink-0 shadow-xs">
          <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      {/* Bottom Row: Value & Subtext on Left, Pulse Pill Bars on Right */}
      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className={`font-display font-medium text-[#1a1f36] tracking-[-0.03em] leading-none ${
              isDish
                ? 'text-xl sm:text-2xl truncate max-w-[180px] sm:max-w-[230px]'
                : 'text-2xl sm:text-[32px] tabular-nums truncate'
            }`}
            title={value}
          >
            {value}
          </div>
          <div className="text-xs font-medium text-[#8c93a4] mt-2">
            {subtext}
          </div>
        </div>

        <PulseMiniPillChart activeIndex={activeBarIndex} />
      </div>
    </div>
  );
};

export const SalesReportView: React.FC<SalesReportViewProps> = ({ customBills = [] }) => {
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [calMonth, setCalMonth] = useState<number>(today.getMonth());
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [monthPickerYear, setMonthPickerYear] = useState<number>(today.getFullYear());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');
  const [selectedStatusFilter] = useState('All');
  const [selectedOrderTypeFilter, setSelectedOrderTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState<PastBill | null>(null);

  const [activeMetricModal, setActiveMetricModal] = useState<'sales' | 'revenue' | 'dishes' | null>(
    null
  );

  const currentYear = today.getFullYear();
  const pastYearsList = useMemo(() => {
    const startYear = Math.min(2018, currentYear - 7);
    const count = currentYear - startYear + 1;
    return Array.from({ length: count }, (_, i) => startYear + i);
  }, [currentYear]);

  const periodLabel = useMemo(() => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    if (viewMode === 'month') {
      return `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
    }
    return `Year ${selectedYear}`;
  }, [viewMode, selectedDate, selectedMonth, selectedYear]);

  const scopedBills = useMemo<PastBill[]>(() => {
    let list: PastBill[] = [];
    if (viewMode === 'day') {
      list = generateDayBills(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      if (customBills && customBills.length > 0) {
        list = [...customBills, ...list];
      }
      return list;
    }

    if (viewMode === 'month') {
      const maxDaysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const sampleDays = [28, 24, 20, 16, 12, 8, 4, 1].filter((d) => d <= maxDaysInMonth);
      list = sampleDays.flatMap((d) => generateDayBills(selectedYear, selectedMonth, d));
      if (customBills && customBills.length > 0) {
        list = [...customBills, ...list];
      }
      return list;
    }

    const sampleMonths = [11, 10, 9, 8, 6, 4, 2, 0];
    list = sampleMonths.flatMap((m, mIdx) => {
      const day = ((mIdx * 5 + 7) % 25) + 1;
      return generateDayBills(selectedYear, m, day);
    });
    if (customBills && customBills.length > 0) {
      list = [...customBills, ...list];
    }
    return list;
  }, [viewMode, selectedDate, selectedMonth, selectedYear, customBills]);

  const totalSalesCount = scopedBills.length;
  const totalRevenue = scopedBills.reduce(
    (sum, bill) => sum + (bill.status === 'Paid' ? bill.amount : 0),
    0
  );

  const dineInSalesCount = scopedBills.filter((bill) => bill.orderType === 'Dine-in').length;
  const takeawaySalesCount = scopedBills.filter((bill) => bill.orderType === 'Takeaway').length;
  const deliverySalesCount = scopedBills.filter((bill) => bill.orderType === 'Delivery').length;
  const qrOrderSalesCount = scopedBills.filter((bill) => bill.orderType === 'QR Order').length;

  const upiRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'UPI / QR')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const cashRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'Cash')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const cardsRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'Credit Card')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const { topDish, top3Dishes, least3Dishes } = useMemo(() => {
    const dishMap: Record<
      string,
      {
        name: string;
        category: string;
        image: string;
        price: number;
        totalQuantity: number;
        totalRevenue: number;
        orderCount: number;
      }
    > = {};

    Object.values(DISH_CATALOG).forEach((catalogEntry) => {
      dishMap[catalogEntry.name] = {
        name: catalogEntry.name,
        category: catalogEntry.category,
        image: catalogEntry.image,
        price: catalogEntry.price,
        totalQuantity: 0,
        totalRevenue: 0,
        orderCount: 0,
      };
    });

    scopedBills.forEach((bill) => {
      if (bill.itemsDetails) {
        bill.itemsDetails.forEach((item) => {
          if (!dishMap[item.name]) {
            const catalogEntry = DISH_CATALOG[item.name] || {
              name: item.name,
              category: item.category || 'Special',
              price: item.price,
              image:
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            };
            dishMap[item.name] = {
              name: item.name,
              category: catalogEntry.category,
              image: catalogEntry.image,
              price: item.price,
              totalQuantity: 0,
              totalRevenue: 0,
              orderCount: 0,
            };
          }
          dishMap[item.name].totalQuantity += item.qty;
          dishMap[item.name].totalRevenue += item.qty * item.price;
          dishMap[item.name].orderCount += 1;
        });
      }
    });

    const sortedDishes = Object.values(dishMap).sort((a, b) => b.totalQuantity - a.totalQuantity);
    const top3Dishes = sortedDishes.slice(0, 3);
    const least3Dishes = [...sortedDishes]
      .sort((a, b) => a.totalQuantity - b.totalQuantity)
      .slice(0, 3);

    return {
      topDish: sortedDishes.length > 0 ? sortedDishes[0] : null,
      top3Dishes,
      least3Dishes,
    };
  }, [scopedBills]);

  const filteredBills = scopedBills.filter((bill) => {
    const matchesSearch =
      bill.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.tableNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment =
      selectedPaymentFilter === 'All' || bill.paymentMethod === selectedPaymentFilter;

    const matchesStatus =
      selectedStatusFilter === 'All' || bill.status === selectedStatusFilter;

    const matchesOrderType =
      selectedOrderTypeFilter === 'All' || bill.orderType === selectedOrderTypeFilter;

    return matchesSearch && matchesPayment && matchesStatus && matchesOrderType;
  });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / ITEMS_PER_PAGE));
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBills, currentPage]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Bill No,Table,Channel,Date & Time,Items,Payment Method,Amount,Status']
        .concat(
          filteredBills.map(
            (b) =>
              `"${b.billNo}","${b.tableNo}","${b.orderType || 'Dine-in'}","${b.dateTime}","${b.itemsSummary}","${b.paymentMethod}",${b.amount},"${b.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `sales_report_${viewMode}_${periodLabel.replace(/[\s,]+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfCalWeek = new Date(calYear, calMonth, 1).getDay();

  const handlePrevCalMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextCalMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(calYear, calMonth, dayNum);
    setSelectedDate(newDate);
    setSelectedMonth(calMonth);
    setSelectedYear(calYear);
    setCurrentPage(1);
    setIsPopupOpen(false);
  };

  const handleSelectMonth = (monthIdx: number) => {
    setSelectedMonth(monthIdx);
    setSelectedYear(monthPickerYear);
    setCurrentPage(1);
    setIsPopupOpen(false);
  };

  const handleSelectYear = (yearNum: number) => {
    setSelectedYear(yearNum);
    setMonthPickerYear(yearNum);
    setCalYear(yearNum);
    setCurrentPage(1);
    setIsPopupOpen(false);
  };

  const renderMetricDetailBody = (metric: 'sales' | 'revenue' | 'dishes') => {
    if (metric === 'sales') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-[20px] bg-[#f7f8fa] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8c93a4] block">Total Orders Placed</span>
              <span className="font-display text-3xl font-medium text-[#1a1f36] tabular-nums">
                {totalSalesCount}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#229a54] bg-[#e6f6ec] px-3 py-1 rounded-full">
              4 Active Channels
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                label: 'Dine-in (Floor Tables)',
                count: dineInSalesCount,
                icon: Utensils,
              },
              {
                label: 'Takeaway (Counter Pickup)',
                count: takeawaySalesCount,
                icon: Package,
              },
              {
                label: 'Delivery (Home & Office)',
                count: deliverySalesCount,
                icon: ShoppingBag,
              },
              {
                label: 'QR Order (Table Digital Orders)',
                count: qrOrderSalesCount,
                icon: QrCode,
              },
            ].map((ch) => {
              const Icon = ch.icon;
              const pct = totalSalesCount > 0 ? Math.round((ch.count / totalSalesCount) * 100) : 0;
              return (
                <div key={ch.label} className="p-3.5 rounded-[20px] bg-[#f7f8fa] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-[#1a1f36]">{ch.label}</span>
                    </div>
                    <div className="tabular-nums text-xs font-semibold text-[#1a1f36]">
                      {ch.count} <span className="text-[#8c93a4] font-normal">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#e4e7f0] overflow-hidden">
                    <div
                      className="h-full bg-[#313b68] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (metric === 'revenue') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-[20px] bg-[#f7f8fa] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#8c93a4] block">Total Settled Revenue</span>
              <span className="font-display text-3xl font-medium text-[#1a1f36] tabular-nums">
                ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#229a54] bg-[#e6f6ec] px-3 py-1 rounded-full">
              ↑ Settled
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'UPI / QR (PhonePe, GPay, Paytm)', rev: upiRevenue, icon: QrCode },
              { label: 'Cash (Counter & Hand-off)', rev: cashRevenue, icon: Banknote },
              { label: 'Credit / Debit Cards (POS Terminal)', rev: cardsRevenue, icon: CreditCard },
            ].map((mode) => {
              const Icon = mode.icon;
              const pct = totalRevenue > 0 ? Math.round((mode.rev / totalRevenue) * 100) : 0;
              return (
                <div key={mode.label} className="p-3.5 rounded-[20px] bg-[#f7f8fa] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-xs text-[#1a1f36]">{mode.label}</span>
                    </div>
                    <div className="tabular-nums text-xs font-semibold text-[#1a1f36]">
                      ₹{mode.rev.toLocaleString('en-IN')}{' '}
                      <span className="text-[#229a54] font-semibold">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#e4e7f0] overflow-hidden">
                    <div
                      className="h-full bg-[#313b68] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1a1f36]">Top 3 Most Ordered Dishes</h4>
            <span className="text-[11px] font-semibold text-[#229a54] bg-[#e6f6ec] px-2.5 py-0.5 rounded-full">
              Best Sellers
            </span>
          </div>

          <div className="space-y-2">
            {top3Dishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="p-3 rounded-[20px] bg-[#f7f8fa] flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="w-7 h-7 rounded-full bg-[#313b68] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#1a1f36] block truncate">
                      {dish.name}
                    </span>
                    <span className="text-[11px] text-[#8c93a4] block">
                      {dish.category} · ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs tabular-nums font-semibold text-[#1a1f36] block">
                    {dish.totalQuantity} sold
                  </span>
                  <span className="text-[11px] tabular-nums font-semibold text-[#229a54] block">
                    +₹{dish.totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1a1f36]">Least Ordered Dishes</h4>
            <span className="text-[11px] font-semibold text-[#d94646] bg-[#fdecec] px-2.5 py-0.5 rounded-full">
              Needs Promotion
            </span>
          </div>

          <div className="space-y-2">
            {least3Dishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="p-3 rounded-[20px] bg-[#f7f8fa] flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="w-7 h-7 rounded-full bg-[#e8ecf7] text-[#313b68] font-semibold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#1a1f36] block truncate">
                      {dish.name}
                    </span>
                    <span className="text-[11px] text-[#8c93a4] block">
                      {dish.category} · ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs tabular-nums font-semibold text-[#1a1f36] block">
                    {dish.totalQuantity} sold
                  </span>
                  <span className="text-[11px] tabular-nums text-[#8c93a4] block">
                    ₹{dish.totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const avatarBadges = [
    'bg-[#e8ecf7] text-[#313b68]',
    'bg-[#f5ebe1] text-[#6e5641]',
    'bg-[#e5f3eb] text-[#2f684e]',
    'bg-[#f9e6ea] text-[#7a3e48]',
  ];

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4 animate-in fade-in duration-300 select-none overflow-hidden">
      {/* 1. Fixed Top Action Bar */}
      <div className="shrink-0 bg-white rounded-[28px] px-6 py-4 shadow-[0_8px_28px_rgba(20,25,45,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-semibold text-[#1a1f36] tracking-[-0.01em]">
            Sales Overview
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f7f8fa] text-[#6e768a]">
            {periodLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Day / Month / Year Pill Toggle */}
          <div className="relative flex items-center gap-1 bg-[#f7f8fa] p-1 rounded-full">
            {(['day', 'month', 'year'] as const).map((mode) => {
              const isSelected = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    if (viewMode === mode) {
                      setIsPopupOpen((prev) => !prev);
                    } else {
                      setViewMode(mode);
                      if (mode === 'day') {
                        setCalMonth(selectedDate.getMonth());
                        setCalYear(selectedDate.getFullYear());
                      } else if (mode === 'month') {
                        setMonthPickerYear(selectedYear);
                      }
                      setIsPopupOpen(false);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#313b68] text-white font-semibold shadow-2xs'
                      : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{mode}</span>
                  {isSelected && <ChevronDown className="w-3 h-3 opacity-80" />}
                </button>
              );
            })}

            {isPopupOpen && (
              <div className="fixed inset-0 z-30" onClick={() => setIsPopupOpen(false)} />
            )}

            {/* DAY VIEW CALENDAR POPUP */}
            {isPopupOpen && viewMode === 'day' && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-[26px] shadow-[0_16px_40px_rgba(20,25,45,0.14)] p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <select
                      value={calMonth}
                      onChange={(e) => setCalMonth(Number(e.target.value))}
                      className="font-semibold text-xs text-[#1a1f36] bg-[#f7f8fa] rounded-lg px-2 py-1 outline-none cursor-pointer"
                    >
                      {MONTH_NAMES.map((name, idx) => (
                        <option key={name} value={idx}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={calYear}
                      onChange={(e) => setCalYear(Number(e.target.value))}
                      className="font-semibold text-xs text-[#1a1f36] bg-[#f7f8fa] rounded-lg px-1.5 py-1 outline-none cursor-pointer"
                    >
                      {pastYearsList.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevCalMonth}
                      className="p-1 hover:bg-[#f7f8fa] rounded-lg text-[#6e768a] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextCalMonth}
                      className="p-1 hover:bg-[#f7f8fa] rounded-lg text-[#6e768a] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#8c93a4] mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: firstDayOfCalWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInCalMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected =
                      selectedDate.getDate() === dayNum &&
                      selectedDate.getMonth() === calMonth &&
                      selectedDate.getFullYear() === calYear;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => handleSelectDay(dayNum)}
                        className={`h-8 w-8 rounded-full font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#313b68] text-white'
                            : 'text-[#1a1f36] hover:bg-[#f7f8fa]'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MONTH VIEW POPUP */}
            {isPopupOpen && viewMode === 'month' && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-[26px] shadow-[0_16px_40px_rgba(20,25,45,0.14)] p-4 z-40 w-80 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <button
                    onClick={() => setMonthPickerYear((y) => y - 1)}
                    className="p-1.5 hover:bg-[#f7f8fa] rounded-lg text-[#1a1f36] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="px-3.5 py-1 rounded-full bg-[#e8ecf7] text-[#313b68] font-semibold text-xs tabular-nums">
                    {monthPickerYear}
                  </div>
                  <button
                    onClick={() => setMonthPickerYear((y) => Math.min(currentYear, y + 1))}
                    disabled={monthPickerYear >= currentYear}
                    className="p-1.5 hover:bg-[#f7f8fa] disabled:opacity-30 rounded-lg text-[#1a1f36] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {MONTH_NAMES.map((name, idx) => {
                    const isSelected = selectedMonth === idx && selectedYear === monthPickerYear;
                    return (
                      <button
                        key={name}
                        onClick={() => handleSelectMonth(idx)}
                        className={`py-2 px-2 rounded-xl font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#313b68] text-white'
                            : 'bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36]'
                        }`}
                      >
                        {SHORT_MONTH_NAMES[idx]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YEAR VIEW POPUP */}
            {isPopupOpen && viewMode === 'year' && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-[26px] shadow-[0_16px_40px_rgba(20,25,45,0.14)] p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {pastYearsList.map((y) => {
                    const isSelected = selectedYear === y;
                    return (
                      <button
                        key={y}
                        onClick={() => handleSelectYear(y)}
                        className={`py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#313b68] text-white'
                            : 'bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36]'
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export CSV Pill Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-1 pb-4 space-y-5">
      {/* 2. Top View Content: 3 Pulse KPI Cards */}
      {viewMode === 'day' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
          <RefStyleMetricCard
            title="Total revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="Settled today"
            badgeText="↑ 4.2%"
            isPositive={true}
            activeBarIndex={1}
            isSelected={activeMetricModal === 'revenue'}
            onClick={() => setActiveMetricModal('revenue')}
          />

          <RefStyleMetricCard
            title="Total orders"
            value={totalSalesCount.toLocaleString('en-IN')}
            subtext="Across 4 channels"
            badgeText="↑ 2.8%"
            isPositive={true}
            activeBarIndex={4}
            isSelected={activeMetricModal === 'sales'}
            onClick={() => setActiveMetricModal('sales')}
          />

          <RefStyleMetricCard
            title="Top ordered dish"
            value={topDish ? topDish.name : 'No orders'}
            subtext="Best seller today"
            badgeText="Popular"
            isPositive={true}
            isDish={true}
            activeBarIndex={2}
            isSelected={activeMetricModal === 'dishes'}
            onClick={() => setActiveMetricModal('dishes')}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 shrink-0">
            <RefStyleMetricCard
              title="Total revenue"
              value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtext={viewMode === 'month' ? 'This month' : 'This year'}
              badgeText="↑ 4.2%"
              isPositive={true}
              isSelected={activeMetricModal === 'revenue'}
              onClick={() => setActiveMetricModal('revenue')}
            />

            <RefStyleMetricCard
              title="Total orders"
              value={totalSalesCount.toLocaleString('en-IN')}
              subtext={viewMode === 'month' ? 'This month' : 'This year'}
              badgeText="↑ 2.8%"
              isPositive={true}
              isSelected={activeMetricModal === 'sales' || !activeMetricModal}
              onClick={() => setActiveMetricModal('sales')}
            />

            <RefStyleMetricCard
              title="Top ordered dish"
              value={topDish ? topDish.name : 'No orders'}
              subtext={viewMode === 'month' ? 'This month' : 'This year'}
              badgeText="Popular"
              isPositive={true}
              isDish={true}
              isSelected={activeMetricModal === 'dishes'}
              onClick={() => setActiveMetricModal('dishes')}
            />
          </div>

          <div className="flex-1 w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_8px_28px_rgba(20,25,45,0.04)] min-h-[460px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center shrink-0">
                  {(activeMetricModal || 'sales') === 'sales' && <ShoppingBag className="w-4 h-4" />}
                  {(activeMetricModal || 'sales') === 'revenue' && <DollarSign className="w-4 h-4" />}
                  {(activeMetricModal || 'sales') === 'dishes' && <Flame className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1a1f36]">
                    {(activeMetricModal || 'sales') === 'sales' && 'Sales Volume & Channels'}
                    {(activeMetricModal || 'sales') === 'revenue' && 'Revenue & Payment Modes'}
                    {(activeMetricModal || 'sales') === 'dishes' && 'Menu Dish Performance'}
                  </h3>
                  <p className="text-xs text-[#8c93a4]">Breakdown for {periodLabel}</p>
                </div>
              </div>
            </div>

            {renderMetricDetailBody(activeMetricModal || 'sales')}
          </div>
        </div>
      )}

      {/* Floating Modal for DAY VIEW ONLY */}
      {viewMode === 'day' && activeMetricModal && (
        <div className="fixed inset-0 bg-[#1a1f36]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setActiveMetricModal(null)} />

          <div className="relative w-full max-w-xl bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(20,25,45,0.2)] z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center shrink-0">
                  {activeMetricModal === 'sales' && <ShoppingBag className="w-4 h-4" />}
                  {activeMetricModal === 'revenue' && <DollarSign className="w-4 h-4" />}
                  {activeMetricModal === 'dishes' && <Flame className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1a1f36]">
                    {activeMetricModal === 'sales' && 'Sales Volume & Channels'}
                    {activeMetricModal === 'revenue' && 'Revenue & Payment Modes'}
                    {activeMetricModal === 'dishes' && 'Menu Dish Performance'}
                  </h3>
                  <p className="text-xs text-[#8c93a4]">Breakdown for {periodLabel}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveMetricModal(null)}
                className="p-1.5 rounded-full hover:bg-[#f7f8fa] text-[#8c93a4] hover:text-[#1a1f36] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5">{renderMetricDetailBody(activeMetricModal)}</div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveMetricModal(null)}
                className="py-2.5 px-6 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Recent Transactions / All Bills & Receipts Section */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_8px_28px_rgba(20,25,45,0.04)] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-3 border-b border-slate-100">
            <h4 className="font-semibold text-[#1a1f36] text-[17px] tracking-[-0.01em]">
              Recent transactions & bills
            </h4>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="flex items-center bg-[#f7f8fa] rounded-full px-3.5 py-2">
                  <Search className="w-4 h-4 text-[#8c93a4] shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search bill #, customer, items..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-xs font-medium text-[#1a1f36] placeholder-[#8c93a4] outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="p-0.5 text-[#8c93a4] hover:text-[#1a1f36] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Filter */}
              <div className="relative shrink-0">
                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => {
                    setSelectedPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-[#f7f8fa] hover:bg-[#eceff5] rounded-full px-4 py-2 pr-8 text-xs font-medium text-[#1a1f36] outline-none cursor-pointer"
                >
                  <option value="All">Payment: All</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI / QR">UPI / QR</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8c93a4] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Channel Filter */}
              <div className="relative shrink-0">
                <select
                  value={selectedOrderTypeFilter}
                  onChange={(e) => {
                    setSelectedOrderTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-[#f7f8fa] hover:bg-[#eceff5] rounded-full px-4 py-2 pr-8 text-xs font-medium text-[#1a1f36] outline-none cursor-pointer"
                >
                  <option value="All">Channel: All</option>
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                  <option value="QR Order">QR Order</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8c93a4] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {filteredBills.length === 0 ? (
            <div className="py-12 text-center text-[#8c93a4] bg-[#f7f8fa] rounded-[22px]">
              <p className="font-semibold text-sm text-[#1a1f36]">No matching bills found</p>
              <p className="text-xs text-[#8c93a4] mt-0.5">Try clearing your search query or filters.</p>
            </div>
          ) : (
            <div>
              {/* Structured 7-Column Header on Desktop */}
              <div className="hidden md:grid md:grid-cols-[1fr_1.6fr_1.4fr_1fr_1.1fr_1fr_64px] items-center gap-4 px-4 pb-2.5 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-[#8c93a4]">
                <span>Order ID</span>
                <span>Customer / Table</span>
                <span>Date & Time</span>
                <span>Order Type</span>
                <span>Payment Method</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Details</span>
              </div>

              <div className="divide-y divide-slate-100">
                {paginatedBills.map((bill, idx) => {
                  const isPaid = bill.status === 'Paid';
                  const initials = bill.tableNo
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase();
                  const badgeColor = avatarBadges[idx % avatarBadges.length];

                  return (
                    <div
                      key={bill.id}
                      onClick={() => setSelectedReceiptBill(bill)}
                      className="py-3 px-4 hover:bg-[#f7f8fa] rounded-2xl transition-colors grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_1.6fr_1.4fr_1fr_1.1fr_1fr_64px] items-center gap-3 md:gap-4 cursor-pointer group"
                    >
                      {/* Column 1 – Order ID */}
                      <div className="font-mono font-semibold text-xs sm:text-[13px] text-[#313b68] tabular-nums whitespace-nowrap">
                        {bill.billNo}
                      </div>

                      {/* Column 2 – Customer Name / Table */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full ${badgeColor} font-semibold text-xs flex items-center justify-center shrink-0`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-xs sm:text-sm text-[#1a1f36] truncate block">
                            {bill.tableNo}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 md:hidden">
                            <span className="text-[11px] text-[#8c93a4] tabular-nums">
                              {bill.dateTime}
                            </span>
                            <span className="text-[10px] font-medium text-[#6e768a] bg-[#f4f5f8] px-2 py-0.5 rounded-full">
                              {bill.orderType || 'Dine-in'}
                            </span>
                            <span className="text-[11px] text-[#8c93a4]">
                              {bill.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Column 3 – Date & Time */}
                      <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#6e768a] tabular-nums whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-[#8c93a4] shrink-0" />
                        <span>{bill.dateTime}</span>
                      </div>

                      {/* Column 4 – Order Type */}
                      <div className="hidden md:flex items-center">
                        <span className="text-[11px] font-medium text-[#6e768a] bg-[#f4f5f8] px-2.5 py-1 rounded-full whitespace-nowrap">
                          {bill.orderType || 'Dine-in'}
                        </span>
                      </div>

                      {/* Column 5 – Payment Method */}
                      <div className="hidden md:flex items-center text-xs font-medium text-[#6e768a] whitespace-nowrap">
                        {bill.paymentMethod}
                      </div>

                      {/* Column 6 – Amount & Column 7 – View Details */}
                      <div className="flex items-center justify-end gap-2.5 md:contents">
                        <span
                          className={`font-display font-semibold text-sm tabular-nums text-right whitespace-nowrap ${
                            isPaid ? 'text-[#229a54]' : 'text-[#1a1f36]'
                          }`}
                        >
                          {isPaid ? '+' : ''}₹{bill.amount.toFixed(2)}
                        </span>

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceiptBill(bill);
                            }}
                            className="w-8 h-8 rounded-full bg-[#f7f8fa] group-hover:bg-[#313b68] text-[#6e768a] group-hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-slate-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-full font-semibold text-xs flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#313b68] text-white'
                            : 'bg-[#f7f8fa] hover:bg-[#eceff5] text-[#6e768a]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Bill Receipt Modal */}
      {selectedReceiptBill && (
        <ReceiptModal
          bill={selectedReceiptBill}
          onClose={() => setSelectedReceiptBill(null)}
        />
      )}
    </div>
  );
};
