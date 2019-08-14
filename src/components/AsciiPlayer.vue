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
      let $script = document.createElement('script')
      $script.setAttribute('src', this.source)
      $script.setAttribute('id', this.castId)

      this.player = $script
    },
    mounted() {
      this.$refs['player'].appendChild(this.player)
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
