export default {
  methods: {
    isUrlHash(url) {
      return (url.indexOf('#') === 0)
    },
    isInternalLink(url) {
      const vm = this

      return (url.indexOf('http') === -1) && !vm.isUrlHash(url)
    },
  },
}
