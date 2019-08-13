<template>
  <un-site-main>
    <div class="container">
      <div class="row center-xs u-align--left">
        <div class="col-xs-12 col-sm-10 col-md-9 col-lg-8 col-xl-6">

          <un-page-section>
            <un-content :content="$page.supplementalPage.content" />
          </un-page-section>

        </div>
      </div>
    </div>
  </un-site-main>
</template>

<page-query>
  query SupplementalPage ($path: String!) {
    supplementalPage: supplementalPage (path: $path) {
      title
      description
      content
    }
  }
</page-query>

<script>
  import Content from '~/components/Content'

  export default {
    metaInfo() {
      const { title, description } = this.$page.supplementalPage

      return {
        title: title,
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
    components: {
      'un-content': Content,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
