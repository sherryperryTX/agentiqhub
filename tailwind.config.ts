import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1A3A5C", light: "#2A5580", dark: "#0F2340" },
        terra: { DEFAULT: "#B85042", light: "#D4716A", dark: "#8B3A30" },
        accent: { DEFAULT: "#2E86AB", light: "#4BA3C7", dark: "#1D6B8D" },
        sage: { DEFAULT: "#A7BEAE", light: "#C5D6CA", dark: "#8BA695" },
        gold: { DEFAULT: "#C5985E", light: "#D9B47F", dark: "#A67D42" },
        cream: "#F5F0EB",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
