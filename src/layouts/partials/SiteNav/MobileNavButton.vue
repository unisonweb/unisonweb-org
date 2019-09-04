<template>
  <label
    class="un-site-nav__mobile-nav-button"
    for="nav-toggle"
    v-html="'&nbsp;'"
  />
</template>

<script>
  //
</script>

<style lang="scss">

  .un-site-nav__mobile-nav-button {
    $iconSize: rem(4);

    @include max-screen(breakpoint(xs, max)) {
      user-select: none;

      // position absolutely to prevent this
      // element from affecting document flow;
      // this ensures the tallest element in
      // .site-nav is the __logo
      position: absolute;
      z-index: layers(mobileNavButton);
      top: 0;
      right: 0;
      transform: translate3d(
        // align the right-edge of the faux icon
        // with the right-edge of the .container
        // to keep the appearance of being aligned
        // with the content below
        #{(dim(siteNav, logoHeight) - $iconSize) * 1/2}, 0, 0
      );

      width: dim(siteNav, logoHeight);
      height: dim(siteNav, logoHeight);

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: 50%;

        width: $iconSize;
        height: 2px;

        background-color: currentColor;

        transition: transform .1s ease-in-out;
      }

      &:before {
        transform: translate3d(-50%, -#{rem(-3) * 1/2}, 0);
      }

      &:after {
        transform: translate3d(-50%, #{rem(-3) * 1/2}, 0);
      }
    }

    @include min-screen(breakpoint(sm)) {
      display: none;
    }
  }

</style>

