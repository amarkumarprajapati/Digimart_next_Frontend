'use client';

/* eslint-disable */
import { createContext, useContext, useMemo } from "react";
import theme from '@/config/theme.config';

const ThemeContext = createContext(theme);

/**
 * ThemeProvider component
 * Provides theme configuration to all child components
 */
export const ThemeProvider = ({ children }) => {
  const themeValue = useMemo(() => theme, []);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook
 * Access theme configuration from any component
 * 
 * @example
 * const theme = useTheme();
 * const primaryColor = theme.colors.primary.DEFAULT;
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * withTheme HOC
 * Wrap components to inject theme as a prop
 * 
 * @example
 * export default withTheme(MyComponent);
 */
export const withTheme = (Component) => {
  return (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeProvider;
