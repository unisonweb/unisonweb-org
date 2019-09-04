<template>
  <div class="un-post-authors__container">
    <hr class="u-margin--none u-border--top u-border--gray--xx-light" />
    <div
      v-for="(author, i) in authors" :key="i"
      class="un-post-author">

      <span
        class="un-post-author__photo js-lazyLoad"
        :data-bg="`url(${author.photo})`">
        <img
          class="js-lazyLoad"
          :data-src="author.photo"
        />
      </span>

      <div class="un-post-author__info">

        <p>
          <span
            class="u-font--bold"
            data-font-size="2"
            v-text="author.title"
          />
          <br>
          <span
            class="u-font--semibold u-color--gray"
            v-text="author.position"
          />
        </p>

        <div
          class="u-margin--vertical"
          v-html="author.content"
        />

        <un-link
          v-if="author.twitter"
          class="un-post-author__social-link"
          :url="author.twitter"
          :title="`Follow ${author.title} on Twitter`">
          <inline-svg
            src="/media/emblem-twitter.svg"
          />
        </un-link>

        <un-link
          v-if="author.linkedin"
          class="un-post-author__social-link"
          :url="author.linkedin"
          :title="`Connect with ${author.title} on LinkedIn`">
          <inline-svg
            src="/media/emblem-linked-in.svg"
          />
        </un-link>

      </div>

    </div>
    <hr class="u-margin--none u-border--top u-border--gray--xx-light" />
  </div>
</template>

<script>
  import lazyLoad from '~/mixins/lazyLoad'

  export default {
    props: {
      authors: { type: Array, default: null },
    },
    mixins: [
      lazyLoad,
    ]
  }
</script>

<style lang="scss">

  .un-post-authors__container {
    margin-top: dim(pageSection, sm);
  }

  .un-post-author {
    padding-top: dim(pageSection, sm);
    padding-bottom: dim(pageSection, sm);

    & + & {
      padding-top: 0;
    }

    display: flex;
    align-items: flex-start;
  }

  .un-post-author__photo {
    flex: 0 0 auto;

    display: block;

    @include max-screen(breakpoint(xs, max)) {
      width: rem(10);
      height: rem(10);
    }

    @include min-screen(breakpoint(sm)) {
      width: rem(13);
      height: rem(13);
    }

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    overflow: hidden;
    border-radius: 999px;

    > img {

      &.is-loaded {
        display: none;
      }
    }
  }

  .un-post-author__info {
    padding-left: rem(3);

    font-size: rem(-2);
  }

  .un-post-author__social-link {
    display: inline-block;
    width: rem(3);
    height: rem(3);

    margin-top: (rem(-2) * font(sans, capHeight));

    & + & {
      margin-left: rem(3);
    }

    color: palette(gray, light);

    > svg {
      display: inline-block;
      width: auto;
      height: 100%;

      fill: currentColor;
    }
  }

</style>
