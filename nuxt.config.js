import colors from 'vuetify/es5/util/colors'

export default {
  target: 'server',
  ssr: false,
  server: {
    port: 3000,
    host: 'localhost'
  },
  head: {
    titleTemplate: '%s',
    title: 'Arioso - Music Player',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  pwa: {
    manifest: {
      name: 'Arioso - Music Player',
      short_name: 'Arioso',
      description: 'Listen in browser',
      background_color: '#282726',
      theme_color: '#282726',
      lang: 'en'
    }
  },
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: '#282726',
          primary: '#C1403D'
        },
        light: {
          background: '#282726',
          primary: '#A7414A'
        }
      }
    }
  }
}
