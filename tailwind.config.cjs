// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'soft-dark': '0 2px 8px rgba(0,0,0,0.2)',
        'glow-blue': '0 0 20px rgba(91, 192, 248, 0.3)',
        'glow-purple': '0 0 20px rgba(162, 89, 255, 0.3)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
      colors: {
        // Tema Dark
        dark: {
          bg: '#121826',
          card: '#1E2636',
          text: '#E6EAF0',
          muted: '#9CA3AF',
        },
        // Cores de destaque
        accent: {
          blue: '#5BC0F8',
          purple: '#A259FF',
          red: '#FF6B6B',
          yellow: '#FFD93D',
        },
        brand: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#60a5fa',
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
      transitionTimingFunction: {
        'ease-in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
