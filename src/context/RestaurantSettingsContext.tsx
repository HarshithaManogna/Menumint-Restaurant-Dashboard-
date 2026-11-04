import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RestaurantSettings {
  // Step 1: Store Details
  restaurantName: string;
  phoneNumber: string;
  branchLocation: string;
  numberOfTables: number;
  logoUrl?: string;

  // Step 2: Account Details
  bankName: string;
  accountNumber: string;
  upiId: string;

  // Step 3: Tax Details
  gstin: string;
  taxPercentage: number;

  // Step 4: Receipt Settings
  receiptTitle: string;
  receiptGreeting: string;
}

export const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: 'MenuMint Matcha & Cafe',
  phoneNumber: '+91 98765 43210',
  branchLocation: 'Indiranagar 100ft Road, Bengaluru',
  numberOfTables: 16,
  logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80',

  bankName: 'HDFC Bank',
  accountNumber: '50200034891244',
  upiId: 'menumint@okhdfcbank',

  gstin: '29AABCU9603R1ZM',
  taxPercentage: 5,

  receiptTitle: 'TAX INVOICE',
  receiptGreeting: 'Thank you for dining with us! Please visit again 😊',
};

const STORAGE_KEY = 'menumint_restaurant_settings_v1';

interface RestaurantSettingsContextType {
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  resetToDefaults: () => void;
}

const RestaurantSettingsContext = createContext<RestaurantSettingsContextType | undefined>(undefined);

export const RestaurantSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <RestaurantSettingsContext.Provider value={{ settings, updateSettings, resetToDefaults }}>
      {children}
    </RestaurantSettingsContext.Provider>
  );
};

export const useRestaurantSettings = () => {
  const context = useContext(RestaurantSettingsContext);
  if (!context) {
    throw new Error('useRestaurantSettings must be used within a RestaurantSettingsProvider');
  }
  return context;
};
