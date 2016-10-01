import * as barba from 'barba.js'

var FadeTransition = barba.BaseTransition.extend({
  start: function() {
    this.oldContainer.classList.add('hide')
    window.scrollTo(0, 0)
    this.newContainerLoading.then(this.done.bind(this))
  }
});

/**
 * Next step, you have to tell Barba to use the new Transition
 */

barba.Pjax.getTransition = function() {
  return FadeTransition;
};

document.addEventListener('DOMContentLoaded', function() {
  if (window.history.pushState) {
    barba.Pjax.start()
  }
})

let canvas = document.querySelector('.js-home-canvas')
let context = canvas.getContext('2d')
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let points = []

class Point {
  constructor () {
    this.x = Math.floor(Math.random() * (width + 100)) - 49
    this.y = Math.floor(Math.random() * (height + 100)) - 49
    this.r = 3 * Math.random()
  }
}

for (let i = 0; i < 800; i++) {
  points.push(new Point())
}

let startTime = new Date().getTime()
loop()

function loop () {
  let ellapsedTime = new Date().getTime() - startTime
  context.clearRect(0, 0, width, height)
  points.forEach(point => {
    context.fillStyle = `rgba(220, 220, 220, ${ellapsedTime / 2000})`
    context.beginPath()
    context.arc(point.x, point.y, 1, 0, Math.PI * 2, false)
    context.fill()
  })
  requestAnimationFrame(loop)
}
