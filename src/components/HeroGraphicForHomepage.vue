<template>
  <span
    class="uc-homepage-hero-graphic__wrapper"
    aria-hidden="true">
    <inline-svg
      class="uc-homepage-hero-graphic"
      :src="graphic.path"
      :alt="graphic.alt"
      :title="graphic.title"
    />
  </span>
</template>

<script>
  export default {
    props: {
      graphic: { type: Object, default: null },
    }
  }
</script>

<style lang="scss">

  .uc-homepage-hero-graphic__wrapper {

    @include max-screen(breakpoint(xs, max)) {
      margin-bottom: (dim(pageSection, xs) * 2);
    }

    @include max-screen(breakpoint(sm, max)) {
      position: relative;

      width: (7/12 * 100%);
      margin-right: auto;
      margin-left: auto;

      margin-bottom: (dim(pageSection, sm) * 2);
    }

    @include min-screen(breakpoint(md)) {
      position: absolute;
      top: 0;
      bottom: 0;

      height: 100%;
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
      // pull the left edge 1 column width away from the content
      left: calc(50% + #{1/12 * container(lg)});
      // pull the right edge 1 column width outside from the edge of the .container
      right: calc(50% - #{7/12 * container(lg)} + #{rem(0)});
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

    display: flex;
  }

  .uc-homepage-hero-graphic {
    position: relative;
    z-index: 2;
    display: block;
    margin: auto;
    width: 100%;
  }

</style>
