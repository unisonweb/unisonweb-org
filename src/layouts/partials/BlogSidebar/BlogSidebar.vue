<template>
  <div class="row">
    <div class="col-xs-12 col-sm-5 col-md-12">

      <un-page-section tag="div" class="u-padding--top--none@md u-padding--top--none@lg u-padding--top--none@xl">
        <h2
          class="u-margin--bottom u-tight"
          data-font-size="2"
          v-text="componentContent.categories.heading"
        />
        <Categories />
      </un-page-section>

    </div>
    <div class="col-xs-12 col-sm-7 col-md-12">

      <un-page-section tag="div" class="u-padding--top--none@md u-padding--top--none@lg u-padding--top--none@xl">
        <h2
          class="u-margin--bottom u-tight"
          data-font-size="2"
          v-text="componentContent.subscribeForm.heading"
        />
        <vue-markdown
          class="u-margin--bottom"
          data-font-size="-2"
          :source="componentContent.subscribeForm.blurb"
        />
        <SubscribeForm
          :content="componentContent.subscribeForm"
        />
      </un-page-section>

    </div>
  </div>
</template>

<script>
  import Categories from './Categories'
  import SubscribeForm from './SubscribeForm'
  import componentContent from '~/data/components/blog-sidebar.yml'

  export default {
    computed: {
      componentContent() {
        return componentContent
      },
    },
    components: {
      Categories,
      SubscribeForm,
    },
  }
</script>

<style lang="scss">
  // intentionally blank
</style>
