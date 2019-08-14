<template>
  <div class="un-blog-sidebar">

    <h2
      class="u-margin--bottom"
      data-font-size="2"
      v-text="'Categories'"
    />

    <Categories />

    <un-page-section tag="div" class="u-padding--bottom--none">

      <h2
        class="u-margin--bottom"
        data-font-size="2"
        v-text="'Updates'"
      />

    </un-page-section>

  </div>
</template>

<script>
  import Categories from './Categories'

  export default {
    components: {
      Categories,
    },
  }
</script>

<style lang="scss">

  .un-blog-sidebar {

  }

</style>
