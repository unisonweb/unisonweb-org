<template>
  <div class="un-site-nav__links__stage">
    <ul class="un-site-nav__links__container">
      <li v-for="(link, i) in links" :key="i">
        <un-link
          class="un-site-nav__link"
          :url="link.url">
          {{link.label}}
        </un-link>
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

  .un-site-nav__links__stage {

    @include max-screen(breakpoint(xs, max)) {
      transform: translate3d(0, #{dim(siteNav, verticalPadding)}, 0);

      // hidden by default
      pointer-events: none;
      transition:
        opacity .5s ease-in-out,
        max-height .5s ease-in-out;
      opacity: 0;
      max-height: 0;
    }

    @include min-screen(breakpoint(sm)) {
      flex: 1 1 auto;
      order: 99;

      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .un-site-nav__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      @include max-screen(breakpoint(xs, max)) {
        margin-right: -#{rem(3)};
        margin-left: -#{rem(3)};

        padding-top: em(0);
        padding-bottom: em(0);

        text-align: center;

        border-color: transparent;
        border-style: solid;
        border-width: 1px 0;
      }

      @include min-screen(breakpoint(sm)) {
        display: flex;
        align-items: center;
      }

      > li {
        // <li> reset
        margin: 0;

        &:not(:last-child) {

          @include min-screen(breakpoint(sm)) {
            margin-right: rem(5);
          }
        }
      }
    }
  }

  .un-site-nav__link {
    cursor: default;

    display: block;

    font-family: font(semibold);
    font-size: dim(siteNav, fontSize);
    line-height: line-height(base);

    &, &:hover {
      color: inherit;
      cursor: pointer;
      text-decoration: none;
    }

    @include max-screen(breakpoint(xs, max)) {
      padding-top: em(0);
      padding-bottom: em(0);
    }

    @include min-screen(breakpoint(sm)) {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -#{em(0) * 1/2};
        left: 0;
        width: 100%;

        height: 1px;
        background-color: palette(lightpurple);

        transition:
          opacity .25s ease-in-out,
          transform .25s ease-in-out;
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
