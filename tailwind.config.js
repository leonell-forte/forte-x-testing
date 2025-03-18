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
        panel: "rgba(48,241,255,10%)",
        green: {
          300: "#1D6965",
        },
        neutral: {
          100: "#38C6C04D",
        },
        red: {
          300: "#6A3030",
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
