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
        accent: '#8bccc2',
        secondary: '#F1C56B',
        border: '#D9D9D9',
        text: '#222222',
      },
      borderRadius: {
        'eubiosis': '11px',
      },
      letterSpacing: {
        'eubiosis': '0.01em',
      },
    },
  },
  plugins: [],
}
