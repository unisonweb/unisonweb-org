const find = require('lodash.find')
const flatten = require('lodash.flatten')
const has = require('lodash.has')

const codeExtraOptions = {
  transform: node => ({

    transform: node => {

      // add custom properties to wrapping element
      node.data.hProperties = {
        className: 'un-codeblock__wrapper',
      }

      // add custom properties to the `<pre>` tag
      const $pre = find(node.data.hChildren, child => child.tagName === 'pre')

      const showNumbers = (
        has(node.frontmatter, 'show-numbers') &&
        node.frontmatter['show-numbers'] === false
      ) ? false : true

      const showCarets = (
        has(node.frontmatter, 'show-carets') &&
        node.frontmatter['show-carets'] === true
      )

      const showCopyButton = (
        has(node.frontmatter, 'show-copy-button') &&
        node.frontmatter['show-copy-button'] === false
      ) ? 0 : 1

      const classNames = [
        'un-codeblock',
        'line-numbers',
        (showNumbers ? ['un-codeblock--show-numbers'] : null),
        (showCarets ? ['un-codeblock--show-carets'] : null),
      ]

      $pre.properties = {
        className: flatten(classNames).join(' '),
        'data-title': node.frontmatter['title'] ? node.frontmatter['title'] : 'Code',
        'data-show-copy-button': showCopyButton,
      }

    },

    before: node.frontmatter['filename'] && [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'un-codeblock__filename'
      },
      children: [{
        type: 'text',
        value: node.frontmatter['filename'],
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
  'remark-unwrap-images',
]

module.exports = plugins
