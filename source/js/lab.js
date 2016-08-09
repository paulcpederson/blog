(function () {
  var button = document.querySelector('.js-lab-toggle')
  var thumbnail = document.querySelector('.js-lab-thumbnail')
  var lab = document.querySelector('.js-lab')
  var body = document.querySelector('body')

  button.addEventListener('click', toggleLab)
  thumbnail.addEventListener('click', toggleLab)

  function toggleLab (e) {
    var action = lab.classList.contains('lab-shrunk') ? 'remove' : 'add'
    body.classList[action]('is-active')
    lab.classList[action]('lab-shrunk')
  }
})()
