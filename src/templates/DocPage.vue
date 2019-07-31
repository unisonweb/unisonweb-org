<template>
  <uc-site-main
    :nav-search="true"
    :nav-inverted="true">
    <div class="container">
      <uc-page-section>

        <div class="uc-doc-page">
          <uc-doc-sidebar :links="links" />
          <uc-doc-content :content="$page.doc.content" />
        </div>

      </uc-page-section>
    </div>
  </uc-site-main>
</template>

<script>
  import links from '~/data/doc-links.yml'
  import DocContent from '~/components/DocContent'
  import DocSidebar from '~/components/DocSidebar'

  export default {
    computed: {
      links () {
        return links
      }
    },
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

    @include min-screen(breakpoint(md)) {
      display: flex;
      align-items: stretch;
    }
  }

</style>

<page-query>
  query DocPage ($path: String!) {
    doc: docPage (path: $path) {
      path
      title
      content
      headings (depth: h1) {
        value
      }
      subtitles: headings (depth: h2) {
        value
        anchor
      }
    }
  }
</page-query>
