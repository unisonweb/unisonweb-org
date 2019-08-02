<template>
  <div
    class="un-search"
    :class="{ 'un-search--focused' : isFocused }"
    v-on-clickaway="closeSearch">

    <div class="un-search__input">
      <label
        class="un-search__icon"
        for="search">
        <inline-svg src="/media/icon-search.svg" />
      </label>
      <un-input
        :label="labelText"
        id="search"
        input-name="search"
        v-model="query"
        v-on:focus="handleFocus"
      />
    </div>

    <button
      v-if="isFocused"
      class="un-search__close-button"
      @click="closeSearch">
      <inline-svg src="/media/icon-times.svg" />
    </button>

  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'
  import Input from '~/components/Input'

  export default {
    data() {
      return {
        query: null,
        isFocused: false,
      }
    },
    computed: {
      labelText() {
        return !this.isFocused ? 'Search' : null
      },
    },
    methods: {
      handleFocus() {
        this.isFocused = true
      },
      closeSearch() {
        this.isFocused = false
      },
    },
    components: {
      'un-input': Input,
    },
    mixins: [
      clickaway,
    ],
  }
</script>

<style lang="scss">

  $iconSize: rem(2);

  .un-search {
    position: absolute;

    // faux background-color that spans the
    // entire width of the screen. this
    // becomes visible when the search input
    // is focused and on mobile/tablet screens
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      width: 100vw;
      height: 100%;

      background-color: palette(white);
      @include drop-shadow;

      display: none;
    }

    @include max-screen(breakpoint(sm, max)) {
      top: 100%;
      right: 0;
      left: 0;

      height: (
        dim(siteNav, fontSize)
      + dim(siteNav, logoHeight)
      + dim(siteNav, fontSize)
      );

      margin-top: dim(siteNav, verticalPadding);

      color: palette(black);

      &:before {
        display: block;
      }
    }

    @include min-screen(breakpoint(md)) {
      top: 0;
      bottom: 0;
      right: (4/12 * 100%);
      background-color: palette(black);

      transition: all .5s ease-in-out;
    }

    // calculate the left-edge to align with the
    // faux border between the sidebar and content
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

    &--focused {

      @include max-screen(breakpoint(sm, max)) {

        .un-search__input {
          z-index: z-index(searchFocused);

          max-width: 100vw;
          margin-right: unset;
        }
      }

      @include min-screen(breakpoint(md)) {
        top: -#{dim(siteNav, verticalPadding)};
        bottom: -#{dim(siteNav, verticalPadding)};
        right: 0;
        left: 0;

        padding-top: dim(siteNav, verticalPadding);
        padding-bottom: dim(siteNav, verticalPadding);

        // this calculation keeps the left-edge of
        // the text aligned with the left-edge of
        // the links in the sidebar
        padding-left: $iconSize;

        color: palette(black);
        background-color: palette(white);

        &:before {
          display: block;
        }
      }
    }

    @include max-screen(breakpoint(sm, max)) {
      // display: flex;
      // justify-content: space-between;
    }
  }

  .un-search__input {
    position: relative; // for positioning __icon

    width: 100%;
    padding-left: ($iconSize * 1.5);

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      top: dim(siteNav, fontSize);
      right: 0;

      overflow: hidden;
      max-width: 0;
      margin-right: -#{$iconSize * 1/2};

      // when focused, prevent __page-title
      // from peeking through from underneath
      background-color: palette(white);

      transition: max-width .5s ease-in-out;
    }

    @include min-screen(breakpoint(md)) {
      // align the left-edge of the __label with
      // the left-edge of the faux border between
      // the sidebar and content
      margin-left: -#{rem(3)};
    }

    .un-input__wrapper {
      // 
    }

    .un-input {
      height: dim(siteNav, logoHeight);

      padding-top: 0;
      padding-bottom: 0;
    }

    .un-input__label {

      @include max-screen(breakpoint(sm, max)) {
        display: none;
      }

      @include min-screen(breakpoint(md)) {
        transform: translate3d(0, -50%, 0);
        top: (dim(siteNav, logoHeight) * 1/2);
      }
    }
  }

  .un-search__sidebar-toggle,
  .un-search__icon,
  .un-search__close-button {
    position: absolute;
    top: 50%;
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

  .un-search__sidebar-toggle {
    left: 0;
  }

  .un-search__icon {
    z-index: 2;
    left: 0;
  }

  .un-search__close-button {
    @include reset-button;

    z-index: z-index(searchCloseButton);
    right: 0;
    opacity: 0.5;
  }

</style>
