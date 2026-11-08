import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { useRestaurantSettings, RestaurantSettings } from '../context/RestaurantSettingsContext';

const STEPS = [
  { id: 1, title: 'Store Details' },
  { id: 2, title: 'Account Details' },
  { id: 3, title: 'Tax Details' },
  { id: 4, title: 'Receipt' },
];

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useRestaurantSettings();

  const [formData, setFormData] = useState<RestaurantSettings>({ ...settings });
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleInputChange = (field: keyof RestaurantSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleConfirmSave = () => {
    updateSettings(formData);
    setIsConfirmModalOpen(false);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-4 animate-in fade-in duration-300 select-none overflow-hidden font-sans">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#313b68] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#e6f6ec] shrink-0" />
            <p className="font-semibold text-xs leading-tight">Settings saved</p>
          </div>
        </div>
      )}

      {/* Fixed Top Header Card */}
      <div className="shrink-0 bg-white rounded-[28px] px-6 py-4 shadow-[0_8px_28px_rgba(20,25,45,0.04)] flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-[#1a1f36] tracking-[-0.01em]">
            Store Settings
          </h3>
          <p className="text-xs text-[#8c93a4] font-medium mt-0.5">
            Configure restaurant profile, bank settlement, GST rates, and invoice layout
          </p>
        </div>
      </div>

      {/* Scrollable Main Settings Card */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4">
      <div className="w-full bg-white rounded-[28px] shadow-[0_8px_28px_rgba(20,25,45,0.04)] p-6 sm:p-10 space-y-8">
        {/* Horizontal Stepper */}
        <div className="max-w-3xl mx-auto px-2 sm:px-6 w-full">
          <div className="relative flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = activeStep > step.id;
              const isCurrent = activeStep === step.id;
              const isLast = index === STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <button
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#e6f6ec] text-[#229a54]'
                          : isCurrent
                          ? 'bg-[#313b68] text-white shadow-[0_4px_14px_rgba(49,59,104,0.25)] scale-105'
                          : 'bg-[#f7f8fa] text-[#8c93a4] hover:text-[#1a1f36]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.id}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className={`mt-2 text-[11px] sm:text-xs font-medium text-center transition-colors cursor-pointer ${
                        isCurrent
                          ? 'text-[#1a1f36] font-semibold'
                          : isCompleted
                          ? 'text-[#229a54] font-semibold'
                          : 'text-[#8c93a4] hover:text-[#1a1f36]'
                      }`}
                    >
                      {step.title}
                    </button>
                  </div>

                  {!isLast && (
                    <div
                      className={`flex-1 h-[2px] mx-2 sm:mx-4 -translate-y-3.5 transition-colors ${
                        activeStep > step.id ? 'bg-[#229a54]/40' : 'bg-[#eff1f6]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mx-auto border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1a1f36]">
            {STEPS.find((s) => s.id === activeStep)?.title}
          </h3>
          <span className="text-xs font-medium text-[#8c93a4]">Step {activeStep} of 4</span>
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto space-y-4">
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Restaurant Name
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Phone Number
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] tabular-nums outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Branch Location
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.branchLocation}
                    onChange={(e) => handleInputChange('branchLocation', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Number of Tables
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.numberOfTables}
                    onChange={(e) =>
                      handleInputChange('numberOfTables', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-32 bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] tabular-nums outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4 pt-2">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Cafe Logo
                </label>
                <div className="sm:col-span-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e8ecf7] shrink-0">
                    <img
                      src={
                        formData.logoUrl ||
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80'
                      }
                      alt="Cafe Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#f7f8fa] hover:bg-[#eceff5] rounded-full text-xs font-semibold text-[#1a1f36] transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#313b68]" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                handleInputChange('logoUrl', reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Bank Name
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Account Number
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] tabular-nums outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  UPI ID
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  GST Registration ID
                </label>
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] uppercase outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-4 text-xs font-medium text-[#6e768a]">
                  Tax Percentage (%)
                </label>
                <div className="sm:col-span-8 flex flex-wrap items-center gap-2.5">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={formData.taxPercentage}
                    onChange={(e) =>
                      handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-28 bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] tabular-nums outline-none transition-colors"
                  />
                  <div className="flex items-center gap-1.5">
                    {[0, 5, 12, 18, 28].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleInputChange('taxPercentage', rate)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          formData.taxPercentage === rate
                            ? 'bg-[#313b68] text-white'
                            : 'bg-[#f7f8fa] text-[#6e768a] hover:text-[#1a1f36]'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#6e768a]">
                    Receipt Title
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={formData.receiptTitle}
                      onChange={(e) => handleInputChange('receiptTitle', e.target.value)}
                      className="flex-1 bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                    />
                    <div className="flex gap-1.5 shrink-0">
                      {['TAX INVOICE', 'CASH BILL', 'RECEIPT'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleInputChange('receiptTitle', preset)}
                          className={`text-[10px] font-semibold px-3 py-2 rounded-full transition-all cursor-pointer ${
                            formData.receiptTitle === preset
                              ? 'bg-[#313b68] text-white'
                              : 'bg-[#f7f8fa] text-[#6e768a] hover:text-[#1a1f36]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#6e768a]">
                    Receipt Greeting
                  </label>
                  <input
                    type="text"
                    value={formData.receiptGreeting}
                    onChange={(e) => handleInputChange('receiptGreeting', e.target.value)}
                    className="w-full bg-[#f7f8fa] focus:bg-[#eef0f6] rounded-2xl px-4 py-3 text-xs font-semibold text-[#1a1f36] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-[#f7f8fa] rounded-[24px] p-4">
                  <div className="w-full bg-white rounded-[20px] p-4 shadow-2xs text-[#1a1f36] space-y-3 text-xs">
                    <div className="text-center pb-2 border-b border-dashed border-slate-200">
                      <span className="inline-block px-2.5 py-0.5 bg-[#313b68] text-white rounded-full text-[9px] font-semibold uppercase mb-1">
                        {formData.receiptTitle || 'TAX INVOICE'}
                      </span>
                      <h4 className="font-semibold text-[#1a1f36] text-sm">
                        {formData.restaurantName || 'Restaurant Name'}
                      </h4>
                      <p className="text-[10px] text-[#8c93a4] mt-0.5">
                        {formData.branchLocation || 'Branch Location'}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] pb-2 border-b border-slate-100">
                      <div className="flex justify-between text-[#8c93a4]">
                        <span>GST ({formData.taxPercentage}%):</span>
                        <span className="tabular-nums font-semibold text-[#1a1f36]">
                          ₹{Math.round(500 * (formData.taxPercentage / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-[#1a1f36] pt-1">
                        <span>Grand Total:</span>
                        <span className="font-display text-sm text-[#313b68] tabular-nums">
                          ₹{500 + Math.round(500 * (formData.taxPercentage / 100))}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-center text-[#8c93a4] italic">
                      "{formData.receiptGreeting}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="text-xs font-semibold text-[#6e768a] hover:text-[#1a1f36] transition-colors cursor-pointer flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#f7f8fa] hover:bg-[#eceff5]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {activeStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="px-6 py-2.5 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Save & Apply</span>
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1f36]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsConfirmModalOpen(false)} />

          <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 shadow-[0_24px_60px_rgba(20,25,45,0.2)] text-[#1a1f36] z-10 animate-in zoom-in-95 duration-200">
            <div className="w-11 h-11 rounded-full bg-[#f5ebe1] text-[#6e5641] flex items-center justify-center mb-3.5">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-semibold text-[#1a1f36]">
              Confirm Settings Update
            </h3>
            <p className="text-xs text-[#8c93a4] mt-1 leading-relaxed">
              Apply these updates to your billing headers, table counts, and tax rates?
            </p>

            <div className="mt-4 bg-[#f7f8fa] rounded-[20px] p-4 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Restaurant:</span>
                <span className="font-semibold text-[#1a1f36] truncate max-w-[200px]">
                  {formData.restaurantName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Tables:</span>
                <span className="tabular-nums font-semibold text-[#313b68]">
                  {formData.numberOfTables} Tables
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8c93a4]">Tax:</span>
                <span className="tabular-nums font-semibold text-[#1a1f36]">{formData.taxPercentage}% GST</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 bg-[#f7f8fa] hover:bg-[#eceff5] text-[#1a1f36] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 bg-[#313b68] hover:bg-[#252e54] text-white font-semibold text-xs rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
