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
        const vm = this

        if (!vm.src) {
          return false
        }

        const filename = vm.src.split('/').pop()
        const ext = filename.split('.').pop()
        return (ext === 'svg')
      },
      loader() {
        const vm = this

        if (!vm.isSvg) {
          return null
        }

        return () => import(`~/../static${vm.src}?inline`)
      },
    },
    mounted() {
      const vm = this

      vm.loader().then(() => {
        vm.inlineSvg = () => vm.loader()
      })
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
