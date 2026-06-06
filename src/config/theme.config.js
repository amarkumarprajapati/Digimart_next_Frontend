export const themeColors = {
  // Light mode
  primary: {
    DEFAULT: '#088395',
    dark: '#09637E',
    light: '#7AB2B2',
    lighter: '#EBF4F6',
  },
  secondary: {
    DEFAULT: '#7AB2B2',
    dark: '#5A9292',
    light: '#9AC5C5',
  },
  accent: {
    DEFAULT: '#088395',
    hover: '#09637E',
  },
  background: {
    DEFAULT: '#EBF4F6',
    light: '#FFFFFF',
    dark: '#F8FBFC',
  },
  
  // Dark mode specific (when dark class is applied)
  darkMode: {
    background: {
      primary: '#0F172A',      // Very dark blue-gray
      secondary: '#1E293B',    // Dark slate
      tertiary: '#334155',     // Slightly lighter slate
      card: '#1A2332',         // Dark blue
      hover: '#293548',        // Hover state
    },
    text: {
      primary: '#F1F5F9',      // Almost white
      secondary: '#CBD5E1',    // Light gray
      tertiary: '#94A3B8',     // Medium gray
      muted: '#64748B',        // Muted gray
    },
    border: {
      DEFAULT: '#334155',      // Dark slate
      light: '#475569',        // Light slate
    },
    accent: {
      DEFAULT: '#0EA5E9',      // Bright cyan/blue
      hover: '#06B6D4',        // Bright teal
      light: '#38BDF8',        // Light cyan
    }
  }
};

export const theme = {
  colors: themeColors,
  
  // Spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(8, 131, 149, 0.05)',
    md: '0 4px 6px -1px rgba(8, 131, 149, 0.1)',
    lg: '0 10px 15px -3px rgba(8, 131, 149, 0.1)',
    xl: '0 20px 25px -5px rgba(8, 131, 149, 0.1)',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default theme;
