const twAnimate = require("tailwindcss-animate");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all your files are included
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
        "table-breakpoint": "1200px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(50px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1)", // Custom easing
      },
      backgroundImage: {
        "body-gradient":
          "linear-gradient(205.47deg, #229B83 8.69%, #094548 44.83%, #011217 80.96%)",
      },
      colors: {
        "text-black": "#000000",
        "forest-green": "#0A312A",
        white: "#ffffff",
        mint: "#42ECA8",
        beige: "#E4E4D4",
        "powder-blue": "#D9EAF3",
        sage: "#BDE8D8",
        grey: "#EFEFEF",
        alert: "#651A1A",
        warning: "#EBBC46",
        success: "#42ECA8",
        disabled: "#787878",
        panel: "#30F1FF1F",
        green: {
          300: "#1D6965",
        },
        neutral: {
          100: "#38C6C04D",
        },
        red: {
          300: "#6A3030",
        },

        // new colors
        brand: "var(--brand)",
        "brand-50": "var(--brand-50)",
        "brand-100": "var(--brand-100)",
        "brand-200": "var(--brand-200)",
        "brand-300": "var(--brand-300)",
        "brand-400": "var(--brand-400)",
        "brand-500": "var(--brand-500)",
        "brand-600": "var(--brand-600)",
        "brand-700": "var(--brand-700)",
        "brand-800": "var(--brand-800)",
        "brand-900": "var(--brand-900)",
        "brand-950": "var(--brand-950)",

        red: "var(--red)",
        "red-50": "var(--red-50)",
        "red-100": "var(--red-100)",
        "red-200": "var(--red-200)",
        "red-300": "var(--red-300)",
        "red-400": "var(--red-400)",
        "red-500": "var(--red-500)",
        "red-600": "var(--red-600)",
        "red-700": "var(--red-700)",
        "red-800": "var(--red-800)",
        "red-900": "var(--red-900)",
        "red-950": "var(--red-950)",

        yellow: "var(--yellow)",
        "yellow-50": "var(--yellow-50)",
        "yellow-100": "var(--yellow-100)",
        "yellow-200": "var(--yellow-200)",
        "yellow-300": "var(--yellow-300)",
        "yellow-400": "var(--yellow-400)",
        "yellow-500": "var(--yellow-500)",
        "yellow-600": "var(--yellow-600)",
        "yellow-700": "var(--yellow-700)",
        "yellow-800": "var(--yellow-800)",
        "yellow-900": "var(--yellow-900)",
        "yellow-950": "var(--yellow-950)",

        neutral: "var(--neutral)",
        "neutral-50": "var(--neutral-50)",
        "neutral-100": "var(--neutral-100)",
        "neutral-200": "var(--neutral-200)",
        "neutral-300": "var(--neutral-300)",
        "neutral-400": "var(--neutral-400)",
        "neutral-500": "var(--neutral-500)",
        "neutral-600": "var(--neutral-600)",
        "neutral-700": "var(--neutral-700)",
        "neutral-800": "var(--neutral-800)",
        "neutral-900": "var(--neutral-900)",
        "neutral-950": "var(--neutral-950)",

        pastel: {
          green: "#C3EEEC",
        },
      },
      fontSize: {
        "heading-1": "42px",
        "heading-2": "36px",
        "heading-3": "32px",
        "heading-4": "28px",
        "heading-5": "26px",
        "heading-6": "24px",
        "heading-7": "20px",
        "heading-8": "18px",
        "body-1": "16px",
        "body-2": "14px",
        "body-3": "12px",
      },
      fontFamily: {
        famaime: ["FAMAime", "sans-serif"],
      },
    },
  },
  plugins: [twAnimate],
};
