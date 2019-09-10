<template>
  <footer class="un-site-footer" role="contentinfo">
    <un-page-section tag="div" size="small">
      <div class="container">

        <vue-markdown :source="layoutContent.meta" />

      </div>
    </un-page-section>
  </footer>
</template>

<script>
  import layoutContent from '~/data/layouts/partials/site-footer.yml'

  export default {
    computed: {
      layoutContent() {
        return layoutContent
      },
    },
  }
</script>

<style lang="scss">

  .un-site-footer {
    color: palette(gray);
    font-size: rem(-2);
    text-align: center;

    border-top: 1px solid palette(gray, xx-light);
    background-color: palette(gray, xxx-light);

    a {
      text-decoration: underline;
    }
  }

</style>
