<template>
  <un-blog>
    <un-post-excerpts :posts="posts" />
  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostExcerpts from '~/components/PostExcerpts'

  export default {
    metaInfo() {
      const { title, description } = this.$page.category

      return {
        title: title,
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
    computed: {
      posts() {
        return this.$page.category.belongsTo.edges.map(edge => edge.node)
      },
    },
    components: {
      'un-blog': Blog,
      'un-post-excerpts': PostExcerpts,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>

<page-query>
  query Category ($path: String!) {
    category: category (path: $path) {
      title
      belongsTo {
        pageInfo {
          totalPages
          currentPage
        }
        edges {
          node {
            ...on BlogPost {
              path
              title
              description
              date (format: "MMMM D, YYYY")
              author
              categories {
                path
                title
                color
              }
            }
          }
        }
      }
    }
  }
</page-query>
