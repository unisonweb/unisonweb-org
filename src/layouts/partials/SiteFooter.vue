<template>
  <footer class="un-site-footer" role="contentinfo">
    <un-page-section tag="div" size="small">
      <div class="container">

        <vue-markdown :source="componentContent.meta" />

      </div>
    </un-page-section>
  </footer>
</template>

<script>
  import componentContent from '~/data/components/site-footer.yml'

  export default {
    computed: {
      componentContent() {
        return componentContent
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
  }

</style>