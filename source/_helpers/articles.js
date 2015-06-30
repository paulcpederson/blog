function isArticle (page) {
  return page.url.indexOf('/articles/') > -1
}

module.exports = function (site, cb) {
  var articles = site
    .filter(isArticle)
    .sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    .map(function (article) {
      article.year = article.date.getFullYear()
      return article
    })
  site = site.map(function (page) {
    page.articles = articles
    if (isArticle(page)) {
      var index = articles.indexOf(page)
      page.prev = articles[index + 1] || articles[0]
      page.next = articles[index - 1] || articles[articles.length - 1]
    }
    return page
  })
  cb(null, site)
}
