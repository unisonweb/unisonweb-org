<template>
  <div class="un-site-main__stage">

    <un-site-nav
      :with-search="withSearch"
      :is-inverted="isInverted"
    />

    <div class="un-site-main__wrapper">
      <main
        class="un-site-main"
        role="main"
        tabindex="-1">
        <slot />
      </main>

      <un-site-footer />
    </div>

    <un-cookies-notice />

  </div>
</template>

<script>
  import siteNavProps from '~/mixins/siteNavProps'
  import SiteNav from './partials/SiteNav/SiteNav'
  import SiteFooter from './partials/SiteFooter'
  import CookiesNotice from './partials/CookiesNotice'

  export default {
    components: {
      'un-site-nav': SiteNav,
      'un-site-footer': SiteFooter,
      'un-cookies-notice': CookiesNotice,
    },
    mixins: [
      siteNavProps,
    ]
  }
</script>

<style lang="scss">

  .un-site-main__stage {
    // intentionally blank
  }

  .un-site-main__wrapper {
    $siteNavHeight: (
      dim(siteNav, verticalPadding)
    + dim(siteNav, logoHeight)
    + dim(siteNav, verticalPadding)
    );

    min-height: calc(100vh - #{$siteNavHeight});

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .un-site-main {
    $this: &;

    @at-root main#{&} {
      // <main> overrides
      outline: none !important;
      box-shadow: none !important;
    }
  }

</style>
