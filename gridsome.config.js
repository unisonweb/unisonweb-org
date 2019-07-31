module.exports = {
  siteName: 'Unison Computing',
  siteUrl: 'www.unisonweb.org',
  titleTemplate: '%s',
  plugins: [{
    use: '@gridsome/source-filesystem',
    options: {
      index: ['README'],
      path: 'docs/**/*.md',
      typeName: 'DocPage',
      remark: {
        autolinkHeadings: {
          content: {
            type: 'text',
            value: '#'
          }
        },
        plugins: [
          '@gridsome/remark-prismjs'
        ]
      }
    }
  }, {
    use: '@gridsome/plugin-sitemap',
    options: {
      cacheTime: 600000, // default
    }
  }],
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
