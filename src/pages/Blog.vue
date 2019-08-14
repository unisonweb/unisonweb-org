<template>
  <un-blog>
    <un-post-excerpts :posts="posts" />
  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostExcerpts from '~/components/PostExcerpts'
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
  query {
    allBlogPost {
      edges {
        node {
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
          content
        }
      }
    }
  }
</page-query>
