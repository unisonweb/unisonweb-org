import '~/assets/styles/main.scss'

import VueSimpleMarkdown from 'vue-simple-markdown'
import VueScrollTo from 'vue-scrollto'

import SiteMain from '~/layouts/SiteMain.vue'

import PageSection from '~/components/PageSection.vue'
import Link from '~/components/Link.vue'
import InlineSvg from '~/components/InlineSvg.vue'

export default function (Vue, {router, head, isClient, isServer, appOptions}) {

  head.meta.push(
    { 'charset': 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge,chrome=1' },
    { 'name': 'viewport', 'content': 'width=device-width, initial-scale=1' },
  )

  // layouts
  Vue.component('un-site-main', SiteMain)

  // components
  Vue.component('un-page-section', PageSection)
  Vue.component('un-link', Link)
  Vue.component('inline-svg', InlineSvg)

  // 3rd party components/libraries
  Vue.use(VueSimpleMarkdown)
  Vue.use(VueScrollTo)

  if (isClient) {
    require('~/assets/scripts/lazyLoad')
  }

  // debugging scripts
  // require('~/assets/scripts/utils/debugFonts');
}
