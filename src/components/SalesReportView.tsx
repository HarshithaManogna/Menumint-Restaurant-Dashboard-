import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Receipt, 
  CheckCircle2, 
  Download, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Clock, 
  Eye, 
  FileText,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Utensils,
  Package,
  Flame,
  Award,
  Sparkles,
  ArrowUpRight
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
  'Waffles': {
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

// Generate consistent, realistic bills for any given date
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
      table: 'Table T-4',
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
      table: 'Denis Freeman (Table T-2)',
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
      table: 'Table T-9',
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
      table: 'Takeaway Counter #1',
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
      table: 'Delivery #412 (Home Express)',
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
      table: 'Delivery #308 (Office Delivery)',
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

const MetricCardBarcodeGraphic: React.FC<{ accentTheme?: 'coral' | 'mint' }> = ({
  accentTheme = 'mint',
}) => {
  const barHeights = [10, 12, 11, 14, 16, 32, 36, 38, 38, 36, 34, 16, 14, 11, 12, 10];
  const isCoral = accentTheme === 'coral';

  const centerBg = isCoral ? 'bg-[#e57e7c]' : 'bg-[#52b788]';
  const outerBg = isCoral ? 'bg-rose-200/70' : 'bg-emerald-200/70';

  return (
    <div className="flex items-end gap-[3.5px] h-10 shrink-0">
      {barHeights.map((h, i) => {
        const isCenter = i >= 5 && i <= 10;
        return (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-colors ${
              isCenter ? centerBg : outerBg
            }`}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
};

interface MetricCardRefProps {
  title: string;
  value: string;
  subtext: string;
  isSelected?: boolean;
  onClick: () => void;
  isDish?: boolean;
  accentTheme?: 'coral' | 'mint';
}

const RefStyleMetricCard: React.FC<MetricCardRefProps> = ({
  title,
  value,
  subtext,
  isSelected,
  onClick,
  isDish = false,
  accentTheme = 'mint',
}) => {
  const isCoral = accentTheme === 'coral';

  const selectedClasses = isCoral
    ? 'border-[#e57e7c] ring-2 ring-[#e57e7c]/30 shadow-[0_12px_30px_rgba(229,126,124,0.18)] -translate-y-0.5 bg-rose-50/20'
    : 'border-[#52b788] ring-2 ring-[#52b788]/30 shadow-[0_12px_30px_rgba(82,183,136,0.18)] -translate-y-0.5 bg-emerald-50/20';

  const hoverClasses = isCoral
    ? 'border-slate-200/70 shadow-[0_8px_25px_-4px_rgba(0,0,0,0.05),0_4px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_32px_-6px_rgba(229,126,124,0.15)] hover:border-[#e57e7c]/60 hover:-translate-y-0.5'
    : 'border-slate-200/70 shadow-[0_8px_25px_-4px_rgba(0,0,0,0.05),0_4px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_32px_-6px_rgba(82,183,136,0.15)] hover:border-[#52b788]/60 hover:-translate-y-0.5';

  const arrowIconClasses = isCoral
    ? 'bg-rose-50 border-rose-200/80 text-[#e57e7c] group-hover:scale-105 group-hover:bg-[#e57e7c] group-hover:text-white group-hover:border-[#e57e7c]'
    : 'bg-emerald-50 border-emerald-200/80 text-[#2d8f63] group-hover:scale-105 group-hover:bg-[#52b788] group-hover:text-white group-hover:border-[#52b788]';

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-[28px] p-6 sm:p-7 border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between group ${
        isSelected ? selectedClasses : hoverClasses
      }`}
    >
      {/* Top Header Row: Title on Left, Circular Button with Arrow on Right */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-800 text-lg sm:text-xl font-semibold tracking-tight font-sans">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-full border shadow-2xs flex items-center justify-center transition-all shrink-0 ${arrowIconClasses}`}
        >
          <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
        </div>
      </div>

      {/* Bottom Row: Value & Subtext on Left, Barcode Graph on Right */}
      <div className="mt-8 sm:mt-10 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className={`font-extrabold text-slate-900 tracking-tight leading-none ${
              isDish
                ? 'text-xl sm:text-3xl font-display truncate max-w-[170px] sm:max-w-[230px]'
                : 'text-2xl sm:text-3xl md:text-[36px] font-mono truncate'
            }`}
            title={value}
          >
            {value}
          </div>
          <div className="text-sm font-medium text-slate-500 mt-2 capitalize">
            {subtext}
          </div>
        </div>

        <MetricCardBarcodeGraphic accentTheme={accentTheme} />
      </div>
    </div>
  );
};

export const SalesReportView: React.FC<SalesReportViewProps> = ({ customBills = [] }) => {
  // View mode: 'day' | 'month' | 'year'
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Default date state
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  // Navigation states inside popups
  const [calMonth, setCalMonth] = useState<number>(today.getMonth());
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [monthPickerYear, setMonthPickerYear] = useState<number>(today.getFullYear());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedOrderTypeFilter, setSelectedOrderTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState<PastBill | null>(null);

  // Detail Modal State for the 3 Metric Cards
  const [activeMetricModal, setActiveMetricModal] = useState<'sales' | 'revenue' | 'dishes' | null>(null);

  // Available previous years up to current year (no future years)
  const currentYear = today.getFullYear();
  const pastYearsList = useMemo(() => {
    const startYear = Math.min(2018, currentYear - 7);
    const count = currentYear - startYear + 1;
    return Array.from({ length: count }, (_, i) => startYear + i);
  }, [currentYear]);

  // Current scope label for header and buttons
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

  // Compute scoped bills dynamically based on viewMode
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
      // Sample 7-8 representative days distributed across the month
      const maxDaysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const sampleDays = [28, 24, 20, 16, 12, 8, 4, 1].filter((d) => d <= maxDaysInMonth);
      list = sampleDays.flatMap((d) => generateDayBills(selectedYear, selectedMonth, d));
      if (customBills && customBills.length > 0) {
        list = [...customBills, ...list];
      }
      return list;
    }

    // viewMode === 'year': Sample across months of that year
    const sampleMonths = [11, 10, 9, 8, 6, 4, 2, 0]; // Nov, Oct, Sep, Aug, Jun, Apr, Feb, Jan
    list = sampleMonths.flatMap((m, mIdx) => {
      const day = ((mIdx * 5 + 7) % 25) + 1;
      return generateDayBills(selectedYear, m, day);
    });
    if (customBills && customBills.length > 0) {
      list = [...customBills, ...list];
    }
    return list;
  }, [viewMode, selectedDate, selectedMonth, selectedYear, customBills]);

  // Dynamic calculations for the scoped bills
  const totalSalesCount = scopedBills.length;
  const totalRevenue = scopedBills.reduce(
    (sum, bill) => sum + (bill.status === 'Paid' ? bill.amount : 0),
    0
  );

  // Exact Breakdowns for Total Sales Count across all 4 channels
  const dineInSalesCount = scopedBills.filter((bill) => bill.orderType === 'Dine-in').length;
  const takeawaySalesCount = scopedBills.filter((bill) => bill.orderType === 'Takeaway').length;
  const deliverySalesCount = scopedBills.filter((bill) => bill.orderType === 'Delivery').length;
  const qrOrderSalesCount = scopedBills.filter((bill) => bill.orderType === 'QR Order').length;

  // Exact Breakdowns for Total Revenue by Payment Method
  const upiRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'UPI / QR')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const cashRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'Cash')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const cardsRevenue = scopedBills
    .filter((bill) => bill.status === 'Paid' && bill.paymentMethod === 'Credit Card')
    .reduce((sum, bill) => sum + bill.amount, 0);

  // Most Ordered Food (Top Selling Dishes for the active scope)
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

    // Seed catalog items so low/zero-volume dishes are captured
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
    const least3Dishes = [...sortedDishes].sort((a, b) => a.totalQuantity - b.totalQuantity).slice(0, 3);

    return {
      topDish: sortedDishes.length > 0 ? sortedDishes[0] : null,
      top3Dishes,
      least3Dishes,
    };
  }, [scopedBills]);

  // Filter bills
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

  // Table Pagination
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

  // Day Calendar Calculations
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

  // Helper to render metric breakdown details content
  const renderMetricDetailBody = (metric: 'sales' | 'revenue' | 'dishes') => {
    if (metric === 'sales') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">{totalSalesCount}</span>
            </div>
            <span className="text-xs font-bold text-[#2d8f63] bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              4 Active Channels
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Orders by Order Channel
            </div>

            {/* Dine-in */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-[#e57e7c] flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">Dine-in (Floor Tables)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  {dineInSalesCount}{' '}
                  <span className="text-slate-400 font-normal">
                    orders ({totalSalesCount > 0 ? Math.round((dineInSalesCount / totalSalesCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#e57e7c] rounded-full transition-all"
                  style={{ width: `${totalSalesCount > 0 ? (dineInSalesCount / totalSalesCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Takeaway */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">Takeaway (Counter Pickup)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  {takeawaySalesCount}{' '}
                  <span className="text-slate-400 font-normal">
                    orders ({totalSalesCount > 0 ? Math.round((takeawaySalesCount / totalSalesCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all"
                  style={{ width: `${totalSalesCount > 0 ? (takeawaySalesCount / totalSalesCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">Delivery (Home & Office)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  {deliverySalesCount}{' '}
                  <span className="text-slate-400 font-normal">
                    orders ({totalSalesCount > 0 ? Math.round((deliverySalesCount / totalSalesCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${totalSalesCount > 0 ? (deliverySalesCount / totalSalesCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* QR Order */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2d8f63] flex items-center justify-center">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">QR Order (Table Digital Orders)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  {qrOrderSalesCount}{' '}
                  <span className="text-slate-400 font-normal">
                    orders ({totalSalesCount > 0 ? Math.round((qrOrderSalesCount / totalSalesCount) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#52b788] rounded-full transition-all"
                  style={{ width: `${totalSalesCount > 0 ? (qrOrderSalesCount / totalSalesCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (metric === 'revenue') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Settled Revenue
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">
                ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-xs font-bold text-[#e57e7c] bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
              Settled
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Revenue by Payment Mode
            </div>

            {/* UPI / QR */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2d8f63] flex items-center justify-center">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">UPI / QR (PhonePe, GPay, Paytm)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  ₹{upiRevenue.toLocaleString('en-IN')}{' '}
                  <span className="text-[#52b788] font-bold">
                    ({totalRevenue > 0 ? Math.round((upiRevenue / totalRevenue) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#52b788] rounded-full transition-all"
                  style={{ width: `${totalRevenue > 0 ? (upiRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cash */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2d8f63] flex items-center justify-center">
                    <Banknote className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">Cash (Counter & Hand-off)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  ₹{cashRevenue.toLocaleString('en-IN')}{' '}
                  <span className="text-[#52b788] font-bold">
                    ({totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#52b788] rounded-full transition-all"
                  style={{ width: `${totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cards */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#e57e7c] flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-800">Credit / Debit Cards (POS Terminal)</span>
                </div>
                <div className="font-mono text-xs font-black text-slate-900">
                  ₹{cardsRevenue.toLocaleString('en-IN')}{' '}
                  <span className="text-[#e57e7c] font-bold">
                    ({totalRevenue > 0 ? Math.round((cardsRevenue / totalRevenue) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#e57e7c] rounded-full transition-all"
                  style={{ width: `${totalRevenue > 0 ? (cardsRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* SECTION 1: TOP 3 MOST ORDERED FOOD */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-[#2d8f63] flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Top 3 Most Ordered Food
              </h4>
            </div>
            <span className="text-[10px] font-bold text-[#2d8f63] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Best Sellers
            </span>
          </div>

          <div className="space-y-2">
            {top3Dishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="w-6 h-6 rounded-xl bg-[#52b788] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block leading-tight truncate">
                      {dish.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5">
                      {dish.category} · ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-slate-900 block leading-tight">
                    {dish.totalQuantity} <span className="text-[10px] text-slate-400 font-normal">sold</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#2d8f63] block leading-none mt-0.5">
                    ₹{dish.totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TOP 3 LEAST ORDERED FOOD */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100/80 text-[#e57e7c] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Top 3 Least Ordered Food
              </h4>
            </div>
            <span className="text-[10px] font-bold text-[#e57e7c] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Needs Attention / Promotion
            </span>
          </div>

          <div className="space-y-2">
            {least3Dishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="w-6 h-6 rounded-xl bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block leading-tight truncate">
                      {dish.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5">
                      {dish.category} · ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-slate-700 block leading-tight">
                    {dish.totalQuantity} <span className="text-[10px] text-slate-400 font-normal">sold</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block leading-none mt-0.5">
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

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* 1. Top Action Bar: Day / Month / Year Pill Selector with Attached Interactive Calendars */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black font-display text-slate-900 tracking-tight">
            Sales Overview
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#52b788]" />
            {periodLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Day / Month / Year Pill Toggle */}
          <div className="relative flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            {/* Day Button */}
            <button
              onClick={() => {
                if (viewMode === 'day') {
                  setIsPopupOpen((prev) => !prev);
                } else {
                  setViewMode('day');
                  setCalMonth(selectedDate.getMonth());
                  setCalYear(selectedDate.getFullYear());
                  setIsPopupOpen(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'day'
                  ? 'bg-[#e57e7c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={viewMode === 'day' ? "Click to open date calendar popup" : "Switch to Day view"}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Day</span>
              {viewMode === 'day' && <ChevronDown className="w-3 h-3 opacity-80" />}
            </button>

            {/* Month Button */}
            <button
              onClick={() => {
                if (viewMode === 'month') {
                  setIsPopupOpen((prev) => !prev);
                } else {
                  setViewMode('month');
                  setMonthPickerYear(selectedYear);
                  setIsPopupOpen(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'month'
                  ? 'bg-[#e57e7c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={viewMode === 'month' ? "Click to open month selector popup" : "Switch to Month view"}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month</span>
              {viewMode === 'month' && <ChevronDown className="w-3 h-3 opacity-80" />}
            </button>

            {/* Year Button */}
            <button
              onClick={() => {
                if (viewMode === 'year') {
                  setIsPopupOpen((prev) => !prev);
                } else {
                  setViewMode('year');
                  setIsPopupOpen(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'year'
                  ? 'bg-[#e57e7c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={viewMode === 'year' ? "Click to open year selector popup" : "Switch to Year view"}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Year</span>
              {viewMode === 'year' && <ChevronDown className="w-3 h-3 opacity-80" />}
            </button>

            {/* Backdrop overlay for closing any open calendar popup */}
            {isPopupOpen && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsPopupOpen(false)}
              />
            )}

            {/* DAY VIEW CALENDAR POPUP */}
            {isPopupOpen && viewMode === 'day' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                {/* Calendar Header with Month/Year Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <select
                      value={calMonth}
                      onChange={(e) => setCalMonth(Number(e.target.value))}
                      className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 outline-none cursor-pointer"
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
                      className="font-bold text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 outline-none cursor-pointer"
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
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextCalMonth}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day Names Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Calendar Days Grid */}
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

                    const isToday =
                      today.getDate() === dayNum &&
                      today.getMonth() === calMonth &&
                      today.getFullYear() === calYear;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => handleSelectDay(dayNum)}
                        className={`h-8 w-8 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#e57e7c] text-white shadow-xs scale-105'
                            : isToday
                            ? 'bg-emerald-100 text-[#52b788] border border-emerald-300 font-black'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Shortcut */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      const now = new Date();
                      setSelectedDate(now);
                      setCalMonth(now.getMonth());
                      setCalYear(now.getFullYear());
                      setSelectedMonth(now.getMonth());
                      setSelectedYear(now.getFullYear());
                      setCurrentPage(1);
                      setIsPopupOpen(false);
                    }}
                    className="font-bold text-[#e57e7c] hover:underline cursor-pointer"
                  >
                    Today ({today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })})
                  </button>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* MONTH VIEW CALENDAR POPUP (Year Selector + 12 Months Grid) */}
            {isPopupOpen && viewMode === 'month' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-40 w-80 animate-in fade-in zoom-in-95 duration-150">
                {/* Year Navigation Stepper: Clean, non-blocking UI */}
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                  <button
                    onClick={() => setMonthPickerYear((y) => y - 1)}
                    className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer flex items-center gap-1 group"
                    title="Previous Year"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 font-mono">
                      {monthPickerYear - 1}
                    </span>
                  </button>

                  <div className="px-3.5 py-1 rounded-xl bg-emerald-50 text-[#2d8f63] border border-emerald-200/90 font-black font-display text-sm tracking-tight shadow-2xs">
                    {monthPickerYear}
                  </div>

                  <button
                    onClick={() => setMonthPickerYear((y) => Math.min(currentYear, y + 1))}
                    disabled={monthPickerYear >= currentYear}
                    className="p-1.5 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl text-slate-700 transition-colors cursor-pointer flex items-center gap-1 group"
                    title="Next Year"
                  >
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 font-mono">
                      {monthPickerYear < currentYear ? monthPickerYear + 1 : ''}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                  </button>
                </div>

                {/* 12 Months Selection Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {MONTH_NAMES.map((name, idx) => {
                    const isSelected =
                      selectedMonth === idx && selectedYear === monthPickerYear;
                    const isCurrentMonthNow =
                      today.getMonth() === idx && today.getFullYear() === monthPickerYear;

                    return (
                      <button
                        key={name}
                        onClick={() => handleSelectMonth(idx)}
                        className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#e57e7c] text-white shadow-xs scale-105 font-black'
                            : isCurrentMonthNow
                            ? 'bg-rose-50 text-[#e57e7c] border border-rose-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="text-xs">{SHORT_MONTH_NAMES[idx]}</span>
                        <span className="text-[9px] opacity-70 font-normal">{name.slice(0, 4)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Shortcuts */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      const now = new Date();
                      setSelectedMonth(now.getMonth());
                      setSelectedYear(now.getFullYear());
                      setMonthPickerYear(now.getFullYear());
                      setCurrentPage(1);
                      setIsPopupOpen(false);
                    }}
                    className="font-bold text-[#e57e7c] hover:underline cursor-pointer"
                  >
                    Current Month ({SHORT_MONTH_NAMES[today.getMonth()]} {today.getFullYear()})
                  </button>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* YEAR VIEW PICKER POPUP */}
            {isPopupOpen && viewMode === 'year' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-40 w-72 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Year
                  </span>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {pastYearsList.map((y) => {
                    const isSelected = selectedYear === y;
                    const isCurrentYearNow = today.getFullYear() === y;

                    return (
                      <button
                        key={y}
                        onClick={() => handleSelectYear(y)}
                        className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#e57e7c] text-white shadow-xs scale-105 font-black'
                            : isCurrentYearNow
                            ? 'bg-rose-50 text-[#e57e7c] border border-rose-200'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      handleSelectYear(today.getFullYear());
                    }}
                    className="font-bold text-[#e57e7c] hover:underline cursor-pointer"
                  >
                    Current Year ({today.getFullYear()})
                  </button>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#52b788] hover:bg-[#43a276] active:bg-[#388d66] text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>


      {/* 2. Top View Content: Cards & Modal Layout */}
      {viewMode === 'day' ? (
        /* DAY VIEW: Horizontal Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {/* Card 1: Total Revenue */}
          <RefStyleMetricCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="This Day"
            accentTheme="mint"
            isSelected={activeMetricModal === 'revenue'}
            onClick={() => setActiveMetricModal('revenue')}
          />

          {/* Card 2: Total Sales Count */}
          <RefStyleMetricCard
            title="Total Sales Count"
            value={totalSalesCount.toLocaleString('en-IN')}
            subtext="This Day"
            accentTheme="coral"
            isSelected={activeMetricModal === 'sales'}
            onClick={() => setActiveMetricModal('sales')}
          />

          {/* Card 3: Most Ordered Food */}
          <RefStyleMetricCard
            title="Most Ordered Food"
            value={topDish ? topDish.name : 'No orders'}
            subtext="This Day"
            isDish={true}
            accentTheme="mint"
            isSelected={activeMetricModal === 'dishes'}
            onClick={() => setActiveMetricModal('dishes')}
          />
        </div>
      ) : (
        /* MONTH & YEAR VIEW: 3 Vertical Stacked Cards on Left + Inline Side Panel on Right */
        <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in duration-300">
          {/* Left Column: 3 Vertical Cards Stacked */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 shrink-0">
            {/* Card 1: Total Revenue */}
            <RefStyleMetricCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtext={viewMode === 'month' ? 'This Month' : 'This Year'}
              accentTheme="mint"
              isSelected={activeMetricModal === 'revenue'}
              onClick={() => setActiveMetricModal('revenue')}
            />

            {/* Card 2: Total Sales Count */}
            <RefStyleMetricCard
              title="Total Sales Count"
              value={totalSalesCount.toLocaleString('en-IN')}
              subtext={viewMode === 'month' ? 'This Month' : 'This Year'}
              accentTheme="coral"
              isSelected={activeMetricModal === 'sales' || !activeMetricModal}
              onClick={() => setActiveMetricModal('sales')}
            />

            {/* Card 3: Most Ordered Food */}
            <RefStyleMetricCard
              title="Most Ordered Food"
              value={topDish ? topDish.name : 'No orders'}
              subtext={viewMode === 'month' ? 'This Month' : 'This Year'}
              isDish={true}
              accentTheme="mint"
              isSelected={activeMetricModal === 'dishes'}
              onClick={() => setActiveMetricModal('dishes')}
            />
          </div>

          {/* Right Side Panel: Inline Detailed Breakdown */}
          <div className="flex-1 w-full bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-md min-h-[460px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    (activeMetricModal || 'sales') === 'sales'
                      ? 'bg-emerald-100/70 text-[#2d8f63]'
                      : (activeMetricModal || 'sales') === 'revenue'
                      ? 'bg-rose-100/70 text-[#e57e7c]'
                      : 'bg-emerald-100/70 text-[#2d8f63]'
                  }`}
                >
                  {(activeMetricModal || 'sales') === 'sales' && <ShoppingBag className="w-5 h-5 text-[#52b788]" />}
                  {(activeMetricModal || 'sales') === 'revenue' && <DollarSign className="w-5 h-5 text-[#e57e7c]" />}
                  {(activeMetricModal || 'sales') === 'dishes' && <Flame className="w-5 h-5 text-[#52b788]" />}
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900">
                    {(activeMetricModal || 'sales') === 'sales' && 'Sales Volume & Channels'}
                    {(activeMetricModal || 'sales') === 'revenue' && 'Revenue & Payment Modes'}
                    {(activeMetricModal || 'sales') === 'dishes' && 'Menu Dish Performance'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Breakdown for {periodLabel}</p>
                </div>
              </div>
            </div>

            {/* Render detail content for active metric */}
            {renderMetricDetailBody(activeMetricModal || 'sales')}
          </div>
        </div>
      )}

      {/* Floating Modal for DAY VIEW ONLY */}
      {viewMode === 'day' && activeMetricModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setActiveMetricModal(null)} />

          <div className="relative w-full max-w-xl bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeMetricModal === 'sales'
                      ? 'bg-emerald-100/70 text-[#2d8f63]'
                      : activeMetricModal === 'revenue'
                      ? 'bg-rose-100/70 text-[#e57e7c]'
                      : 'bg-emerald-100/70 text-[#2d8f63]'
                  }`}
                >
                  {activeMetricModal === 'sales' && <ShoppingBag className="w-5 h-5 text-[#52b788]" />}
                  {activeMetricModal === 'revenue' && <DollarSign className="w-5 h-5 text-[#e57e7c]" />}
                  {activeMetricModal === 'dishes' && <Flame className="w-5 h-5 text-[#52b788]" />}
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900">
                    {activeMetricModal === 'sales' && 'Sales Volume & Channels'}
                    {activeMetricModal === 'revenue' && 'Revenue & Payment Modes'}
                    {activeMetricModal === 'dishes' && 'Menu Dish Performance'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Breakdown for {periodLabel}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveMetricModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5">
              {renderMetricDetailBody(activeMetricModal)}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveMetricModal(null)}
                className="py-2.5 px-6 bg-[#52b788] hover:bg-[#43a276] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. "All Bills & Receipts" Section - ONLY for Day View */}
      {viewMode === 'day' && (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-inner space-y-5 animate-in fade-in duration-200">
          {/* Section Header: Title on Left, Search Bar & Dropdowns on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <h4 className="font-black text-slate-900 text-lg tracking-tight font-display">
                All Bills & Receipts
              </h4>
            </div>

          {/* Controls: Search Bar + Payment Dropdown + Status Dropdown beside search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="relative flex items-center bg-white border border-slate-200/90 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 rounded-xl px-3 py-1.5 transition-all shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search bill #, table, items..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="p-0.5 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Payment Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedPaymentFilter}
                onChange={(e) => {
                  setSelectedPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-slate-700 shadow-2xs outline-none cursor-pointer"
              >
                <option value="All">Payment: All</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI / QR">UPI / QR</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Channel / Order Type Dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedOrderTypeFilter}
                onChange={(e) => {
                  setSelectedOrderTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-slate-700 shadow-2xs outline-none cursor-pointer"
              >
                <option value="All">Channel: All</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
                <option value="QR Order">QR Order</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Elevated Floating Table Card */}
        {filteredBills.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <p className="font-extrabold text-sm text-slate-700">No matching bills found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try clearing your search query or filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2.5">
                <thead>
                  <tr className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-2.5 px-4">Bill No</th>
                    <th className="py-2.5 px-4">Table / Customer</th>
                    <th className="py-2.5 px-4">Items Summary</th>
                    <th className="py-2.5 px-4">Date & Time</th>
                    <th className="py-2.5 px-4">Payment Method</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBills.map((bill) => {
                    const isPaid = bill.status === 'Paid';
                    return (
                      <tr 
                        key={bill.id} 
                        onClick={() => setSelectedReceiptBill(bill)}
                        className="group cursor-pointer transition-all duration-200 hover:drop-shadow-[0_4px_14px_rgba(82,183,136,0.18)]"
                      >
                        {/* Bill No with pill badge & left accent pill */}
                        <td className="py-3.5 px-4 rounded-l-2xl border-y border-l-4 border-l-transparent border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 group-hover:border-l-[#52b788] transition-all duration-200">
                          <span className="font-black text-slate-900 font-mono text-xs bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs inline-block group-hover:border-[#52b788]/60 group-hover:text-emerald-900 group-hover:shadow-xs transition-all">
                            {bill.billNo}
                          </span>
                        </td>

                        {/* Table / Customer */}
                        <td className="py-3.5 px-4 border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-800 group-hover:text-slate-950 text-xs transition-colors">
                              {bill.tableNo}
                            </span>
                            {bill.orderType && (
                              <span
                                className={`inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md w-fit border ${
                                  bill.orderType === 'QR Order'
                                    ? 'bg-emerald-50 text-[#2d8f63] border-emerald-300/80 font-black'
                                    : bill.orderType === 'Dine-in'
                                    ? 'bg-rose-50 text-[#e57e7c] border-rose-200/70 font-bold'
                                    : bill.orderType === 'Delivery'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200/70 font-bold'
                                    : 'bg-slate-100 text-slate-700 border-slate-200/80 font-bold'
                                }`}
                              >
                                {bill.orderType}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Items Summary */}
                        <td className="py-3.5 px-4 font-semibold text-slate-600 group-hover:text-slate-800 text-xs max-w-[220px] truncate border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          {bill.itemsSummary}
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 text-slate-500 group-hover:text-slate-700 whitespace-nowrap font-mono text-[11px] border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          {bill.dateTime}
                        </td>

                        {/* Payment Method with Icon */}
                        <td className="py-3.5 px-4 border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200/80 group-hover:border-[#52b788]/40 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-700 group-hover:text-slate-900 shadow-2xs transition-colors">
                            {bill.paymentMethod === 'Credit Card' && <CreditCard className="w-3 h-3 text-slate-500" />}
                            {bill.paymentMethod === 'Cash' && <Banknote className="w-3 h-3 text-slate-500" />}
                            {bill.paymentMethod === 'UPI / QR' && <QrCode className="w-3 h-3 text-slate-500" />}
                            <span>{bill.paymentMethod}</span>
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right font-black text-slate-900 group-hover:text-emerald-950 font-mono text-sm border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          ₹{bill.amount.toFixed(2)}
                        </td>

                        {/* Status Tag */}
                        <td className="py-3.5 px-4 text-center border-y border-y-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 transition-all duration-200">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-white group-hover:border-emerald-300'
                                : 'bg-rose-50 text-[#e57e7c] border-rose-200/80 group-hover:bg-white group-hover:border-rose-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPaid ? 'bg-emerald-500' : 'bg-[#e57e7c]'
                              }`}
                            />
                            {bill.status}
                          </span>
                        </td>

                        {/* Action Receipt Button */}
                        <td className="py-3.5 px-4 text-center rounded-r-2xl border-y border-r border-y-slate-200/80 border-r-slate-200/80 bg-slate-50/80 group-hover:bg-emerald-50/90 group-hover:border-y-[#52b788]/50 group-hover:border-r-[#52b788]/50 transition-all duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceiptBill(bill);
                            }}
                            className="p-2 rounded-xl bg-white group-hover:bg-rose-50 text-slate-600 group-hover:text-[#e57e7c] border border-slate-200/80 group-hover:border-rose-200 hover:!bg-[#e57e7c] hover:!text-white hover:!border-[#e57e7c] transition-all cursor-pointer inline-flex items-center justify-center shadow-2xs active:scale-95"
                            title="View & Download Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                  title="First Page"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                  title="Previous Page"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#e57e7c] text-white shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                  title="Next Page"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                  title="Last Page"
                >
                  »
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )}



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
