<template>
  <un-site-main :has-shadow="true">
    <un-page-section>
      <div class="container">
        <div class="row center-xs u-align--left">
          <div class="col-xs-12 col-sm-9 col-md-8">

            <slot />

          </div>
          <div class="col-xs-12 col-sm-9 col-md-8">

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
  // intentionally blank
</style>
