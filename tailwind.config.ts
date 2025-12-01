import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      colors: {
        // Primary orange from logo
        primary: {
          DEFAULT: '#F39C12',
          dark: '#E67E22',
          light: '#F9A825',
        },
        // Secondary colors - warm tones
        secondary: {
          DEFAULT: '#F9A825',
          light: '#FDB45C',
          lighter: '#FFCC80',
        },
        // Accent colors - warm tones
        accent: {
          orange: '#ff8044',
          peach: '#fda77f',
          yellow: '#f9ad4d',
        },
        // Logo green from pineapple leaves
        green: {
          DEFAULT: '#6B9B5C',
          light: '#7CAF6E',
          dark: '#5A8A4B',
        },
        // Custom text colors
        text: {
          dark: '#151414',
          medium: '#5d5d61',
          light: '#757575',
        },
        // Background colors
        bg: {
          cream: '#fef6ed',
          'light-green': '#FFF3E0',
          'light-peach': '#fdf1ec',
          light: '#f1f0ef',
        },
      },
    },
  },
  plugins: [],
};

export default config;
