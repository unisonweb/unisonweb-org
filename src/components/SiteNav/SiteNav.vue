<template>
  <div
    class="uc-site-nav__stage"
    :class="{
      'is-inverted': navInverted,
    }">
    <div class="container">
      <div class="uc-site-nav">

        <input
          class="uc-site-nav__mobile-nav-toggle"
          type="checkbox"
          id="mobile-nav-toggle"
          style="display: none;"
          hidden
        />

        <Logo />

        <MobileNavButton />

        <Links :links="componentContent.links" />

      </div>
    </div>
  </div>
</template>

<script>
  import Links from '~/components/SiteNav/Links'
  import Logo from '~/components/SiteNav/Logo'
  import MobileNavButton from '~/components/SiteNav/MobileNavButton'
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
    },
    mixins: [
      siteNavProps,
    ]
  }
</script>

<style lang="scss">

  .uc-site-nav__stage {
    padding-top: dim(siteNav, paddingVertical);
    padding-bottom: dim(siteNav, paddingVertical);

    background-color: palette(white);

    .uc-site-nav__link {
      color: palette(black);
    }

    &.is-inverted {
      background-color: palette(black);

      .uc-site-nav__mobile-nav-button {

        @include max-screen(breakpoint(xs, max)) {
          color: palette(white);
        }
      }

      .uc-site-nav__link {

        @include min-screen(breakpoint(sm)) {
          color: palette(white);
        }
      }
    }
  }

  .uc-site-nav {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .uc-site-nav__mobile-nav-toggle {
    display: none;

    &:checked {

      ~ .uc-site-nav__logo,
      ~ .uc-site-nav__mobile-nav-button {
        z-index: 2;
      }

      ~ .uc-site-nav__mobile-nav-button {

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

      ~ .uc-site-nav__links__stage {
        z-index: 1;

        display: block;
      }
    }
  }

</style>
