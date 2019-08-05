const codeExtraOptions = {
  transform: node => ({

    transform: node => {
      // add custom class to wrapping element
      node.data.hProperties = { className: 'un-codeblock__wrapper' }
      // add `line-numbers` class to `<pre>` tag
      node.data.hChildren[0].properties = { className: 'un-codeblock line-numbers' }
    },

    before: node.meta && [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'un-codeblock__meta'
      },
      children: [{
        type: 'text',
        value: node.meta,
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
  [ 'remark-code-extra', codeExtraOptions ]
]

module.exports = plugins
