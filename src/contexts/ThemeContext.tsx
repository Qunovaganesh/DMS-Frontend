import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';

interface ThemeContextType {
  isDark: boolean;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  getThemeColors: () => {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    light: string;
    dark: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  blue: {
    primary: '#1890ff',
    secondary: '#40a9ff',
    accent: '#096dd9',
    gradient: 'from-blue-500 to-indigo-600',
    light: 'from-blue-50 to-blue-100',
    dark: 'from-blue-900/20 to-blue-800/20'
  },
  green: {
    primary: '#52c41a',
    secondary: '#73d13d',
    accent: '#389e0d',
    gradient: 'from-green-500 to-emerald-600',
    light: 'from-green-50 to-green-100',
    dark: 'from-green-900/20 to-green-800/20'
  },
  purple: {
    primary: '#722ed1',
    secondary: '#9254de',
    accent: '#531dab',
    gradient: 'from-purple-500 to-violet-600',
    light: 'from-purple-50 to-purple-100',
    dark: 'from-purple-900/20 to-purple-800/20'
  },
  orange: {
    primary: '#fa8c16',
    secondary: '#ffa940',
    accent: '#d46b08',
    gradient: 'from-orange-500 to-amber-600',
    light: 'from-orange-50 to-orange-100',
    dark: 'from-orange-900/20 to-orange-800/20'
  },
  red: {
    primary: '#f5222d',
    secondary: '#ff4d4f',
    accent: '#cf1322',
    gradient: 'from-red-500 to-rose-600',
    light: 'from-red-50 to-red-100',
    dark: 'from-red-900/20 to-red-800/20'
  },
  teal: {
    primary: '#13c2c2',
    secondary: '#36cfc9',
    accent: '#08979c',
    gradient: 'from-teal-500 to-cyan-600',
    light: 'from-teal-50 to-teal-100',
    dark: 'from-teal-900/20 to-teal-800/20'
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('bizz_theme');
    const savedColorTheme = localStorage.getItem('bizz_color_theme') as ColorTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme ? savedTheme === 'dark' : prefersDark;
    const color = savedColorTheme || 'blue';
    
    setIsDark(theme);
    setColorTheme(color);
    
    if (theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set CSS custom properties for the theme
    const colors = themeColors[color];
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-accent', colors.accent);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('bizz_theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSetColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    localStorage.setItem('bizz_color_theme', theme);
    
    // Update CSS custom properties
    const colors = themeColors[theme];
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-accent', colors.accent);
  };

  const getThemeColors = () => themeColors[colorTheme];

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      colorTheme, 
      toggleTheme, 
      setColorTheme: handleSetColorTheme, 
      getThemeColors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};