import path from 'path'

export default {
  /**
   * environment variables
   */
  env: process.env,

  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  serverMiddleware: [],
  server: {
    port: process.env.APP_PORT || 3000,
    // host: '0.0.0.0',
    // timing: false,
  },
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    // tailwind.css imports
    '~assets/css/tailwind.css',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    'nuxt-purgecss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/apollo',
  ],
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    /**
     * PostCSS settings
     */
    postcss: {
      plugins: {
        'postcss-import': {}, // css で @import を有効化
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        'postcss-nested': {}, // css で scss のように nested style 定義を有効化
      }
    },
    preset: {
      stage: 1 // ref https://tailwindcss.com/docs/using-with-preprocessors#future-css-featuress
    },
    /**
     * PurgeCSS settings
     * 本番ビルド時に余分な CSS を削除
     */
    purgeCSS: {
      mode: 'postcss',
      enabled: process.env.NODE_ENV === 'production',
    }
  },
  /**
   * Apollo Client configures
   */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `http://localhost:${process.env.PORT || 4000}`,
      }
    }
  }
}
