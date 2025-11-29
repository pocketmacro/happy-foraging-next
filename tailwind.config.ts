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
        // Primary greens from happyforaging.com
        primary: {
          DEFAULT: '#4b916d',
          dark: '#0d4f3d',
          light: '#97c693',
        },
        // Secondary colors
        secondary: {
          DEFAULT: '#97c693',
          light: '#bde2a7',
          lighter: '#c1f0c1',
        },
        // Accent colors - warm tones
        accent: {
          orange: '#ff8044',
          peach: '#fda77f',
          yellow: '#f9ad4d',
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
          'light-green': '#f1f5ed',
          'light-peach': '#fdf1ec',
          light: '#f1f0ef',
        },
      },
    },
  },
  plugins: [],
};

export default config;
