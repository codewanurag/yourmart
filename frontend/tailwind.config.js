/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans:  ['"Outfit"', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink:       '#0A0908',
        ink2:      '#111010',
        ink3:      '#1A1917',
        ink4:      '#242220',
        ink5:      '#2E2C29',
        smoke:     '#3D3A36',
        muted:     '#7A766F',
        dim:       '#A09B93',
        cream:     '#EDE8DF',
        parchment: '#F7F3EC',
        gold:      '#C9A84C',
        gold2:     '#E8C96A',
        gold3:     '#F5E4A8',
        ember:     '#E05C2A',
        blush:     '#C94B6A',
        sage:      '#4A8C6F',
        sky:       '#3A7FB5',
        // Light mode
        lt_bg:     '#F5F0E8',
        lt_surface:'#FFFFFF',
        lt_border: '#E8E0D0',
        lt_text:   '#1A1714',
        lt_muted:  '#7A6F60',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-live': 'pulse-live 1.4s ease-in-out infinite',
        'spin-ring': 'spin-ring 3s linear infinite',
        'slide-up': 'slide-up 0.35s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%':     { transform: 'translateY(-10px) rotate(3deg)' },
        },
        'pulse-live': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.3', transform: 'scale(1.5)' },
        },
        'spin-ring': {
          to: { filter: 'hue-rotate(360deg)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
