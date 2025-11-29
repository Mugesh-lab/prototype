module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#06b6d4',
        bg: 'var(--bg)',
        surface: 'var(--surface)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        dyslexic: ['OpenDyslexic', 'Inter', 'ui-sans-serif']
      },
      boxShadow: {
        soft: '0 6px 18px rgba(16,24,40,0.06)'
      }
    }
  },
  plugins: [],
}
