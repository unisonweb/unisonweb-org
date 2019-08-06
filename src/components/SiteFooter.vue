<template>
  <footer
    class="un-site-footer"
    role="contentinfo">
    <un-page-section tag="div">
      <div class="container">

        <vue-simple-markdown
          class="u-align--center"
          data-font-size="-1"
          :source="componentContent.meta"
        />

      </div>
    </un-page-section>
  </footer>
</template>

<script>
  import componentContent from '~/data/components/site-footer.yml'

  export default {
    computed: {
      componentContent() {
        return componentContent
      },
    },
  }
</script>

<style lang="scss">
  // 
</style>