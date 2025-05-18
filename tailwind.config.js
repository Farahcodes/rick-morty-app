/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./node_modules/@nuxt/ui/dist/**/*.{mjs,js,vue}"
  ],
  safelist: [
    // Add color classes for buttons that need to be available
    'bg-green-500', 'hover:bg-green-600', 'text-green-600', 'outline-green-500',
    'bg-red-500', 'hover:bg-red-600', 'text-red-600', 'outline-red-500',
    'bg-gray-500', 'hover:bg-gray-600', 'text-gray-600', 'outline-gray-500',
    // Button and badge variants
    'text-white',
    // Color variant classes
    { pattern: /bg-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /text-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /border-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /outline-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /ring-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /hover:bg-(green|red|gray)-(50|100|200|300|400|500|600|700|800|900)/ },
  ],
  theme: {
    extend: {
      colors: {
        // These colors match the ones used in the statuses
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        gray: { 
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        }
      }
    }
  }
} 