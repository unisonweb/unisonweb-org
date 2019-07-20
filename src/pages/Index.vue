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
  import page from '~/mixins/page'
  import Hero from '~/components/Hero'

  export default {
    computed: {
      pageContent() {
        return pageContent
      },
    },
    mixins: [
      page,
    ],
    components: {
      'uc-hero': Hero,
    },
  }
</script>

<style lang="scss">
  // 
</style>
