<template>
  <div
    class="un-site-nav__stage"
    :class="{
      'is-inverted': isInverted,
      'with-search': withSearch,
      'has-shadow': hasShadow,
    }">
    <div class="container">
      <div class="un-site-nav">

        <input
          class="un-site-nav__nav-toggle"
          type="checkbox"
          id="nav-toggle"
          style="display: none;"
          hidden
        />

        <Logo />

        <MobileNavButton />

        <Links :links="layoutContent.links" />

        <SearchBox v-if="withSearch" />

      </div>
    </div>
  </div>
</template>

<script>
  import Links from './Links'
  import Logo from './Logo'
  import MobileNavButton from './MobileNavButton'
  import SearchBox from './SearchBox'
  import layoutContent from '~/data/layouts/partials/site-nav.yml'
  import siteNavProps from '~/mixins/siteNavProps'

  export default {
    computed: {
      layoutContent() {
        return layoutContent
      },
    },
    components: {
      Links,
      Logo,
      MobileNavButton,
      SearchBox,
    },
    mixins: [
      siteNavProps,
    ]
  }
</script>

<style lang="scss">

  .un-site-nav__stage {

    @include max-screen(breakpoint(sm, max)) {
      padding-top: dim(siteNav, mobilePadding);
      padding-bottom: dim(siteNav, mobilePadding);
    }

    @include min-screen(breakpoint(md)) {
      padding-top: dim(siteNav, padding);
      padding-bottom: dim(siteNav, padding);
    }

    color: palette(black);
    background-color: palette(white);

    .un-site-nav__links__container {

      @include max-screen(breakpoint(xs, max)) {
        border-color: palette(gray, x-light);
        background-color: palette(gray, xxx-light);
      }
    }

    &.is-inverted {
      color: palette(white);
      background-color: palette(black);

      .un-site-nav__links__container {

        @include max-screen(breakpoint(xs, max)) {
          border-color: palette(black);
          background-color: palette(gray, xxx-dark);
        }
      }
    }

    &.with-search {

      @include max-screen(breakpoint(sm, max)) {
        margin-bottom: (
          dim(siteNav, mobilePadding)
        + dim(siteNav, logoHeight)
        + dim(siteNav, mobilePadding)
        );
      }
    }

    &.has-shadow {
      @include drop-shadow;
    }
  }

  .un-site-nav {
    position: relative;

    height: dim(siteNav, logoHeight);
    line-height: line-height(base);

    @include min-screen(breakpoint(sm)) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .un-site-nav__nav-toggle {
    display: none;

    &:checked {

      ~ .un-site-nav__logo,
      ~ .un-site-nav__mobile-nav-button {
        z-index: 2;
      }

      ~ .un-site-nav__mobile-nav-button {

        &:before {
          transform:
            translate3d(-50%, 0, 0)
            rotate(45deg);
        }

        &:after {
          transform:
            translate3d(-50%, 0, 0)
            rotate(-45deg);
        }
      }

      ~ .un-site-nav__links__stage {
        // z-index: 1;

        @include max-screen(breakpoint(xs, max)) {
          pointer-events: auto;
          opacity: 1;
          max-height: 100vh;
        }
      }
    }
  }

</style>
