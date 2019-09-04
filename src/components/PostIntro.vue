<template>
  <div class="un-post-intro">

    <h1
      class="un-post-intro__heading">
      <un-link
        v-if="headingLink"
        :url="blogPost.path">
        {{blogPost.title}}
      </un-link>
      <span
        v-else
        v-text="blogPost.title"
      />
    </h1>

    <div class="un-post-intro__meta">

      <span
        class="u-color--gray--mid u-medium u-line-height--base"
        data-font-size="-2">
        <span v-text="authors" />
        &nbsp;&bull;&nbsp;
        <span v-text="blogPost.date" />
      </span>

    </div>

    <slot />

  </div>
</template>

<script>
  export default {
    props: {
      blogPost: { type: Object, default: null },
      headingLink: { type: Boolean, default: false },
    },
    computed: {
      authors() {
        const authors = this.blogPost.authors.map(author => {
          return author.title
        })

        return authors.join(', ')
      },
      category() {
        return this.blogPost.categories[0]
      },
    },
    mounted() {
      console.log(this.blogPost.authors)
    }
  }
</script>

<style lang="scss">

  .un-post-intro {

    & + .un-content {

      @include max-screen(breakpoint(xs, max)) {
        margin-top: (dim(pageSection, xs) * 1/2);
      }

      @include min-screen(breakpoint(sm)) {
        margin-top: (dim(pageSection, sm) * 1/2);
      }

      @include min-screen(breakpoint(md)) {
        margin-top: (dim(pageSection, md) * 1/2);
      }
    }
  }

  .un-post-intro__heading {
    font-family: font(extrabold);
    font-size: responsive rem(5) rem(7);
    font-range: breakpoint(xs, max) breakpoint(xl);
    letter-spacing: dim(letterSpacing, -4);
  }

  .un-post-intro__meta {
    margin-top: rem(0);
    margin-bottom: rem(0);

    font-family: font(semibold);

    display: flex;
    align-items: center;
  }

</style>
