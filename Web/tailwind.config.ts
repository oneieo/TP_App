import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F5",
        primary: {
          DEFAULT: "#5CBDB5",
          dark: "#3ca098",
          darker: "#005e59",
        },
        accent: {
          DEFAULT: "#FDA83F",
          dark: "#ff8c2e",
        },
        text: {
          DEFAULT: "#333333",
          secondary: "#5c5c5c",
        },
        gray: {
          200: "#ebebeb",
          300: "#c2c2c2",
        },
      },
      fontFamily: {
        sf: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
      },
      spacing: {
        "safe-area-pt": "env(safe-area-inset-top)",
        "safe-area-pb": "env(safe-area-inset-bottom)",
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
