import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const [activeTheme, setActiveTheme] = useState(() => getSystemTheme());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      const resolvedTheme = isSystemDark ? 'dark' : 'light';
      setActiveTheme(resolvedTheme);

      const root = document.documentElement;
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
      localStorage.setItem('lf_theme_mode', 'system');
      localStorage.setItem('lf_theme', resolvedTheme);
    };

    applyTheme();

    const handleSystemChange = () => {
      applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const isDark = activeTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

