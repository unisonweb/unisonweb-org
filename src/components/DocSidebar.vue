<template>
  <div class="uc-doc-sidebar">

    <ul class="uc-doc-sidebar__links">
      <li v-for="(link, i) in links" :key="i">
        <g-link
          :to="link.url">
          {{link.label}}
        </g-link>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    props: {
      links: { type: Array, defaul: null },
    },
  }
</script>

<style lang="scss">

  .uc-doc-sidebar {

    @include min-screen(breakpoint(md)) {
      flex: 0 0 auto;
      width: (3/12 * 100%);
    }
  }

  .uc-doc-sidebar__links {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      > li {
        // <li> reset
        margin: 0;
      }
    }

    a {

      &, &:hover {
        color: palette(black);
      }

      &.active {
        font-family: font(bold);
      }
    }
  }

</style>
