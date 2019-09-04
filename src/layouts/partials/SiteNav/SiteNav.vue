<template>
  <div
    class="un-site-nav__stage"
    :class="{
      'is-inverted': isInverted,
      'with-search': withSearch,
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

        <Links :links="componentContent.links" />

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
  import componentContent from '~/data/components/site-nav.yml'
  import siteNavProps from '~/mixins/siteNavProps'

  export default {
    computed: {
      componentContent() {
        return componentContent
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
    @include drop-shadow;

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
  }

  .un-site-nav {
    position: relative;

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
