module.exports = function byDate (a, b) {
  if (a.date && b.date) {
    return new Date(b.date) - new Date(a.date)
  } else {
    return 0
  }
}
