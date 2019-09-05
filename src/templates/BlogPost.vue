<template>
  <un-blog>

    <un-post-intro :blog-post="$page.blogPost" />

    <un-content :content="$page.blogPost.content" />

    <un-post-categories
      :categories="$page.blogPost.categories"
    />

    <un-share-links
      heading="Enjoy this post? Let others know."
      :title="$page.blogPost.title"
      :path="$page.blogPost.path">
    </un-share-links>

    <un-post-authors
      :authors="$page.blogPost.authors"
    />

    <!-- prev/next posts -->

  </un-blog>
</template>

<script>
  import Blog from '~/layouts/Blog'
  import PostIntro from '~/components/PostIntro'
  import PostCategories from '~/components/PostCategories'
  import PostAuthors from '~/components/PostAuthors'
  import Content from '~/components/Content'
  import ShareLinks from '~/components/ShareLinks'

  export default {
    metaInfo() {
      const { title, description } = this.$page.blogPost

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
      'un-post-categories': PostCategories,
      'un-post-authors': PostAuthors,
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
    blogPost: blogPost (path: $path) {
      path
      title
      description
      date (format: "MMMM D, YYYY")
      authors {
        title
        position
        photo
        content
        twitter
        linkedin
      }
      categories {
        path
        title
        color
      }
      featuredImage
      content
    }
  }
</page-query>
