<template>
  <aside
    ref="notice"
    class="un-cookies-notice__stage animated slideInUp"
    style="display: none;"
    hidden>

    <input
      ref="noticeToggle"
      @change="setCookieToHideNotice"
      class="un-cookies-notice__toggle"
      type="checkbox"
      id="cookies-notice"
      aria-hidden="true"
      hidden
    />

    <div class="un-cookies-notice__wrapper">
      <label
        class="un-cookies-notice__close-button"
        for="cookies-notice"
        v-text="'&times;'"
      />
      <vue-simple-markdown
        class="un-cookies-notice"
        :source="componentContent.blurb"
      />
    </div>

  </aside>
</template>

<script>
  import Cookies from 'js-cookie'
  import componentContent from '~/data/components/cookies-notice.yml'

  export default {
    data() {
      return {
        COOKIE: 'UNISON_cookies'
      }
    },
    computed: {
      componentContent() {
        return componentContent
      },
    },
    methods: {
      setCookieToHideNotice() {

        // set the cookie
        Cookies.set(this.COOKIE, true);
        // hide the notice
        this.$refs['notice'].style.display = 'none'
        this.$refs['notice'].setAttribute('hidden', true)

      },
    },
    mounted() {

      if (!Cookies.get(this.COOKIE)) {
        // make the notice visible
        this.$refs['notice'].style.display = 'block'
        this.$refs['notice'].setAttribute('hidden', false)
      }

    },
  }
</script>

<style lang="scss">

  .un-cookies-notice__toggle {
    display: none;
  }

  .un-cookies-notice__stage {
    position: fixed;
    z-index: z-index(cookies-notice);
    bottom: 0;
    left: 0;
    width: 100%;

    display: none;

    @at-root .un-cookies-notice__toggle:checked ~ & {
      display: block;
    }
  }

  .un-cookies-notice__wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%, -100%, 0);

    @include max-screen(breakpoint(xs, max)) {
      width: container(xs);
      padding: rem(-2) #{rem(6) + rem(0)} rem(-2) rem(0);
      text-align: left;
    }

    @include min-screen(breakpoint(sm)) {
      width: calc(#{container(sm)} - #{rem(0) * 2});
      padding: rem(-2) #{rem(6) + rem(0)} rem(-2);
      text-align: center;
    }

    @include min-screen(breakpoint(md)) {
      width: calc(#{container(md)} - #{rem(0) * 4});
    }

    @include min-screen(breakpoint(lg)) {
      width: calc(#{container(lg)} - #{rem(0) * 4});
    }

    color: palette(white);
    background-color: palette(purple, xx-dark);

    @include min-screen(breakpoint(sm)) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .un-cookies-notice__close-button {
    $this: &;
    cursor: pointer;
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;

    width: rem(6);
    height: rem(6);

    font-size: 0;
    line-height: 0;
    white-space: nowrap;
    text-align: center;

    opacity: 0.5;

    &:hover {
      opacity: 1;
    }

    &:before {
      content: '\00D7'; // &times;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      font-size: rem(6);
    }
  }

  .un-cookies-notice {
    user-select: none;

    font-size: responsive rem(-2) rem(-1);
    font-range: breakpoint(xs, max) breakpoint(xl);
    line-height: line-height(half);

    a {
      color: inherit;
      text-decoration: underline;
    }
  }

</style>
