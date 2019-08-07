const find = require('lodash.find')

const codeExtraOptions = {
  transform: node => ({

    transform: node => {
      // add custom properties to wrapping element
      node.data.hProperties = {
        className: 'un-codeblock__wrapper',
      }
      // add custom properties to the `<pre>` tag
      const $pre = find(node.data.hChildren, child => child.tagName === 'pre')
      $pre.properties = {
        className: 'un-codeblock line-numbers',
        'data-title': node.frontmatter.title ? node.frontmatter.title : 'Code',
      }
    },

    before: node.frontmatter.filename && [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'un-codeblock__filename'
      },
      children: [{
        type: 'text',
        value: node.frontmatter.filename,
      }]
    }],

    after: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'un-codeblock__flair',
        'aria-hidden': 'true'
      }
    }],

  })
}

const plugins = [
  'remark-code-frontmatter',
  [ 'remark-code-extra', codeExtraOptions ],
]

module.exports = plugins
