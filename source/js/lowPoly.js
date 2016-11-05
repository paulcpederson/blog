import * as THREE from 'three'

const player = document.querySelector('.js-player')

const playPause = document.querySelector('.js-play-pause')
playPause.addEventListener('click', (e) => {
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

let audioContext = new (window.AudioContext || window.webkitAudioContext)
let source = audioContext.createMediaElementSource(player)
let analyser = audioContext.createAnalyser()
analyser.fftSize = 128
let d = new Uint8Array(analyser.frequencyBinCount)
source.connect(analyser)
analyser.connect(audioContext.destination)

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 1000

var scene = new THREE.Scene()
scene.background = new THREE.Color(0xf1f9f2)

var material = new THREE.MeshBasicMaterial({
  color: 0xef7654,
  wireframe: true
})

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.querySelector('.js-lab').appendChild(renderer.domElement)

window.addEventListener('resize', e => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

var geo = new THREE.IcosahedronGeometry(300, 1)
geo.computeBoundingBox()

var cX = 0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x)
var cY = 0.5 * (geo.boundingBox.max.y - geo.boundingBox.min.y)
var cZ = 0.5 * (geo.boundingBox.max.z - geo.boundingBox.min.z)
var center = new THREE.Vector3(cX, cY, cZ)

var icosahedron = new THREE.Mesh(geo, material)
var rotation = {
  x: 0,
  y: 0
}

function animate () {
  scene.remove(icosahedron)

  // create a new geometry and compute the bounding box
  geo = new THREE.IcosahedronGeometry(300, 1)

  rotation.x += 0.01
  rotation.y += 0.02

  // TODO: set programatically based on spectrum analysis
  var distance = 1 + (Math.random() * .25)
  analyser.getByteFrequencyData(d)

  geo.vertices = geo.vertices.map((v, i) => {
    var newPos = new THREE.Vector3()
    newPos.addVectors(center, v.multiplyScalar(1 + (d[Math.floor(64 * i / 42)] / 255 * .65)))
    return newPos
  })

  geo.center()

  icosahedron = new THREE.Mesh(geo, material)
  icosahedron.rotation.x = rotation.x
  icosahedron.rotation.y = rotation.y

  scene.add(icosahedron)

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
