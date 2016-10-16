import * as THREE from 'three'

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.z = 1000

var scene = new THREE.Scene()
scene.background = new THREE.Color(0xf1f9f2)

var geometry = new THREE.IcosahedronGeometry(300, 0)
var material = new THREE.MeshBasicMaterial({
  color: 0xef7654,
  wireframe: true
})

var mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.classList.add('fullscreen-canvas')
document.body.appendChild(renderer.domElement)

function animate() {
    requestAnimationFrame(animate)

    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02

    renderer.render(scene, camera)
}

animate()
