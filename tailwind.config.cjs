/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "codemart-50": "#E2F2FF",
        "codemart-100": "#BADEFF",
        "codemart-200": "#8CCAFF",
        "codemart-300": "#5AB5FF",
        "codemart-400": "#2EA5FF",
        "codemart-500": "#0095FF",
        "codemart-600": "#0087FD",
        "codemart-700": "#0C74E9",
        "codemart-800": "#1262D6",
        "codemart-900": "#1742B7",
      },
      minHeight: {
        sm: "24rem",
        xs: "20rem",
        "2xs": "16rem",
        "3xs": "12rem",
        "4xs": "10rem",
        us: "8rem",
      },
      maxWidth: {
        "2xs": "16rem",
        "3xs": "12rem",
        "4xs": "10rem",
        us: "8rem",
        "2us": "6rem",
        "3us": "4rem",
        "4us": "2rem",
        screen: "100vw",
      },
      minWidth: {
        lg: "32rem",
        sm: "24rem",
        xs: "20rem",
        "2xs": "16rem",
        "3xs": "12rem",
        "4xs": "10rem",
        us: "8rem",
      },
      screens: {
        "mobile-sm": "320px",
        "mobile-md": "375px",
        "mobile-lg": "425px",
      },
    },
  },
  plugins: [],
};

module.exports = config;
