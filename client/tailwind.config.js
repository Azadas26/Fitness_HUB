// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        show: 'show 1s ease-out forwards',
        fadeIn: 'fadeIn 2s ease-out',
        bounceFast: 'bounceFast 1.5s infinite ease-in-out',
        bounceFast2: 'bounceFast 1.5s infinite ease-in-out',
        moveRight: 'moveRight 1.5s infinite ease-in-out',
      },
      keyframes: {
        show: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
        moveRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        },
      }
    }
  },
  plugins: [],
}
