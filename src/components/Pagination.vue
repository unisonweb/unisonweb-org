<template>
  <div class="un-pagination__stage">

    <p>
      <span v-text="`Page ${info.currentPage}`" class="u-bold" />
      <span v-text="' of '" />
      <span v-text="info.totalPages" class="u-bold" />
    </p>

    <Pager
      class="un-pagination"
      :info="info"
      :range="0"
      :show-links="false"
      link-class="un-pagination__link"
      :prev-label="'← Newest'"
      :next-label="'Older →'"
      :first-label="''"
      :last-label="''"
    />

  </div>
</template>

<script>
  import { Pager } from 'gridsome'

  export default {
    props: {
      info: { type: Object, default: null },
    },
    components: {
      Pager,
    },
  }
</script>

<style lang="scss">

  .un-pagination__stage {

    @include max-screen(breakpoint(xs, max)) {
      margin-top: dim(pageSection, xs);
    }

    @include min-screen(breakpoint(sm)) {
      margin-top: dim(pageSection, sm);
    }

    @include min-screen(breakpoint(md)) {
      margin-top: dim(pageSection, md);
    }

    padding-top: rem(3);
    border-top: 1px solid palette(gray, xxx-light);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .un-pagination {
    margin-right: -#{em(-3) * 1/2};
    margin-left: -#{em(-3) * 1/2};
  }

  .un-pagination__link {
    display: inline-block;
    padding-right: (em(-3) * 1/2);
    padding-left: (em(-3) * 1/2);

    color: palette(lightpurple);
    font-family: font(bold);

    &:empty {
      display: none;
    }
  }

</style>

