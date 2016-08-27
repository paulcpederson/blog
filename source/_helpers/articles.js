var byDate = require('./lib/byDate.js')

function isArticle (page) {
  return page.url.indexOf('/articles/') > -1
}

function notIndex (page) {
  return page.url !== '/articles/'
}

function addYear (page) {
  var date = new Date(page.date)
  page.year = date.getFullYear()
  return page
}

function addNextPrev (page, i, arr) {
  page.prev = arr[i + 1] || arr[0]
  page.next = arr[i - 1] || arr[arr.length - 1]
}

module.exports = function (site, cb) {
  var articles = site.filter(isArticle)
    .filter(notIndex)
    .sort(byDate)
    .map(addYear)
    .map(addNextPrev)
  cb(null, site)
}
