var byDate = require('./lib/byDate.js')

function isWork (page) {
  return page.url.indexOf('/work/') > -1
}

function notIndex (page) {
  return page.url !== '/work/'
}

function addYear (page) {
  page.year = page.date.getFullYear()
  return page
}

function addNextPrev (page, i, arr) {
  page.prev = arr[i + 1] || arr[0]
  page.next = arr[i - 1] || arr[arr.length - 1]
}

module.exports = function (site, cb) {
  var work = site.filter(isWork)
    .filter(notIndex)
    .sort(byDate)
    .map(addYear)
    .map(addNextPrev)
  cb(null, site)
}
