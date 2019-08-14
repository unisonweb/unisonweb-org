export default {
  methods: {
    isUrlHash(url) {
      return (url.indexOf('#') === 0)
    },
    isInternalLink(url) {
      return (url.indexOf('http') === -1) && !this.isUrlHash(url)
    },
  },
}
