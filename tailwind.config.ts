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
        background: "#F5F5F7",
        secondary: "#E5E5EA",
        surface: "#FFFFFF",
        "glass-surface": "rgba(255, 255, 255, 0.7)",
        "glass-border": "rgba(0, 0, 0, 0.05)",
        accent: "#0071E3", // Apple Blue
        success: "#34C759", // Apple Green
        warning: "#FF9F0A", // Apple Orange
        danger: "#FF3B30", // Apple Red
        text: "#1D1D1F",
        muted: "#86868B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      backgroundImage: {
        "apple-intelligence": "conic-gradient(from 180deg at 50% 50%, #FF2E93 0deg, #FF8A00 90deg, #00C0FF 180deg, #FF2E93 360deg)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      }
    },
  },
  plugins: [],
};
export default config;
