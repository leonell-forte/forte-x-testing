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
    },
  },
  plugins: [],
};
export default config;
