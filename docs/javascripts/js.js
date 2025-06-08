
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const con=document.getElementById("con");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, con.clientWidth/con.clientHeight, 0.1, 1000);
camera.position.z=5;
const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(con.clientWidth, con.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
con.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
    
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);
let model;
const loader = new GLTFLoader();
loader.load(
'./3dmodels/snow_bush.glb',
function (gltf) {
    model = gltf.scene;
    model.scale.set(0.8,0.8,0.8);
    model.position.set(-11.7,-9,0);
    model.rotation.set(0,0.5,0);
    scene.add(model);
},
undefined,
(error) => console.error('Error loading model:', error)
);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.enableZoom=false;
controls.enableRotate=false;

const loop=()=>{
window.requestAnimationFrame(loop);
renderer.render(scene,camera);
}
loop();
window.addEventListener('resize',function(){
camera.aspect=con.clientWidth/con.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(con.clientWidth,con.clientHeight);
});
