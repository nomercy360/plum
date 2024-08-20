import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      xxs: ['11px', '11px'],
      xs: '13px',
      sm: ['15px', '19px'],
      base: ['15px', '21px'],
      lg: ['19px', '25px'],
      xl: ['21px', '25px'],
    },
    extend: {
      textColor: {
        'gray-dark': '#262626',
        'gray-light': '#BCBCBC',
      },
      letterSpacing: {
        wide: '0.5px',
      },
      colors: {
        black: '#262626',
        violet: '#6E23E7',
        purple: '#EF40FF',
        'light-purple': '#B7A5D8',
        'lighter-purple': '#F6F1FF',
        'dark-gray': '#929292',
        gray: '#F8F8F8',
        'light-green': '#00DB92',
        blue: '#00C8FC',
        yellow: '#FFC700',
        red: '#FF0031',
        'lighter-gray': '#EBEBEB',
        'light-gray': '#BCBCBC',
      },
    },
    screens: {
      sm: '640px',
      lg: '1024px',
    },
  },
  plugins: [],
};
export default config;
