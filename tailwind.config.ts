import type { Config } from 'tailwindcss'

export default <Partial<Config>>{

  content: [
    "./components/**/*.{js,ts,vue}",
    "./layouts/**/*.{js,ts,vue}",
    "./pages/**/*.{js,ts,vue}",
    "./plugins/**/*.{js,ts,vue}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}