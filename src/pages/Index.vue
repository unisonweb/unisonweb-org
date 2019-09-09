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
        <div class="row center-xs u-align--left">
          <div class="col-xs-12 col-sm-10 col-md-12">

            <vue-markdown
              class="sb-homepage-intro u-drop-cap"
              :source="pageContent.intro"
            />

          </div>
        </div>
      </div>
    </un-page-section>

    <un-page-section size="large" class="u-bg--gray--xxx-light">
      <div class="container u-align--center@xs u-align--center@sm">

        <un-homepage-links
          :heading="pageContent.links.heading"
          :items="pageContent.links.items"
          :button="pageContent.links.button"
        />

      </div>
    </un-page-section>

  </un-site-main>
</template>

<script>
  import pageContent from '~/data/pages/index.yml'
  import Hero from '~/components/Hero'
  import HeroGraphic from '~/components/Homepage/HeroGraphic'
  import Links from '~/components/Homepage/Links'
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
      'un-homepage-links': Links,
    },
    mixins: [
      pageMetaInfo,
    ],
  }
</script>

<style lang="scss">

  .sb-homepage-intro {
    font-family: font(light);
    letter-spacing: dim(letterSpacing, -2);

    > p {

      &:first-of-type {
        font-size: rem(2);
        letter-spacing: dim(letterSpacing, -3);
      }
    }
  }

</style>
