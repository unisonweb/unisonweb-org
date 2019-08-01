<template>
  <un-link
    class="un-site-nav__logo__wrapper"
    title="Unison"
    url="/">
    <inline-svg
      class="un-site-nav__logo"
      src="/media/logo-unison.svg"
    />
  </un-link>
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

  .un-site-nav__logo__wrapper {
    display: block;
    width: auto;
    height: dim(siteNav, logoHeight);
    line-height: line-height(base);

    &, &:hover {
      color: inherit;
    }
  }

  .un-site-nav__logo {
    display: block;
    width: auto;
    height: 100%;

    fill: currentColor;
  }

</style>
