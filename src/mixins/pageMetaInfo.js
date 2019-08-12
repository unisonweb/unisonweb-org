export default {
  metaInfo() {
    const { title, description } = this.pageContent

    return {
      title: title,
      meta: [{
        key: 'description',
        name: 'description',
        content: description,
      }],
    }
  },
}
