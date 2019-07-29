export default {
  metaInfo() {
    const vm = this

    return {
      title: vm.pageContent.title,
      meta: [{
        key: 'description',
        name: 'description',
        content: vm.pageContent.description
      }],
    }
  },
}
