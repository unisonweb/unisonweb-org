<template>
  <un-link
    class="un-site-nav__logo__wrapper"
    title="Unison"
    url="/">
    <Logo class="un-site-nav__logo" />
  </un-link>
</template>

<script>
  import Logo from '~/../static/media/logo-unison.svg'
  import links from '~/mixins/links'

  export default {
    components: {
      Logo,
    },
    mixins: [
      links,
    ],
  }
</script>

<style lang="scss">

  .un-site-nav__logo__wrapper {
    display: inline-block;
    width: auto;
    height: dim(siteNav, logoHeight);
    line-height: line-height(base);

    &, &:hover {
      color: inherit;
    }
  }

  .un-site-nav__logo {
    display: inline-block;
    width: auto;
    height: 100%;

    fill: currentColor;
  }

</style>
