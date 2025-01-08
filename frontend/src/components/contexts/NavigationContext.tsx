// contexts/NavigationContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  showSidebar: boolean;
  showMobileMenu: boolean;
  categories: any[];
  setShowSidebar: (show: boolean) => void;
  setShowMobileMenu: (show: boolean) => void;
  setCategories: (categories: any[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  return (
    <NavigationContext.Provider value={{
      showSidebar,
      showMobileMenu,
      categories,
      setShowSidebar,
      setShowMobileMenu,
      setCategories,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
