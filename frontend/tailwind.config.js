/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F5FB",
        ink: "#12172B",
        teal: {
          // repurposed as the primary navy palette
          950: "#0B1230",
          900: "#141C42",
          700: "#1F2A5C",
          600: "#2E3D82",
          100: "#E7EAF7",
        },
        amber: {
          // repurposed as the accent (bright royal blue) for CTAs
          600: "#2B4CDB",
          500: "#3557F0",
          100: "#E4EAFD",
        },
        brick: {
          600: "#C6423F",
          100: "#FBE4E3",
        },
        line: "#E2E5F1",
        muted: "#767C99",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "12px",
        DEFAULT: "18px",
        lg: "22px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,23,43,0.04), 0 8px 24px rgba(18,23,43,0.06)",
      },
    },
  },
  plugins: [],
}
