<template>
  <header class="uc-hero">

    <uc-page-section tag="div" size="large">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-5 col-md-offset-1">

            <strong
              class="uc-hero__eyebrow"
              v-html="eyebrow"
            />

            <h1
              class="uc-hero__heading"
              v-html="heading"
            />

            <vue-markdown
              class="uc-hero__blurb"
              :source="blurb"
            />

            <uc-link
              class="uc-button uc-button--yellow uc-button--large"
              :url="cta.url">
              <strong v-text="cta.label" />
              <!-- icon -->
            </uc-link>

          </div>
        </div>
      </div>
    </uc-page-section>

    <span
      class="uc-hero__graphic"
      aria-hidden="true">
      <img
        class="js-lazyLoad"
        :data-src="graphic.path"
        alt=""
        title=""
      />
    </span>

  </header>
</template>

<script>
  import lazyLoad from '~/mixins/lazyLoad'

  export default {
    props: {
      eyebrow: { type: String, default: null },
      heading: { type: String, default: null },
      blurb: { type: String, default: null },
      cta: { type: Object, default: null },
      graphic: { type: Object, default: null },
    },
    mixins: [
      lazyLoad,
    ],
  }
</script>

<style lang="scss">

  $eyebrowPadding: rem(-3);
  $eyebrowFontSize: rem(-1);

  .uc-hero {
    overflow: hidden;
    position: relative; // for positioning the __eyebrow and __graphic

    color: palette(white);
    background-color: palette(primary);

    @include max-screen(breakpoint(xs, max)) {
      // push down content to make room for the __eyebrow
      padding-top: (
        $eyebrowPadding
      + $eyebrowFontSize
      + $eyebrowPadding
      );
    }
  }

  .uc-hero__eyebrow {
    padding-top: $eyebrowPadding;
    padding-bottom: $eyebrowPadding;
    font-size: $eyebrowFontSize;
    line-height: line-height(base);
    background-color: palette(primary, dark);

    @include max-screen(breakpoint(xs, max)) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      padding-right: rem(0); // match .container
      padding-left: rem(0);
    }

    @include min-screen(breakpoint(sm)) {
      display: inline-block;
      margin-bottom: dim(pageSection, sm); // gap between __eyebrow and __heading
      margin-left: -#{rem(-2)}; // align left edge of the text with __heading
      padding-right: rem(-2);
      padding-left: rem(-2);
      border-radius: 99px; // big number to force rounded edges
    }
  }

  .uc-hero__heading {
    font-size: responsive rem(5) rem(10);
    font-range: breakpoint(xs, max) breakpoint(xl);
    letter-spacing: -#{3/100 * em(0)};
    line-height: line-height(base);
  }

  .uc-hero__blurb {
    margin-top: dim(pageSection, sm);
    margin-bottom: dim(pageSection, sm);
  }

  .uc-hero__graphic {

    @include max-screen(breakpoint(xs, max)) {
      display: none;
    }

    @include min-screen(breakpoint(sm)) {
      position: absolute;
      top: 0;
      bottom: 0;

      height: 100%;

      display: flex;

      > img {
        position: relative;
        z-index: 2;
        display: block;
        margin: auto;
        width: 100%;
      }
    }

    @include screen(breakpoint(sm, min), #{container(sm) - 1}) {
      // pull the left edge 1/2 of a column width away from the content
      left: calc(50% + #{.5/12 * 100%});
      // pull the right edge to align with the edge of the .container
      right: calc(50% - #{6/12 * 100%} + #{rem(0)});
    }

    @include min-screen(container(sm)) {
      // pull the left edge 1/2 of a column width away from the content
      left: calc(50% + #{.5/12 * container(sm)});
      // pull the right edge to align with the edge of the .container
      right: calc(50% - #{6/12 * container(sm)} + #{rem(0)});
    }

    @include screen(breakpoint(md, min), #{container(md) - 1}) {
      // pull the left edge 1/2 of a column width away from the content
      left: calc(50% + #{.5/12 * 100%});
      // pull the right edge to align with the edge of the .container
      right: calc(50% - #{6/12 * 100%} + #{rem(0)});
    }

    @include min-screen(container(md)) {
      // pull the left edge 1/2 of a column width away from the content
      left: calc(50% + #{.5/12 * container(md)});
      // pull the right edge to align with the edge of the .container
      right: calc(50% - #{6/12 * container(md)} + #{rem(0)});
    }

    @include min-screen(breakpoint(lg)) {
      // pull the left edge 1/2 of a column width away from the content
      left: calc(50% + #{.5/12 * container(lg)});
      // pull the right edge 1 column width away from the edge of the .container
      right: calc(50% - #{5/12 * container(lg)} + #{rem(0)});
    }

    &:before {
      content: '';
      position: absolute;
      z-index: 1;
      top: 50%;
      left: 0;

      transform-origin: top center;
      transform:
        translate3d(0, 0, 0)
        rotate(-45deg)
        scale(10);

      width: 100%;
      height: 0;
      padding-top: 100%;

      background-color: palette(pink);
    }
  }

</style>
