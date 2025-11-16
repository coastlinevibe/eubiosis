/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand
        accent: '#3A9E92',
        text: '#1F2F2F',
        // Legacy keys kept for compatibility
        secondary: '#F1C56B',
        border: '#D9D9D9',
        // Extended palette
        earth: '#1F2F2F', // Deep Earth Grey
        soft: '#3C4B4B', // Soft Organic Grey
        soil: '#5B3A1A', // Warm Soil Brown
        cream: '#F6F2EA', // Cream White
        mint: '#A4DAD2', // Light Mint Teal
        forest: '#0B3F32', // Deep Forest Green
      },
      borderRadius: {
        'eubiosis': '11px',
      },
      letterSpacing: {
        'eubiosis': '0.01em',
      },
      boxShadow: {
        premium: '0 6px 22px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
    },
  },
  plugins: [],
}
