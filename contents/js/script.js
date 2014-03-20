//Add ready class to body for onload animations
document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByTagName("body")[0].className += ' ready';
});

// Add touch class to body if touch is detected
var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

if (isTouch) {
  document.getElementsByTagName('body')[0].className += ' touch';
}
