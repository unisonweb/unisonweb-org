<template>
  <un-blog>

    <un-post-excerpts :blog-posts="blogPosts" />
    <un-pagination :info="$page.category.belongsTo.pageInfo" />

  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostExcerpts from '~/components/PostExcerpts'
  import Pagination from '~/components/Pagination'

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
      blogPosts() {
        return this.$page.category.belongsTo.edges.map(edge => edge.node)
      },
    },
    components: {
      'un-blog': Blog,
      'un-post-excerpts': PostExcerpts,
      'un-pagination': Pagination,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>

<page-query>
  query Category ($path: String!, $page: Int) {
    category: category (path: $path) {
      title
      belongsTo (perPage: 5, page: $page) @paginate {
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
              authors {
                title
              }
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
