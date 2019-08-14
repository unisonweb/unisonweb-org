<template>
  <un-site-main>

    <un-hero
      :eyebrow="pageContent.hero.eyebrow"
      :heading="pageContent.hero.heading"
      :blurb="pageContent.hero.blurb"
      :cta="pageContent.hero.cta"
      :graphic="pageContent.hero.graphic">
      <un-hero-graphic :graphic="pageContent.hero.graphic" />
    </un-hero>

    <un-page-section size="large">
      <div class="container">

        <vue-simple-markdown
          :source="pageContent.intro"
          class="u-drop-cap"
          data-font-size="2"
        />

      </div>
    </un-page-section>

    <un-page-section size="large" class="u-bg--gray--xxx-light">
      <div class="container">

        <un-homepage-ctas
          :heading="pageContent.ctas.heading"
          :items="pageContent.ctas.items"
          :button="pageContent.ctas.button"
        />

      </div>
    </un-page-section>

  </un-site-main>
</template>

<script>
  import pageContent from '~/data/pages/index.yml'
  import Hero from '~/components/Hero'
  import HeroGraphic from '~/components/Homepage/HeroGraphic'
  import Ctas from '~/components/Homepage/Ctas'
  import pageMetaInfo from '~/mixins/pageMetaInfo'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
    },
    components: {
      'un-hero': Hero,
      'un-hero-graphic': HeroGraphic,
      'un-homepage-ctas': Ctas,
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
