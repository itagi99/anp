/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopkart: {
          blue: '#2874F0',
          darkBlue: '#1A51B0',
          yellow: '#FFE500',
          orange: '#FB641B',
          dark: '#172337',
          grayBg: '#F1F3F6',
          border: '#E0E0E0',
          text: '#212121',
          muted: '#878787',
          green: '#388E3C',
        }
      }
    },
  },
  plugins: [],
}
