module.exports = function (site, cb) {
  var sitemap = site.map(function (page) {
    return {
      url: page.url,
      thumbnail: page.thumbnail,
      changefreq: page.changefreq || 'monthly'
    }
  })
  site = site.map(function (page) {
    page.sitemap = sitemap
    return page
  })
  cb(null, site)
}
