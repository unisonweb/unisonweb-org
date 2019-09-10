<template>
  <component
    v-if="loadSVG"
    :is="loadSVG"
  />
</template>

<script>
  export default {
    props: {
      src: { type: String, default: () => null },
    },
    computed: {
      isSvg() {
        const filename = this.src.split('/').pop()
        const ext = filename.split('.').pop()
        return (ext === 'svg')
      },
      loadSVG() {
        return () => import(`~/../static${this.src}`)
      },
    },
    mounted() {

      if (this.src && this.isSvg) {
        this.loadSVG()
      }

    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
