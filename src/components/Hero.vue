<template>
  <header class="un-hero">
    <un-page-section tag="div" size="large">
      <div class="container">

        <div class="row center-xs start-md u-align--center@xs u-align--center@sm u-align--left">
          <div class="col-xs-12 col-sm-9 col-md-6">

            <strong
              class="un-hero__eyebrow"
              v-html="eyebrow"
            />

            <h1
              class="un-hero__heading"
              v-html="heading"
            />

            <vue-markdown
              class="un-hero__blurb"
              :source="blurb"
            />

            <div class="un-hero__cta">
              <un-link
                class="un-button un-button--orange un-button--large u-nowrap"
                :url="cta.url">
                <strong v-html="`${cta.label}&nbsp;&nbsp;&rarr;`" />
              </un-link>
            </div>

          </div>
        </div>

        <slot />

      </div>
    </un-page-section>
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

  .un-hero {
    overflow: hidden;
    position: relative; // for positioning the __eyebrow and __graphic

    // TODO: figure out how to calculate the max-width so the pink
    // box underneath intersects the top right corner (yikes)
    // width: 100%;
    // max-width: calc(#{container(lg)} + #{dim(pageSection, lg) * 3});
    // margin-right: auto;
    // margin-left: auto;

    color: palette(white);
    background-color: palette(purple);
  }

  .un-hero__eyebrow {
    display: inline-block;

    margin-bottom: dim(pageSection, sm); // gap between __eyebrow and __heading
    margin-left: -#{rem(-2)}; // align left edge of the text with __heading

    padding: rem(-3) rem(-2);

    font-family: font(semibold);
    font-size: rem(-1);
    line-height: line-height(base);

    border-radius: 99px; // big number to force rounded edges
    background-color: palette(purple, dark);
  }

  .un-hero__heading {
    font-size: responsive rem(6) rem(11);
    font-range: breakpoint(xs, max) breakpoint(xl);
    letter-spacing: dim(letterSpacing, -4);
    line-height: line-height(base);
  }

  .un-hero__blurb {
    margin-top: dim(pageSection, xs);
    margin-bottom: dim(pageSection, sm);

    letter-spacing: dim(letterSpacing, -1);
  }

</style>
