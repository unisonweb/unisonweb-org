<template>
  <div class="uc-site-main__platform">
    <uc-site-nav />

    <div class="uc-site-main__wrapper">
      <main
        class="uc-site-main"
        role="main"
        tabindex="-1">
        <slot />
      </main>

      <uc-site-footer />
    </div>

    <uc-cookies-notice />
  </div>
</template>

<script>
import SiteNav from '~/components/SiteNav/SiteNav'
import SiteFooter from '~/components/SiteFooter'
import CookiesNotice from '~/components/CookiesNotice'

export default {
  components: {
    'uc-site-nav': SiteNav,
    'uc-site-footer': SiteFooter,
    'uc-cookies-notice': CookiesNotice,
  },
}
</script>

<style lang="scss">

  .uc-site-main__platform {
    position: relative; // for positioning the site nav
  }

  .uc-site-main__wrapper {
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .uc-site-main {
    $this: &;

    @at-root main#{&} {
      // <main> overrides
      outline: none !important;
      box-shadow: none !important;
    }
  }

</style>
