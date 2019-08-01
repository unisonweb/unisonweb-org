<template>
  <component
    :is="tag"
    class="un-page-section"
    :class="{ [`un-page-section--${size}`] : size }">
    <slot />
  </component>
</template>

<script>
  export default {
    props: {
      size: { type: String, default: null },
      tag: { type: String, default: 'section' },
    },
  }
</script>

<style lang="scss">

  .un-page-section {
    $this: &;

    flex: 1 1 auto;

    width: 100%;
    max-width: 100%;

    @include max-screen(breakpoint(xs, max)) {
      padding-top: dim(pageSection, xs);
      padding-bottom: dim(pageSection, xs);
    }

    @include min-screen(breakpoint(sm)) {
      padding-top: dim(pageSection, sm);
      padding-bottom: dim(pageSection, sm);
    }

    @include min-screen(breakpoint(md)) {
      padding-top: dim(pageSection, md);
      padding-bottom: dim(pageSection, md);
    }

    &#{$this}--large {

      @include max-screen(breakpoint(xs, max)) {
        padding-top: (dim(pageSection, xs) * 2);
        padding-bottom: (dim(pageSection, xs) * 2);
      }

      @include min-screen(breakpoint(sm)) {
        padding-top: (dim(pageSection, sm) * 2);
        padding-bottom: (dim(pageSection, sm) * 2);
      }

      @include min-screen(breakpoint(md)) {
        padding-top: (dim(pageSection, md) * 2);
        padding-bottom: (dim(pageSection, md) * 2);
      }
    }
  }

</style>
