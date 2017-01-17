export default function makeEdges (artists) {
  var edges = []
  for (let i = 0; i < artists.length; i++) {
    let artist1 = artists[i]
    for (let j = 0; j < artists.length; j++) {
      if (i < j) {
        let artist2 = artists[j]
        let score = artist1.genres.reduce((prev, curr) => {
          return artist2.genres.indexOf(curr) > -1 ? prev + 1 : prev
        }, 0);
        if (score > 2) {
          edges.push({
            source: artist1.name,
            target: artist2.name,
            value: score
          })
        }
      }
    }
  }
  return edges
}
