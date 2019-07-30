<template>
  <uc-site-main>

    <uc-hero
      :eyebrow="pageContent.hero.eyebrow"
      :heading="pageContent.hero.heading"
      :blurb="pageContent.hero.blurb"
      :cta="pageContent.hero.cta"
      :graphic="pageContent.hero.graphic">
      <uc-hero-graphic-for-homepage :graphic="pageContent.hero.graphic" />
    </uc-hero>

    <uc-page-section size="large">
      <div class="container">

        <vue-markdown
          class="uc-homepage-intro u-drop-cap"
          :source="pageContent.intro"
        />

      </div>
    </uc-page-section>

    <uc-page-section
      size="large"
      class="u-bg--gray--xxx-light">
      <div class="container">
        <div class="uc-homepage-ctas__stage u-align--center@xs u-align--center@sm">

          <h2
            class="uc-homepage-ctas__heading"
            v-text="pageContent.ctas.heading"
          />

          <ul class="uc-homepage-ctas__container u-list--unstyled">
            <li
              v-for="(item, i) in pageContent.ctas.items" :key="i"
              class="uc-homepage-cta">
              <span
                class="uc-homepage-cta__icon"
                aria-hidden="true"
              />
              <strong
                class="uc-homepage-cta__label"
                v-text="item.label"
              />
            </li>
          </ul>

          <div class="uc-homepage-ctas__button">
            <a
              class="uc-button uc-button--primary"
              :href="pageContent.ctas.button.url"
              v-text="pageContent.ctas.button.label"
            />
          </div>

        </div>
      </div>
    </uc-page-section>

  </uc-site-main>
</template>

<script>
  import pageContent from '~/data/pages/index.yml'
  import Hero from '~/components/Hero'
  import HeroGraphicForHomepage from '~/components/HeroGraphicForHomepage'
  import pageMetaInfo from '~/mixins/pageMetaInfo'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
    },
    components: {
      'uc-hero': Hero,
      'uc-hero-graphic-for-homepage': HeroGraphicForHomepage,
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">

  .uc-homepage-intro {

    > p {

      &:first-of-type {
        font-size: rem(2);
      }
    }
  }

  $headingFontSize: rem(6);
  $defaultFontSize: rem(0);
  $itemPadding: rem(4);
  $iconSize: rem(5);

  .uc-homepage-ctas__stage {
    position: relative;

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .uc-homepage-ctas__heading {

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      // increase font size so the __heading
      // is wider than the __container. this
      // way, the left-edge of the __icons
      // will align with the left-edge of
      // the __heading
      font-size: rem(7);
    }

    @include max-screen(breakpoint(sm, max)) {
      // space between __heading and __container
      margin-bottom: ($itemPadding * 2);
    }

    @include min-screen(breakpoint(md)) {
      position: absolute;
      top: $itemPadding; // keep this vertically aligned with the first <li>
      left: 0;
    }

    font-size: $headingFontSize;
    line-height: line-height(base); // align top edge of text with top edge of parent element
  }

  .uc-homepage-ctas__container {

    @at-root ul#{&} {
      margin-top: -#{$itemPadding};     // compensate for padding-top/bottom
      margin-bottom: -#{$itemPadding};  // of children <li>s

      // vertically align first <li>
      // with the heading
      padding-top: (
        ($headingFontSize * 1/2)
      - ($defaultFontSize * line-height(default) * 1/2)
      );

      @include min-screen(breakpoint(md)) {
        padding-left: (6/12 * 100%);
      }
    }
  }

  .uc-homepage-cta {
    padding-top: $itemPadding;
    padding-bottom: $itemPadding;
    padding-left: ($iconSize + $itemPadding);

    text-align: left;

    &:not(:last-child) {
      border-bottom: 1px solid palette(gray, x-light);
    }

    color: palette(yellow);

    &:nth-child(4n-2) {
      color: palette(orange);
    }

    &:nth-child(4n-1) {
      color: palette(pink);
    }

    &:nth-child(4n) {
      color: palette(lightpurple);
    }

    position: relative;
  }

  .uc-homepage-cta__icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 0);

    display: block;

    width: $iconSize;
    height: $iconSize;

    border-radius: 50%;
    background-color: currentColor;
  }

  .uc-homepage-cta__label {
    color: palette(black);
  }

  .uc-homepage-ctas__button {
    margin-top: ($itemPadding * 2);

    @include min-screen(breakpoint(md)) {
      padding-left: (6/12 * 100%);
    }
  }

</style>
