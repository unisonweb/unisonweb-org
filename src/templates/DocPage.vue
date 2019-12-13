<template>
  <un-docs>

    <div class="un-doc-page">
      <un-content
        ref="content"
        :content="$page.docPage.content"
      />
      <un-doc-sidebar
        ref="sidebar"
        :headings="$page.docPage.headings"
      />
    </div>

  </un-docs>
</template>

<script>
  import debounce from 'lodash.debounce'
  import Docs from '~/layouts/Docs'
  import DocSidebar from '~/layouts/partials/DocSidebar/DocSidebar'
  import Content from '~/components/Content'
  import { UCbreakpoints as breakpoints } from '~/data/breakpoints.yml'

  export default {
    metaInfo() {
      const { title, headings, description } = this.$page.docPage

      return {
        title: title || (headings.length ? headings[0].value : undefined),
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
    methods: {
      setContentMinHeight() {
        if (window.matchMedia(`(min-width: ${breakpoints.md.min})`).matches) {
          // only set `min-height` for desktop screens
          const height = this.$refs['sidebar'].$refs['getSidebarHeight'].offsetHeight
          this.$refs['content'].$el.style.minHeight = `${height}px`
        } else {
          // if we're on a mobile/tablet screen, remove `min-height`
          this.$refs['content'].$el.style.minHeight = null
        }
      },
    },
    mounted() {
      if (process.isClient) {
        this.setContentMinHeight()
        window.addEventListener('resize', debounce(this.setContentMinHeight, 300))
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

    @include min-screen(breakpoint(md)) {
      position: relative; // for positioning __sidebar

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
    docPage: docPage (path: $path) {
      path
      title
      content
      headings (depth: h6) {
        value
        anchor
      }
    }
  }
</page-query>
