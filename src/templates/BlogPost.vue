<template>
  <un-blog>

    <un-post-intro :post="$page.post" />

    <un-content :content="$page.post.content" />

    <un-share-links
      :title="$page.post.title"
      :path="$page.post.path"
    />

    <!-- prev/next posts -->

  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostIntro from '~/components/PostIntro'
  import Content from '~/components/Content'
  import ShareLinks from '~/components/ShareLinks'

  export default {
    metaInfo() {
      const { title, description } = this.$page.post

      return {
        title: title,
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
    components: {
      'un-blog': Blog,
      'un-post-intro': PostIntro,
      'un-content': Content,
      'un-share-links': ShareLinks,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>

<page-query>
  query BlogPost ($path: String!) {
    post: blogPost (path: $path) {
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
</page-query>
