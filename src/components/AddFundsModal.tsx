import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Check } from 'lucide-react';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: number, note: string) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState<string>('3500');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'crypto'>('card');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSuccess(true);
    setTimeout(() => {
      onAdd(numAmount, 'Funds Loaded');
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-slate-100 relative text-slate-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#fef6e4] text-[#52b788] flex items-center justify-center font-bold">
              $
            </div>
            <div>
              <h3 className="font-bold text-lg font-display text-slate-900">Add Funds</h3>
              <p className="text-xs text-slate-500">Deposit money directly to Your Wallet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#25a77b] flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold font-display text-slate-900">Funds Loaded Successfully!</h4>
            <p className="text-sm text-slate-500">
              +${parseFloat(amount).toLocaleString()} added to your account wallet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Deposit Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-slate-400 font-display">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold font-display text-slate-900 focus:outline-none focus:border-[#52b788] focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-2 mt-2.5">
                {['500', '1000', '3500', '5000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      amount === val
                        ? 'bg-[#52b788] text-white border-[#52b788]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    +${parseInt(val).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'card'
                      ? 'border-[#52b788] bg-[#fef9eb] text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#7bb2b2]" />
                  <span className="text-xs block">Card ••5678</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'bank'
                      ? 'border-[#52b788] bg-[#fef9eb] text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-[#52b788]" />
                  <span className="text-xs block">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('crypto')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedMethod === 'crypto'
                      ? 'border-[#52b788] bg-[#fef9eb] text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="w-5 h-5 mx-auto mb-1 block font-mono font-bold text-[#e5837f]">
                    ₿
                  </span>
                  <span className="text-xs block">Crypto Pay</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#52b788] hover:bg-[#e0a21f] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Confirm Deposit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
