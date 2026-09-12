/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", "Segoe UI", "Arial", "sans-serif"],
        serif: ["Noto Sans", "Segoe UI", "Arial", "sans-serif"],
        mono: ["Noto Sans", "Segoe UI", "Arial", "sans-serif"],
      },
      colors: {
        ink: "#12253F",
        paper: "#EEF1F4",
        card: "#FFFFFF",
        border: "#D6DCE3",
        muted: "#6B7A8C",
        subtle: "#405166",
        text: "#1F2E42",
        accent: "#E07B1A",
        navy: {
          DEFAULT: "#0B3B60",
          dark: "#062A47",
          light: "#0E4B7A",
        },
        saffron: "#FF9933",
        indianGreen: "#138808",
        risk: {
          high: { bg: "#FBE4E1", fg: "#A32A20" },
          medium: { bg: "#FDF0D9", fg: "#8A5F17" },
          low: { bg: "#E1F0E5", fg: "#1F6B37" },
        },
      },
    },
  },
  plugins: [],
};
