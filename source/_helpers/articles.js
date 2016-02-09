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
      var prev = articles[index + 1] || articles[0]
      var next = articles[index - 1] || articles[articles.length - 1]
      page.prev = {
        title: prev.title,
        date: prev.date,
        url: prev.url
      }
      page.next = {
        title: next.title,
        date: next.date,
        url: next.url
      }
    }
    return page
  })
  cb(null, site)
}
