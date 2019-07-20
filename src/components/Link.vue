<template>

  <a
    v-if="isUrlHash(url)"
    href="#"
    v-scroll-to="url">
    <slot />
  </a>

  <g-link
    v-else-if="isInternalLink(url)"
    :to="url">
    <slot />
  </g-link>

  <a
    v-else
    :href="url"
    target="_blank">
    <slot />
  </a>

</template>

<script>
  import links from '~/mixins/links'

  export default {
    props: {
      url: { type: String, default: null },
      newTab: { type: Boolean, default: false },
    },
    mixins: [
      links,
    ],
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
