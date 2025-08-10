/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00FF87",
        secondary: "#1a1a2e",
        accent: "#FFD700",
        surface: "#16213e",
        background: "#0f0f1e",
        success: "#00FF87",
        warning: "#FFA500",
        error: "#FF4757",
        info: "#00D4FF",
      },
      fontFamily: {
        display: ["Bebas Neue", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px #00FF87' },
          to: { boxShadow: '0 0 20px #00FF87, 0 0 30px #00FF87' },
        },
      },
    },
  },
  plugins: [],
}