<template>
  <vue-markdown
    class="un-announcement-bar"
    :data-color="componentContent.color"
    :source="componentContent.blurb"
  />
</template>

<script>
  import componentContent from '~/data/components/announcement-bar.yml'

  export default {
    computed: {
      componentContent() {
        return componentContent
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
  }

</style>
