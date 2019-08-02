<template>
  <ul
    v-if="links"
    class="un-sidebar__links__container">
    <li v-for="(link, i) in links" :key="i">

      <un-link
        class="un-sidebar__link un-link-animation"
        :url="link.path">
        <inline-svg
          class="un-sidebar__link__icon"
          :src="link.icon"
        />
        {{link.label}}
      </un-link>

      <ul
        v-if="link.path === currentPath && headings && headings.length"
        class="un-sidebar__sub-links__container">
        <li v-for="(heading, j) in headings" :key="j">
          <un-link
            class="un-sidebar__sub-link"
            :url="heading.anchor">
            {{heading.value}}
          </un-link>
        </li>
      </ul>

    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      links: { type: Array, default: null },
      headings: { type: Array, default: null },
      currentPath: { type: String, default: false },
    },
  }
</script>

<style lang="scss">

  $iconSize: rem(3);

  .un-sidebar__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      position: relative;

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

  .un-sidebar__link {
    position: relative;

    display: block;
    padding-left: ($iconSize + rem(0));

    color: inherit;
    font-family: font(bold);
    font-size: rem(1);
  }

  .un-sidebar__link__icon {
    position: absolute;
    top: (em(0) * line-height(half) * 1/2);
    left: 0;
    transform: translate3d(0, -50%, 0);

    display: block;
    width: $iconSize;
    height: $iconSize;

    fill: currentColor;
  }

  .un-sidebar__sub-links__container {
    opacity: 1;

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      padding-left: ($iconSize + rem(0));

      > li {
        // <li> reset
        margin: 0;

        margin-top: rem(-2);
      }
    }
  }

  .un-sidebar__sub-link {
    display: inline-block;
    color: inherit;
    font-size: rem(-1);

    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: (em(0) * line-height(half) * 1/2);
      left: -#{($iconSize * 1/2) + rem(0)};
      transform: translate3d(-50%, -50%, 0);

      width: 8px;
      height: 8px;

      border-radius: 50%;
      background-color: currentColor;

      transition: opacity .1s ease-in-out;
      opacity: 0;
    }

    &:hover {

      &:before {
        opacity: 1;
      }
    }
  }

</style>
