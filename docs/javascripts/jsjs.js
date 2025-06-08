import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

function initScene(containerId, modelPath, position, rotation, scale, cameraPosition) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(...cameraPosition);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    const textureLoader = new THREE.TextureLoader();
    const iceColor = textureLoader.load('./javascripts/texture/ice_0002_color_2k.jpg');
    const iceRoughness = textureLoader.load('./javascripts/texture/ice_0002_roughness_2k.jpg');
    const iceNormalOpenGL = textureLoader.load('./javascripts/texture/ice_0002_normal_opengl_2k.png');
    const iceHeight = textureLoader.load('./javascripts/texture/ice_0002_height_2k.png');

    [iceColor, iceRoughness, iceNormalOpenGL].forEach(texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
    });

    let model, transitionProgress = 0, isHovering = false;
    let originalMaterials = new Map(), frozenMaterials = new Map();
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
        model = gltf.scene;
        model.position.set(...position);
        model.rotation.set(...rotation);
        model.scale.set(...scale);

        model.traverse((child) => {
            if (child.isMesh) {
                originalMaterials.set(child, child.material.clone()); 
                let iceMaterial = new THREE.MeshStandardMaterial({
                    map: iceColor,
                    roughnessMap: iceRoughness,
                    normalMap: iceNormalOpenGL,
                    displacementMap: iceHeight,
                    displacementScale: 0.02,
                    transparent: true,
                    opacity: 0 
                });

                frozenMaterials.set(child, iceMaterial);
            }
        });

        scene.add(model);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener("mousemove", (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = model ? raycaster.intersectObject(model, true) : [];
        isHovering = intersects.length > 0;
    });

    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            model.traverse((child) => {
                if (child.isMesh) {
                    let originalMaterial = originalMaterials.get(child);
                    let frozenMaterial = frozenMaterials.get(child);

                    if (isHovering) {
                        transitionProgress = Math.min(transitionProgress + 0.02, 1); 
                    } else {
                        transitionProgress = Math.max(transitionProgress - 0.02, 0);
                    }

                    child.material = transitionProgress < 1 ? originalMaterial : frozenMaterial;

                    child.material.opacity = 1 - transitionProgress;
                    frozenMaterial.opacity = transitionProgress;
                }
            });
        }

        renderer.render(scene, camera);
    }

    animate();
    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

initScene("con1", "./3dmodels/instagram_logo_3d_-_colored.glb", [0, -3, 0], [0, 0, 0], [1, 1, 1], [0, 0, 8]);
initScene("con2", "./3dmodels/linkedin_logo.glb", [0, 0, 0], [0, 0, 0], [1, 1, 1], [0, 0, 2.5]);
initScene("con3","./3dmodels/twitter_x_logo.glb",[0,0,0],[0,4.7,0],[1,1,1],[0,0,6]);

