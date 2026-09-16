import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        ink: "#14161F",
        "ink-soft": "#63677A",
        paper: "#F7F6F2",
        line: "#E4E2DC",
        "line-dark": "#262A38",
        accent: "#B4740E",
        "accent-soft": "#F4E4C1",
        positive: "#2E9E6D",
        "positive-soft": "#DFF3EA",
        negative: "#C4574A",
        "negative-soft": "#F7E4E1",
      },
    },
  },
  plugins: [],
};
export default config;
