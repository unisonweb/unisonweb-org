<template>
  <ul class="u-list--unstyled">
    <li>
      <CategoryLink :category="latestCategory" />
    </li>
    <li
      v-for="(category, i) in categories" :key="i"
      class="u-margin--top">
      <CategoryLink :category="category" />
    </li>
  </ul>
</template>

<script>
  import CategoryLink from './CategoryLink'

  export default {
    data() {
      return {
        latestCategory: {
          path: '/blog',
          emoji: '⚡️',
          title: 'Latest'
        }
      }
    },
    computed: {
      categories() {
        return this.$static.allCategory.edges.map(edge => edge.node)
      },
    },
    components: {
      CategoryLink,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>

<static-query>
  query {
    allCategory {
      edges {
        node {
          id
          title
          path
          emoji
        }
      }
    }
  }
</static-query>
