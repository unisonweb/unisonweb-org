<template>
  <figure
    class="uc-asciiplayer"
    ref="player"
    :id="id"
  />
</template>

<script>
  export default {
    props: {
      id: { type: String, default: null },
    },
    data() {
      return {
        source: `https://asciinema.org/a/${this.id}.js`,
        castId: `asciicast-${this.id}`,
        player: null,
      }
    },
    created() {
      const vm = this

      let $script = document.createElement('script')
      $script.setAttribute('src', vm.source)
      $script.setAttribute('id', vm.castId)

      vm.player = $script
    },
    mounted() {
      const vm = this

      vm.$refs['player'].appendChild(vm.player)
    }
  }
</script>

<style lang="scss">

  .uc-asciiplayer {
    // <figure> reset
    margin: 0;

    margin-top: rem(3);
    margin-bottom: rem(3);

    > .asciicast {
      // overrides
      margin: 0 !important;
    }
  }

</style>
