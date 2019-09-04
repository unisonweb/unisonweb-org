<template>
  <div class="un-homepage-links__stage">

    <h2
      class="un-homepage-links__heading"
      v-text="heading"
    />

    <ul class="un-homepage-links__container u-list--unstyled">
      <li
        v-for="(item, i) in items" :key="i"
        class="un-homepage-link">
        <span
          class="un-homepage-link__icon"
          aria-hidden="true"
        />
        <un-link
          class="un-homepage-link__label"
          :url="item.url">
          {{item.label}}
        </un-link>
      </li>
    </ul>

    <div class="un-homepage-links__button">
      <a
        class="un-button un-button--purple"
        :href="button.url">
        <strong v-html="`${button.label}&nbsp;&nbsp;&rarr;`" />
      </a>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      heading: { type: String, default: null },
      items: { type: Array, default: null },
      button: { type: Object, default: null },
    },
  }
</script>

<style lang="scss">

  $headingFontSize: (rem(3) * 2);
  $defaultFontSize: rem(0);
  $itemPadding: rem(4);
  $iconSize: rem(5);

  .un-homepage-links__stage {
    position: relative;

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .un-homepage-links__heading {

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      // increase font size so the __heading
      // is wider than the __container. this
      // way, the left-edge of the __icons
      // will align with the left-edge of
      // the __heading
      font-size: $headingFontSize;
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
    letter-spacing: dim(letterSpacing, -4);
    line-height: line-height(base); // align top edge of text with top edge of parent element
  }

  .un-homepage-links__container {

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

  .un-homepage-link {
    padding-top: $itemPadding;
    padding-bottom: $itemPadding;
    padding-left: ($iconSize + $itemPadding);

    text-align: left;

    &:not(:last-child) {
      border-bottom: 1px solid palette(gray, xx-light);
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

  .un-homepage-link__icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 0);

    display: block;

    width: $iconSize;
    height: $iconSize;

    border-radius: 99px; // big number
    background-color: currentColor;

    &:before {
      content: '\02192';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      color: palette(white);
      font-weight: weight(bold);
    }
  }

  .un-homepage-link__label {
    color: palette(black);
    font-family: font(semibold);
  }

  .un-homepage-links__button {
    margin-top: ($itemPadding * 2);

    @include min-screen(breakpoint(md)) {
      padding-left: (6/12 * 100%);
    }
  }

</style>
