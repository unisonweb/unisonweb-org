<template>
  <uc-link
    class="uc-site-nav__logo__wrapper"
    title="Unison"
    url="/">
    <inline-svg
      class="uc-site-nav__logo"
      src="/media/logo-unison.svg"
    />
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

  .uc-site-nav__logo__wrapper {
    display: block;
    width: auto;
    height: dim(siteNav, logoHeight);
    line-height: line-height(base);

    &, &:hover {
      color: inherit;
    }
  }

  .uc-site-nav__logo {
    display: block;
    width: auto;
    height: 100%;

    fill: currentColor;
  }

</style>
