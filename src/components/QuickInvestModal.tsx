import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface QuickInvestModalProps {
  category: string | null;
  onClose: () => void;
  onConfirmInvest: (amount: number, title: string) => void;
}

export const QuickInvestModal: React.FC<QuickInvestModalProps> = ({
  category,
  onClose,
  onConfirmInvest,
}) => {
  const [amount, setAmount] = useState('1000');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    setIsSuccess(true);
    setTimeout(() => {
      onConfirmInvest(num, `Invested in ${category}`);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg font-display text-slate-900">
            Invest in {category}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#25a77b] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold font-display text-slate-900">Investment Confirmed!</h4>
            <p className="text-xs text-slate-500">
              Purchased ${parseFloat(amount).toLocaleString()} of {category}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-light text-slate-400 font-display">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold font-display text-slate-900 focus:outline-none focus:border-[#52b788]"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Estimated Yield:</span>
                <span className="font-bold text-emerald-600">+8.4% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span>Management Fee:</span>
                <span className="font-bold">0.0%</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#52b788] hover:bg-[#e0a21f] text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Confirm Investment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
