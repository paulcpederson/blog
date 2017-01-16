import music from './data/music'
import * as d3 from 'd3'

let $svg = d3.select('.js-container-svg')
let $tooltip = d3.select('.js-tooltip')
let $searchInput = document.querySelector('.js-search-input')
let $suggestions = document.querySelector('.js-search-suggestions')
let $searchButton = document.querySelector('.js-search-button')
let search = document.querySelector('.js-search')
var $info = document.querySelector('.js-search-info')
let state = {
  active: '',
  transform: 'translate(0, 0)',
  scale: 1
}

let img = 'https://lastfm-img2.akamaized.net/i/u/avatar170s/620abf38efaf498298196e3e06e6286a.jpg' // TODO remove

let edges = []
for (let i = 0; i < music.artists.length; i++) {
  let artist1 = music.artists[i]
  for (let j = 0; j < music.artists.length; j++) {
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
    .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

let link = $svg.append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(edges)
  .enter()
  .append('line')

let node = $svg.append('g')
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
    .on('click', click)

node
  .on('mouseover', onHover)
  .on('mouseout', onHoverOut)

$svg.call(d3.zoom().on('zoom', onZoom))

simulation
    .nodes(music.artists)
    .on('tick', ticked)
    .alphaMin(0)

simulation.force('link')
    .links(edges)

function ticked () {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('stroke-opacity', d => {
      let isActive = d.source.name === state.active.name || d.target.name === state.active.name
      return isActive ? 0.8 : 0.2
    })
    .attr('stroke', d => {
      let isActive = d.source.name === state.active.name || d.target.name === state.active.name
      return isActive ? 'white' : '#0e6fc4'
    })
  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

let links = d3.select('.links')
let nodes = d3.select('.nodes')

function click (d) {
  if (state.active.name === d.name) {
    deselect()
  } else {
    state.active = d
    showInfo(d);
  }
}

$info.addEventListener('click', function (e) {
  if (e.target.classList.contains('similar__artist__link')) {
    e.preventDefault()
    let name = e.target.getAttribute('data-name')
    let chosenArtist = music.artists.filter(artist => artist.name === name).shift()
    showInfo(chosenArtist)
  }
})

$suggestions.addEventListener('click', function (e) {
  let name = e.target.getAttribute('data-name')
  let chosenArtist = music.artists.filter(artist => artist.name === name).shift()
  showInfo(chosenArtist)
})

function showResults (term) {
  search.classList.remove('is-active')
  search.classList.remove('is-searching')
  if (term.length > 0) {
    $suggestions.innerHTML = music.artists
      .filter(artist => artist.name.toLowerCase().indexOf(term) > -1)
      .slice(0, 5)
      .map(artist => `<a href="#" class="search-result" data-name="${artist.name}"><img src="${img}" class="artist-thumb artist-thumb--small" alt="${artist.name}">${artist.name}</a>`)
      .join('')
    search.classList.add('is-searching')
  }
}

$searchInput.addEventListener('input', e => {
  let searchTerm = e.target.value.toLowerCase()
  showResults(searchTerm)
})

function deselect () {
  search.classList.remove('is-active')
  search.classList.remove('is-searching')
  state.active = {}
  $searchInput.value = ''
  $searchInput.focus()
}

$searchButton.addEventListener('click', e => {
  let isClose = search.classList.contains('is-active') || search.classList.contains('is-searching')
  if (isClose) {
    deselect()
  } else {
    showResults($searchInput.value)
  }
})

function showInfo (d) {
  state.active = d
  search.classList.remove('is-searching')
  $searchInput.value = d.name;

  let genres = d.genres.reduce((prev, curr) => {
    return prev + `<li class="genre__tag">${curr}</li>`
  }, '')

  let similarArtists = edges
    .filter(edge => edge.source.name === d.name || edge.target.name === d.name)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map(edge => edge.source.name !== d.name ? edge.source : edge.target)
    .map(artist => {
      return `
        <li class="similar__artist">
          <a href="#" class="similar__artist__link" data-name="${artist.name}">
            <img src="${img}" class="artist-thumb artist-thumb--small" alt="${artist.name}">${artist.name}
          </a>
        </li>`
    })
    .join('')

  $info.innerHTML = `
    <div class="artist">
      <img src="https://lastfm-img2.akamaized.net/i/u/avatar170s/620abf38efaf498298196e3e06e6286a.jpg" class="artist-thumb" alt="${d.name}">
      <h2 class="text-center text-light font-size-1 leader-half trailer-0">${d.name}</h2>
    </div>
    <div class="padding-left-1 padding-right-1 trailer-half">
      <h4 class="leader-1 trailer-half font-size-0 text-light">Tagged</h4>
      <ul class="genre">${genres}</ul>
    </div>
    <div class="padding-left-1 padding-right-1 trailer-half ${similarArtists.length > 0 ? '' : 'hide'}">
      <h4 class="leader-1 trailer-half font-size-0 text-light">Similar To</h4>
      <ul class="similar">${similarArtists}</ul>
    </div>
  `
  search.classList.add('is-active');
}

function onHover (d) {
  return $tooltip
    .html(d.name)
    .style('top', `${d.y * state.scale - 17}px`)
    .style('left', `${d.x * state.scale + 14}px`)
    .style('transform', state.transform)
    .classed('is-active', true)
}

function onHoverOut (d) {
  return $tooltip.classed('is-active', false);
}

function onZoom () {
  let {x, y, k} = d3.event.transform
  state.scale = k
  state.transform = `translate(${x}px, ${y}px)`
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
