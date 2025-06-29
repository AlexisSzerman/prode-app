/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ['"VT323"', 'monospace'],
        gamer: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
};
