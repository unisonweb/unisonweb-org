const options = {
  plugins: getPlugins()
}

module.exports = options

function getPlugins() {

  const plugins = [
    require('postcss-import'),
    require('rucksack-css'),
    require('postcss-inline-svg'),
    require('autoprefixer'),
  ]

  if (process.env.NODE_ENV === 'production') {

    const prodPlugins = [
      require('css-mqpacker')({
        sort: true
      }),
      require('postcss-combine-duplicated-selectors')({
        removeDuplicatedProperties: true
      }),
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.vue',
          './src/**/*.html',
          './src/**/*.md',
        ],
        whitelistPatterns: [
          /(body).*/,
          /(un-).*/,
          /(is-).*/,
          /(line-numbers-rows).*/,
          /(token).*/,
        ],
        keyframes: true,
        extractors: [{
          extractor: class {
            static extract(content) {
              return content.match(/[A-Za-z0-9-_:\/@]+/g) || [];
            }
          },
          extensions: ['vue', 'md', 'html']
        }]
      }),
    ]

    plugins.push.apply(plugins, prodPlugins)
  }

  return plugins
}
