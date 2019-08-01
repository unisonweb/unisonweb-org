<template>
  <div class="un-site-main__stage">

    <un-site-nav
      :nav-search="navSearch"
      :nav-inverted="navInverted"
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
  import SiteNav from '~/components/SiteNav/SiteNav'
  import SiteFooter from '~/components/SiteFooter'
  import CookiesNotice from '~/components/CookiesNotice'

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
    position: relative; // for positioning the site nav
  }

  .un-site-main__wrapper {
    min-height: 100vh;

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
