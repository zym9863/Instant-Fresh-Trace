// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '即刻鲜踪 - 实时信息聚合平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '即刻鲜踪是一个实时信息聚合与个性化订阅平台，帮助您及时获取最新动态。' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      appName: '即刻鲜踪',
      appVersion: '1.0.0'
    }
  }
})
