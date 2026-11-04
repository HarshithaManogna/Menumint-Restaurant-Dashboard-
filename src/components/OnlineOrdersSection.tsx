import React, { useState } from 'react';
import {
  Search,
  X,
  Check,
  Eye,
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

export const OnlineOrdersSection: React.FC<OnlineOrdersSectionProps> = ({ onCountsChange, onCompleteOrder }) => {
  // Option 1: Tabs are All | Accepted | Payment Done
  const [activeTab, setActiveTab] = useState<'All' | 'Accepted' | 'Payment Done'>('All');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderCard | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Per-order payment method choice before clicking "Mark as Payment Done"
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

  // Report counts to parent App
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
    showToast(`Order ${order.orderNo} completed & sent to Sales Report as QR Order.`);
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'Accepted') return ord.status === 'Accepted';
    if (activeTab === 'Payment Done') return ord.status === 'Payment Done';
    return true; // 'All' shows all active orders
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 select-none pb-12">
      {/* Toast Notification */}
      {recentNotification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#52b788]" />
          <span>{recentNotification}</span>
          <button
            onClick={() => setRecentNotification(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded-full text-slate-300 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Top Action Bar: QR Orders Title on Left & Capsule Filter Bar on Right */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <span>QR Orders</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time table orders placed by customers via table QR codes
          </p>
        </div>

        {/* Option 1 Filter Tabs: All | Accepted | Payment Done */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-2xs">
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
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#e57e7c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-inner relative min-h-[480px]">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <p className="font-extrabold text-sm text-slate-700">
              {activeTab === 'Accepted'
                ? 'No orders in accepted phase'
                : activeTab === 'Payment Done'
                ? 'No orders awaiting completion'
                : 'No active QR orders right now'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'Accepted'
                ? 'When new orders are accepted, they will wait here for the customer to settle the bill.'
                : activeTab === 'Payment Done'
                ? 'Orders marked with payment settled will appear here ready to be completed.'
                : 'Incoming customer QR orders will show up here automatically.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const isAccepted = order.status === 'Accepted';
              const isPaymentDone = order.status === 'Payment Done';
              const isNew = order.status === 'New';
              const currentPaymentMethod = orderPaymentSelection[order.id] || 'UPI / QR';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200/70 shadow-lg shadow-slate-200/70 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div>
                    {/* Card Top Row: Order No, Name & Dynamic Status Badge */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 gap-2">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-display truncate">
                          {order.tableOrName}
                        </h4>
                        <span className="text-[11px] font-bold text-slate-500 font-mono">
                          Order {order.orderNo}
                        </span>
                      </div>

                      {/* Status Badges */}
                      {isNew && (
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>New</span>
                        </div>
                      )}

                      {isAccepted && (
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Accepted</span>
                        </div>
                      )}

                      {isPaymentDone && (
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-teal-50 text-[#2d8f63] border border-emerald-300/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
                          <Check className="w-3.5 h-3.5 text-[#52b788] stroke-[3]" />
                          <span>Paid · {order.paymentMethod || 'UPI / QR'}</span>
                        </div>
                      )}
                    </div>

                    {/* Date & Time Row */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-4">
                      <span>{order.dateStr}</span>
                      <span className="font-mono">{order.timeStr}</span>
                    </div>

                    {/* Items Table Header */}
                    <div className="grid grid-cols-12 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      <span className="col-span-7">Items</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-3 text-right">Price</span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 text-xs font-bold text-slate-800 px-1 items-center"
                        >
                          <span className="col-span-7 truncate">{item.name}</span>
                          <span className="col-span-2 text-center text-slate-500 font-mono">
                            {item.qty}
                          </span>
                          <span className="col-span-3 text-right font-mono text-slate-900">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Total Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Total
                        </span>
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 underline font-semibold cursor-pointer"
                        >
                          View Bill
                        </button>
                      </div>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        ₹{order.total}
                      </span>
                    </div>

                    {/* Action Area based on Lifecycle Stage */}
                    {isNew && (
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={(e) => handleReject(order.id, e)}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={(e) => handleAccept(order.id, e)}
                          className="py-2.5 px-3 bg-[#e57e7c] hover:bg-[#d9706e] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Accept</span>
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="space-y-2 pt-1 border-t border-slate-100/80">
                        {/* Payment Options Selection */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Payment Method</span>
                          <span className="text-[#2d8f63] font-black lowercase">{currentPaymentMethod}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          {(['UPI / QR', 'Card', 'Cash'] as const).map((method) => {
                            const isChosen = currentPaymentMethod === method;
                            return (
                              <button
                                key={method}
                                type="button"
                                onClick={(e) => handleSelectPaymentMethod(order.id, method, e)}
                                className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                                  isChosen
                                    ? 'bg-emerald-50 border-[#52b788] text-[#2d8f63] shadow-2xs font-extrabold ring-1 ring-[#52b788]/20'
                                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
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

                        {/* Mark as Payment Done Button */}
                        <button
                          onClick={(e) => handleMarkAsPaymentDone(order.id, e)}
                          className="w-full mt-2 py-2.5 px-3 bg-[#52b788] hover:bg-[#43a276] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Mark as Payment Done</span>
                        </button>
                      </div>
                    )}

                    {isPaymentDone && (
                      <div className="space-y-2.5 pt-1 border-t border-slate-100/80">
                        {/* Verified Payment Summary */}
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-[#52b788] shrink-0" />
                            <span>Payment Settled</span>
                          </div>
                          <span className="font-mono font-black text-emerald-900 bg-white px-2 py-0.5 rounded-lg border border-emerald-200/90 text-[11px] shadow-2xs">
                            {order.paymentMethod || 'UPI / QR'}
                          </span>
                        </div>

                        {/* Mark as Completed Button */}
                        <button
                          onClick={(e) => handleMarkAsCompleted(order, e)}
                          className="w-full py-2.5 px-3 bg-[#52b788] hover:bg-[#43a276] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Mark as Completed</span>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedReceiptOrder(null)} />

          <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 text-slate-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#52b788]" />
                <h3 className="text-lg font-black font-display text-slate-900">
                  QR Order Bill {selectedReceiptOrder.orderNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Customer / Table:</span>
                  <span className="font-bold text-slate-800">{selectedReceiptOrder.tableOrName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Order Time:</span>
                  <span className="font-bold text-slate-800">
                    {selectedReceiptOrder.timeStr} ({selectedReceiptOrder.dateStr})
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-700">{selectedReceiptOrder.status}</span>
                </div>
                {selectedReceiptOrder.paymentMethod && (
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Method:</span>
                    <span className="font-bold text-emerald-800 font-mono">
                      {selectedReceiptOrder.paymentMethod}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-100 flex justify-between">
                  <span>Item</span>
                  <span>Qty & Price</span>
                </div>
                {selectedReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center font-bold text-slate-800">
                    <span>{item.name}</span>
                    <span className="font-mono text-slate-600">
                      {item.qty} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-black font-mono text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[#2d8f63] font-bold">₹{selectedReceiptOrder.total}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-[#52b788] hover:bg-[#409a71] text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
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
