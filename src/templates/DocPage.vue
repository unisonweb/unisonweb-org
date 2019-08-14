<template>
  <un-docs>

    <div class="un-doc-page">
      <un-content :content="$page.doc.content" />
      <un-doc-sidebar :headings="$page.doc.headings" />
    </div>

  </un-docs>
</template>

<script>
  import Docs from '~/layouts/Docs'
  import DocSidebar from '~/layouts/partials/DocSidebar/DocSidebar'
  import Content from '~/components/Content'

  export default {
    metaInfo() {
      const { title, headings, description } = this.$page.doc

      return {
        title: title || (headings.length ? headings[0].value : undefined),
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
    components: {
      'un-docs': Docs,
      'un-content': Content,
      'un-doc-sidebar': DocSidebar,
    },
  }
</script>

<style lang="scss">

  .un-doc-page {
    position: relative; // for positioning the sidebar

    @include min-screen(breakpoint(md)) {
      padding-right: (1/12 * 100%);
      padding-left: (4/12 * 100%);
    }

    &:before {

      @include min-screen(breakpoint(md)) {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;

        border-left: 1px solid palette(gray, xx-light);
      }

      @include screen(breakpoint(md), container(md) - 1) {
        left: (3/12 * 100%);
      }

      @include min-screen(container(md)) {
        left: (3/12 * container(md));
      }

      @include screen(breakpoint(lg), container(lg) - 1) {
        left: (3/12 * 100%);
      }

      @include min-screen(container(lg)) {
        left: (3/12 * container(lg));
      }
    }
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
        anchor
      }
    }
  }
</page-query>
