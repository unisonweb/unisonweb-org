<template>
  <un-blog>

    <un-post-intro
      v-for="(post, i) in posts" :key="i"
      :post="post"
      :link-heading-to-post="true">
      <p v-text="post.description" />
      <un-link
        class="u-inline-block u-margin--top u-color--lightpurple u-bold"
        :url="post.path">
        Read More &rarr;
      </un-link>
    </un-post-intro>

  </un-blog>
</template>

<script>
  import PostIntro from '~/components/PostIntro'

  export default {
    props: {
      posts: { type: Array, default: null },
    },
    components: {
      'un-post-intro': PostIntro,
    },
  }
</script>

<style lang="scss">
  // 
</style>
