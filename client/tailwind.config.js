/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
  extend: {
    colors: {
      brand: {
        violet: '#7c3aed',
        pink: '#ec4899',
      }
    },
    boxShadow: {
      'brand': '0 6px 24px rgba(109,40,217,0.4),0 2px 8px rgba(219,39,119,0.2),inset 0 1px 0 rgba(255,255,255,0.2)',
      'brand-hover': '0 10px 36px rgba(109,40,217,0.5),0 4px 14px rgba(219,39,119,0.3),inset 0 1px 0 rgba(255,255,255,0.2)',
      'soft': '0 6px 15px rgba(0,0,0,0.03)',
    },
    transitionTimingFunction: {
      'easeOutCubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
    },
    fontFamily: {
      'serif': ["'Cormorant Garamond'", 'serif'], // Ensure correct serif definition
    }
  }
},

  plugins: [],
};
