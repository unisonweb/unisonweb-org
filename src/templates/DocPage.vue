<template>
  <un-site-main
    :with-search="true"
    :is-inverted="true">
    <div class="container">
      <un-page-section>

        <div class="un-doc-page">
          <un-sidebar
            :links="sidebarNav.links"
            :headings="$page.doc.headings"
          />
          <un-doc-content :content="$page.doc.content" />
        </div>

      </un-page-section>
    </div>
  </un-site-main>
</template>

<script>
  import DocContent from '~/components/DocContent'
  import Sidebar from '~/components/Sidebar/Sidebar'
  import sidebarNav from '~/data/sidebar-nav.yml'

  export default {
    metaInfo () {
      const { title, headings } = this.$page.doc

      return {
        title: title || (headings.length ? headings[0].value : undefined)
      }
    },
    computed: {
      sidebarNav() {
        return sidebarNav
      },
    },
    components: {
      'un-doc-content': DocContent,
      'un-sidebar': Sidebar,
    },
  }
</script>

<style lang="scss">

  .un-doc-page {
    position: relative; // for positioning the sidebar

    @include min-screen(breakpoint(md)) {
      padding-right: (1/12 * 100%);
      padding-left: (4/12 * 100%);

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;

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

        border-left: 1px solid palette(gray, xx-light);
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
