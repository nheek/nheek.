// tailwind.config.js
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      // For the best performance and to avoid false positives,
      // be as specific as possible with your content configuration.
    ],
    theme: {
      extend: {
        boxShadow: {
          'inner-blue': 'rgba(100, 100, 153, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px inset',
        }
      }
    }
  };