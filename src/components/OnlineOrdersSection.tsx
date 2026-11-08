import React, { useState } from 'react';
import {
  X,
  Check,
  Printer,
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export type PaymentMethod = 'UPI / QR' | 'Card' | 'Cash';

export interface OrderCard {
  id: string;
  tableOrName: string;
  orderNo: string;
  status: 'New' | 'Accepted' | 'Payment Done';
  paymentMethod?: PaymentMethod;
  dateStr: string;
  timeStr: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}

export interface CompletedLogItem {
  id: string;
  customerName: string;
  orderNo: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod?: PaymentMethod;
  completedTime: string;
  date: string;
}

interface OnlineOrdersSectionProps {
  onCountsChange?: (totalOrders: number, waiterCalls: number) => void;
  onCompleteOrder?: (order: OrderCard) => void;
}

export const OnlineOrdersSection: React.FC<OnlineOrdersSectionProps> = ({
  onCountsChange,
  onCompleteOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Accepted' | 'Payment Done'>('All');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderCard | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const [orderPaymentSelection, setOrderPaymentSelection] = useState<Record<string, PaymentMethod>>({
    'ord-2': 'UPI / QR',
    'ord-5': 'Cash',
  });

  const [orders, setOrders] = useState<OrderCard[]>([
    {
      id: 'ord-1',
      tableOrName: 'Ariel Hikmat (Table T-4)',
      orderNo: '#925',
      status: 'New',
      dateStr: 'Today',
      timeStr: '01:12 PM',
      items: [
        { name: 'Avocado Toast', qty: 1, price: 260 },
        { name: 'Iced Matcha Latte', qty: 1, price: 190 },
        { name: 'Almond Croissant', qty: 2, price: 340 },
      ],
      total: 790,
    },
    {
      id: 'ord-2',
      tableOrName: 'Denis Freeman (Table T-2)',
      orderNo: '#921',
      status: 'Accepted',
      dateStr: 'Today',
      timeStr: '01:18 PM',
      items: [
        { name: 'Truffle Toastie', qty: 1, price: 310 },
        { name: 'Artisanal Flat White', qty: 2, price: 360 },
      ],
      total: 670,
    },
    {
      id: 'ord-3',
      tableOrName: 'Morgan Cox (Table T-7)',
      orderNo: '#916',
      status: 'Payment Done',
      paymentMethod: 'UPI / QR',
      dateStr: 'Today',
      timeStr: '01:19 PM',
      items: [
        { name: 'Quinoa Bowl', qty: 1, price: 290 },
        { name: 'Berry Smoothie', qty: 2, price: 460 },
        { name: 'French Crepes', qty: 1, price: 320 },
      ],
      total: 1070,
    },
    {
      id: 'ord-4',
      tableOrName: 'Paul Rey (Table T-1)',
      orderNo: '#919',
      status: 'New',
      dateStr: 'Today',
      timeStr: '01:22 PM',
      items: [
        { name: 'Pancake Stack', qty: 1, price: 280 },
        { name: 'Artisanal Flat White', qty: 1, price: 180 },
        { name: 'Yogurt Bowl', qty: 1, price: 240 },
      ],
      total: 700,
    },
    {
      id: 'ord-5',
      tableOrName: 'Sarah Jenkins (Table T-5)',
      orderNo: '#911',
      status: 'Accepted',
      dateStr: 'Today',
      timeStr: '01:25 PM',
      items: [
        { name: 'Chia Pudding', qty: 2, price: 440 },
        { name: 'Iced Matcha Latte', qty: 1, price: 190 },
      ],
      total: 630,
    },
    {
      id: 'ord-6',
      tableOrName: 'Liam Miller (Table T-8)',
      orderNo: '#909',
      status: 'New',
      dateStr: 'Today',
      timeStr: '01:28 PM',
      items: [
        { name: 'Fruit Bowl', qty: 1, price: 210 },
        { name: 'Berry Smoothie', qty: 1, price: 230 },
      ],
      total: 440,
    },
  ]);

  const acceptedCount = orders.filter((o) => o.status === 'Accepted').length;
  const paymentDoneCount = orders.filter((o) => o.status === 'Payment Done').length;
  const allCount = orders.length;

  React.useEffect(() => {
    if (onCountsChange) {
      onCountsChange(orders.length, 4);
    }
  }, [orders.length, onCountsChange]);

  const showToast = (msg: string) => {
    setRecentNotification(msg);
    setTimeout(() => {
      setRecentNotification((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleAccept = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Accepted' } : o))
    );
    showToast(`Order accepted! Awaiting customer bill payment.`);
  };

  const handleReject = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ord = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (ord) {
      showToast(`Order ${ord.orderNo} was rejected.`);
    }
  };

  const handleSelectPaymentMethod = (orderId: string, method: PaymentMethod, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrderPaymentSelection((prev) => ({ ...prev, [orderId]: method }));
  };

  const handleMarkAsPaymentDone = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenMethod = orderPaymentSelection[orderId] || 'UPI / QR';
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Payment Done',
              paymentMethod: chosenMethod,
            }
          : o
      )
    );
    const ord = orders.find((o) => o.id === orderId);
    showToast(`Order ${ord?.orderNo || ''} paid via ${chosenMethod}. Moved to Payment Done.`);
  };

  const handleMarkAsCompleted = (order: OrderCard, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    if (onCompleteOrder) {
      onCompleteOrder(order);
    }
    showToast(`Order ${order.orderNo} completed & sent to Sales Report.`);
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'Accepted') return ord.status === 'Accepted';
    if (activeTab === 'Payment Done') return ord.status === 'Payment Done';
    return true;
  });

  const avatarBadges = [
    'bg-[#e8ecf7] text-[#313b68]',
    'bg-[#f5ebe1] text-[#6e5641]',
    'bg-[#e5f3eb] text-[#2f684e]',
    'bg-[#f9e6ea] text-[#7a3e48]',
  ];

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4 animate-in fade-in duration-300 select-none overflow-hidden">
      {/* Toast Notification */}
      {recentNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#313b68] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#e8ecf7]" />
          <span>{recentNotification}</span>
          <button
            onClick={() => setRecentNotification(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Fixed Top Action Bar */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-4 bg-white rounded-[28px] px-6 py-4 shadow-[0_8px_28px_rgba(20,25,45,0.04)]">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1a1f36] tracking-[-0.01em]">
            QR Orders
          </h3>
          <p className="text-xs text-[#8c93a4] font-medium mt-0.5">
            Real-time table orders placed by customers via table QR codes
          </p>
        </div>

        {/* Filter Tabs: All | Accepted | Payment Done */}
        <div className="flex items-center gap-1.5 bg-[#f7f8fa] p-1.5 rounded-full">
          {(
            [
              { id: 'All', label: 'All', count: allCount },
              { id: 'Accepted', label: 'Accepted', count: acceptedCount },
              { id: 'Payment Done', label: 'Payment Done', count: paymentDoneCount },
            ] as const
          ).map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#313b68] text-white font-semibold shadow-2xs'
                    : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold tabular-nums ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#e8ecf7] text-[#313b68]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Main Content View */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4">
        {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-[28px] shadow-[0_8px_28px_rgba(20,25,45,0.04)] max-w-lg mx-auto p-8">
          <div className="w-12 h-12 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-5 h-5" />
          </div>
          <p className="font-semibold text-sm text-[#1a1f36]">
            {activeTab === 'Accepted'
              ? 'No orders in accepted phase'
              : activeTab === 'Payment Done'
              ? 'No orders awaiting completion'
              : 'No active QR orders right now'}
          </p>
          <p className="text-xs text-[#8c93a4] mt-1 max-w-xs mx-auto">
            Incoming customer QR orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order, idx) => {
            const isAccepted = order.status === 'Accepted';
            const isPaymentDone = order.status === 'Payment Done';
            const isNew = order.status === 'New';
            const currentPaymentMethod = orderPaymentSelection[order.id] || 'UPI / QR';
            const initials = order.tableOrName
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase();
            const avatarColor = avatarBadges[idx % avatarBadges.length];

            return (
              <div
                key={order.id}
                className="bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_8px_28px_rgba(20,25,45,0.04)] flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Card Top Row: Pastel Initials Avatar + Customer/Table + Status Pill */}
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full ${avatarColor} font-semibold text-xs flex items-center justify-center shrink-0`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-[#1a1f36] text-sm truncate">
                          {order.tableOrName}
                        </h4>
                        <span className="text-xs text-[#8c93a4] font-medium tabular-nums">
                          Order {order.orderNo} · {order.timeStr}
                        </span>
                      </div>
                    </div>

                    {isNew && (
                      <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f5ebe1] text-[#6e5641] flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>New</span>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e6f6ec] text-[#229a54] flex items-center gap-1 shrink-0">
                        <span>Accepted</span>
                      </div>
                    )}

                    {isPaymentDone && (
                      <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8ecf7] text-[#313b68] flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Paid</span>
                      </div>
                    )}
                  </div>

                  {/* Inner Box for Order Items (matching #f7f8fa Pulse inner boxes) */}
                  <div className="bg-[#f7f8fa] rounded-[20px] p-3.5 mb-4">
                    <div className="grid grid-cols-12 text-[11px] font-medium text-[#8c93a4] mb-2 px-1">
                      <span className="col-span-7">Item</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-3 text-right">Price</span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="grid grid-cols-12 text-xs font-semibold text-[#1a1f36] px-1 items-center"
                        >
                          <span className="col-span-7 truncate">{item.name}</span>
                          <span className="col-span-2 text-center text-[#8c93a4] font-medium tabular-nums">
                            {item.qty}
                          </span>
                          <span className="col-span-3 text-right tabular-nums text-[#1a1f36]">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* Total Row */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#8c93a4]">Total amount</span>
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="text-xs text-[#313b68] hover:underline font-semibold cursor-pointer"
                      >
                        View bill
                      </button>
                    </div>
                    <span className="font-display text-lg font-medium text-[#1a1f36] tabular-nums">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Lifecycle Action Buttons */}
                  {isNew && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={(e) => handleReject(order.id, e)}
                        className="py-2.5 px-3 bg-[#fdecec] hover:bg-[#fad8d8] text-[#d94646] font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={(e) => handleAccept(order.id, e)}
                        className="py-2.5 px-3 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-3 gap-1.5 bg-[#f7f8fa] p-1 rounded-full">
                        {(['UPI / QR', 'Card', 'Cash'] as const).map((method) => {
                          const isChosen = currentPaymentMethod === method;
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={(e) => handleSelectPaymentMethod(order.id, method, e)}
                              className={`py-1.5 px-2 rounded-full text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                isChosen
                                  ? 'bg-white text-[#1a1f36] font-semibold shadow-2xs'
                                  : 'text-[#6e768a] hover:text-[#1a1f36] font-medium'
                              }`}
                            >
                              {method === 'UPI / QR' ? (
                                <QrCode className="w-3 h-3 shrink-0" />
                              ) : method === 'Card' ? (
                                <CreditCard className="w-3 h-3 shrink-0" />
                              ) : (
                                <Banknote className="w-3 h-3 shrink-0" />
                              )}
                              <span className="truncate">{method}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={(e) => handleMarkAsPaymentDone(order.id, e)}
                        className="w-full py-3 px-4 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as payment done</span>
                      </button>
                    </div>
                  )}

                  {isPaymentDone && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-2xl bg-[#e6f6ec] flex items-center justify-between text-xs px-3.5">
                        <div className="flex items-center gap-1.5 text-[#229a54] font-semibold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Payment settled</span>
                        </div>
                        <span className="font-semibold text-[#229a54] text-[11px]">
                          {order.paymentMethod || 'UPI / QR'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleMarkAsCompleted(order, e)}
                        className="w-full py-3 px-4 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete order</span>
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

      {/* Printable Bill Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 bg-[#1a1f36]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedReceiptOrder(null)} />

          <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(20,25,45,0.2)] z-10 text-[#1a1f36] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#e8ecf7] text-[#313b68] flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[#1a1f36]">
                  QR Order Bill {selectedReceiptOrder.orderNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#f7f8fa] text-[#8c93a4] hover:text-[#1a1f36] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="bg-[#f7f8fa] p-4 rounded-[20px] space-y-1.5">
                <div className="flex justify-between text-[#8c93a4]">
                  <span>Customer / Table:</span>
                  <span className="font-semibold text-[#1a1f36]">{selectedReceiptOrder.tableOrName}</span>
                </div>
                <div className="flex justify-between text-[#8c93a4]">
                  <span>Order Time:</span>
                  <span className="font-semibold text-[#1a1f36] tabular-nums">
                    {selectedReceiptOrder.timeStr} ({selectedReceiptOrder.dateStr})
                  </span>
                </div>
                <div className="flex justify-between text-[#8c93a4]">
                  <span>Status:</span>
                  <span className="font-semibold text-[#229a54]">{selectedReceiptOrder.status}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-semibold text-[#8c93a4] uppercase text-[10px] pb-1 border-b border-slate-100 flex justify-between">
                  <span>Item</span>
                  <span>Qty & Price</span>
                </div>
                {selectedReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center font-semibold text-[#1a1f36]">
                    <span>{item.name}</span>
                    <span className="tabular-nums text-[#6e768a]">
                      {item.qty} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-[#1a1f36]">
                <span>Total Amount:</span>
                <span className="font-display text-lg text-[#313b68] tabular-nums">
                  ₹{selectedReceiptOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 py-3 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
