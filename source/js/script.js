import * as barba from 'barba.js'

barba.Pjax.getTransition = barba.BaseTransition.extend({
  start: function() {
    this.oldContainer.classList.add('hide')
    window.scrollTo(0, 0)
    this.newContainerLoading.then(this.done.bind(this))
  }
});
