// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: true,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['@/assets/css/tailwind.css', '@/assets/global.scss'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  plugins: [
    '~/plugins/element-plus.js'  // Add the plugin here
  ],
  ssr: false,
})
