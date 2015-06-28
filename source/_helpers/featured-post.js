module.exports = function (site, cb) {
  var featured = site.filter(function (page) {
    return page.featured
  })
  site = site.map(function (page) {
    page.featuredPost = featured[0]
    return page
  })
  cb(null, site)
}
