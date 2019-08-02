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

        <un-search v-if="withSearch" />

      </div>
    </div>
  </div>
</template>

<script>
  import Links from '~/components/SiteNav/Links'
  import Logo from '~/components/SiteNav/Logo'
  import MobileNavButton from '~/components/SiteNav/MobileNavButton'
  import Search from '~/components/Search'
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
      'un-search': Search,
    },
    mixins: [
      siteNavProps,
    ]
  }
</script>

<style lang="scss">

  .un-site-nav__stage {
    padding-top: dim(siteNav, verticalPadding);
    padding-bottom: dim(siteNav, verticalPadding);

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
          dim(siteNav, fontSize)
        + dim(siteNav, logoHeight)
        + dim(siteNav, fontSize)
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
