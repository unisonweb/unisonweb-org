<template>
  <div
    class="un-search-box__stage"
    :class="{ 'is-open' : isOpen }"
    v-on-clickaway="closeSearchBox">

    <div
      class="un-search-box"
      @click="openSearchBox">
      <ais-instant-search-ssr>

        <label
          class="un-search-box__icon"
          for="search">
          <inline-svg src="/media/icon-search.svg" />
        </label>

        <ais-search-box placeholder="Search" />

        <ais-state-results>
          <template slot-scope="{ query, hits }">

            <div
              v-if="query"
              class="un-search-box__results">

              <p
                v-if="hits.length === 0"
                class="un-search-box__results__none">
                No results found matching <em>{{ query }}</em>
              </p>

              <ais-hits
                :escape-HTML="true">
                <template slot="item" slot-scope="{ item }">
                  <h1>
                    <g-link
                      :to="item.path">
                      <ais-highlight
                        :hit="item"
                        attribute="title"
                      />
                    </g-link>
                  </h1>

                  <p
                    v-for="(heading, i) in item._highlightResult.headings" :key="i"
                    v-if="heading.value.matchLevel !== 'none'">
                    <a
                      v-if="item.path === $route.path"
                      href="#"
                      v-scroll-to="{
                        el: item.headings[i].anchor,
                        onStart: closeSearchBox,
                      }">
                      <span v-html="heading.value.value" />
                    </a>
                    <g-link
                      v-else
                      :to="`${item.path}${item.headings[i].anchor}`">
                      <span v-html="heading.value.value" />
                    </g-link>
                  </p>

                </template>
              </ais-hits>

            </div>

            <!-- span to fill `ais-search-results` default slot -->
            <span v-else />

          </template>
        </ais-state-results>

      </ais-instant-search-ssr>
    </div>

    <button
      v-if="isOpen"
      class="un-search__close-button"
      @click="closeSearchBox">
      <inline-svg src="/media/icon-times.svg" />
    </button>

  </div>
</template>

<script>
  import {
    AisInstantSearchSsr,
    AisStateResults,
    AisHits,
    AisHighlight,
    AisSearchBox,
    createInstantSearch,
  } from 'vue-instantsearch'
  import algoliasearch from 'algoliasearch/lite'
  import { mixin as clickaway } from 'vue-clickaway'

  const searchClient = algoliasearch(
    '6ZJ8V24AGR',
    '80100f1abe6d9d7d6c874701aaa3fe88',
  )

  const { instantsearch, rootMixin } = createInstantSearch({
    searchClient,
    indexName: 'dev_docs',
  })

  export default {
    asyncData() {
      return instantsearch.then(() => ({
        algoliaState: instantsearch.getState(),
      }))
    },
    data() {
      return {
        isOpen: false,
      }
    },
    methods: {
      openSearchBox() {
        this.isOpen = true
      },
      closeSearchBox() {
        this.isOpen = false
      },
    },
    watch: {
      $route(to, from) {
        this.closeSearchBox()
      },
    },
    components: {
      'ais-instant-search-ssr': AisInstantSearchSsr,
      'ais-state-results': AisStateResults,
      'ais-hits': AisHits,
      'ais-highlight': AisHighlight,
      'ais-search-box': AisSearchBox,
    },
    mixins: [
      rootMixin,
      clickaway,
    ],
  }
</script>

<style lang="scss">

  $iconSize: rem(2);

  .un-search-box__stage {
    position: absolute;

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

    &.is-open {
      z-index: z-index(searchBox);

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

        &:before,
        &:after {
          display: block;
        }
      }

      .un-search-box {

        @include max-screen(breakpoint(sm, max)) {
          max-width: 100vw;
          margin-right: unset;
        }
      }

      .un-search-box__results {
        opacity: 1;
        pointer-events: auto;
      }
    }

    // faux background-color and drop shadow
    // that spans the entire width of the
    // screen. this becomes visible when the
    // search input is clicked and on
    // mobile/tablet screens
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      width: 100vw;
      height: 100%;

      display: none;

      @include max-screen(breakpoint(sm, max)) {
        display: block;
      }
    }

    &:before {
      z-index: 3;
      background-color: palette(white);
    }

    &:after {
      z-index: 1;
      @include drop-shadow;
    }
  }

  .un-search-box {
    position: relative; // for positioning __icon

    width: 100%;
    padding-left: (rem(3) + rem(0));

    @include max-screen(breakpoint(xs, max)) {
      margin-right: -#{rem(0)};
    }

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      top: dim(siteNav, fontSize);
      right: 0;

      // when open, prevent __page-title
      // from peeking through from underneath
      background-color: palette(white);

      transition: max-width .5s ease-in-out;
      max-width: 0;
    }

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      margin-right: -#{$iconSize * 1/2};
    }

    @include min-screen(breakpoint(md)) {
      // align the left-edge of the __label with
      // the left-edge of the faux border between
      // the sidebar and content
      margin-left: -#{rem(3)};
    }

    .ais-SearchBox {
      position: relative;
      z-index: 4;

      @include max-screen(breakpoint(xs, max)) {
        padding-right: $iconSize;
      }
    }

    .ais-SearchBox-input {
      @include reset-input;

      height: dim(siteNav, logoHeight);
      width: 100%;
    }

    .ais-SearchBox-reset {
      display: none;
    }

    .ais-Hits-list {
      // <ol> reset
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .ais-Hits-item {
      // <li> reset
      margin: 0;

      @include max-screen(breakpoint(xs, max)) {
         padding: $iconSize;
       }

      @include min-screen(breakpoint(sm)) {
        padding: $iconSize (rem(3) + rem(0));
      }

      border-top: 1px solid palette(gray, xxx-light);
      background-color: palette(white);

      &:hover {
        color: palette(white);
        background-color: palette(purple);
      }

      a {
        display: block;

        &, &:hover {
          color: inherit;
        }
      }

      mark {
        background-color: palette(yellow);
      }
    }

    .ais-SearchBox-submit {
      display: none;
      @include reset-button;
    }
  }

  .un-search-box__results {
    position: absolute;
    z-index: 2;
    top: 100%;

    @include max-screen(breakpoint(xs, max)) {
      right: -#{rem(3)};
      left: -#{rem(3)};
      margin-top: dim(siteNav, fontSize);
    }

    @include min-screen(breakpoint(sm)) {
      left: 0;
      width: (9/12 * 100%);
      margin-top: dim(siteNav, verticalPadding);
    }

    border-bottom-right-radius: rem(-3);
    border-bottom-left-radius: rem(-3);
    @include drop-shadow;

    transition: opacity 0 0.5s ease-in-out;
    opacity: 0;
    pointer-events: none;

    &:after {
      content: '';
      position: absolute;
      top: 100%;
      right: 0;

      display: block;
      width: (168px * 2/3);
      height: (24px * 2/3);
      padding: 4px 6px;

      background-color: palette(white);
      background-image: url('/media/search-by-algolia-light-background.svg');
      background-repeat: no-repeat;
      background-size: (168px * 2/3) (24px * 2/3);
      background-position: center center;
    }
  }

  .un-search-box__results__none {

    @include max-screen(breakpoint(xs, max)) {
       padding: $iconSize;
     }

    @include min-screen(breakpoint(sm)) {
      padding: $iconSize (rem(3) + rem(0));
    }

    background-color: palette(white);
  }

  .un-search-box__icon,
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

  .un-search-box__icon {
    z-index: 3;
    left: 0;
  }

  .un-search__close-button {
    @include reset-button;

    z-index: 4;

    @include max-screen(breakpoint(sm, max)) {
      right: 0;
    }

    @include min-screen(breakpoint(md)) {
      left: 100%;
    }

    opacity: 0.5;
  }

</style>
