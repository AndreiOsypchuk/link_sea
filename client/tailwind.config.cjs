/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%": { transform: "translateX(1.5px)" },
          "5%": { transform: "translateX(-1.5px)" },
          "10%": { transform: "translateX(1.5px)" },
          "15%": { transform: "translateX(-1.5px)" },
          "20%": { transform: "translateX(0px)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s linear infinite",
        shake: "shake 2s cubic-bezier(0, 1, 1, 1.2) infinite",
      },
    },
  },
  plugins: [],
};
