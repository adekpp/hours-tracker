/** @type {import('tailwindcss').Config} */
module.exports = {
  types: ["next", "react"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'landing': 'url("/images/landing.svg")',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: false,
  },
};
