const CONFIG = {
  algolia: require('./config/algolia'),
  postcss: require('./config/postcss'),
  remarkPlugins: require('./config/remarkPlugins'),
  scss: require('./config/scss'),
  svgo: require('./config/svgo'),
}

module.exports = {

  siteName: 'Unison Computing',
  siteUrl: 'www.unisonweb.org',
  titleTemplate: '%s',

  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        baseDir: './src/data/supplemental-pages',
        path: '**/*.md',
        route: ':slug',
        typeName: 'SupplementalPage',
        remark: true
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        index: ['README'],
        baseDir: './src/data/docs',
        pathPrefix: '/docs',
        path: '**/*.md',
        typeName: 'DocPage',
        remark: {
          autolinkHeadings: {
            content: {
              type: 'text',
              value: '#'
            }
          }
        }
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        cacheTime: 600000, // default
      }
    },
    {
      use: 'gridsome-plugin-algolia',
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        collections: CONFIG.algolia.collections,
        chunkSize: 10000, // default: 1000
        enablePartialUpdates: true, // default: false
      },
    }
  ],

  transformers: {
    remark: {
      plugins: CONFIG.remarkPlugins
    }
  },

  css: {
    loaderOptions: {
      scss: CONFIG.scss,
      postcss: CONFIG.postcss,
    },
  },

  chainWebpack: config => {

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
        .loader('babel-loader')
        .end()
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
        .options({
          svgo: {
            plugins: CONFIG.svgo
          }
        })
        .end()

  },
}
