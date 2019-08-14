<template>
  <component
    v-if="inlineSvg"
    :is="inlineSvg"
  />
</template>

<script>
  export default {
    props: {
      src: { type: String, default: null },
    },
    data() {
      return {
        inlineSvg: null,
      }
    },
    computed: {
      isSvg() {

        if (!this.src) {
          return false
        }

        const filename = this.src.split('/').pop()
        const ext = filename.split('.').pop()
        return (ext === 'svg')
      },
      loader() {

        if (!this.isSvg) {
          return null
        }

        return () => import(`~/../static${this.src}?inline`)
      },
    },
    mounted() {

      this.loader().then(() => {
        this.inlineSvg = () => this.loader()
      })

    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
