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

        <label
          class="uc-site-nav__mobile-nav-button"
          for="mobile-nav-toggle"
          v-html="'&nbsp;'"
        />

        <Links :links="componentContent.links" />

      </div>
    </div>
  </div>
</template>

<script>
  import Links from '~/components/SiteNav/Links'
  import Logo from '~/components/SiteNav/Logo'
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

      .uc-site-nav__link {
        color: palette(white);
      }
    }
  }

  .uc-site-nav {
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

        display: flex;
      }
    }
  }

  .uc-site-nav__mobile-nav-button {

    @include max-screen(breakpoint(sm, max)) {
      user-select: none;

      // position absolutely to prevent this
      // element from affecting document flow;
      // this ensures the tallest element in
      // .site-nav is the __logo
      position: absolute;
      z-index: z-index(mobileNavButton);
      top: 50%;
      right: rem(0);
      transform: translate3d(0, -50%, 0);

      width: rem(6);
      height: rem(6);

      color: palette(white);

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: 50%;

        width: rem(4);
        height: 1px;

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

    @include min-screen(breakpoint(md)) {
      display: none;
    }
  }

</style>
