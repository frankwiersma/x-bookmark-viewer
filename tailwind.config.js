/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#e7e9ea',
            h1: { color: '#e7e9ea' },
            h2: { color: '#e7e9ea' },
            h3: { color: '#e7e9ea' },
            h4: { color: '#e7e9ea' },
            h5: { color: '#e7e9ea' },
            h6: { color: '#e7e9ea' },
            strong: { color: '#1d9bf0' },
            blockquote: {
              borderLeftColor: '#1d9bf0',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0 0.375rem 0.375rem 0',
              padding: '0.25rem 1rem',
              color: '#e7e9ea',
            },
            a: {
              color: '#1d9bf0',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            hr: { borderColor: '#2f3336' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
