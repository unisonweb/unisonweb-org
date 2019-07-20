<template>
  <div class="uc-site-nav__links__stage">
    <ul class="uc-site-nav__links__container">
      <li v-for="(link, i) in links" :key="i">
        <uc-link
          class="uc-site-nav__link"
          :url="link.url">
          {{link.label}}
        </uc-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import links from '~/mixins/links'

  export default {
    props: {
      links: { type: Array, default: null },
    },
    mixins: [
      links,
    ],
  }
</script>

<style lang="scss">

  .uc-site-nav__links__stage {

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;

      background-color: rgba(palette(primary), 0.9);

      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      display: none;
    }

    @include min-screen(breakpoint(md)) {
      display: flex;
      align-items: center;
    }

    .uc-social-links__container {

      @include max-screen(breakpoint(sm, max)) {
        margin-top: rem(3);
      }

      @include min-screen(breakpoint(md)) {
        margin-left: rem(5);
      }
    }
  }

  .uc-site-nav__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      display: flex;

      @include max-screen(breakpoint(sm, max)) {
        flex-direction: column;
        align-items: center;
      }

      @include min-screen(breakpoint(md)) {
        align-items: center;
      }

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {

          @include max-screen(breakpoint(sm, max)) {
            margin-bottom: rem(3);
          }

          @include min-screen(breakpoint(md)) {
            margin-right: rem(5);
          }
        }
      }
    }

    @include max-screen(breakpoint(sm, max)) {

      a {
        display: block;
        font-size: rem(3);
      }
    }
  }

  .uc-site-nav__link {
    cursor: default;

    display: block;
    line-height: line-height(base);

    &, &:hover {
      cursor: pointer;
      color: palette(black);
      text-decoration: none;
    }

    @include min-screen(breakpoint(md)) {
      font-size: dim(siteNav, fontSize);

      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -#{em(0) * 1/2};
        left: 0;
        width: 100%;

        height: 1px;
        background-color: palette(pink);

        transition:
          opacity .45s ease-in-out,
          transform .45s ease-in-out;
        opacity: 0;
        transform: scale(0);
        transform-origin: left;
      }

      &:hover {

        &:after {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }

</style>
