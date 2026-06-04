/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2FA766',
          red: '#E74049',
          teal: '#007F81',
          yellow: '#F4C200',
        },
      },
    },
  },
  plugins: [],
}
