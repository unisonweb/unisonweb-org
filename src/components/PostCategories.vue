<template>
  <ul class="un-post-categories__container">
    <li v-for="(category, i) in categories" :key="i">
      <un-link
        class="un-post-category"
        :data-color="category.color"
        :url="category.path">
        {{category.title}}
      </un-link>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      categories: { type: Array, default: null },
    },
  }
</script>

<style lang="scss">

  .un-post-categories__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      margin-top: dim(pageSection, sm);
      margin-bottom: dim(pageSection, sm);

      display: flex;
      flex-wrap: wrap;

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {
          margin-right: (em(0) * 1/2);
        }

        font-family: font(semibold);
        font-size: rem(-2);
        letter-spacing: 0; // override
        line-height: line-height(base);
      }
    }
  }

  .un-post-category {
    $verticalPadding: em(-3);

    display: inline-block;
    padding: $verticalPadding em(-2) ($verticalPadding - ($verticalPadding * font(sans, descent)));

    &, &:hover {
      text-decoration: none;
    }

    border-radius: 4px;

    @each $palette, $value in $UCpalettes {

      &[data-color="#{$palette}"] {
        color: palette($palette);
        background-color: palette($palette, xx-light);

        // &:hover {
        //   background-color: palette($palette, bright);
        // }
      }
    }
  }

</style>
