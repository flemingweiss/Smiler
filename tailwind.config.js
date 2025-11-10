/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          black: '#000000',
          'gray-900': '#111111',
          'gray-800': '#1A1A1A',
          'gray-700': '#2D2D2D',
          'gray-600': '#4A4A4A',
          'gray-500': '#6B7280',
          'gray-400': '#9CA3AF',
          'gray-300': '#D1D5DB',
          'gray-200': '#E5E7EB',
          'gray-100': '#F3F4F6',
          'gray-50': '#F9FAFB',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Rethink Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Be Vietnam Pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      lineHeight: {
        'relaxed-plus': '1.7',
        'loose-plus': '1.8',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 3s infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'flow': 'flow 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-30px) translateX(20px)' },
          '66%': { transform: 'translateY(-15px) translateX(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        flow: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) rotate(0deg)' },
          '33%': { transform: 'translateX(30%) translateY(-20%) rotate(120deg)' },
          '66%': { transform: 'translateX(-20%) translateY(30%) rotate(240deg)' },
        },
      },
      boxShadow: {
        'glass': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 20px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

