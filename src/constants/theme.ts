/**
 * Rehoboth Assembly Hymn Book — Design Token System
 * Royal Blue + Deep Navy + Rehoboth Gold + White
 * Mirrors efik-hymn-book's CSS custom properties.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Surfaces
    background: '#f4f6f8',
    surface: '#ffffff',
    surfaceSecondary: '#ecf0f5',
    surfaceElevated: '#ffffff',

    // Text
    text: '#0a1f3d',
    textSecondary: '#46586f',
    subtleText: '#7b8ba1',

    // Borders
    border: '#dde3eb',
    borderStrong: '#c2ccd9',

    // Brand — Royal Blue
    primary: '#0b3d91',
    primaryHover: '#093378',
    primaryForeground: '#ffffff',
    primarySoft: '#e8eef9',
    primarySoftBorder: '#c4d3ee',

    // Rehoboth Gold
    gold: '#d4af37',
    goldStrong: '#be9427',
    onGold: '#062b63',

    // Accent (gold on light surfaces)
    accent: '#8a6a17',
    accentMuted: '#f6efdb',

    // Feedback
    success: '#1f7a46',
    successSoft: '#e2f2e8',
    danger: '#b3362a',
    dangerSoft: '#f9e7e4',

    // Legacy aliases for backward compatibility
    backgroundElement: '#e8eef9',
    backgroundSelected: '#E0E1E6',
  },
  dark: {
    // Surfaces — deep navy family, never pure black
    background: '#061224',
    surface: '#0a1b33',
    surfaceSecondary: '#102743',
    surfaceElevated: '#16305a',

    // Text
    text: '#eaf0f9',
    textSecondary: '#a9b8ce',
    subtleText: '#7c8da6',

    // Borders
    border: '#1d3357',
    borderStrong: '#2e4a75',

    // Brand
    primary: '#2c55a8',
    primaryHover: '#3b6ac2',
    primaryForeground: '#ffffff',
    primarySoft: '#12274a',
    primarySoftBorder: '#24437a',

    // Gold (brighter on dark)
    gold: '#e2c15c',
    goldStrong: '#efd384',
    onGold: '#062b63',

    // Accent
    accent: '#e2c15c',
    accentMuted: '#26200f',

    // Feedback
    success: '#5cb98a',
    successSoft: '#10281c',
    danger: '#e87b6e',
    dangerSoft: '#321a16',

    // Legacy aliases for backward compatibility
    backgroundElement: '#12274a',
    backgroundSelected: '#1d3357',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Courier New',
  },
  android: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// Bottom tab height for safe-area-aware content padding
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
