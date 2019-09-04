<template>
  <un-site-main>

    <div class="un-404-hero">
      <div class="container">

        <h1
          class="u-margin--bottom u-padding--bottom"
          data-font-size="6"
          v-text="pageContent.title"
        />

        <un-link
          class="un-button un-button--outline un-button--white"
          :url="pageContent.cta.url">
          {{pageContent.cta.label}}
        </un-link>

      </div>
    </div>

  </un-site-main>
</template>

<script>
  import pageContent from '~/data/pages/404.yml'
  import pageMetaInfo from '~/mixins/pageMetaInfo'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">

  .un-404-hero {

    @include max-screen(breakpoint(sm, max)) {
      min-height: calc(100vh - #{(
        dim(siteNav, mobilePadding)
      + dim(siteNav, logoHeight)
      + dim(siteNav, mobilePadding)
      )});
    }

    @include min-screen(breakpoint(md)) {
      min-height: calc(100vh - #{(
        dim(siteNav, padding)
      + dim(siteNav, logoHeight)
      + dim(siteNav, padding)
      )});
    }

    color: palette(white);
    text-align: center;
    background-color: palette(pink);

    display: flex;
    align-items: center;
  }

</style>
