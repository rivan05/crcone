/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00c6ff',
        secondary: '#0072ff',
        dark: '#0f2027',
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      },
    },
  },
  plugins: [],
}
