import type { Config } from "tailwindcss";

// Central place for the brand's visual identity. Any coding agent extending
// the UI should pull colors/fonts from here rather than hardcoding hex
// values in components, so the palette stays consistent as pages grow.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf3f5",
          100: "#fbe6ea",
          200: "#f6cdd6",
          300: "#efa9ba",
          400: "#e57d97",
          500: "#d85575",
          600: "#c1385c",
          700: "#a12a4b",
          800: "#852641",
          900: "#71233b"
        },
        cream: {
          50: "#fffdf9",
          100: "#fdf8ef",
          200: "#f9eeda",
          300: "#f3e0bd"
        },
        gold: {
          300: "#e9cd8f",
          400: "#d9b25f",
          500: "#c69a42",
          600: "#a67c2e"
        }
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Poppins", "system-ui", "sans-serif"]
      },
      keyframes: {
        "bangle-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.15)" },
          "100%": { transform: "rotate(360deg) scale(1)" }
        },
        "bag-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(6deg)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "bangle-spin": "bangle-spin 0.6s ease-in-out",
        "bag-wiggle": "bag-wiggle 0.4s ease-in-out",
        "fade-in-up": "fade-in-up 0.5s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
