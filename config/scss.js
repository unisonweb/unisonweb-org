const options = {
  functions: require('chromatic-sass'),
  outputStyle: 'expanded',
  sourceComments: false,
  importer: require('node-sass-yaml-importer'),
  includePaths: [
    'src',
    'src/assets/styles',
    'node_modules'
  ],
  data: `
    @import
      "vendor/utilities",
      "generators/generators",
      "config/config";
  `,
}

module.exports = options
