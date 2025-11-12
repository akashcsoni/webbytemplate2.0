import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    keyframes: {
      zoom: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.2)' },
      },
    },
    animation: {
      zoom: 'zoom 2s ease-in-out infinite',
    },
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "992px",
      // => @media (min-width: 1199px) { ... }
      xl: "1170px",
      // => @media (min-width: 1440px) { ... }
      "1xl": "1260px",
      // => @media (min-width: 1440px) { ... }
      "2xl": "1490px",
    },
    extend: {
      fontFamily: {
        sans: ["Product Sans"],
        Space_Mono: ["Space Mono"],
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        primary: "#0043A2",
        blue: {
          300: "#E6EFFB",
        },
        gray: {
          100: "#D9DDE2",
          200: "#505050",
          300: "#808080",
          400: "#BBBBBB",
          500: "#27313B",
          600: "#1A2127",
        },
        orange: {
          100: "#FFCC00",
          600: "#FF7F22",
        },
        purple: {
          100: "#0C0C20",
        },
      },
      dropShadow: {
        primary: "0px 6px 20px #0156D51A",
        category: "0px 2px 3px 0px #0000001F",
      },

      boxShadow: {
        'gray': '0px -2px 15px 0px #00000014',
        'dropDown': '0px 3px 20px 0px #00000024',
        'gray-inset': '0px 2px 1px 0px #FFFFFF inset',
      },
      fontSize: {
        "5xl": "3.75rem",
        "4xl": "2.75rem",
        "3xl": "2.1875rem",
        "2xl": "1.5625rem",
      },
    },
    listStyleType: {
      radio: 'round',
    }
  },
  darkMode: "class",
  plugins: [heroui()],
};
