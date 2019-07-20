import LazyLoad from 'vanilla-lazyload'
import triggerEvent from './utils/triggerEvent'

const lazyloadConfig = {
  elements_selector: '.js-lazyLoad',
  class_loaded: 'is-loaded',
  class_loading: 'is-loading',
  load_delay: 300,
  callback_loaded: () => triggerEvent(document, 'lazyLoaded'),
  callback_finish: () => triggerEvent(document, 'lazyFinish'),
}

// Only initialize it one time for the entire application
if (!document.lazyLoadInstance) {
  document.lazyLoadInstance = new LazyLoad(lazyloadConfig);
}
