<template>
  <un-link
    class="un-category-link"
    :url="category.path">

    <span
      class="un-category-link__emoji"
      v-text="category.emoji"
    />

    <span
      class="un-category-link__title"
      v-text="category.title"
    />

  </un-link>
</template>

<script>
  export default {
    props: {
      category: { type: Object, default: null }
    },
  }
</script>

<style lang="scss">

  $emojiSize: rem(2);
  $emojiGap: rem(0);

  .un-category-link {
    position: relative; // for positioning the __emoji

    display: inline-block;
    padding-left: ($emojiSize + $emojiGap);

    color: inherit;
    line-height: line-height(base);

    &.active {
      color: palette(lightpurple);
      font-family: font(bold);
    }
  }

  .un-category-link__emoji {
    position: absolute;
    top: 1px; // for pixel-perfect alignment
    left: 0;

    display: inline-block;
    width: $emojiSize;

    text-align: center;
  }

  .un-category-link__title {
    display: inline-block;

    @at-root .un-category-link:hover & {
      text-decoration: underline;
    }
  }

</style>