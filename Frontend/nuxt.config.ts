// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: true,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['@/assets/css/tailwind.css'],
  // @ts-expect-error: pinia options are not typed by default
  pinia: {
    autoImports: ['defineStore'],
  },
})
