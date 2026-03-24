import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-navy': '#002C77',
        'primary-blue': '#4CC9F0',
        'primary-dark': '#001A4A',
        'secondary-blue': '#E0F7FA',
        'accent-pink': '#F72585',
        'accent-yellow': '#FFD60A',
        'accent-gray': '#F8FAFC',
        'text-dark': '#0F172A',
        'text-main': '#334155',
        'text-light': '#64748B',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'soft': '0 8px 20px rgba(0, 44, 119, 0.05)',
        'medium': '0 12px 28px rgba(0, 44, 119, 0.08)',
        'premium': '0 24px 50px rgba(0, 44, 119, 0.15)',
      },
      backgroundImage: {
        'premium-glass-bg': 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
