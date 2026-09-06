/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bebas Neue"', '"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#1e2022',
          gray: '#64748b',
          light: '#f8fafc',
          accent: '#2563eb',
        },
      },
    },
  },
  plugins: [],
};

