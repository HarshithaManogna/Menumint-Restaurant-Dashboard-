import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Receipt as ReceiptIcon,
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

  // Local form state
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
    <div className="w-full space-y-6 animate-in fade-in duration-300 select-none pb-12 font-sans">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#52b788] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#439e74]">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <p className="font-extrabold text-sm leading-tight font-sans">Settings Saved Successfully</p>
          </div>
        </div>
      )}

      {/* Top Action Bar matching Waiter Calls & Online Orders */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 tracking-tight">
            Settings
          </h3>
        </div>
      </div>

      {/* Main Full-Width Container matching Waiter Calls & Online Orders */}
      <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-8 shadow-inner font-sans min-h-[580px] flex flex-col justify-center">
        {/* Elevated White Card */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Horizontal Stepper */}
          <div className="max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8 px-1 sm:px-6 w-full">
            <div className="relative flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = activeStep > step.id;
                const isCurrent = activeStep === step.id;
                const isLast = index === STEPS.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Item */}
                    <div className="flex flex-col items-center relative z-10">
                      <button
                        type="button"
                        onClick={() => setActiveStep(step.id)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer font-sans ${
                          isCompleted
                            ? 'bg-[#52b788] text-white shadow-md shadow-emerald-200/50'
                            : isCurrent
                            ? 'bg-[#e57e7c] text-white ring-4 ring-[#e57e7c]/25 shadow-md shadow-rose-200/50 scale-105'
                            : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : step.id}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(step.id)}
                        className={`mt-1.5 text-[10px] sm:text-xs font-bold text-center transition-colors cursor-pointer font-sans leading-tight max-w-[65px] sm:max-w-none ${
                          isCurrent
                            ? 'text-[#e57e7c] font-black'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {step.title}
                      </button>
                    </div>

                    {/* Horizontal Connector Line */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-1 sm:mx-3 -translate-y-3 sm:-translate-y-3.5 transition-colors ${
                          activeStep > step.id ? 'bg-[#52b788]' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Section Header with subtle divider line */}
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e57e7c]" />
              <h3 className="text-xs font-black font-sans text-slate-800 uppercase tracking-wider">
                {STEPS.find((s) => s.id === activeStep)?.title.toUpperCase()}
              </h3>
            </div>
            <span className="text-[11px] font-bold font-sans text-slate-400">Step {activeStep} of 4</span>
          </div>

          {/* FORM CONTENT */}
          <div className="space-y-4 sm:space-y-5">
            {/* STEP 1: Store Details */}
            {activeStep === 1 && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
                {/* Restaurant Name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Restaurant Name
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.restaurantName}
                      onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                      placeholder="Enter restaurant name"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-sans font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Phone Number
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Branch Location */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Branch Location
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.branchLocation}
                      onChange={(e) => handleInputChange('branchLocation', e.target.value)}
                      placeholder="Enter branch location"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-sans font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Number of Tables */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Number of Tables
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formData.numberOfTables}
                      onChange={(e) =>
                        handleInputChange('numberOfTables', Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-32 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Cafe Logo */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-2 sm:gap-4 pt-2 border-t border-slate-100">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Cafe Logo
                  </label>
                  <div className="sm:col-span-8 flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-full ring-2 ring-slate-200 overflow-hidden shadow-xs shrink-0 bg-slate-100">
                      <img
                        src={formData.logoUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80'}
                        alt="Cafe Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload New Logo</span>
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
                      <p className="text-[10px] text-slate-400 mt-1">Appears in header avatar and printed receipts</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Account Details */}
            {activeStep === 2 && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
                {/* Bank Name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Bank Name
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      placeholder="e.g. HDFC Bank, ICICI Bank"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-sans font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Account Number */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Account Number
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      placeholder="Enter account number"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* UPI ID */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    UPI ID for Quick Payments
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      placeholder="e.g. restaurant@upi"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Tax Details */}
            {activeStep === 3 && (
              <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
                {/* GSTIN */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    GST Registration ID
                  </label>
                  <div className="sm:col-span-8 w-full">
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                      placeholder="e.g. 29AABCU9603R1ZM"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all placeholder-slate-400 uppercase tracking-wider"
                    />
                  </div>
                </div>

                {/* Tax Percentage */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-start sm:items-center gap-1.5 sm:gap-4">
                  <label className="sm:col-span-4 text-xs font-bold font-sans text-slate-700">
                    Tax Percentage (%)
                  </label>
                  <div className="sm:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 w-full">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      value={formData.taxPercentage}
                      onChange={(e) =>
                        handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)
                      }
                      className="w-28 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none transition-all"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[0, 5, 12, 18, 28].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => handleInputChange('taxPercentage', rate)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                            formData.taxPercentage === rate
                              ? 'bg-[#e57e7c] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

            {/* STEP 4: Receipt & Summary */}
            {activeStep === 4 && (
              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start animate-in fade-in duration-200">
                {/* Left Column: Receipt Controls */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Receipt Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold font-sans text-slate-700">
                      Receipt Title
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={formData.receiptTitle}
                        onChange={(e) => handleInputChange('receiptTitle', e.target.value)}
                        placeholder="e.g. TAX INVOICE"
                        className="flex-1 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-sans font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                      />
                      <div className="flex gap-1 flex-wrap shrink-0">
                        {['TAX INVOICE', 'CASH BILL', 'RECEIPT'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleInputChange('receiptTitle', preset)}
                            className={`text-[10px] font-bold font-sans px-2.5 py-1.5 sm:py-2 rounded-xl border transition-all cursor-pointer ${
                              formData.receiptTitle === preset
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Receipt Greeting */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold font-sans text-slate-700">
                      Receipt Greeting
                    </label>
                    <input
                      type="text"
                      value={formData.receiptGreeting}
                      onChange={(e) => handleInputChange('receiptGreeting', e.target.value)}
                      placeholder="e.g. Thank you for dining with us! Please visit again."
                      className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs font-sans font-semibold text-slate-800 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Right Column: Live Receipt Preview Card */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 sm:p-5">
                    <div className="w-full bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs text-slate-800 space-y-3 text-xs font-sans">
                      <div className="text-center pb-2 border-b border-dashed border-slate-200">
                        <span className="inline-block px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-extrabold uppercase mb-1 font-sans">
                          {formData.receiptTitle || 'TAX INVOICE'}
                        </span>
                        <h4 className="font-black font-display text-slate-900 text-sm leading-tight break-words">
                          {formData.restaurantName || 'Restaurant Name'}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-sans break-words">
                          {formData.branchLocation || 'Branch Location'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono break-all">
                          Tel: {formData.phoneNumber || 'Phone'} · GSTIN: {formData.gstin || 'N/A'}
                        </p>
                      </div>

                      <div className="space-y-1 text-[11px] pb-2 border-b border-slate-100 font-sans">
                        <div className="flex justify-between text-slate-500">
                          <span>GST ({formData.taxPercentage}%):</span>
                          <span className="font-mono font-bold text-slate-800">
                            ₹{Math.round(500 * (formData.taxPercentage / 100))}
                          </span>
                        </div>
                        <div className="flex justify-between font-black text-slate-900 pt-1">
                          <span>Grand Total:</span>
                          <span className="font-mono text-[#e57e7c] font-black">
                            ₹{500 + Math.round(500 * (formData.taxPercentage / 100))}
                          </span>
                        </div>
                      </div>

                      <div className="bg-emerald-50/60 rounded-lg p-2.5 text-[10px] space-y-0.5 border border-emerald-100 font-sans">
                        <div className="font-bold text-emerald-800 truncate">
                          UPI: <span className="font-mono font-semibold">{formData.upiId}</span>
                        </div>
                        <div className="text-emerald-700 truncate font-semibold">
                          Bank: {formData.bankName}
                        </div>
                      </div>

                      <p className="text-[10px] font-medium text-center text-slate-500 italic font-sans break-words">
                        "{formData.receiptGreeting}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons matching reference image */}
          <div className="max-w-3xl lg:max-w-4xl mx-auto mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="text-xs font-bold font-sans text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100"
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
                className="px-6 py-2.5 bg-[#52b788] hover:bg-[#439e74] text-white font-bold font-sans text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-200/50 flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-6 py-2.5 bg-[#e57e7c] hover:bg-[#d9706e] text-white font-bold font-sans text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-rose-200/50 flex items-center gap-1.5"
              >
                <span>Save & Apply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsConfirmModalOpen(false)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-slate-800 z-10 animate-in zoom-in-95 duration-200">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center mb-3.5">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-black font-display text-slate-900 tracking-tight">
              Confirm Settings Update
            </h3>
            <p className="text-xs text-slate-500 font-sans font-medium mt-1 leading-relaxed">
              Are you sure you want to apply these updates to your billing headers, table counts, and tax rates?
            </p>

            <div className="mt-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 space-y-1.5 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Restaurant:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">
                  {formData.restaurantName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tables:</span>
                <span className="font-mono font-bold text-[#52b788]">
                  {formData.numberOfTables} Tables
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tax:</span>
                <span className="font-mono font-bold text-slate-800">{formData.taxPercentage}% GST</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Receipt Title:</span>
                <span className="font-bold text-slate-800">{formData.receiptTitle}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-sans text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 py-2 bg-[#e57e7c] hover:bg-[#d9706e] text-white font-bold font-sans text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
