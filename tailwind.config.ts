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
        bg: "#08080e",
        surface: "#111118",
        "surface-2": "#1a1a24",
        border: "#2a2a38",
        "border-2": "#3a3a50",
        orange: "#FF6B2B",
        "orange-dim": "#cc5522",
        lime: "#A8FF3E",
        "lime-dim": "#85cc30",
        muted: "#6b6b8a",
        "muted-2": "#4a4a68",
        white: "#f0f0f8",
        "white-dim": "#a0a0b8",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.svg')",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "marquee": "marquee 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
