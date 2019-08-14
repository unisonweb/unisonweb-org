<template>
  <ul class="un-doc-sidebar__links__container">
    <li v-for="(link, i) in links" :key="i">

      <un-link
        class="un-doc-sidebar__link"
        :class="{ 'un-doc-sidebar__link--active' : link.url === currentPath }"
        :url="link.url">
        {{link.label}}
      </un-link>

      <ul
        v-if="link.url === currentPath && headings && headings.length"
        class="un-doc-sidebar__sub-links__container">
        <li v-for="(heading, j) in headings" :key="j">
          <un-link
            class="un-doc-sidebar__sub-link"
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

  .un-doc-sidebar__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      margin-top: rem(0);

      font-size: rem(-1);

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {
          margin-bottom: rem(0);
        }
      }
    }
  }

  .un-doc-sidebar__link {
    display: block;

    &--active {
      color: palette(lightpurple);
      font-family: font(bold);
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: (em(0) * line-height(default) * 1/2);
        left: -#{($iconSize * 1/2) + $iconSpacing};
        transform: translate3d(-50%, -50%, 0);

        width: 8px;
        height: 8px;

        border-radius: 50%;
        background-color: currentColor;
      }
    }
  }

  .un-doc-sidebar__sub-links__container {
    opacity: 1;

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      margin-top: rem(-3);
      padding-left: $iconSpacing;

      position: relative;

      // faux border to align with top/bottom of links
      &:before {
        content: '';
        position: absolute;
        top: (((em(0) * line-height(default)) - em(0)) * 1/2);
        bottom: (((em(0) * line-height(default)) - em(0)) * 1/2);
        left: 1px;
        width: 1px;

        background-color: palette(gray, xx-light);
      }

      color: palette(gray);
      font-size: rem(-2);

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {
          margin-bottom: rem(-3);
        }
      }
    }
  }

  .un-doc-sidebar__sub-link {
    display: inline-block;
    color: inherit;

    &:hover {
      color: palette(lightpurple);
      text-decoration: none;
    }
  }

</style>
