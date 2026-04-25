// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '¿Dónde Matraquearon?',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Reporta y consulta puntos de matraca en Venezuela. Comunidad unida contra la corrupción.',
        },
        { name: 'theme-color', content: '#0d0d0d' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: '',
        },
      ],
    },
  },
  vite: {
    ssr: {
      // Supabase uses browser globals — keep it out of the SSR bundle
      noExternal: ['@supabase/supabase-js'],
    },
  },
})
