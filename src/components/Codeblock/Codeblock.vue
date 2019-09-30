<template>
  <div
    class="un-codeblock__wrapper"
    ref="codeblock">
    <button
      type="button"
      class="un-codeblock__copy-button"
      :class="{ 'is-copied': isCopied }"
      v-clipboard:copy="code"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">
      <inline-svg
        v-show="!isCopied"
        src="/media/icon-copy.svg"
        width="16"
        height="16"
      />
      <span
        v-text="buttonLabel"
      />
    </button>
  </div>
</template>

<script>
  const { Element } = require('global-object')

  export default {
    props: {
      HTML: { type: Element, default: null },
    },
    data() {
      return {
        code: null,
        isCopied: false,
      }
    },
    computed: {
      buttonLabel() {
        return (this.isCopied) ? 'Copied' : 'Copy'
      },
    },
    methods: {
      onCopy() {
        this.isCopied = true

        setTimeout(() => {
          this.isCopied = false
        }, 3000)
      },
      onError() {
        console.log('Oops, something went wrong. Please try again.')
      },
    },
    mounted() {
      this.$refs['codeblock'].appendChild(this.HTML)
      this.code = this.$refs['codeblock'].querySelector('code').innerText
    },
  }
</script>

<style lang="scss">
  // intentionally blank
  // styles are located in `src/assets/styles/codeblock/`
</style>
