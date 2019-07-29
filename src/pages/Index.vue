<template>
  <uc-site-main>

    <uc-hero
      :eyebrow="pageContent.hero.eyebrow"
      :heading="pageContent.hero.heading"
      :blurb="pageContent.hero.blurb"
      :cta="pageContent.hero.cta"
      :graphic="pageContent.hero.graphic"
    />

  </uc-site-main>
</template>

<script>
  import pageContent from '~/data/pages/index.yml'
  import Hero from '~/components/Hero'
  import pageMetaInfo from '~/mixins/pageMetaInfo'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
    },
    components: {
      'uc-hero': Hero,
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">
  // 
</style>
