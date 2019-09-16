<template>
  <vue-markdown
    v-if="layoutContent.show"
    class="un-announcement-bar"
    :data-color="layoutContent.color"
    :source="layoutContent.blurb"
  />
</template>

<script>
  import layoutContent from '~/data/layouts/partials/announcement-bar.yml'

  export default {
    computed: {
      layoutContent() {
        return layoutContent
      },
    },
  }
</script>

<style lang="scss">

  .un-announcement-bar {
    padding: em(0) rem(3);

    font-size: rem(-2);
    line-height: line-height(half);
    text-align: center;

    @each $palette, $value in $UCpalettes {

      $textColor: mix-pick-visible-color(
        palette($palette),           // background
        palette($palette, xxx-dark), // dark text color
        palette(white)               // light text color
      );

      &[data-color="#{$palette}"] {
        color: $textColor;
        background-color: palette($palette);
      }
    }

    a {
      color: inherit;
      text-decoration: underline;
    }
  }

</style>
