<template>
  <div
    class="un-site-nav__stage"
    :class="{
      'is-inverted': navInverted,
    }">
    <div class="container">
      <div class="un-site-nav">

        <input
          class="un-site-nav__mobile-nav-toggle"
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

  .un-site-nav__stage {
    padding-top: dim(siteNav, paddingVertical);
    padding-bottom: dim(siteNav, paddingVertical);

    color: palette(black);
    background-color: palette(white);

    &.is-inverted {
      color: palette(white);
      background-color: palette(black);
    }
  }

  .un-site-nav {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .un-site-nav__mobile-nav-toggle {
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
        z-index: 1;

        display: block;
      }
    }
  }

</style>
