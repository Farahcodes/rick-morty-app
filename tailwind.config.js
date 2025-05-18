/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './node_modules/@nuxt/ui/dist/**/*.{js,vue}'
  ],
  theme: {
    extend: {
      colors: {
        // Uesd those value in main.css I don't think tailwind.config.js is used with v4
        'green': { 
          500: '#22c55e', // Used for 'Alive' status
          50: '#f0fdf4',
          600: '#16a34a'
        },
        'red': { 
          500: '#ef4444', // Used for 'Dead' status
          50: '#fef2f2',
          600: '#dc2626'
        },
        // Nuxt-ui uses 'neutral' color
        'gray': { 
          500: '#6b7280', // Used for 'unknown' status
          50: '#f9fafb',
          600: '#4b5563'
        }
      }
    }
  }
} 