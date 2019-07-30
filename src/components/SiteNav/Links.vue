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

    @include max-screen(breakpoint(xs, max)) {
      position: absolute;
      top: 100%;
      left: -#{rem(3)};
      width: 100vw;

      margin-top: dim(siteNav, paddingVertical);
      padding-top: dim(siteNav, paddingVertical);
      padding-bottom: dim(siteNav, paddingVertical);

      border-top: 1px solid palette(gray, x-light);
      background-color: palette(gray, xxx-light);

      display: none;
    }

    @include min-screen(breakpoint(sm)) {
      display: flex;
      align-items: center;
    }
  }

  .uc-site-nav__links__container {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      @include max-screen(breakpoint(xs, max)) {
        text-align: center;
        // flex-direction: column;
        // align-items: center;
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

  .uc-site-nav__link {
    cursor: default;

    display: block;
    line-height: line-height(base);

    &, &:hover {
      cursor: pointer;
      text-decoration: none;
    }

    @include max-screen(breakpoint(xs, max)) {
      padding-top: dim(siteNav, paddingVertical);
      padding-bottom: dim(siteNav, paddingVertical);

      font-family: font(bold);
    }

    @include min-screen(breakpoint(sm)) {
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
