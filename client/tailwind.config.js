import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#2196f3", // main
          600: "#1e88e5",
          700: "#1976d2",
          800: "#1565c0",
          900: "#0d47a1",
        },
        secondary: {
          50: "#fce4ec",
          100: "#f8bbd0",
          200: "#f48fb1",
          300: "#f06292",
          400: "#ec407a",
          500: "#e91e63",
          600: "#d81b60",
          700: "#c2185b",
          800: "#ad1457",
          900: "#880e4f",
        },
        medical: {
          light: "#e3f2fd",
          main: "#2196f3",
          dark: "#1565c0",
        },
        health: {
          light: "#e8f5e9",
          main: "#4caf50",
          dark: "#2e7d32",
        },

        room: {
          900: "#2196f3",
        },
        girl: {
          tertiary: "#fdefe1",
          secondary: "#ed1b6f",
          primary: "#ee2d7a",
          vividPurple: "#9b51e0",
          vividCyanBlue: "#0693e3",
          paleCyanBlue: "#8ed1fc",
          vividGreenCyan: "#00d084",
          lightGreenCyan: "#7bdcb5",
          vividAmber: "#fcb900",
          vividOrange: "#ff6900",
          vividRed: "#cf2e2e",
          palePink: "#f78da7",
          white: "#ffffff",
          bluishGray: "#abb8c3",
          black: "#000000",
          secondary: "#ed1b6f",
          secondary: "#ed1b6f",
          yellow: "#feefe1",
          typograph: "#232323",
        },

        info: "#18181b",
        warning: "#f5a524",
        success: "#17c964",
        danger: "#f31260",
        secondary: "#9353d3",
        primary: "#006FEE"

      },

      fontSize: {
        tiny: "12px",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        poppins: [
          "Poppins",
          "Open Sans",
          "Montserrat",
          "Chakra Petch",
          "Cairo",
          "Tajawal",
          "Orbitron",
          "sans-serif",
        ],
        opensans: [
          "Open Sans",
          "Poppins",
          "Montserrat",
          "Chakra Petch",
          "Cairo",
          "Tajawal",
          "Orbitron",
          "sans-serif",
        ],
        chakra: [
          "Chakra Petch",
          "Open Sans",
          "Montserrat",
          "Poppins",
          "Cairo",
          "Tajawal",
          "Orbitron",
          "sans-serif",
        ],
        cairo: [
          "Cairo",
          "Tajawal",
          "Chakra Petch",
          "Open Sans",
          "Poppins",
          "Orbitron",
          "sans-serif",
        ],
        tawjal: [
          "Tajawal",
          "Cairo",
          "Chakra Petch",
          "Open Sans",
          "Poppins",
          "Orbitron",
          "sans-serif",
        ],
        montserat: ["Montserrat", "Open sans", "Poppins"],
        josefin: ["Josefin Sans", "Open Sans", "Poppins", "sans-serif"],
        paris: [
          "Parisienne",
          "Poppins",
          "Open Sans",
          "Chakra Petch",
          "Tajwal",
          "Cairo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 10px 0 rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 20px 0 rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [heroui()],
  corePlugins: {
    preflight: true,
  },
  important: "#root", // Ensures Tailwind styles override MUI styles when needed
};
