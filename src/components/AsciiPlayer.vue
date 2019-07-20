<template>
  <figure :id="id"></figure>
</template>

<script>
  export default {
    props: ['id'],
    data() {
      return {
        source: `https://asciinema.org/a/${this.id}.js`,
        ascid: `asciicast-${this.id}`
      }
    },
    mounted() {
      // Can't use script tags directly apparently
      let asciiscript = document.createElement('script');
      asciiscript.setAttribute('src', this.source);
      asciiscript.setAttribute('id', this.ascid);
      console.log(this.id);
      document.getElementById(this.id).appendChild(asciiscript)
    }
  }
</script>
