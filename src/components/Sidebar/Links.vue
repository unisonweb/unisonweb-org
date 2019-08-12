<template>
  <ul class="un-sidebar__links__container">
    <li v-for="(link, i) in links" :key="i">

      <un-link
        class="un-sidebar__link"
        :class="{ 'u-bold' : link.url === currentPath }"
        :url="link.url">
        {{link.label}}
      </un-link>

      <ul
        v-if="link.url === currentPath && headings && headings.length"
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
  $iconSpacing: rem(0);

  .un-sidebar__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      > li {
        // <li> reset
        margin: 0;

        margin-top: rem(-1);
      }
    }
  }

  .un-sidebar__link {
    display: block;

    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: (em(0) * line-height(half) * 1/2);
      left: -#{($iconSize * 1/2) + $iconSpacing};
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

  .un-sidebar__sub-links__container {
    opacity: 1;

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      margin-left: 1px;
      padding-left: $iconSpacing;
      border-left: 1px solid palette(gray, x-light);

      color: palette(gray);

      > li {
        // <li> reset
        margin: 0;

        margin-top: rem(-1);
      }
    }
  }

  .un-sidebar__sub-link {
    display: inline-block;
    color: inherit;
    font-size: rem(-1);
  }

</style>
