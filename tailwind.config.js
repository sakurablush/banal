/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        banal: {
          50: '#f8f7f4',
          100: '#f0ede6',
          200: '#e0d9cc',
          300: '#c9bfaa',
          400: '#b0a285',
          500: '#9a8a6e',
          600: '#82735c',
          700: '#6b5e4d',
          800: '#594e42',
          900: '#4b4239',
          950: '#28241f',
        },
        accent: {
          500: '#3b82f6', // warm trustworthy blue
          600: '#2563eb',
        },
        fire: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#b91c1c', // manga crimson fire — the red ghost flame
          600: '#991b1b',
          700: '#7f1d1d',
        },
        ghost: {
          // warm ink + subtle fire tint for ghost protocol elements
          400: '#a38b6e',
          500: '#8a745a',
          600: '#5c4a3a',
        },
      },
    },
  },
  plugins: [],
};
