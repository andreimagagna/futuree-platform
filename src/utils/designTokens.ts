/**
 * Design System Tokens
 * Sistema de design robusto para landing pages de alta conversão
 */

export const DesignTokens = {
  // Spacing System (8px grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Color Palette (Otimizada para conversão)
  colors: {
    primary: {
      50: 'hsl(25, 70%, 95%)',
      100: 'hsl(25, 65%, 90%)',
      200: 'hsl(25, 60%, 80%)',
      300: 'hsl(25, 55%, 70%)',
      400: 'hsl(25, 50%, 60%)',
      500: 'hsl(25, 40%, 35%)',  // Main brand
      600: 'hsl(25, 45%, 30%)',
      700: 'hsl(25, 50%, 25%)',
      800: 'hsl(25, 55%, 20%)',
      900: 'hsl(25, 60%, 15%)',
    },
    accent: {
      50: 'hsl(30, 20%, 95%)',
      100: 'hsl(30, 18%, 90%)',
      200: 'hsl(30, 15%, 80%)',
      300: 'hsl(30, 13%, 70%)',
      400: 'hsl(30, 11%, 60%)',
      500: 'hsl(30, 10%, 45%)',  // Main accent
      600: 'hsl(30, 12%, 40%)',
      700: 'hsl(30, 14%, 35%)',
      800: 'hsl(30, 16%, 30%)',
      900: 'hsl(30, 18%, 25%)',
    },
    success: {
      light: 'hsl(142, 76%, 90%)',
      DEFAULT: 'hsl(142, 76%, 36%)',
      dark: 'hsl(142, 76%, 25%)',
    },
    warning: {
      light: 'hsl(48, 100%, 90%)',
      DEFAULT: 'hsl(48, 100%, 50%)',
      dark: 'hsl(48, 100%, 35%)',
    },
    error: {
      light: 'hsl(0, 84%, 90%)',
      DEFAULT: 'hsl(0, 84%, 60%)',
      dark: 'hsl(0, 84%, 45%)',
    },
    neutral: {
      50: 'hsl(0, 0%, 98%)',
      100: 'hsl(0, 0%, 96%)',
      200: 'hsl(0, 0%, 93%)',
      300: 'hsl(0, 0%, 88%)',
      400: 'hsl(0, 0%, 74%)',
      500: 'hsl(0, 0%, 62%)',
      600: 'hsl(0, 0%, 46%)',
      700: 'hsl(0, 0%, 38%)',
      800: 'hsl(0, 0%, 26%)',
      900: 'hsl(0, 0%, 13%)',
    },
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows (Optimized for depth)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container Max Widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
};

// UX Best Practices Constants
export const UXBestPractices = {
  // CTA Best Practices
  cta: {
    minHeight: '48px', // Touch target size
    minWidth: '120px',
    recommendedText: [
      'Começar Grátis',
      'Experimente Agora',
      'Quero Testar',
      'Criar Conta',
      'Ver Demonstração',
      'Baixar Agora',
      'Agendar Demo',
    ],
    avoidText: [
      'Clique Aqui',
      'Enviar',
      'Submit',
      'Saiba Mais', // Muito genérico
    ],
  },

  // Form Best Practices
  form: {
    maxFields: 5, // Optimal for conversion
    requiredFields: ['email'], // Minimum viable
    recommendedFields: ['name', 'email', 'company'],
  },

  // Hero Section Best Practices
  hero: {
    headlineMaxChars: 60,
    subheadlineMaxChars: 120,
    ctaPosition: 'above-fold',
    hasVisual: true, // Image/Video increases conversion
  },

  // Social Proof Best Practices
  socialProof: {
    minTestimonials: 3,
    showPhotos: true,
    includeMetrics: true, // Numbers build trust
    displayLogos: true, // Brand association
  },

  // Pricing Best Practices
  pricing: {
    maxTiers: 3, // Don't overwhelm users
    highlightPopular: true,
    showAnnualSavings: true,
    includeFreeOption: true,
  },
};

// Conversion-Optimized Layouts
export const ConversionLayouts = {
  aboveFold: {
    height: '100vh',
    elements: ['headline', 'subheadline', 'cta', 'visual', 'trust-badges'],
    order: 'F-pattern', // Eye-tracking optimized
  },
  
  trustSection: {
    position: 'after-hero',
    elements: ['logos', 'stats', 'awards'],
    backgroundColor: 'neutral',
  },

  featureSection: {
    layout: 'alternating', // Text-Image-Text pattern
    maxFeatures: 6,
    showIcons: true,
  },

  pricingSection: {
    position: 'middle-to-end',
    highlightMiddleTier: true,
    showComparison: true,
  },

  ctaSection: {
    frequency: 'every-3-sections',
    style: 'full-width',
    includeGuarantee: true,
  },
};

export default DesignTokens;
