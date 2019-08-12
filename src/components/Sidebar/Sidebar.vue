<template>
  <div
    class="un-sidebar__platform"
    :class="{ 'un-sidebar__platform--show-mobile-bg': isVisible }">
    <div
      class="un-sidebar__stage"
      v-on-clickaway="closeSidebar">

      <div class="un-sidebar__page-title">
        <label
          class="un-sidebar__mobile-sidebar-button"
          for="sidebar-toggle">
          <inline-svg
            v-if="isVisible"
            src="/media/x.svg"
          />
          <inline-svg
            v-else
            src="/media/menu.svg"
          />
        </label>
        <span v-text="pageTitle" />
      </div>

      <input
        ref="sidebarToggle"
        class="un-sidebar__mobile-sidebar-toggle"
        type="checkbox"
        id="sidebar-toggle"
        style="display: none;"
        hidden
        @change="handleChange"
      />

      <div class="un-sidebar__wrapper">

        <div class="un-sidebar">
          <Links
            :links="componentContent.links"
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
  import { mixin as clickaway } from 'vue-clickaway'
  import componentContent from '~/data/components/sidebar.yml'
  import Links from '~/components/Sidebar/Links'
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
      componentContent() {
        return componentContent
      },
      currentPath() {
        return this.$route.matched[0].path
      },
      pageTitle() {
        const currentLink = find(this.links, link => {
          return link.path === this.currentPath
        })

        return currentLink ? currentLink.label : null
      },
    },
    methods: {
      closeSidebar() {

        // check to prevent build errors
        if (process.isClient) {
          this.$refs['sidebarToggle'].checked = false
          triggerEvent(this.$refs['sidebarToggle'], 'change')
        }

      },
      handleChange() {
        this.toggleSidebarVisbility()
        this.preventBodyScrolling()
      },
      toggleSidebarVisbility() {
        this.isVisible = this.$refs['sidebarToggle'].checked
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
      Links,
    },
    mixins: [
      clickaway,
    ],
  }
</script>

<style lang="scss">

  $iconSize: rem(3);

  .un-sidebar__platform {

    &:before {

      @include max-screen(breakpoint(xs, max)) {
        top: -#{dim(pageSection, xs)};
        bottom: -#{dim(pageSection, xs)};
      }

      @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
        top: -#{dim(pageSection, sm)};
        bottom: -#{dim(pageSection, sm)};
      }

      @include max-screen(breakpoint(sm, max)) {
        content: '';
        position: absolute;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        width: 100vw;

        background-color: rgba(palette(black), 0.5);

        transition: opacity .5s ease-in-out;
        opacity: 0;
        pointer-events: none;
      }
    }

    &--show-mobile-bg {

      &:before {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  .un-sidebar__stage {

    @include min-screen(breakpoint(md)) {
      position: absolute;
      top: 0;
      left: 0;
      width: (2/12 * 100%);
    }
  }

  .un-sidebar__page-title {
    $searchHeight: (
      dim(siteNav, fontSize)
    + dim(siteNav, logoHeight)
    + dim(siteNav, fontSize)
    );

    @include max-screen(breakpoint(xs, max)) {
      top: -#{dim(pageSection, xs) + ($searchHeight * 1/2)};
    }

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      top: -#{dim(pageSection, sm) + ($searchHeight * 1/2)};
    }

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      z-index: z-index(sidebar);
      left: 0;
      transform: translate3d(0, -50%, 0);

      // 
      padding-left: (rem(3) + rem(0));

      color: palette(black);
      font-family: font(bold);
      font-size: rem(1);
      line-height: line-height(base);
    }

    @include min-screen(breakpoint(md)) {
      display: none;
    }
  }

  .un-sidebar__wrapper {

    @include max-screen(breakpoint(xs, max)) {
      top: -#{dim(pageSection, xs)};
      width: (8/12 * 100%);
    }

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      top: -#{dim(pageSection, sm)};
      width: (4/12 * 100%);
    }

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      z-index: z-index(sidebar);
      bottom: 0;
      left: -#{rem(3)};

      background-color: palette(white);
      @include drop-shadow;

      transition:
        opacity .5s ease-in-out,
        transform .5s ease-in-out;
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }
  }

  .un-sidebar {

    @include max-screen(breakpoint(sm, max)) {
      overflow: scroll;

      padding: rem(4) rem(3);
    }
  }

  .un-sidebar__mobile-sidebar-button {
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

  .un-sidebar__mobile-sidebar-toggle {
    display: none;

    &:checked {

      & ~ .un-sidebar__wrapper {

        @include max-screen(breakpoint(sm, max)) {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    }
  }

</style>
