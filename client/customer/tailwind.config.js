/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      heading: ["Poppins", "sans-serif"],
    },
    colors: {
      primary: "#7C3AED",   // purple
      secondary: "#A855F7",
      pinky: "#F472B6",
      softPink: "#FBCFE8",
    },
    boxShadow: {
      soft: "0px 10px 30px rgba(124, 58, 237, 0.08)",
    },
    borderRadius: {
      xl2: "1.25rem", // 20px
    },
  },
},

  plugins: [],
};
