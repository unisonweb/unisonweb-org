<template>
  <uc-site-main
    :nav-search="true"
    :nav-inverted="true">
    <div class="container">

      <uc-doc-content :content="$page.doc.content" />

    </div>
  </uc-site-main>
</template>

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

<script>
// import links from '@/data/doc-links.yaml'
import DocContent from '~/components/DocContent'

export default {
  // computed: {
  //   links () {
  //     return links
  //   }
  // },
  // metaInfo () {
  //   const { title, headings } = this.$page.doc

  //   return {
  //     title: title || (headings.length ? headings[0].value : undefined)
  //   }
  // }
  components: {
    'uc-doc-content': DocContent,
  },
}
</script>