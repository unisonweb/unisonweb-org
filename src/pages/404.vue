<template>
  <uc-site-main>

    <div class="uc-404-hero">
      <div class="container">

        <h1
          class="u-margin--bottom"
          data-font-size="6"
          v-text="pageContent.title"
        />

        <uc-link
          class="uc-button uc-button--outline uc-button--white"
          :url="pageContent.cta.url">
          {{pageContent.cta.label}}
        </uc-link>

      </div>
    </div>

  </uc-site-main>
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

  .uc-404-hero {
    min-height: calc(
      100vh -
      #{dim(siteNav, paddingVertical) +
        dim(siteNav, logoHeight) +
        dim(siteNav, paddingVertical)}
    );

    color: palette(white);
    background-color: palette(primary);

    display: flex;
    align-items: center;
  }

</style>
