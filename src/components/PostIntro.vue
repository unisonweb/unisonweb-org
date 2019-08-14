<template>
  <div class="un-post-intro">

    <h1
      class="un-post-intro__heading">
      <un-link
        v-if="linkHeadingToPost"
        :url="post.path">
        {{post.title}}
      </un-link>
      <span
        v-else
        v-text="post.title"
      />
    </h1>

    <div class="un-post-intro__meta">

      <un-link
        class="un-post-intro__category-badge"
        :data-color="category.color"
        :url="category.path">
        <span
          class="u-color--white"
          v-text="category.title"
        />
      </un-link>

      <span
        class="u-color--gray--mid u-bold u-line-height--base"
        data-font-size="-2"
        v-html="`${post.author} &bull; ${post.date}`"
      />

    </div>

    <slot />

  </div>
</template>

<script>
  export default {
    props: {
      post: { type: Object, default: null },
      linkHeadingToPost: { type: Boolean, default: false },
    },
    computed: {
      category() {
        return this.post.categories[0]
      },
    },
  }
</script>

<style lang="scss">

  .un-post-intro {
    // intentionally blank
  }

  .un-post-intro__heading {
    font-size: responsive rem(4) rem(5);
    font-range: breakpoint(xs, max) breakpoint(xl);
  }

  .un-post-intro__meta {
    margin-top: rem(0);
    margin-bottom: rem(0);

    display: flex;
    align-items: center;
  }

  .un-post-intro__category-badge {
    display: inline-block;
    margin-right: rem(0);
    padding: em(-3) em(-2) (em(-3) - (em(-3) * font(sans, descent)));

    font-family: font(bold);
    font-size: rem(-3);
    letter-spacing: 0; // override
    line-height: line-height(base);

    border-radius: 4px;

    @each $palette, $value in $UCpalettes {

      &[data-color="#{$palette}"] {
        background-color: palette($palette);
      }
    }
  }

</style>
