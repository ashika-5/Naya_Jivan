/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F5F0",
          dark: "#EDE9E1",
        },
        ink: "#1a1a18",
      },
      fontFamily: {
        head: ["Instrument Serif", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
