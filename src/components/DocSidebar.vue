<template>
  <div class="un-doc-sidebar">

    <ul class="un-doc-sidebar__links">
      <li v-for="(link, i) in links" :key="i">
        <g-link
          :to="link.path">
          {{link.label}}
        </g-link>
        <!-- <ul>
          <li v-for="(heading, j) in link.headings" :key="j">
            {{heading.value}}
          </li>
        </ul> -->
      </li>
    </ul>

  </div>
</template>

<script>
  import find from 'lodash.find'
  import docLinks from '~/data/doc-links.yml'

  export default {
    props: {
      currentDocSubtitles: { type: Array, default: null },
    },
    computed: {
      links() {
        const vm = this

        const links = docLinks.map(link => {
          const page = find(vm.allDocPage, (p) => {
            return p.path === vm.$router.currentRoute.path
          })

          return {
            label: link.label,
            path: link.path,
            // headings: page.headings,
            // subheadings: page.subheadings,
          }
        })

        return links
      },
      allDocPage() {
        const vm = this

        return vm.$static.allDocPage.edges.map(edge => {
          return edge.node
        })
      },
    },
    mounted() {
      // console.log(this.$router.currentRoute)
      // console.log(this.currentDocPage)
      // console.log(this.$static)
    }
  }
</script>

<style lang="scss">

  .un-doc-sidebar {

    @include max-screen(breakpoint(xs, max)) {
      display: none;
    }

    @include min-screen(breakpoint(md)) {
      position: absolute;
      top: 0;
      left: 0;
      width: (3/12 * 100%);
    }
  }

  .un-doc-sidebar__links {

    @at-root ul#{&} {
      // <ul> reset
      margin: 0;
      padding: 0;
      list-style: none;

      > li {
        // <li> reset
        margin: 0;
      }
    }

    a {

      &, &:hover {
        color: palette(black);
      }

      &.active {
        font-family: font(bold);
      }
    }
  }

</style>

<static-query>
  query {
    allDocPage {
      edges {
        node {
          title
          headings (depth: h2) {
            value
            anchor
          }
          subheadings: headings (depth: h3) {
            value
            anchor
          }
          path
        }
      }
    }
  }
</static-query>