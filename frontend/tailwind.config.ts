// @ts-ignore
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",                   // ✅ Main HTML
    "./static/html/**/*.html",        // ✅ All HTML files in static/html/
    "./static/css/**/*.css",          // ✅ All CSS files in static/css/
    "./static/js/**/*.js"             // ✅ All JS files in static/js/
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'selected'
  ],
  plugins: [],
};

export default config;
