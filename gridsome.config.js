module.exports = {
  siteName: 'Unison Computing',
  siteUrl: 'www.unisonweb.org',
  titleTemplate: '%s',
  plugins: [{
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
  }, {
    use: '@gridsome/plugin-sitemap',
    options: {
      cacheTime: 600000, // default
    }
  }],
  transformers: {
    remark: {
      plugins: require('./config/remarkPlugins')
    }
  },
  css: {
    loaderOptions: {
      scss: require('./config/scss'),
      postcss: require('./config/postcss'),
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
            plugins: require('./config/svgo')
          }
        })
        .end()

  },
}
