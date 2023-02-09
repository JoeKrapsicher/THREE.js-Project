import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js'

import sky from'../img/skybox.jpg';
import stars from'../img/Stars.jpg';

const elephantUrl = new URL('../assets/Goriphant.stl', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF12}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box);

box.position.y = 2.5;
box.castShadow = true;
box.receiveShadow = true;

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xDDDDDD,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere);

sphere.position.set(-10, 10, 0)
sphere.castShadow = true;

const abmientLight = new THREE.AmbientLight(0x333333)
scene.add(abmientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow =  true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00)
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(sky);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([ 
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
])


const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({ 
    // color: 0x00FF00,
    // map: textureLoader.load(sky)
})
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(sky)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10)
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15)


plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometery = new THREE.SphereGeometry(4);

// const vShader= `
//     void main() {
//         gl_position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `

const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});
const sphere2 = new THREE.Mesh(sphere2Geometery, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// const assetLoader = new STLLoader();

// assetLoader.load(elephantUrl.href, function(gltf) {
//     const model = gltf.scene;
//     scene.add(model);
//     model.position.set(-12, 4, 10)
// }, undefined, function(error) {
//     console.log(error)
// })

const assetMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb2ffc8,
    metalness: 0.25,
    roughness: 0.1,
    opacity: 0,
    transparent: false,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25
})

const assetLoader = new STLLoader()
assetLoader.load(
    elephantUrl,
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, assetMaterial)
        scene.add(mesh)
        mesh.rotation.x = -0.5 * Math.PI;
        mesh.position.set(-12, 4, 10)
        mesh.scale.set(0.2, 0.2, 0.2)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// const assetLoader = new STLLoader();

// assetLoader.load(elephantUrl, function(stl) {
//     const model = stl.scene;
//     scene.add(model);
//     model.position.set(-12, 4, 10);
// }, undefined, function(error) {
//     console.error(error)
// })


const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
}

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 +1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';


function animate(time) {

    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects)

    for(let i=0; i<intersects.length; i++) {
        if(intersects[i].object.id === sphereId){
            intersects[i].object.material.color.set(0xFF0000)
        }

        if(intersects[i].object.name === 'theBox') {
            box2.rotation.x = time / 1000
            box2.rotation.y = time / 1000
        }
    }

    
    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})