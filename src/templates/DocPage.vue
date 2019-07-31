<template>
  <uc-site-main
    :nav-search="true"
    :nav-inverted="true">
    <div class="container">
      <uc-page-section>

        <div class="uc-doc-page">
          <uc-doc-sidebar />
          <uc-doc-content :content="$page.doc.content" />
        </div>

      </uc-page-section>
    </div>
  </uc-site-main>
</template>

<script>
  import DocContent from '~/components/DocContent'
  import DocSidebar from '~/components/DocSidebar'

  export default {
    // metaInfo () {
    //   const { title, headings } = this.$page.doc

    //   return {
    //     title: title || (headings.length ? headings[0].value : undefined)
    //   }
    // }
    components: {
      'uc-doc-content': DocContent,
      'uc-doc-sidebar': DocSidebar,
    },
  }
</script>

<style lang="scss">

  .uc-doc-page {
    position: relative;
  }

</style>

<page-query>
  query DocPage ($path: String!) {
    doc: docPage (path: $path) {
      path
      title
      content
      headings (depth: h2) {
        value
      }
      subheadings: headings (depth: h3) {
        value
        anchor
      }
    }
  }
</page-query>
