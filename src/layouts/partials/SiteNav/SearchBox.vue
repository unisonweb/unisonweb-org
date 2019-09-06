<template>
  <div
    v-if="!isLoading"
    class="un-search-box__stage"
    :class="{ 'is-open' : isOpen }">

    <div
      class="un-search-box__wrapper animated fadeIn"
      v-on-clickaway="closeSearchBox">

      <div
        class="un-search-box"
        @click="openSearchBox">
        <AisInstantSearchSsr>

          <label
            class="un-search-box__search-icon"
            for="search">
            <inline-svg src="/media/icon-search.svg" />
          </label>

          <AisSearchBox placeholder="Search" />

          <AisStateResults>
            <template slot-scope="{ query, hits }">

              <div
                v-if="query"
                class="un-search-box__results">

                <p
                  v-if="hits.length === 0"
                  class="un-search-box__no-results-message">
                  No results found matching <em>{{ query }}</em>
                </p>

                <AisHits :escape-HTML="true">
                  <template slot="item" slot-scope="{ item }">

                    <span class="un-search-box__results__item">
                      <g-link
                        class="u-font--bold"
                        :to="item.path">
                        <AisHighlight
                          :hit="item"
                          attribute="title"
                        />
                      </g-link>
                    </span>

                    <span
                      v-for="(heading, i) in item._highlightResult.headings" :key="i"
                      v-if="heading.value.matchLevel !== 'none'"
                      class="un-search-box__results__item u-color--gray"
                      data-font-size="-2">
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
                    </span>

                  </template>
                </AisHits>

              </div>

              <!-- span to fill `ais-search-results` default slot -->
              <span v-else />

            </template>
          </AisStateResults>

        </AisInstantSearchSsr>
      </div>

    </div>

    <span
      class="un-search-box__close-button animated"
      :class="[ isOpen ? 'fadeIn' : 'fadeOut' ]">
      <button @click="closeSearchBox">
        <inline-svg src="/media/icon-times.svg" />
      </button>
    </span>

    <span
      class="un-search-box__faux-bg animated"
      :class="[ isOpen ? 'fadeIn' : 'fadeOut' ]"
    />

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
    'XNXUU7UYLX',
    'fb9a74b45f909c666e8f6f52f97b6730',
  )

  const { instantsearch, rootMixin } = createInstantSearch({
    searchClient,
    indexName: 'prod_unison_docs',
  })

  export default {
    data() {
      return {
        isSidebarVisible: false,
        isLoading: true,
        isOpen: false,
        algoliaState: null,
      }
    },
    computed: {
      pageTitle() {
        // const currentLink = find(this.links, link => {
        //   return link.url === this.currentPath
        // })

        // return currentLink ? currentLink.label : null
        return 'some page title'
      },
      forAttributeValue() {
        return !this.isSidebarVisible ? 'sidebar-toggle' : false
      },
    },
    methods: {
      toggleSidebarVisibility() {

        // this.$nextTick(() => {
        setTimeout(() => {
          this.isSidebarVisible = !this.isSidebarVisible
        }, 0)
        // })
      },
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
    beforeCreate() {
      instantsearch.findResultsState().then(() => {
        this.algoliaState = instantsearch.getState()
        this.isLoading = false
      })
    },
    components: {
      AisInstantSearchSsr,
      AisStateResults,
      AisHits,
      AisHighlight,
      AisSearchBox,
    },
    mixins: [
      rootMixin,
      clickaway,
    ],
  }
</script>

<style lang="scss">

  $animationSpeed: .25s;
  $iconSize: rem(3);
  $iconGap: rem(0);
  $resultsBorderRadius: 8px;
  $mobileSearchHeight: (
    dim(siteNav, mobilePadding)
  + dim(siteNav, logoHeight)
  + dim(siteNav, mobilePadding)
  );
  $layers: (
    closeButton: 8,
    searchIcon: 7,
    searchBox: 6,
    searchBoxWrapper: 5,
    results: 4,
    searchBoxStage: 2,
    fauxBg: 1
  );

  .un-search-box__stage {

    &.is-open {

      @include max-screen(breakpoint(xs, max)) {
        position: relative;
      }

      @include max-screen(breakpoint(sm, max)) {
        z-index: layers(searchBoxOpen);
      }

      .un-search-box__wrapper {

        @include min-screen(breakpoint(md)) {
          top: -#{dim(siteNav, padding)};
          bottom: -#{dim(siteNav, padding)};
          right: $iconSize; // make room for the __close-button
          left: ($iconSize + $iconGap);

          padding-top: dim(siteNav, padding);
          padding-bottom: dim(siteNav, padding);

          color: palette(black);
        }
      }

      .un-search-box {

        @include max-screen(breakpoint(sm, max)) {
          right: (rem(3) + $iconSize + $iconGap);
          left: (rem(3) + $iconSize + $iconGap);

          margin-right: unset;
        }
      }

      .un-search-box__results {
        opacity: 1;
      }

      .un-search-box__results,
      .un-search-box__faux-bg,
      .un-search-box__close-button {
        pointer-events: auto;
      }
    }
  }

  .un-search-box__wrapper {
    position: absolute;
    z-index: map-get($layers, searchBoxWrapper);

    @include max-screen(breakpoint(sm, max)) {
      top: calc(100% + #{dim(siteNav, mobilePadding)});
      right: -#{rem(3)};
      left: -#{rem(3)};

      height: $mobileSearchHeight;

      padding-right: rem(3);
      padding-left: rem(3);

      color: palette(black);

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        width: 100vw;

        background-color: palette(white);
        @include drop-shadow;
      }
    }

    @include min-screen(breakpoint(md)) {
      top: 0;
      bottom: 0;
      right: (4/12 * 100%);

      transition: all $animationSpeed ease-in-out;
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
  }

  .un-search-box {
    z-index: map-get($layers, searchBox);
    height: dim(siteNav, logoHeight);

    @include max-screen(breakpoint(sm, max)) {
      position: absolute;
      top: dim(siteNav, mobilePadding);
      right: (rem(3) - $iconGap);

      // when open, prevent __page-title
      // from peeking through from underneath
      background-color: palette(white);

      transition: left .5s ease-in-out;
      left: calc(100% - #{rem(3) - $iconGap});
    }

    @include min-screen(breakpoint(md)) {
      position: relative; // for positioning __icon
    }

    .ais-SearchBox-input {
      @include reset-input;

      height: dim(siteNav, logoHeight);
      width: 100%;

      &::-webkit-search-cancel-button {
        appearance: none;
      }
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

      &:last-child {
        overflow: hidden;
        border-bottom-right-radius: $resultsBorderRadius;
        border-bottom-left-radius: $resultsBorderRadius;
      }

      border-top: 1px solid palette(gray, xxx-light);
      background-color: palette(white);

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
    z-index: map-get($layers, results);
    top: 100%;

    @include max-screen(breakpoint(sm, max)) {
      right: -#{rem(3) + $iconSize + $iconGap};
      left: -#{rem(3) + $iconSize + $iconGap};
      margin-top: dim(siteNav, mobilePadding);
    }

    @include min-screen(breakpoint(md)) {
      left: -#{dim(boxShadow, blur)};
      width: calc(#{9/12 * 100%} - #{dim(boxShadow, blur)});
      margin-top: dim(siteNav, padding);

      padding-right: dim(boxShadow, blur);
      padding-left: dim(boxShadow, blur);

      &, &:after {
        border-bottom-right-radius: $resultsBorderRadius;
        border-bottom-left-radius: $resultsBorderRadius;
      }
    }

    overflow: hidden;
    padding-bottom: dim(boxShadow, blur);

    // faux shadow
    &:after {
      content: '';
      position: absolute;
      z-index: -1; // keep this below the result items
      top: 0;
      bottom: dim(boxShadow, blur);

      @include max-screen(breakpoint(sm, max)) {
        right: 0;
        left: 0;
      }

      @include min-screen(breakpoint(md)) {
        right: dim(boxShadow, blur);
        left: dim(boxShadow, blur);
      }

      @include drop-shadow;
    }

    transition: opacity $animationSpeed ease-in-out;
    opacity: 0;
  }

  .un-search-box__no-results-message {

    @include max-screen(breakpoint(sm, max)) {
      padding: $iconSize;
    }

    @include min-screen(breakpoint(md)) {
      padding: $iconSize (rem(3) + rem(0));
    }

    background-color: palette(white);
  }

  .un-search-box__results__item {
    display: block;

    > a {
      display: block;
      padding-top: ($iconSize * 1/3);
      padding-bottom: ($iconSize * 1/3);

      @include max-screen(breakpoint(sm, max)) {
        padding-right: rem(3);
        padding-left: rem(3);
      }

      @include min-screen(breakpoint(md)) {
        padding-right: (rem(3) + rem(0));
        padding-left: (rem(3) + rem(0));
      }

      line-height: line-height(half);

      &, &:hover {
        color: inherit;
        text-decoration: none;
      }

      &:hover {
        color: palette(white);
        background-color: palette(purple);
      }
    }

    &:first-child {

      > a {
        padding-top: $iconSize;
      }
    }

    &:last-child {

      > a {
        padding-bottom: $iconSize;
      }
    }
  }

  .un-search-box__search-icon {
    position: absolute;
    z-index: map-get($layers, searchIcon);
    top: 50%;
    left: -#{$iconSize + $iconGap};
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

  .un-search-box__close-button {

    @include max-screen(breakpoint(xs, max)) {
      position: absolute; // relative to .un-search-box__stage
      top: (
        dim(siteNav, mobilePadding)
      + dim(siteNav, mobilePadding)
      + (dim(siteNav, logoHeight) * 1/2)
      );
    }

    @include screen(breakpoint(sm, min), breakpoint(sm, max)) {
      top: (
        dim(siteNav, logoHeight)
      + dim(siteNav, mobilePadding)
      + dim(siteNav, mobilePadding)
      + (dim(siteNav, logoHeight) * 1/2)
      );
    }

    @include min-screen(breakpoint(sm)) {
      position: absolute; // relative to .un-site-nav
    }

    @include min-screen(breakpoint(md)) {
      top: 50%;
    }

    z-index: map-get($layers, closeButton);
    right: 0;
    transform: translate3d(#{rem(0) / $iconSize * 1/4 * 100%}, -50%, 0);

    animation-duration: $animationSpeed;

    > button {
      @include reset-button;

      opacity: 0.5;

      &:hover {
        opacity: 1;
      }

      &, & > svg {
        display: block;
        width: $iconSize;
        height: $iconSize;
      }

      > svg {
        transform: scale(#{rem(0) / $iconSize});

        fill: currentColor;
      }
    }
  }

  .un-search-box__faux-bg {

    @include max-screen(breakpoint(sm, max)) {
      position: absolute; // relative to .un-site-nav
      z-index: map-get($layers, fauxBg);
      top: calc(100% + #{dim(siteNav, mobilePadding)});
      left: 50%;
      transform: translate3d(-50%, 0, 0);

      height: (
        dim(siteNav, mobilePadding)
      + dim(siteNav, logoHeight)
      + dim(siteNav, mobilePadding)
      );
    }

    @include min-screen(breakpoint(md)) {
      position: absolute; // relative to .un-site-nav
      z-index: map-get($layers, fauxBg);
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      height: (
        dim(siteNav, padding)
      + dim(siteNav, logoHeight)
      + dim(siteNav, padding)
      );
    }

    display: block;
    width: 100vw;
    background-color: palette(white);

    animation-duration: $animationSpeed;
  }

  .un-search-box__results,
  .un-search-box__faux-bg,
  .un-search-box__close-button {
    // by default, visitors shouldn't be able to
    // interact with these elements until the
    // search box is open. this will prevent
    // issues where links cannot be clicked
    // because these are sitting on top of them
    pointer-events: none;
  }

</style>
