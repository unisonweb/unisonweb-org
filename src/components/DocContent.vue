<template>
  <div
    ref="content"
    class="uc-doc-content"
  />
</template>

<script>
  import 'prismjs'
  import 'prismjs/components/prism-unison'
  import 'prismjs/plugins/line-numbers/prism-line-numbers'

  export default {
    props: {
      content: { type: String, default: null },
    },
    data() {
      return {
        HTML: null,
      }
    },
    created() {
      const vm = this
      const $el = document.createElement('div')

      // convert the content string to actual HTML
      $el.innerHTML = vm.content

      // find all the `<pre>` tags, and add
      // the `line-numbers` class to each one
      $el.querySelectorAll('pre').forEach($pre => $pre.classList.add('uc-codeblock', 'line-numbers'))

      // save the modified HTML
      vm.HTML = $el.innerHTML

      // update Prism to select our custom codeblocks
      Prism.hooks.add('before-highlightall', function (env) {
        env.selector += ", .uc-codeblock code"
      })
    },
    mounted() {
      const vm = this

      // set the saved HTML
      vm.$refs['content'].innerHTML = vm.HTML

      // run the highlighter
      Prism.highlightAllUnder(vm.$refs['content'])
    },
  }
</script>

<style lang="scss">

  .uc-doc-content {

    h1, h2, h3, h4, h5, h6 {
      margin-top: em(5);

      &:first-child {
        margin-top: 0;
      }
    }

    h2, h3, h4, h5, h6 {
      display: flex;
      align-items: flex-start;

      > a {
        // position this link after the text
        order: 99;
        flex: 0 0 auto;

        // overrides to prevent text from displaying
        color: transparent;
        line-height: 0;

        $iconSize: rem(1);

        overflow: hidden;
        display: block;
        width: $iconSize;
        height: (
          em(0)
        - (font(sans, descent) * em(0))
        );

        margin-left: $iconSize;

        opacity: 0.25;

        &:hover {
          opacity: 1;
        }

        position: relative;

        &:before {
          content: '';

          display: block;
          width: 100%;
          height: 100%;

          background-image: url('/media/icon-link.svg');
          background-repeat: no-repeat;
          background-position: center center;

          // magic number to prevent display issues
          // with the icon appearing to be "cut off"
          background-size: 95%;
        }
      }
    }

    h1 {
      font-size: responsive rem(6) rem(8);
      font-range: breakpoint(xs, max) breakpoint(xl);

      > a {
        display: none;
      }

      + p {
        font-size: rem(2);
      }
    }
    h2 {
      font-size: responsive rem(4) rem(5);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }
    h3, h4 {
      font-size: responsive rem(2) rem(3);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }
    h5, h6 {
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
