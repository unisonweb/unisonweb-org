import FontMetrics from 'fontmetrics'
import FontFaceObserver from 'fontfaceobserver'

const fonts = [
  'Inter-Regular',
  'Roboto Mono'
]

const observers = fonts.map(function(font) {
  return new FontFaceObserver(font)
})

Promise.all([ observers.forEach((observer) => observer.load()) ]).then(function() {

  const metrics = fonts.map(function(font) {
    return FontMetrics({
      fontFamily: font
    })
  })

  metrics.forEach(console.log)

})
