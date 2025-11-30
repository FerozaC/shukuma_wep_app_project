import type { Config } from "tailwindcss";

export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: ["class"],
  plugins: [],
} satisfies Config;
