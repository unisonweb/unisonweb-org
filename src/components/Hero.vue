<template>
  <header class="uc-hero">

    <uc-page-section tag="div" size="large">
      <div class="container">
        <div class="row center-xs start-md u-align--center@xs u-align--center@sm u-align--left">
          <div class="col-xs-12 col-sm-9 col-md-6">

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
              class="uc-button uc-button--orange uc-button--large"
              :url="cta.url">
              <strong v-text="cta.label" />
              <!-- icon -->
            </uc-link>

          </div>
        </div>
      </div>
    </uc-page-section>

    <slot />

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

  .uc-hero {
    overflow: hidden;
    position: relative; // for positioning the __eyebrow and __graphic

    color: palette(white);
    background-color: palette(primary);
  }

  .uc-hero__eyebrow {
    display: inline-block;

    margin-bottom: dim(pageSection, sm); // gap between __eyebrow and __heading
    margin-left: -#{rem(-2)}; // align left edge of the text with __heading

    padding: rem(-3) rem(-2);

    font-size: rem(-1);
    // letter-spacing: 0;
    line-height: line-height(base);

    border-radius: 99px; // big number to force rounded edges
    background-color: palette(primary, dark);
  }

  .uc-hero__heading {
    font-size: responsive rem(6) rem(10);
    font-range: breakpoint(xs, max) breakpoint(xl);
    letter-spacing: -#{3/100 * em(0)};
    line-height: line-height(base);
  }

  .uc-hero__blurb {
    margin-top: dim(pageSection, xs);
    margin-bottom: dim(pageSection, sm);
  }

</style>
