import music from './data/music'
import * as d3 from 'd3'

let svg = d3.select('.js-container-svg')
let tooltip = d3.select('.js-tooltip')
let width = window.innerWidth
let height = window.innerHeight
let length = music.artists.length
let edges = []
let active = ''
let transform = 'translate(0, 0)'
let scale = 1

for (let i = 0; i < length; i++) {
  let artist1 = music.artists[i]
  for (let j = 0; j < length; j++) {
    let column = music.artists[j];
    if (i < j) {
      let artist2 = music.artists[j]
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

let simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.name))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

let link = svg.append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(edges)
  .enter()
  .append('line')

let node = svg.append('g')
  .attr('class', 'nodes')
  .selectAll('circle')
  .data(music.artists)
  .enter()
  .append('circle')
    .attr('r', 3)
    .attr('fill', 'white')
    .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

node
  .on('mouseover', onHover)
  .on('mouseout', onHoverOut)

svg.call(d3.zoom().on('zoom', onZoom))

simulation
    .nodes(music.artists)
    .on('tick', ticked)

simulation.force('link')
    .links(edges)

function ticked () {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr()
  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

let links = d3.select('.links')
let nodes = d3.select('.nodes')

function onHover (d) {
  active = d.name
  return tooltip
    .html(d.name)
    .style('top', `${d.y * scale - 17}px`)
    .style('left', `${d.x * scale + 14}px`)
    .style('transform', transform)
    .classed('is-active', true)
}

function onHoverOut (d) {
  return tooltip.classed('is-active', false);
}

function onZoom () {
  let {x, y, k} = d3.event.transform
  scale = k
  transform = `translate(${x}px, ${y}px)`
  nodes.attr('transform', `translate(${x}, ${y}) scale(${k})`)
  links.attr('transform', `translate(${x}, ${y}) scale(${k})`)
}

function dragged (d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragstarted (d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0.3).restart()
  }
  d.fx = d.x
  d.fy = d.y
}

function dragended (d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  d.fx = null
  d.fy = null
}
