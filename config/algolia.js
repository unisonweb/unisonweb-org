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
      }
    },
    matchFields: ['title', 'path', 'headings'],
  },
]

module.exports = { collections }
