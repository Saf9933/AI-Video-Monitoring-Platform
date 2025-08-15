// Enhanced theme tokens for consistent styling across the application
// Extracted from homepage patterns and centralized for easy maintenance

// Core color palette - dark theme focused
export const colors = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Secondary palette (emerald/green)
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main secondary
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // Accent colors
  accent: {
    blue: '#60a5fa',
    green: '#4ade80',
    yellow: '#f59e0b',
    red: '#f87171',
    purple: '#a78bfa',
  },

  // Status colors
  status: {
    success: '#4ade80',
    warning: '#f59e0b', 
    error: '#f87171',
    info: '#60a5fa',
  },

  // Grayscale for dark theme
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Slate palette (primary grayscale)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
} as const;

// CSS Custom Properties for runtime theme consistency
export const cssVars = {
  // Primary colors
  '--color-primary': colors.primary[500],
  '--color-primary-light': colors.primary[400], 
  '--color-primary-dark': colors.primary[600],
  
  // Secondary colors
  '--color-secondary': colors.secondary[500],
  '--color-secondary-light': colors.secondary[400],
  '--color-secondary-dark': colors.secondary[600],

  // Background colors  
  '--color-bg-primary': colors.slate[950],
  '--color-bg-secondary': colors.slate[900],
  '--color-bg-card': 'rgba(15, 23, 42, 0.6)', // slate-900/60
  '--color-bg-card-hover': 'rgba(15, 23, 42, 0.8)', // slate-900/80
  '--color-bg-sidebar': 'rgba(15, 23, 42, 0.8)', // slate-900/80
  '--color-bg-header': 'rgba(15, 23, 42, 0.7)', // slate-900/70

  // Border colors
  '--color-border-primary': colors.slate[800],
  '--color-border-secondary': colors.slate[700],
  '--color-border-active': colors.slate[600],

  // Text colors
  '--color-text-primary': colors.slate[100],
  '--color-text-secondary': colors.slate[200], 
  '--color-text-muted': colors.slate[400],
  '--color-text-dimmed': colors.slate[500],

  // Status colors
  '--color-success': colors.status.success,
  '--color-warning': colors.status.warning,
  '--color-error': colors.status.error,
  '--color-info': colors.status.info,
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

// Spacing scale
export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const;

// Border radius
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadow definitions
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// Animation and transitions
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms', 
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

// Component tokens
export const components = {
  card: {
    background: 'bg-slate-900/60',
    border: 'border-slate-700',
    borderRadius: 'rounded-xl',
    padding: 'p-6',
    hover: 'hover:bg-slate-900/80',
    shadow: 'shadow-lg shadow-black/10',
  },
  button: {
    primary: {
      background: 'bg-primary-500 hover:bg-primary-600',
      text: 'text-white',
      border: 'border-transparent',
    },
    secondary: {
      background: 'bg-slate-800 hover:bg-slate-700',
      text: 'text-slate-200',
      border: 'border-slate-600',
    },
    ghost: {
      background: 'hover:bg-slate-800/50',
      text: 'text-slate-300',
      border: 'border-transparent',
    }
  },
  input: {
    background: 'bg-slate-900/80',
    border: 'border-slate-700 focus:border-slate-500',
    text: 'text-slate-100',
    placeholder: 'placeholder-slate-400',
    ring: 'focus:ring-2 focus:ring-primary-500/20',
  }
} as const;

// Utility function to apply CSS variables
export function applyCssVars() {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

// Theme consistency check utility
export function checkThemeConsistency(): boolean {
  if (typeof window === 'undefined') return true;
  
  const computedStyle = getComputedStyle(document.documentElement);
  const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
  
  return primaryColor === colors.primary[500];
}

// Export default theme object
export const theme = {
  colors,
  cssVars,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  animation,
  components,
} as const;

export default theme;