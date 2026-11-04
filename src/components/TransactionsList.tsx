import React from 'react';
import { ArrowRight, Plus, Minus, Wallet } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

interface TransactionsListProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onViewAll,
}) => {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100/80 shadow-xs">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-sm md:text-base font-display">
          Transactions
        </h3>
        <button
          onClick={onViewAll}
          className="text-slate-700 hover:text-slate-900 transition-colors p-1 group cursor-pointer"
          title="View all transactions"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2]" />
        </button>
      </div>

      {/* Transaction Items */}
      <div className="space-y-3">
        {transactions.map((tx) => {
          const isDeposit = tx.type === 'deposit';
          const formattedAmount =
            (isDeposit ? '+$' : '-$') +
            Math.abs(tx.amount).toLocaleString('en-US', {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            }).replace(',', '.');

          return (
            <div
              key={tx.id}
              className="bg-[#f0f6f6] p-3.5 rounded-[18px] flex items-center justify-between transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                {/* Icon Container */}
                <div className="w-9 h-9 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs shrink-0">
                  {isDeposit ? (
                    <Plus className="w-4 h-4 text-[#25a77b] stroke-[2.5]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                      <Minus className="w-2.5 h-2.5 text-slate-500 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <p className="text-[11px] font-medium text-slate-400 leading-tight">
                    {tx.date}
                  </p>
                  <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                    {tx.title}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div
                className={`text-xs md:text-sm font-bold font-mono tracking-tight ${
                  isDeposit ? 'text-[#25a77b]' : 'text-[#e5837f]'
                }`}
              >
                {formattedAmount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
