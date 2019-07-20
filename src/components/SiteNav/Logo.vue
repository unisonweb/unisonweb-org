<template>
  <uc-link
    class="uc-site-nav__logo"
    title="Unison"
    url="/">
    Unison
  </uc-link>
</template>

<script>
  import links from '~/mixins/links'

  export default {
    mixins: [
      links,
    ],
  }
</script>

<style lang="scss">

  .uc-site-nav__logo {
    display: block;
    width: auto;
    height: dim(siteNav, logoHeight);
    line-height: line-height(base);

    > svg {
      display: block;
      width: auto;
      height: 100%;
    }
  }

</style>
