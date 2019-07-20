<template>
  <footer
    class="uc-site-footer"
    role="contentinfo">
    <uc-page-section tag="div">
      <div class="container">

        <vue-markdown
          class="u-align--right u-align--center@xs"
          :source="componentContent.meta"
        />

      </div>
    </uc-page-section>
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