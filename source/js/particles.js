import * as THREE from 'three'

/* Set up audio player/context */
const player = document.querySelector('.js-player')
const playPause = document.querySelector('.js-play-pause')
let audioContext = new (window.AudioContext || window.webkitAudioContext)
let source = audioContext.createMediaElementSource(player)
let analyser = audioContext.createAnalyser()
let frequencyData = new Uint8Array(analyser.frequencyBinCount)

source.connect(analyser)
analyser.connect(audioContext.destination)

playPause.addEventListener('click', e => {
  if (player.paused) {
    player.play()
    playPause.classList.add('playing')
    player.setAttribute('aria-label', 'pause')
  } else {
    playPause.classList.remove('playing')
    player.pause()
    player.setAttribute('aria-label', 'play')
  }
})

/* 3D Scene, global namespace */
var width = window.innerWidth
var height = window.innerHeight
var mouseX = 0
var mouseY = 0
const RADIUS = 400 // radius of sphere
const background = 0x04083d
const foreground = 0xfc5a34
var camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000) // fov, aspect, near, far
var scene = new THREE.Scene()
var geometry = new THREE.Geometry()
var renderer = new THREE.WebGLRenderer()
var material = new THREE.PointsMaterial({size: 2.75, color: foreground})

geometry.dynamic = true
camera.position.z = 1000
scene.fog = new THREE.FogExp2(background, 0.0007)
scene.background = new THREE.Color(background)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
document.querySelector('.js-lab').appendChild(renderer.domElement)

for (var i = 0; i < 20000; i++) {
  // Random point within sphere (https://math.stackexchange.com/q/50482)
  var theta = Math.random() * Math.PI * 2 // [0, 2π)
  var z = Math.random() * 2 - 1 // [-1, 1]
  var r = Math.sqrt(1 - (z * z))
  var x = r * Math.cos(theta)
  var y = r * Math.sin(theta)

  // Move along vector to sphere surface (https://math.stackexchange.com/q/83419)
  var a = [0,0,0] // centroid
  var b = [x,y,z] // random point (coordinates generated above)
  var ba = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  var baLength = Math.sqrt((ba[0] * ba[0]) + (ba[1] * ba[1]) + (ba[2] * ba[2]))
  var unitVector = [ba[0] / baLength, ba[1] / baLength, ba[2] / baLength] // normalized unit vector
  var vertex = new THREE.Vector3(unitVector[0] * RADIUS, unitVector[1] * RADIUS, unitVector[2] * RADIUS)
  // store the unit vector + audio data array index for later calculations
  vertex.unitVector = unitVector
  vertex.origin = {x: vertex.x, y: vertex.y, z: vertex.z}
  vertex.fft = Math.floor(Math.random() * (frequencyData.length - 1))
  geometry.vertices.push(vertex)
}

console.log(geometry)

var particles = new THREE.Points(geometry, material)
particles.name = 'sphere'
scene.add(particles);

animate()

function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  // rotate slightly around y axis
  scene.children[0].rotation.y = Date.now() * 0.00009
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  // get current frequency data
  analyser.getByteFrequencyData(frequencyData)

  // update the position of all the particles based on their frequency band
  geometry.vertices.forEach(v => {
    v.x = v.unitVector[0] * RADIUS * (frequencyData[v.fft] / 500 + 1)
    v.y = v.unitVector[1] * RADIUS * (frequencyData[v.fft] / 500 + 1)
    v.z = v.unitVector[2] * RADIUS * (frequencyData[v.fft] / 500 + 1)
  })

  geometry.verticesNeedUpdate = true
  renderer.render(scene, camera)
}

/*
 * Event Handlers
 * mouse movement, touch start and end, window resize
 */
window.addEventListener('resize', resize, false)
document.addEventListener('mousemove', mouseMove, false)
document.addEventListener('touchstart', touchStart, false)
document.addEventListener('touchmove', touchMove, false)

function mouseMove(e) {
  mouseX = e.clientX - width / 2
  mouseY = e.clientY - height / 2
}

function touchStart (e) {
  if (e.touches.length === 1) {
    e.preventDefault()
    mouseX = e.touches[0].pageX - width / 2
    mouseY = e.touches[0].pageY - height / 2
  }
}

function touchMove (e) {
  if (e.touches.length === 1) {
    e.preventDefault()
    mouseX = e.touches[0].pageX - width / 2
    mouseY = e.touches[0].pageY - height / 2
  }
}

function resize () {
  width = window.innerWidth
  height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}
