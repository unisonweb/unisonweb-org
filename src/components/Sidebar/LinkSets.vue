<template>
  <ul class="un-sidebar__link-sets__container">
    <li
      v-for="(linkSet, i) in linkSets" :key="i"
      class="un-sidebar__link-set">

      <h2 class="un-sidebar__link-set__heading">
        <inline-svg
          class="un-sidebar__link-set__icon"
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
  import Links from '~/components/Sidebar/Links'

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

  .un-sidebar__link-sets__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      color: palette(black);
      line-height: line-height(half);

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {
          margin-bottom: rem(4);
        }
      }
    }
  }

  .un-sidebar__link-set {
    position: relative; // for positioning the __icon

    padding-left: ($iconSize + $iconSpacing);
  }

  .un-sidebar__link-set__heading {
    font-size: rem(1);

    > a {
      color: inherit;
    }
  }

  .un-sidebar__link-set__icon {
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
