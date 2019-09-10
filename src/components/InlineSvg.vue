<template>
  <component
    v-if="!isLoading"
    :is="loadSVG"
  />
</template>

<script>
  export default {
    props: {
      src: { type: String, default: () => null },
    },
    data() {
      return {
        isLoading: true,
      }
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
        this.loadSVG().then(() => {
          this.isLoading = false
        })
      }

    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
