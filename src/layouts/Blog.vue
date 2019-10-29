<template>
  <un-site-main :has-shadow="true">
    <un-page-section>
      <div class="container">
        <div class="row center-xs u-align--left">
          <div class="col-xs-12 col-sm-9 col-md-7 col-md-offset-1">

            <slot />

          </div>
          <div class="col-xs-12 col-sm-9 col-md-4 first-md">

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
    metaInfo: {
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/feed.xml' }
      ]
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
