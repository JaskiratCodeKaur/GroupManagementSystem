/** @type {import('tailwindcss').Config} */
export default {  darkMode: 'class',  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      card: '#ffffff',
      muted: {
        DEFAULT: '#f3f4f6',
        foreground: '#6b7280',
      },
      foreground: '#111827',
      border: '#e5e7eb',
    },
  },
}
,
  plugins: [],
}

