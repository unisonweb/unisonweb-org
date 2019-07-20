const { basename } = require('path')

module.exports = [{
  prefixIds: {
    prefix: (node, { path }) => basename(path, '.svg'),
    delim: '-',
  },
}, {
  cleanupIDs: true
}, {
  convertPathData: true
}, {
  convertShapeToPath: true
}, {
  minify: true,
}, {
  removeTitle: false
}, {
  removeDesc: false
}, {
  removeDimensions: true,
}]
