import music from './data/music'
// import d3 from 'd3'
// import forceBundle from './lib/forceBundle'
var $svg = document.querySelector('.js-container-svg')
console.log($svg)
var svg = d3.select($svg)
var width = window.innerWidth
var height = window.innerHeight

// var color = d3.scaleOrdinal(d3.schemeCategory20);
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var edges = []
var length = music.artists.length

for (let i = 0; i < length; i++) {
  var artist1 = music.artists[i]
  for (let j = 0; j < length; j++) {
    var column = music.artists[j];
    if (i < j) {
      var artist2 = music.artists[j]
      var score = artist1.genres.reduce((prev, curr) => {
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

var tooltip = d3.select('.js-tooltip')

var link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(edges)
  .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var node = svg.append("g")
    .attr("class", "nodes")
  .selectAll("circle")
  .data(music.artists)
  .enter()
  .append("circle")
    .attr("r", 3)
    .attr("fill", "white")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

node
  .on("mouseover", (e) => {
    tooltip.html(e.name)
    return tooltip.style("visibility", "visible")
  })
  .on("mousemove", (e) => tooltip.style("top", `${d3.event.pageY - 10}px`).style("left",(d3.event.pageX+10)+"px"))
  .on("mouseout", () => tooltip.style("visibility", "hidden"))

svg.call(d3.zoom().on("zoom", function () {
  node.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
  link.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
}))


simulation
    .nodes(music.artists)
    .on("tick", ticked);

simulation.force("link")
    .links(edges);

function ticked() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
