<template>
  <ul class="un-post-excerpts">
    <li v-for="(post, i) in posts" :key="i">

      <un-post-intro
        :post="post"
        :heading-link="true">
        <p v-text="post.description" />
        <un-link
          class="u-inline-block u-margin--top u-color--lightpurple u-bold"
          :url="post.path">
          Read More &rarr;
        </un-link>
      </un-post-intro>

    </li>
  </ul>
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

  .un-post-excerpts {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {

          @include max-screen(breakpoint(xs, max)) {
            margin-bottom: dim(pageSection, xs);
          }

          @include min-screen(breakpoint(sm)) {
            margin-bottom: dim(pageSection, sm);
          }

          @include min-screen(breakpoint(md)) {
            margin-bottom: dim(pageSection, md);
          }
        }
      }
    }
  }

</style>
