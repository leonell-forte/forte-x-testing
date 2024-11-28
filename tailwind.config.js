/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all your files are included
  ],
  theme: {
    extend: {
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
        alert: "#e61a1a",
        warning: "#EBBC46",
        success: "#42ECA8",
        disabled: "#787878",
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
  plugins: [],
};
