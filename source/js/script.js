// Responsive Tables
document.addEventListener('DOMContentLoaded', function() {
  var tables = document.getElementsByTagName('table')
  for (var i = 0; i < tables.length; i++) {
    tables[i].outerHTML = '<div class="overflow-auto">' + tables[i].outerHTML + '</div>'
  }
})
