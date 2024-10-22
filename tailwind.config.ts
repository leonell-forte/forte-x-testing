import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "text-black": "#000000",
        "forest-green": "#0A312A",
        white: "#ffffff",
        mint: "#42ECA8",
        beige: "#E4E4D4",
        "powder-blue": "#D9EAF3",
        sage: "#BDE8D8",
        grey: "#EFEFEF",
        alert: "#DE4841",
        warning: "#EBBC46",
        success: "#42ECA8",
        disabled: "#787878",
      },
      fontSize: {
        "heading-1": "42px",
        "heading-2": "36px",
        "heading-3": "32",
        "heading-4": "28px",
        "heading-5": "26px",
        "heading-6": "24px",
        "heading-7": "20px",
        "heading-8": "18px",
        "body-1": "16px",
        "body-2": "14px",
        "body-3": "12px",
      },
    },
  },
  plugins: [],
};
export default config;
