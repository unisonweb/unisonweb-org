const CONFIG = {
  algolia: require('./config/algolia'),
  postcss: require('./config/postcss'),
  remarkPlugins: require('./config/remarkPlugins'),
  scss: require('./config/scss'),
  svgo: require('./config/svgo'),
}

module.exports = {

  siteName: 'Unison Computing',
  siteUrl: 'https://www.unisonweb.org',
  titleTemplate: '%s',

  plugins: [{
    // supplemental pages
    use: '@gridsome/source-filesystem',
    options: {
      typeName: 'SupplementalPage',
      baseDir: './src/data/supplemental-pages',
      path: '**/*.md',
      route: ':slug',
      remark: true
    }
  }, {
    // blog posts
    use: '@gridsome/source-filesystem',
    options: {
      typeName: 'BlogPost',
      baseDir: './src/data/blog/posts',
      path: '*/index.md',
      route: '/:year/:month/:day/:slug',
      remark: true,
      refs: {
        authors: 'Author',
        categories: 'Category',
      }
    }
  }, {
    // author references
    use: '@gridsome/source-filesystem',
    options: {
      typeName: 'Author',
      baseDir: './src/data/blog/authors',
      path: '*.md',
      route: '/author/:id'
    }
  }, {
    // category indexes
    use: '@gridsome/source-filesystem',
    options: {
      typeName: 'Category',
      baseDir: './src/data/blog/categories',
      path: '*.md',
      route: '/category/:slug'
    }
  }, {
    // doc pages
    use: '@gridsome/source-filesystem',
    options: {
      typeName: 'DocPage',
      index: ['README'],
      baseDir: './src/data/docs',
      pathPrefix: '/docs',
      path: '**/*.md',
      remark: {
        autolinkHeadings: {
          content: {
            type: 'text',
            value: '#'
          }
        }
      }
    }
  }, {
    // sitemap.xml
    use: '@gridsome/plugin-sitemap',
    options: {
      cacheTime: 600000, // default
    }
  }, {
    // algolia integration
    use: 'gridsome-plugin-algolia',
    options: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_ADMIN_KEY,
      collections: CONFIG.algolia.collections,
      chunkSize: 10000, // default: 1000
      enablePartialUpdates: true, // default: false
    },
  }],

  transformers: {
    remark: {
      squeezeParagraphs: true,
      externalLinks: true,
      externalLinksTarget: '_blank',
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

    config.mode('development')

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
