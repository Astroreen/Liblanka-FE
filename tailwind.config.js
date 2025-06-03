/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      rounded:
          "'M PLUS Rounded 1c', 'Comfortaa', 'Roboto', Helvetica, Arial, sans-serif",
      comfortaa:
          "'Comfortaa', 'M PLUS Rounded 1c', 'Roboto', Helvetica, Arial, sans-serif",
      pacifico:
          "'Pacifico', 'Comfortaa', 'M PLUS Rounded 1c', 'Roboto', Helvetica, Arial, sans-serif",
      roboto:
          "'Roboto', 'Comfortaa', 'M PLUS Rounded 1c', Helvetica, Arial, sans-serif",
    },
    extend: {
      colors: {
        primary: "#FFEDDB",
        secondary: "#EDCDBB",
        tertiary: "#E3B7A0",
        quaternary: "#BF9270",
      },
    },
  },
  plugins: [],
}