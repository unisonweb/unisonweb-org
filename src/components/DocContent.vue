<template>
  <div
    class="uc-doc-content"
    v-html="content"
  />
</template>

<script>
  export default {
    props: {
      content: { type: String, defaul: null },
    },
  }
</script>

<style lang="scss">

  .uc-doc-content {

    h1, h2, h3, h4, h5, h6 {

      &:first-child {
        margin-top: 0;
      }
    }

    h1 {
      margin-top: em(6);
      font-size: responsive rem(4) rem(5);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }
    h2 {
      margin-top: em(6);
      font-size: responsive rem(2) rem(4);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }
    h3, h4 {
      margin-top: em(0);
      font-size: responsive rem(1) rem(2);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }
    h5, h6 {
      margin-top: em(0);
      font-size: responsive rem(0) rem(1);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }

    a {

      &, &:hover {
        text-decoration: underline;
      }
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;

      @include max-screen(breakpoint(xs, max)) {
        width: 100%;
      }

      margin-top: rem(6);
      margin-bottom: rem(6);
    }

    .wp-caption {
      max-width: 100%;

      @include max-screen(breakpoint(xs, max)) {
        width: 100% !important;
      }

      margin-bottom: rem(6);

      > img {
        margin-bottom: 0;
      }
    }

    .wp-caption-text {
      margin-top: rem(-3);

      color: palette(gray);
      font-size: rem(-1);
      text-align: center;
    }

    ul, ol {
      // reset
      padding: 0;

      > li {
        margin-left: rem(2);
        padding-left: (rem(0) * 1/2);
      }
    }

    ul {
      // <ul> reset
      list-style: none;

      > li {
        position: relative;

        &:before {
          content: '\2022';
          position: absolute;
          top: 0;
          left: -#{rem(2) * 1/2};
        }
      }
    }

    hr {
      margin-top: rem(6);
      margin-bottom: rem(6);

      border-color: palette(gray, xx-light);
    }

    table {

      th, td {
        padding-right: rem(0);
        padding-bottom: rem(-3);
        padding-left: rem(1);
        border-right: 1px solid palette(gray, xx-light);

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
          border-right: none;
        }
      }

      td {
        vertical-align: top;

        padding-top: rem(-3);

        border-top: 1px solid palette(gray, xx-light);
      }

      ul {
        // <ul> reset
        margin: 0;
        padding: 0;
        list-style: none;

        > li {
          // <li> reset
          margin: 0;

          &:not(:last-child) {
            margin-bottom: rem(-3);
          }
        }
      }
    }
  }

</style>
