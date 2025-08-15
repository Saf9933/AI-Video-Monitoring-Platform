// src/styles/tokens.ts
export const space = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
} as const;

export const radius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  card: '0.75rem', // 12px
  xl: '1rem',      // 16px
} as const;

export const colors = {
  // Background colors
  bg: 'bg-slate-950',
  bgCard: 'bg-slate-900/60',
  bgCardHover: 'bg-slate-900/80',
  bgSidebar: 'bg-slate-900/80',
  bgHeader: 'bg-slate-900/70',
  
  // Border colors
  border: 'border-slate-800',
  borderCard: 'border-slate-700',
  borderActive: 'border-slate-600',
  
  // Text colors
  textPrimary: 'text-slate-100',
  textSecondary: 'text-slate-200',
  textMuted: 'text-slate-400',
  textDimmed: 'text-slate-500',
} as const;

export const text = {
  // Heading styles - made more compact and white
  h1: 'text-lg lg:text-xl font-bold text-white',
  h2: 'text-base lg:text-lg font-bold text-white', 
  h3: 'text-sm lg:text-base font-semibold text-white',
  h4: 'text-xs lg:text-sm font-semibold text-slate-200',
  
  // Body text - made more compact
  body: 'text-sm text-slate-200',
  bodyMuted: 'text-sm text-slate-400',
  caption: 'text-xs text-slate-400',
  
  // Numbers and metrics - made more compact
  metric: 'text-lg lg:text-xl font-bold text-slate-100',
  metricLarge: 'text-xl lg:text-2xl font-bold text-slate-100',
  
  // Labels
  label: 'text-xs font-medium text-slate-300',
  labelMuted: 'text-[11px] text-slate-400',
} as const;

export const transitions = {
  default: 'transition-all duration-200',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-300',
} as const;

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-black/10',
  hover: 'hover:shadow-lg hover:shadow-black/20',
} as const;

// Component-specific tokens - more compact
export const card = {
  base: `rounded-${radius.card} border ${colors.borderCard} ${colors.bgCard} ${transitions.default}`,
  hover: `${shadows.hover} hover:${colors.bgCardHover}`,
  padding: space.sm,        // Reduced from space.md
  paddingLg: space.md,      // Reduced from space.lg
} as const;

export const button = {
  base: `${transitions.default} rounded-${radius.md} font-medium`,
  hover: 'hover:scale-[1.02]',
  active: 'active:scale-[0.98]',
} as const;

// New compact utility classes
export const cardBase = "rounded-xl bg-slate-900/60 border border-slate-700";
export const sectionTitle = "text-lg font-semibold tracking-tight text-white";
export const kpiNumber = "text-xl font-semibold text-slate-100";

// Additional component-specific utilities
export const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4", 
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;

export const layouts = {
  compactGrid: "gap-3",
  compactSpacing: "space-y-3",
  tightPadding: "p-3",
  microPadding: "p-2",
} as const;

export const animations = {
  pulse: "animate-pulse",
  bounce: "animate-bounce", 
  fadeIn: "transition-opacity duration-300",
  slideUp: "transform transition-transform duration-200 hover:-translate-y-0.5",
} as const;

// Chart color tokens for consistent theming
export const chartColors = {
  background: '#0B1220',
  card: '#141B2D',
  border: '#2A3446',
  textPrimary: '#E6EDF7',
  textSecondary: '#92A3B8',
  success: '#4ADE80',
  warning: '#F59E0B',
  danger: '#F87171',
  info: '#60A5FA',
  green: {
    main: '#4ADE80',
    light: '#6EE7B7',
    gradient: 'rgba(74, 222, 128, 0.2)',
  },
  blue: {
    main: '#60A5FA',
    light: '#93C5FD',
    gradient: 'rgba(96, 165, 250, 0.2)',
  },
  yellow: {
    main: '#F59E0B',
    light: '#FCD34D',
    gradient: 'rgba(245, 158, 11, 0.2)',
  },
  red: {
    main: '#F87171',
    light: '#FCA5A5',
    gradient: 'rgba(248, 113, 113, 0.2)',
  },
} as const;