/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
          inset: "var(--bg-inset)",
        },
        line: {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
          3: "var(--line-3)",
        },
        t: {
          0: "var(--t-0)",
          1: "var(--t-1)",
          2: "var(--t-2)",
          3: "var(--t-3)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          dim: "var(--teal-dim)",
          line: "var(--teal-line)",
        },
        cyan: {
          DEFAULT: "var(--cyan)",
          dim: "var(--cyan-dim)",
        },
        crit: {
          DEFAULT: "var(--crit)",
          dim: "var(--crit-dim)",
        },
        high: {
          DEFAULT: "var(--high)",
          dim: "var(--high-dim)",
        },
        med: {
          DEFAULT: "var(--med)",
          dim: "var(--med-dim)",
        },
        low: {
          DEFAULT: "var(--low)",
          dim: "var(--low-dim)",
        },
        ok: {
          DEFAULT: "var(--ok)",
          dim: "var(--ok-dim)",
        },
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        premium: "var(--shadow)",
      },
    },
  },
  plugins: [],
}
