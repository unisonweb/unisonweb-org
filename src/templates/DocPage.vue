<template>
  <un-site-main
    :nav-search="true"
    :nav-inverted="true">
    <div class="container">
      <un-page-section>

        <div class="un-doc-page">
          <un-doc-sidebar />
          <un-doc-content :content="$page.doc.content" />
        </div>

      </un-page-section>
    </div>
  </un-site-main>
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
      'un-doc-content': DocContent,
      'un-doc-sidebar': DocSidebar,
    },
  }
</script>

<style lang="scss">

  .un-doc-page {
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
