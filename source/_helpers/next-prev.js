function isArticle (page) {
  return page.url.indexOf('/articles/') > -1
}

function byDate (a, b) {
  if (a.date && b.date) {
    return new Date(b.date) - new Date(a.date)
  } else {
    return 0
  }
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
  var articles = site.filter(isArticle)
    .sort(byDate)
    .map(addYear)
    .map(addNextPrev)
  cb(null, site)
}
