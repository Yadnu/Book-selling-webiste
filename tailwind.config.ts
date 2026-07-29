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
        abyssal: {
          900: "#080C11",
          DEFAULT: "#0D131A",
          800: "#131C27",
          700: "#1C2938",
        },
        storm: {
          DEFAULT: "#16202C",
          surface: "#1E2C3D",
          border: "#293B50",
        },
        brass: {
          light: "#E4B178",
          DEFAULT: "#C78D4E",
          hover: "#B57B3D",
          dark: "#9E6429",
        },
        kelp: {
          light: "#2C545E",
          DEFAULT: "#1C373E",
          dark: "#102328",
        },
        fog: {
          light: "#FAFBFB",
          DEFAULT: "#F3F4F6",
          dark: "#E1E5EA",
        },
        seafoam: {
          DEFAULT: "#98B0B7",
          subtle: "rgba(152, 176, 183, 0.2)",
        }
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-newsreader)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "Courier New", "monospace"],
      },
      animation: {
        'fog-drift': 'fogDrift 20s infinite ease-in-out',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fogDrift: {
          '0%, 100%': { transform: 'translateX(0%) opacity(0.4)' },
          '50%': { transform: 'translateX(5%) opacity(0.7)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
