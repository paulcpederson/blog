import music from './data/music'
import makeEdges from './genres/edges'
import * as d3 from 'd3'

let $svg = d3.select('.js-container-svg')
let $tooltip = d3.select('.js-tooltip')
let $searchInput = document.querySelector('.js-search-input')
let $suggestions = document.querySelector('.js-search-suggestions')
let $searchButton = document.querySelector('.js-search-button')
let $search = document.querySelector('.js-search')
let $info = document.querySelector('.js-search-info')
let edges = makeEdges(music.artists)
let zoom = d3.zoom()
let width = window.innerWidth
let height = window.innerHeight
let state = {
  active: '',
  transform: 'translate(0, 0)',
  scale: 1
}

let img = 'https://lastfm-img2.akamaized.net/i/u/avatar170s/620abf38efaf498298196e3e06e6286a.jpg' // TODO remove

/**
 * Set Up Simulation
 */
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

let simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.name))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))

simulation
  .nodes(music.artists)
  .alphaMin(0)
  .force('link')
  .links(edges)

/**
 * Attach Events
 */
node.on('mouseover', onHover).on('mouseout', onHoverOut).on('click', nodeClick)
$searchButton.addEventListener('click', searchButtonClick)
$suggestions.addEventListener('click', suggestionClick)
$suggestions.addEventListener('keydown', checkDownUpKey)
$info.addEventListener('click', similarArtistsClick)
$searchInput.addEventListener('input', searchInput)
$searchInput.addEventListener('keydown', checkDownKey)
$svg.call(zoom.on('zoom', onZoom))
simulation.on('tick', ticked)

/**
 * Event Handlers
 */
function checkDownKey (e) {
  // if you pressed the down arrow, focus the first list item
  if (e.keyCode === 40) {
    document.querySelector('.search-result').focus()
  }
}

function checkDownUpKey (e) {
  let suggestions = Array.prototype.slice.call(document.querySelectorAll('.search-result'))
  let last = suggestions.length - 1
  let i = suggestions.indexOf(e.target)
  if (e.keyCode === 40) {
    let next = (i === last) ? 0 : i + 1
    suggestions[next].focus()
  }
  if (e.keyCode === 38) {
    let next = (i === 0) ? last : i - 1
    suggestions[next].focus()
  }
}

function nodeClick (d) {
  if (state.active.name === d.name) {
    deselect()
  } else {
    select(d);
  }
}

function searchInput (e) {
  // quick up/down arrow list selection
  if (e.keyCode === 40 || e.keyCode === 38) {
    console.log(true)
  }
  let searchTerm = e.target.value.toLowerCase()
  showResults(searchTerm)
}

function searchButtonClick (e) {
  let isClose = $search.classList.contains('is-active') || $search.classList.contains('is-searching')
  if (isClose) {
    deselect()
  } else {
    showResults($searchInput.value)
  }
}

function suggestionClick (e) {
  let name = e.target.getAttribute('data-name')
  let chosenArtist = music.artists.filter(artist => artist.name === name).shift()
  select(chosenArtist)
}

function similarArtistsClick (e) {
  if (e.target.classList.contains('similar__artist__link')) {
    e.preventDefault()
    let name = e.target.getAttribute('data-name')
    let chosenArtist = music.artists.filter(artist => artist.name === name).shift()
    select(chosenArtist)
  }
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
  d3.select('.links').attr('transform', `translate(${x}, ${y}) scale(${k})`)
  d3.select('.nodes').attr('transform', `translate(${x}, ${y}) scale(${k})`)
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

/**
 * Run on each from of simulation
 */
function ticked () {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('stroke-opacity', d => isEdgeActive(d) ? 0.8 : 0.2)
    .attr('stroke', d => isEdgeActive(d) ? 'white' : '#0e6fc4')
  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

/**
 * Does an edge connect a node that is selected?
 */
function isEdgeActive (d) {
  return d.source.name === state.active.name || d.target.name === state.active.name
}

/**
 * Show artists matching search query
 */
function showResults (term) {
  $search.classList.remove('is-active')
  $search.classList.remove('is-searching')
  if (term.length > 0) {
    $suggestions.innerHTML = music.artists
      .filter(artist => artist.name.toLowerCase().indexOf(term) > -1)
      .slice(0, 5)
      .map(artist => `<a href="#" class="search-result" data-name="${artist.name}"><img src="${img}" class="artist-thumb artist-thumb--small" alt="${artist.name}">${artist.name}</a>`)
      .join('')
    $search.classList.add('is-searching')
  }
}

/**
 * Clear any selected artist and hide search panel
 */
function deselect () {
  $search.classList.remove('is-active')
  $search.classList.remove('is-searching')
  state.active = {}
  $searchInput.value = ''
  $searchInput.focus()
}

/**
 * Select an artist + show their information
 * @param {object} d - object representing the artist
 */
function select (d) {
  state.active = d
  $search.classList.remove('is-searching')
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
      <h2 class="artist-title">${d.name}</h2>
    </div>
    <div class="padding-left-1 padding-right-1 trailer-half">
      <h4 class="leader-1 trailer-half font-size-0 text-light">Tagged</h4>
      <ul class="genre">${genres}</ul>
    </div>
    <div class="padding-left-1 padding-right-1 trailer-half ${similarArtists.length > 0 ? '' : 'hide'}">
      <h4 class="leader-1 trailer-half font-size-0 text-light">Similar Artists</h4>
      <ul class="similar">${similarArtists}</ul>
    </div>
  `
  $search.classList.add('is-active')

  // center on selected node
  let deltaX = ((width + $search.offsetWidth) / 2) - d.x
  let deltaY = (height / 2) - d.y
  $svg.transition()
    .duration(400)
    .ease(d3.easeExpInOut)
    .call(zoom.transform, d3.zoomIdentity.translate(deltaX, deltaY))
}
