import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js'

const con = document.getElementById('float')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, con.clientWidth / con.clientHeight, 0.1, 1000)
camera.position.z = 150

const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(con.clientWidth, con.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)
con.appendChild(renderer.domElement)
scene.add(new THREE.AmbientLight(0xffffff, 1.5))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 5)
scene.add(directionalLight)
let model

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/') 
loader.setDRACOLoader(dracoLoader)

loader.load(
  './3dmodels/lonely_little_penguin-v1.glb',
  (gltf) => {
    model = gltf.scene
    model.scale.set(1, 1, 1)
    model.position.set(0, -30, 0)
    model.rotation.set(0.6, -1.5, 0)
    scene.add(model)
  },
  undefined,
  (error) => console.error('Error loading DRACO model:', error)
)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;
controls.autoRotate = true; 
controls.autoRotateSpeed = 2.0;  

const loop = () => {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  controls.update();
}

loop()

window.addEventListener('resize', () => {
  camera.aspect = con.clientWidth / con.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(con.clientWidth, con.clientHeight)
})
