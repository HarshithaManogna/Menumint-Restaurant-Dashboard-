/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { MenuDishCardsSection, DishItem } from './components/MenuDishCardsSection';
import { TransactionsList, Transaction } from './components/TransactionsList';
import { GenerateBillCard, OrderItem } from './components/GenerateBillCard';
import { AddFundsModal } from './components/AddFundsModal';
import { QuickInvestModal } from './components/QuickInvestModal';
import { ReceiptModal, PastBill } from './components/ReceiptModal';
import { SalesReportView } from './components/SalesReportView';
import { WaiterCallsSection } from './components/WaiterCallsSection';
import { OnlineOrdersSection, OrderCard } from './components/OnlineOrdersSection';
import { SettingsView } from './components/SettingsView';
import { RestaurantSettingsProvider } from './context/RestaurantSettingsContext';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState('Billing');
  const [walletBalance, setWalletBalance] = useState(205500);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState<PastBill | null>(null);

  // Live completed QR orders that flow into the Sales Report
  const [completedQrBills, setCompletedQrBills] = useState<PastBill[]>([
    {
      id: 'qr-seed-1',
      billNo: '#INV-70916',
      tableNo: 'Morgan Cox (Table T-3)',
      dateTime: '02 Nov 2026, 06:19 PM',
      itemsSummary: '1x Vegetarian Pad Thai, 2x Shrimp Tacos, 1x Belgian Waffles',
      amount: 86.96,
      paymentMethod: 'UPI / QR',
      status: 'Paid',
      orderType: 'QR Order',
      itemsDetails: [
        { name: 'Vegetarian Pad Thai', qty: 1, price: 16.99, category: 'Bowls' },
        { name: 'Shrimp Tacos', qty: 2, price: 19.49, category: 'Special' },
        { name: 'Belgian Waffles', qty: 1, price: 38.98, category: 'Breakfast' },
      ],
    },
  ]);

  const handleCompleteQrOrder = (order: OrderCard) => {
    const rawNumber = order.orderNo.replace(/[^0-9]/g, '') || Math.floor(100 + Math.random() * 900);
    const newBill: PastBill = {
      id: `qr-${Date.now()}`,
      billNo: `#INV-70${rawNumber}`,
      tableNo: `${order.tableOrName} (QR Order)`,
      dateTime: `${order.dateStr}, ${order.timeStr}`,
      itemsSummary: order.items.map((i) => `${i.qty}x ${i.name}`).join(', '),
      amount: order.total,
      paymentMethod: order.paymentMethod || 'UPI / QR',
      status: 'Paid',
      orderType: 'QR Order',
      itemsDetails: order.items.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        category: 'Special',
      })),
    };
    setCompletedQrBills((prev) => [newBill, ...prev]);
  };

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 'dish-1',
      name: 'Yogurt Bowl',
      price: 240,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'dish-7',
      name: 'Avocado Toast',
      price: 260,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'dish-8',
      name: 'Iced Matcha Latte',
      price: 190,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const handleUpdateDishQuantity = (dish: DishItem, delta: number) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === dish.id || i.name.toLowerCase() === dish.title.toLowerCase());
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((_, idx) => idx !== existingIndex);
        }
        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      } else if (delta > 0) {
        return [
          ...prev,
          {
            id: dish.id,
            name: dish.title,
            price: dish.price,
            quantity: 1,
            image: dish.image,
          },
        ];
      }
      return prev;
    });
  };

  const handleUpdateOrderItemQuantity = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is OrderItem => item !== null)
    );
  };

  const [, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      date: '12 May 2023',
      title: 'Funds Loaded',
      amount: 3500,
      type: 'deposit',
    },
    {
      id: 'tx-2',
      date: '05 May 2023',
      title: 'Funds Withdraw',
      amount: 1300,
      type: 'withdrawal',
    },
  ]);

  const handleAddFunds = (amount: number, note: string) => {
    setWalletBalance((prev) => prev + amount);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      title: note || 'Funds Loaded',
      amount,
      type: 'deposit',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleConfirmInvest = (amount: number, title: string) => {
    if (walletBalance >= amount) {
      setWalletBalance((prev) => prev - amount);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        title,
        amount,
        type: 'withdrawal',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  return (
    <RestaurantSettingsProvider>
      {/* Fixed 100vh App Shell: Header stays locked at top, only internal content scrolls */}
      <div className="h-screen w-full overflow-hidden bg-[#eff1f6] text-[#1a1f36] font-sans flex justify-center">
        <div className="w-full max-w-[1600px] bg-[#eff1f6] h-screen overflow-hidden flex flex-col">
          {/* Fixed Top Header Section */}
          <HeaderBar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onlineOrdersCount={6}
            waiterCallsCount={4}
          />

          {/* Full-Width Workspace Content (Sidebar removed, Popular Dishes extended to left edge) */}
          <main className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-5 pt-1 overflow-hidden">
            {activeNav === 'Billing' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 h-full min-h-0 items-start">
                {/* Left Main Section: Popular Dishes (Fixed Card Header, Internal Scrolling Grid) */}
                <div className="lg:col-span-8 h-full min-h-0 flex flex-col">
                  <MenuDishCardsSection
                    orderItems={orderItems}
                    onUpdateDishQuantity={handleUpdateDishQuantity}
                    onNavigate={setActiveNav}
                  />
                </div>

                {/* Right Section: Generate Bill (Fixed Position, Compact Height) */}
                <div className="lg:col-span-4 max-h-full overflow-y-auto no-scrollbar">
                  <GenerateBillCard
                    orderItems={orderItems}
                    onUpdateQuantity={handleUpdateOrderItemQuantity}
                  />
                </div>
              </div>
            ) : activeNav === 'QR Orders' || activeNav === 'Online Orders' ? (
              <OnlineOrdersSection onCompleteOrder={handleCompleteQrOrder} />
            ) : activeNav === 'Waiter Calls' ? (
              <WaiterCallsSection />
            ) : activeNav === 'Sales Report' || activeNav === 'Past Bills' ? (
              <SalesReportView
                customBills={completedQrBills}
                onNewSaleClick={() => setActiveNav('Billing')}
              />
            ) : activeNav === 'Settings' ? (
              <SettingsView />
            ) : (
              <div className="py-8 px-4 text-center space-y-6">
                <button
                  onClick={() => setActiveNav('Billing')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#6e768a] hover:text-[#313b68] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Billing</span>
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        <AddFundsModal
          isOpen={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
          onAdd={handleAddFunds}
        />

        <QuickInvestModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onConfirmInvest={handleConfirmInvest}
        />

        <ReceiptModal
          bill={selectedReceiptBill}
          onClose={() => setSelectedReceiptBill(null)}
        />
      </div>
    </RestaurantSettingsProvider>
  );
}
