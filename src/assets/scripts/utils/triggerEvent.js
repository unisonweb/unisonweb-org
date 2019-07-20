export default function($element, eventName) {
  const event = document.createEvent('HTMLEvents')

  event.initEvent(eventName, false, true)
  $element.dispatchEvent(event)
}
