export const theme = {
  colors: {
    bg: '#F6F7FB',
    surface: '#FFFFFF',
    text: '#101828',
    textSecondary: '#475467',
    border: '#E4E7EC',
    tint: '#2563EB',
    tintSoft: '#E8F0FF',
    danger: '#D92D20',
    shadow: 'rgba(16,24,40,0.10)',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    pill: 999,
  },
  space: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  textSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
  shadow: {
    card: {
      shadowColor: '#101828',
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 4,
    },
  },
} as const;

export type Theme = typeof theme;

