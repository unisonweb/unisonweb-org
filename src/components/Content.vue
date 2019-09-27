<template>
  <div
    ref="content"
    class="un-content"
    v-html="content"
  />
</template>

<script>
  import 'prismjs'
  import 'prismjs/components/prism-unison'
  import 'prismjs/plugins/line-numbers/prism-line-numbers'
  import mediumZoom from 'medium-zoom'
  import Vue from 'vue'
  import Codeblock from '~/components/Codeblock/Codeblock'
  import AsciiPlayer from '~/components/AsciiPlayer'

  const CodeblockClass = Vue.extend(Codeblock)
  const AsciiPlayerClass = Vue.extend(AsciiPlayer)

  export default {
    props: {
      content: { type: String, default: null },
    },
    methods: {
      processCodeblocks() {
        this.$refs['content']
          .querySelectorAll('.un-codeblock')
          .forEach($codeblock => {
            const $codeblockWrapper = $codeblock.parentNode
            const instance = new CodeblockClass({
              propsData: { HTML: $codeblock.cloneNode(true) }
            })

            instance.$mount()
            this.$refs['content'].insertBefore(instance.$el, $codeblockWrapper)
            $codeblockWrapper.remove()
          })
      },
      processAsciiPlayers() {
        this.$refs['content']
          .querySelectorAll('script')
          .forEach($script => {
            if ($script.id.includes('asciicast')) {
              const instance = new AsciiPlayerClass({
                propsData: { id: $script.id.split('-').pop() }
              })

              instance.$mount()
              this.$refs['content'].insertBefore(instance.$el, $script)
              $script.remove()
            }
          })
      },
      refreshContent() {

        this.$nextTick(() => {
          this.processCodeblocks()
          this.processAsciiPlayers()
          Prism.highlightAllUnder(this.$refs['content'])
        })
      },
    },
    created() {

      Prism.hooks.add('before-highlightall', function(env) {
        env.selector += ", .un-codeblock code"
      })

    },
    mounted() {
      this.refreshContent()
      mediumZoom(this.$refs['content'].querySelectorAll('.g-image'))
    },
    updated() {
      this.refreshContent()
      this.processAsciiPlayers()
    },
  }
</script>

<style lang="scss">

  .un-content {

    @include min-screen(breakpoint(md)) {

      .un-codeblock__wrapper {

        // make the right-edge of codeblocks
        // touch the right edge of .un-content
        margin-right: -#{1/12 * 100%};
        padding-right: (rem(3) * 1/2);
      }
    }

    h1, h2, h3, h4, h5, h6 {
      margin-top: em(3);

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
        height: (em(0) * line-height(half));

        margin-left: ($iconSize * 1/2);

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
          background-size: 90% auto;
        }
      }
    }

    h1 {
      font-size: responsive rem(6) rem(7);
      font-range: breakpoint(xs, max) breakpoint(xl);
      letter-spacing: dim(letterSpacing, -3);

      > a {
        display: none;
      }
    }
    h2 {
      font-size: responsive rem(3) rem(4);
      font-range: breakpoint(xs, max) breakpoint(xl);
      letter-spacing: dim(letterSpacing, -3);
    }
    h3, h4 {
      font-size: responsive rem(2) rem(3);
      font-range: breakpoint(xs, max) breakpoint(xl);
      letter-spacing: dim(letterSpacing, -2);
    }
    h5, h6 {
      font-size: responsive rem(0) rem(1);
      font-range: breakpoint(xs, max) breakpoint(xl);
    }

    > p:first-of-type {
      font-family: font(light);
      font-size: responsive rem(1) rem(2);
      font-range: breakpoint(xs, max) breakpoint(xl);
      letter-spacing: dim(letterSpacing, -2);
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

      margin-top: dim(pageSection, sm);
      margin-bottom: dim(pageSection, sm);
    }

    ul, ol {
      // reset
      padding: 0;

      > li {
        margin-left: rem(2);
        padding-left: (rem(0) * 1/2);

        & + li {
          margin-top: (rem(-2) * 1/2);
        }
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
          transform: translate3d(-50%, 0, 0);
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

    blockquote {
      margin-top: dim(pageSection, sm);
      margin-bottom: dim(pageSection, sm);
      padding: rem(3);

      border-left: 2px solid palette(yellow, xx-light);
      background-color: palette(yellow, xxx-light);
    }
  }

  .medium-zoom-overlay {
    z-index: 3; // keep zoomed images above .un-codeblocks
  }

  .medium-zoom-image {
    z-index: 4; // keep zoomed images above .un-codeblocks
  }

</style>
