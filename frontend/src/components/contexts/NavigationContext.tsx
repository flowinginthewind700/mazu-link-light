'use client'
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// 定义一个 Category 类型
interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface NavigationContextType {
  showSidebar: boolean;
  showMobileMenu: boolean;
  categories: Category[];
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  setShowMobileMenu: Dispatch<SetStateAction<boolean>>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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
