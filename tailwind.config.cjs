/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],

  theme: {
    extend: {},
  },

  plugins: [
    require('tailwindcss-3d')
  ],
};

module.exports = config;
