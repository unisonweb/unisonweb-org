<template>
  <div
    class="un-doc-sidebar__platform"
    :class="{ 'un-doc-sidebar__platform--show-mobile-bg': isVisible }">
    <div
      class="un-doc-sidebar__stage"
      v-on-clickaway="closeSidebar">

      <input
        ref="sidebarToggle"
        class="un-doc-sidebar__mobile-sidebar-toggle"
        type="checkbox"
        id="sidebar-toggle"
        style="display: none;"
        hidden
        @change="handleChange"
      />

      <div class="un-doc-sidebar__page-title">
        <label
          class="un-doc-sidebar__mobile-sidebar-button"
          for="sidebar-toggle"
          role="button">
          <inline-svg src="/media/menu.svg" />
        </label>
        <span v-text="pageTitle" />
      </div>

      <div class="un-doc-sidebar__wrapper">
        <div class="un-doc-sidebar">

          <LinkSets
            :link-sets="layoutContent.linkSets"
            :headings="headings"
            :current-path="currentPath"
          />

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import find from 'lodash.find'
  import flatten from 'lodash.flatten'
  import { mixin as clickaway } from 'vue-clickaway'
  import layoutContent from '~/data/layouts/partials/doc-sidebar.yml'
  import LinkSets from './LinkSets'
  import triggerEvent from '~/assets/scripts/utils/triggerEvent'

  export default {
    props: {
      headings: { type: Array, default: null },
    },
    data() {
      return {
        isVisible: false,
      }
    },
    computed: {
      layoutContent() {
        return layoutContent
      },
      currentPath() {
        return this.$route.matched[0].path
      },
      links() {
        const links = this.layoutContent.linkSets.map(linkSet => {
          return linkSet.links
        })

        return flatten(links)
      },
      pageTitle() {
        const currentLink = find(this.links, link => {
          return link.url === this.currentPath
        })

        return currentLink ? currentLink.label : null
      },
    },
    methods: {
      closeSidebar(e) {

        // check to prevent build errors
        if (process.isClient) {
          this.$refs['sidebarToggle'].checked = false
          triggerEvent(this.$refs['sidebarToggle'], 'change')
        }

      },
      handleChange(e) {
        this.toggleSidebarVisbility(e.target.checked)
        this.preventBodyScrolling()
      },
      toggleSidebarVisbility(checked) {
        this.isVisible = checked
      },
      preventBodyScrolling() {

        if (this.$refs['sidebarToggle'].checked) {
          document.body.classList.add('is-blocked-from-scrolling')
          document.body.classList.add('is-blocked-from-scrolling')
        } else {
          document.body.classList.remove('is-blocked-from-scrolling')
          document.body.classList.remove('is-blocked-from-scrolling')
        }

      },
    },
    watch: {
      $route(to, from) {
        this.closeSidebar()
      },
    },
    components: {
      LinkSets,
    },
    mixins: [
      clickaway,
    ],
  }
</script>

<style lang="scss">

  $iconSize: rem(3);
  $mobileSearchHeight: (
    dim(siteNav, mobilePadding)
  + dim(siteNav, logoHeight)
  + dim(siteNav, mobilePadding)
  );

  .un-doc-sidebar__platform {

    @include max-screen(breakpoint(sm, max)) {

      &:before,
      &:after {
        content: '';
        position: absolute; // relataive to .un-site-main__stage
        top: 0;
        bottom: 0;
      }

      &:before {
        z-index: 1;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        width: 100vw;

        background-color: rgba(palette(black), 0.5);

        transition: opacity .5s ease-in-out;
        opacity: 0;
        pointer-events: none;
      }

      &:after {
        z-index: 2;
        left: 0;

        @include max-screen(breakpoint(xs, max)) {
          width: (8/12 * 100%);
        }

        @include screen(breakpoint(sm, min), #{container(sm) - 1}) {
          width: (4/12 * 100%);
        }

        @include screen(container(sm), breakpoint(sm, max)) {
          right: calc(50% + #{4/12 * container(sm) * 1/2});
        }

        background-color: palette(white);
        @include drop-shadow;

        transition:
          transform .5s ease-in-out,
          opacity .5s ease-in-out;
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
        pointer-events: none;
      }
    }

    &--show-mobile-bg {

      &:before {
        opacity: 1;
        pointer-events: auto;
      }

      &:after {
        transform: translate3d(0, 0, 0);
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  .un-doc-sidebar__stage {

    @include min-screen(breakpoint(md)) {
      position: absolute; // relative to .un-doc-page
      top: 0;
      left: 0;
      width: (2.5/12 * 100%);
    }
  }

  .un-doc-sidebar__mobile-sidebar-toggle {
    display: none;

    &:checked {

      & ~ .un-doc-sidebar__wrapper {

        @include max-screen(breakpoint(sm, max)) {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    }
  }

  .un-doc-sidebar__page-title {

    @include max-screen(breakpoint(sm, max)) {
      position: absolute; // relataive to .un-site-main__wrapper
      top: -#{$mobileSearchHeight * 1/2};
      z-index: layers(docSidebarTitle);
      transform: translate3d(0, -50%, 0);

      padding-left: ($iconSize + rem(0));

      color: palette(black);
      font-family: font(bold);
      font-size: rem(1);
      line-height: line-height(base);
    }

    @include max-screen(#{container(sm) - 1}) {
      left: rem(3);
    }

    @include screen(container(sm), breakpoint(sm, max)) {
      left: calc(50% - #{container(sm) * 1/2} + #{rem(3)});
    }

    @include min-screen(breakpoint(md)) {
      display: none;
    }
  }

  .un-doc-sidebar__mobile-sidebar-button {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 0);

    &, & > svg {
      display: block;
      width: $iconSize;
      height: $iconSize;
    }

    > svg {
      fill: currentColor;
    }
  }

  .un-doc-sidebar__wrapper {

    @include max-screen(breakpoint(xs, max)) {
      width: (8/12 * 100%);
    }

    @include screen(breakpoint(sm, min), #{container(sm) - 1}) {
      width: (4/12 * 100%);
    }

    @include screen(container(sm), breakpoint(sm, max)) {
      width: (4/12 * container(sm));
    }

    @include max-screen(breakpoint(sm, max)) {
      position: absolute; // relataive to .un-site-main__wrapper
      z-index: 3;
      top: 0;

      height: calc(100vh - #{$mobileSearchHeight * 2});

      transition:
        opacity .5s ease-in-out,
        transform .5s ease-in-out;
      opacity: 0;
      transform: translate3d(-100%, 0, 0);

      overflow-x: hidden;
      overflow-y: scroll;
    }

    @include max-screen(container(sm)) {
      left: 0;
    }

    @include screen(container(sm), breakpoint(sm, max)) {
      left: calc(50% - #{container(sm) * 1/2});
    }
  }

  .un-doc-sidebar {

    @include max-screen(breakpoint(sm, max)) {
      padding: rem(4) rem(3);
    }
  }

</style>
