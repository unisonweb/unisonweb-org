<template>
  <un-site-main>
    <un-page-section>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-7">

            <slot />

          </div>
          <div class="col-xs-12 col-sm-4 first-sm">

            <un-blog-sidebar />

          </div>
        </div>
      </div>
    </un-page-section>
  </un-site-main>
</template>

<script>
  import BlogSidebar from './partials/BlogSidebar/BlogSidebar'

  export default {
    components: {
      'un-blog-sidebar': BlogSidebar,
    },
  }
</script>

<style lang="scss">
  // 
</style>
