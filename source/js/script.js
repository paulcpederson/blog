import * as barba from 'barba.js'

var FadeTransition = barba.BaseTransition.extend({
  start: function() {
    console.log(this.oldContainer)
    this.oldContainer.classList.add('fade-out')
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
  var tables = document.getElementsByTagName('table')
  for (var i = 0; i < tables.length; i++) {
    tables[i].outerHTML = '<div class="overflow-auto">' + tables[i].outerHTML + '</div>'
  }
  if (window.history.pushState) {
    barba.Pjax.start()
  }
})
