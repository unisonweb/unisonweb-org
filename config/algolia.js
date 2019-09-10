const collections = [
  {
    query: `{
      allDocPage {
        edges {
          node {
            id
            title
            path
            headings (depth: h2) {
              value
              anchor
            }
            content
          }
        }
      }
    }`,
    transformer: ({ data }) => data.allDocPage.edges.map(({ node }) => node),
    indexName: process.env.ALGOLIA_INDEX_NAME,
    itemFormatter: (item) => {
      return {
        objectID: item.id,
        title: item.title,
        path: item.path,
        headings: item.headings,
        // content: item.content,
      }
    },
    matchFields: [
      'title',
      'path',
      'headings',
      // 'content',
    ],
  },
]

module.exports = { collections }
