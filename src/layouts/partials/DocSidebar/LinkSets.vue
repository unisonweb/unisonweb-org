<template>
  <ul class="un-doc-sidebar__link-sets__container">
    <li
      v-for="(linkSet, i) in linkSets" :key="i"
      class="un-doc-sidebar__link-set">

      <h2>
        <inline-svg
          class="un-doc-sidebar__link-set__icon"
          :src="linkSet.icon"
        />
        <un-link :url="linkSet.links[0].url">
          {{linkSet.heading}}
        </un-link>
      </h2>

      <Links
        :links="linkSet.links"
        :headings="headings"
        :current-path="currentPath"
      />

    </li>
  </ul>
</template>

<script>
  import Links from './Links'

  export default {
    props: {
      linkSets: { type: Array, default: null },
      headings: { type: Array, default: null },
      currentPath: { type: String, default: false },
    },
    components: {
      Links,
    },
  }
</script>

<style lang="scss">

  $iconSize: rem(3);
  $iconSpacing: rem(0);

  .un-doc-sidebar__link-sets__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      color: palette(black);

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {
          margin-bottom: rem(4);
        }
      }
    }
  }

  .un-doc-sidebar__link-set {
    position: relative; // for positioning the __icon

    padding-left: ($iconSize + $iconSpacing);
  }

  .un-doc-sidebar__link-set__icon {
    position: absolute;
    top: (em(0) * line-height(half) * 1/2);
    left: 0;
    transform: translate3d(0, -50%, 0);

    display: block;
    width: $iconSize;
    height: $iconSize;

    fill: currentColor;
  }

</style>
