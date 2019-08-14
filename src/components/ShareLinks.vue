<template>
  <div class="un-share-links__container">
    <a
      class="un-share-link un-share-link--facebook"
      title="Share on Facebook"
      :href="facebook"
      target="_blank">
      <inline-svg src="/media/share-facebook.svg" />
    </a>
    <a
      class="un-share-link un-share-link--twitter"
      title="Share on Twitter"
      :href="twitter"
      target="_blank">
      <inline-svg src="/media/share-twitter.svg" />
    </a>
    <a
      class="un-share-link un-share-link--linked-in"
      title="Share on LinkedIn"
      :href="linkedIn"
      target="_blank">
      <inline-svg src="/media/share-linked-in.svg" />
    </a>
    <a
      class="un-share-link un-share-link--hacker-news"
      title="Share on Hacker News"
      :href="hackerNews"
      target="_blank">
      <inline-svg src="/media/share-hacker-news.svg" />
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      title: { type: String, default: null },
      path: { type: String, default: null },
    },
    computed: {
      encodedUrl() {
        return encodeURIComponent(`${this.$static.metaData.siteUrl}${this.path}`)
      },
      encodedTitle() {
        return encodeURIComponent(this.title)
      },
      facebook() {
        return `https://facebook.com/sharer/sharer.php?u=${this.encodedUrl}`
      },
      twitter() {
        return `https://twitter.com/intent/tweet?text=${this.encodedTitle}&url=${this.encodedUrl}`
      },
      linkedIn() {
        return `https://www.linkedin.com/shareArticle?mini=true&title=${this.encodedTitle}&url=${this.encodedUrl}`
      },
      hackerNews() {
        return `https://news.ycombinator.com/submitlink?t=${this.encodedTitle}&u=${this.encodedUrl}`
      },
    },
  }
</script>

<style lang="scss">

  .un-share-links__container {
    display: flex;
    align-items: center;
  }

  .un-share-link {
    display: block;
    width: rem(8);
    height: rem(8);

    &:not(:last-child) {
      margin-right: rem(-3);
    }

    border-radius: 99px; // large number to force rounded corneres

    &--facebook {
      background-color: #3b5998;
    }
    &--twitter {
      background-color: #1da1f2;
    }
    &--linked-in {
      background-color: #0077b5;
    }
    &--hacker-news {
      background-color: #ff4000;
    }

    display: flex;

    > svg {
      display: block;
      width: rem(3);
      height: rem(3);
      margin: auto;

      fill: palette(white);
    }
  }

</style>

<static-query>
  query {
    metaData {
      siteUrl
    }
  }
</static-query>