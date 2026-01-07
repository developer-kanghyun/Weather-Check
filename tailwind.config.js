/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0aa0eb",
        "background-light": "#f5f7f8",
        "background-dark": "#101c22",
      },
      fontFamily: {
        "display": ["Manrope", "Noto Sans KR", "sans-serif"],
        "sans": ["Manrope", "Noto Sans KR", "sans-serif"],
      },
      borderRadius: { 
        "DEFAULT": "0.5rem", 
        "lg": "1rem", 
        "xl": "1.5rem", 
        "2xl": "2rem", 
        "full": "9999px" 
      },
    },
  },
  plugins: [],
}
