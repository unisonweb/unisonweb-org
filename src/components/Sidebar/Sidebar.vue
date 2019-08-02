<template>
  <div
    class="un-sidebar__platform"
    :class="{ 'un-sidebar__platform--with-bg': isVisible }">
    <div
      class="un-sidebar__stage"
      v-on-clickaway="closeSidebar">

      <div class="un-sidebar__page-title">
        <label
          class="un-search__sidebar-toggle"
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
        class="un-sidebar__sidebar-toggle"
        type="checkbox"
        id="sidebar-toggle"
        style="display: none;"
        hidden
        @change="handleChange"
      />

      <div class="un-sidebar__wrapper">

        <div class="un-sidebar">
          <Links
            :links="links"
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
  import Links from '~/components/Sidebar/Links'
  import triggerEvent from '~/assets/scripts/utils/triggerEvent'

  export default {
    props: {
      links: { type: Array, default: null },
      headings: { type: Array, default: null },
    },
    data() {
      return {
        isVisible: false,
      }
    },
    computed: {
      currentPath() {
        return this.$route.matched[0].path
      },
      pageTitle() {
        const vm = this

        const currentLink = find(vm.links, link => {
          return link.path === vm.currentPath
        })

        return currentLink ? currentLink.label : null
      },
    },
    methods: {
      closeSidebar() {
        const vm = this

        vm.$refs['sidebarToggle'].checked = false
        triggerEvent(vm.$refs['sidebarToggle'], 'change')
      },
      handleChange() {
        const vm = this

        vm.isVisible = vm.$refs['sidebarToggle'].checked
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

    @include max-screen(breakpoint(xs, max)) {

      &:before {
        content: '';
        position: absolute;
        top: -#{dim(pageSection, xs)};
        bottom: -#{dim(pageSection, xs)};
        right: -#{rem(3)};
        left: -#{rem(3)};

        background-color: rgba(palette(black), 0.5);

        transition: opacity .5s ease-in-out;
        opacity: 0;
        pointer-events: none;
      }

      &--with-bg {

        &:before {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  }

  .un-sidebar__stage {

    @include min-screen(breakpoint(md)) {
      position: absolute;
      z-index: 2;
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

      transition: transform .5s ease-in-out;
      transform: translate3d(-100%, 0, 0);
    }
  }

  .un-sidebar {

    @include max-screen(breakpoint(sm, max)) {
      overflow: scroll;

      padding: rem(4) rem(3);
    }
  }

  .un-sidebar__sidebar-toggle {
    display: none;

    &:checked {

      & ~ .un-sidebar__wrapper {

        @include max-screen(breakpoint(sm, max)) {
          transform: translate3d(0, 0, 0);
        }
      }
    }
  }

</style>
