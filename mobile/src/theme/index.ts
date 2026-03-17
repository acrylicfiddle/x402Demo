export const colors = {
  primary: '#FF4F00',      // Runna-style orange
  primaryDark: '#CC3F00',
  secondary: '#1A1A2E',    // Deep navy
  background: '#0F0F1A',   // Dark background
  surface: '#1E1E30',      // Card surface
  surfaceLight: '#2A2A40',
  text: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#606080',
  success: '#00C896',
  warning: '#FFB800',
  error: '#FF4444',
  easy: '#00C896',         // green for easy runs
  tempo: '#FFB800',        // orange for tempo
  intervals: '#FF4F00',    // red-orange for intervals
  longRun: '#6C63FF',      // purple for long runs
  rest: '#606080',         // grey for rest days
  cross: '#00B4D8',        // blue for cross training
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  h4: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};
