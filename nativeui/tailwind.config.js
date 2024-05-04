/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,lib}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
