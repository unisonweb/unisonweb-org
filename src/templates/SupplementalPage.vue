<template>
  <un-site-main>
    <div class="container">
      <div class="row center-xs u-align--left">
        <div class="col-xs-12 col-sm-10 col-md-9 col-lg-8 col-xl-6">

          <un-page-section
            v-html="$page.supplementalPage.content"
          />

        </div>
      </div>
    </div>
  </un-site-main>
</template>

<page-query>
  query SupplementalPage ($path: String!) {
    supplementalPage: supplementalPage (path: $path) {
      title
      description
      content
    }
  }
</page-query>

<script>
  export default {
    metaInfo() {
      const { title, description } = this.$page.supplementalPage

      return {
        title: title,
        meta: [{
          key: 'description',
          name: 'description',
          content: description
        }],
      }
    },
  }
</script>

<style lang="scss">

  // .un-supplemental-page {

  //   h1, h2, h3, h4, h5, h6 {
  //     margin-top: em(4);
  //   }

  //   h1 {
  //     font-size: responsive rem(4) rem(8);
  //     font-range: breakpoint(xs, max) breakpoint(xl);
  //   }
  //   h2 {
  //     font-size: responsive rem(3) rem(5);
  //     font-range: breakpoint(xs, max) breakpoint(xl);
  //   }
  //   h3 {
  //     font-size: responsive rem(2) rem(4);
  //     font-range: breakpoint(xs, max) breakpoint(xl);
  //   }
  //   h4 {
  //     font-size: responsive rem(1) rem(3);
  //     font-range: breakpoint(xs, max) breakpoint(xl);
  //   }
  //   h5, h6 {
  //     font-size: responsive rem(1) rem(2);
  //     font-range: breakpoint(xs, max) breakpoint(xl);
  //   }

  //   > * {

  //     &:first-child {
  //       margin-top: 0;
  //     }

  //     margin-bottom: 0;
  //   }
  // }

</style>
