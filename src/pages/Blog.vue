<template>
  <un-blog>

    <un-post-excerpts :posts="posts" />
    <un-pagination :info="$page.allBlogPost.pageInfo" />

  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostExcerpts from '~/components/PostExcerpts'
  import Pagination from '~/components/Pagination'
  import pageContent from '~/data/pages/blog.yml'
  import pageMetaInfo from '~/mixins/pageMetaInfo'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
      posts() {
        return this.$page.allBlogPost.edges.map(edge => edge.node)
      },
    },
    components: {
      'un-blog': Blog,
      'un-post-excerpts': PostExcerpts,
      'un-pagination': Pagination,
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">
  // intentionally blank
</style>

<page-query>
  query Posts ($page: Int) {
    allBlogPost (perPage: 5, page: $page) @paginate {
      pageInfo {
        totalPages
        currentPage
      }
      edges {
        node {
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
          content
        }
      }
    }
  }
</page-query>
